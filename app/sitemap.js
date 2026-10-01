import { SITE } from '@/lib/site'
import { getAllPartnerSlugs } from '@/lib/partners'
import { createClient } from '@supabase/supabase-js'

// Served at /sitemap.xml — submit this URL in Google Search Console and
// Bing Webmaster Tools. Portfolio projects are added automatically.
export const revalidate = 3600

const STATIC_ROUTES = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/diaspora-consultation', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/portfolio', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/people', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/news-events', priority: 0.7, changeFrequency: 'daily' },
    { path: '/partners', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
]

async function portfolioSlugs() {
    try {
        // Public, read-only query with the anon key (no cookies needed here)
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const { data } = await supabase
            .from('gallery_categories')
            .select('slug, gallery_images(count)')
            .order('position', { ascending: true })
        return (data || [])
            .filter(c => (c.gallery_images?.[0]?.count ?? 0) > 0)
            .map(c => c.slug)
    } catch {
        return []
    }
}

export default async function sitemap() {
    const now = new Date()
    const entries = STATIC_ROUTES.map(r => ({
        url: `${SITE.url}${r.path === '/' ? '' : r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }))

    for (const slug of await portfolioSlugs()) {
        entries.push({ url: `${SITE.url}/portfolio/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
    }
    for (const slug of getAllPartnerSlugs()) {
        entries.push({ url: `${SITE.url}/partners/${slug}`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 })
    }
    return entries
}
