import { createAdminClient } from '@/utils/supabase/admin'
import { researchPrices } from './research'
import { CHANGE_THRESHOLD, midpoint } from './items'

/**
 * Research today's prices and store *changed* ones as pending suggestions.
 * Prices that match what's already published (within 1%) are skipped, so the
 * admin only reviews real changes.
 */
export async function runMaterialPricesJob() {
    const startedAt = Date.now()
    const supabase = createAdminClient()
    const report = { found: 0, unchanged: 0, suggested: 0, updatedPending: 0 }

    const found = await researchPrices()
    report.found = found.length

    // Current published price + any open suggestion for each item/city
    const { data: rows, error } = await supabase
        .from('material_prices')
        .select('id, item_key, city, price_min, price_max, status, effective_date, created_at')
        .in('status', ['published', 'pending'])
        .order('effective_date', { ascending: false })
        .order('created_at', { ascending: false })
    if (error) throw new Error('Supabase: ' + error.message)

    const current = new Map()
    const pending = new Map()
    for (const r of rows || []) {
        const k = `${r.item_key}|${r.city}`
        if (r.status === 'published' && !current.has(k)) current.set(k, r)
        if (r.status === 'pending' && !pending.has(k)) pending.set(k, r)
    }

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })

    for (const p of found) {
        const k = `${p.item}|${p.city}`
        const cur = current.get(k)
        const newMid = (p.min + p.max) / 2
        if (cur) {
            const curMid = midpoint(cur)
            if (Math.abs(newMid - curMid) / curMid < CHANGE_THRESHOLD) {
                report.unchanged++
                continue
            }
        }

        const row = {
            item_key: p.item,
            city: p.city,
            price_min: Math.round(p.min),
            price_max: Math.round(p.max),
            source_name: p.source_name || null,
            source_url: p.source_url,
            source_date: p.source_date,
            note: p.note || null,
            effective_date: today,
            origin: 'ai',
            status: 'pending',
        }

        const open = pending.get(k)
        if (open) {
            // Replace the older, still-unreviewed suggestion with today's
            const { error: e } = await supabase.from('material_prices').update(row).eq('id', open.id)
            if (e) throw new Error('Supabase update: ' + e.message)
            report.updatedPending++
        } else {
            const { error: e } = await supabase.from('material_prices').insert(row)
            if (e) throw new Error('Supabase insert: ' + e.message)
            report.suggested++
        }
    }

    report.durationMs = Date.now() - startedAt
    return report
}
