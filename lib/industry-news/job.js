import { createAdminClient } from '@/utils/supabase/admin'
import { SOURCES, SETTINGS } from './sources'
import { parseFeed, normaliseUrl } from './rss'
import { curateWithClaude } from './curate'

async function fetchFeed(source) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), SETTINGS.feedTimeoutMs)
    try {
        const res = await fetch(source.url, {
            signal: controller.signal,
            headers: {
                'user-agent': 'Mozilla/5.0 (compatible; ArtemisAtelierNewsBot/1.0)',
                accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
            },
            cache: 'no-store',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const xml = await res.text()
        return parseFeed(xml)
            .map(item => ({ ...item, source: source.name, region: source.region }))
    } finally {
        clearTimeout(timer)
    }
}

/**
 * Fetch every feed, drop old/duplicate stories, let Claude pick the best,
 * and save them as *pending* rows for an admin to approve.
 */
export async function runIndustryNewsJob({ dryRun = false } = {}) {
    const startedAt = Date.now()
    const report = { sources: [], candidates: 0, alreadySeen: 0, picked: 0, inserted: 0, errors: [] }

    // 1. Fetch all feeds in parallel
    const results = await Promise.allSettled(SOURCES.map(fetchFeed))
    const cutoff = Date.now() - SETTINGS.maxAgeHours * 3600 * 1000
    let items = []
    results.forEach((r, i) => {
        const name = SOURCES[i].name
        if (r.status === 'rejected') {
            report.sources.push({ name, ok: false, error: String(r.reason?.message || r.reason) })
            return
        }
        const fresh = r.value
            .filter(it => !it.publishedAt || it.publishedAt.getTime() >= cutoff)
            .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
            .slice(0, SETTINGS.maxPerSource)
        report.sources.push({ name, ok: true, items: r.value.length, fresh: fresh.length })
        items.push(...fresh)
    })

    // 2. De-duplicate within this batch (same URL or identical title)
    const seenKeys = new Set()
    const seenTitles = new Set()
    items = items
        .map(it => ({ ...it, urlKey: normaliseUrl(it.url) }))
        .filter(it => {
            const t = it.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
            if (seenKeys.has(it.urlKey) || seenTitles.has(t)) return false
            seenKeys.add(it.urlKey)
            seenTitles.add(t)
            return true
        })

    // 3. Skip anything already in the database (pending, published or rejected)
    const supabase = createAdminClient()
    if (items.length) {
        const { data: existing, error } = await supabase
            .from('industry_news')
            .select('url_key')
            .in('url_key', items.map(it => it.urlKey))
        if (error) throw new Error('Supabase: ' + error.message)
        const known = new Set((existing || []).map(r => r.url_key))
        const before = items.length
        items = items.filter(it => !known.has(it.urlKey))
        report.alreadySeen = before - items.length
    }

    // Newest first, capped
    items.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
    items = items.slice(0, SETTINGS.maxCandidates)
    report.candidates = items.length

    if (items.length === 0) {
        report.durationMs = Date.now() - startedAt
        return report
    }

    // 4. Let Claude choose + summarise
    const picks = await curateWithClaude(items, SETTINGS.picksPerRun)
    report.picked = picks.length

    const rows = picks.map(p => ({
        headline: p.headline,
        summary: p.summary,
        category: p.category,
        source: p.candidate.source,
        url: p.candidate.url,
        url_key: p.candidate.urlKey,
        original_title: p.candidate.title,
        published_at: (p.candidate.publishedAt || new Date()).toISOString(),
        status: 'pending',
    }))

    if (dryRun) {
        report.preview = rows
    } else if (rows.length) {
        // ignoreDuplicates guards against two runs overlapping
        const { data, error } = await supabase
            .from('industry_news')
            .upsert(rows, { onConflict: 'url_key', ignoreDuplicates: true })
            .select('id')
        if (error) throw new Error('Supabase insert: ' + error.message)
        report.inserted = data?.length ?? rows.length
    }

    report.durationMs = Date.now() - startedAt
    return report
}
