import { SITE } from '@/lib/site'
import { getAllPartnerSlugs } from '@/lib/partners'
import { createPublicClient } from '@/utils/supabase/public'
import { GUIDES } from '@/lib/content/guides'
import { SERVICES, contractorLagos } from '@/lib/content/services'
import { howWeBuild } from '@/lib/content/process'
import { PROJECTS } from '@/lib/content/projects'

// Served at /sitemap.xml — submit it in Google Search Console and Bing
// Webmaster Tools. lastmod is the real date each page's content changed
// (content files carry an `updated` date; database pages use their rows).
export const revalidate = 3600

// Date of the last edit to pages whose content lives in code. Update when
// you change one of these pages.
const PAGES_UPDATED = {
    '/': '2026-10-02',
    '/build-from-abroad': '2026-10-02',
    '/services': '2026-10-02',
    '/guides': '2026-10-02',
    '/house-plans': '2026-10-02',
    '/about': '2026-10-02',
    '/people': '2026-10-02',
    '/partners': '2026-10-02',
    '/contact': '2026-10-02',
    '/privacy': '2026-10-02',
    '/terms': '2026-10-02',
}

const url = path => `${SITE.url}${path === '/' ? '' : path}`
const day = d => (d ? new Date(d) : undefined)
const latest = (...dates) => dates.filter(Boolean).map(d => new Date(d)).sort((a, b) => b - a)[0]

async function dbDates() {
    try {
        const supabase = createPublicClient()
        const [cats, news, industry, prices] = await Promise.all([
            supabase.from('gallery_categories').select('slug, gallery_images(created_at)').order('position', { ascending: true }),
            supabase.from('news_items').select('created_at').order('created_at', { ascending: false }).limit(1),
            supabase.from('industry_news').select('published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(1),
            supabase.from('material_prices').select('effective_date').eq('status', 'published').order('effective_date', { ascending: false }).limit(1),
        ])
        const portfolio = (cats.data || [])
            .filter(c => (c.gallery_images || []).length > 0)
            .map(c => ({ slug: c.slug, updated: latest(...c.gallery_images.map(i => i.created_at)) }))
        return {
            portfolio,
            news: latest(news.data?.[0]?.created_at, industry.data?.[0]?.published_at),
            prices: day(prices.data?.[0]?.effective_date),
        }
    } catch {
        return { portfolio: [], news: undefined, prices: undefined }
    }
}

export default async function sitemap() {
    const db = await dbDates()
    const latestPortfolio = latest(...db.portfolio.map(p => p.updated))
    const entries = []
    const add = (path, lastModified, priority) => entries.push({ url: url(path), ...(lastModified ? { lastModified } : {}), priority })

    add('/', latest(PAGES_UPDATED['/'], db.news), 1.0)
    add('/build-from-abroad', day(PAGES_UPDATED['/build-from-abroad']), 0.9)
    add('/how-we-build', day(howWeBuild.updated), 0.8)
    add('/services', day(PAGES_UPDATED['/services']), 0.8)
    for (const s of SERVICES) add(s.path, day(s.updated), 0.8)
    add(contractorLagos.path, day(contractorLagos.updated), 0.8)
    add('/portfolio', latest(latestPortfolio, '2026-10-02'), 0.8)
    for (const p of PROJECTS) add(`/portfolio/${p.slug}`, day('2026-10-02'), 0.6)
    for (const p of db.portfolio) add(`/portfolio/${p.slug}`, p.updated, 0.6)
    add('/house-plans', day(PAGES_UPDATED['/house-plans']), 0.7)
    add('/guides', day(PAGES_UPDATED['/guides']), 0.7)
    for (const g of GUIDES) add(g.path, latest(g.updated, g.blocks?.some(b => b.t === 'prices') ? db.prices : null), 0.8)
    add('/news/material-prices', db.prices || day('2026-10-02'), 0.7)
    add('/news-events', db.news, 0.6)
    add('/about', day(PAGES_UPDATED['/about']), 0.6)
    add('/people', day(PAGES_UPDATED['/people']), 0.6)
    add('/partners', day(PAGES_UPDATED['/partners']), 0.4)
    for (const slug of getAllPartnerSlugs()) add(`/partners/${slug}`, day(PAGES_UPDATED['/partners']), 0.4)
    add('/contact', day(PAGES_UPDATED['/contact']), 0.7)
    add('/privacy', day(PAGES_UPDATED['/privacy']), 0.2)
    add('/terms', day(PAGES_UPDATED['/terms']), 0.2)
    return entries
}
