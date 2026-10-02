import { createPublicClient } from '@/utils/supabase/public'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import HeroCarousel from '../components/HeroCarousel'
import NewsEventsClient from './NewsEventsClient'
import { NEWS_HERO_SLIDES } from './heroSlides'
import { buildNewsFeed } from '@/lib/news-feed'
import { buildPriceBoard } from '@/lib/material-prices/board'
import { pageMetadata } from '@/lib/seo'
import Breadcrumbs from '../components/content/Breadcrumbs'

// Statically generated, refreshed every 10 minutes
export const revalidate = 600

export const metadata = pageMetadata({
    title: 'Nigeria Construction News & Material Prices | Artemis Atelier',
    description: 'Artemis Atelier project news, Nigerian construction, architecture and engineering updates, and current building material prices, updated as they change.',
    path: '/news-events',
})

export default async function NewsEventsPage() {
    const supabase = createPublicClient()

    const { data: newsItems } = await supabase
        .from('news_items')
        .select('*')
        .order('position', { ascending: true })

    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('position', { ascending: true })

    // Industry Watch — approved AI-curated stories from the last 30 days
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    const { data: industryNews } = await supabase
        .from('industry_news')
        .select('id, headline, summary, category, source, url, published_at')
        .eq('status', 'published')
        .gte('published_at', since)
        .order('published_at', { ascending: false })
        .limit(20)

    // One feed, newest first — firm news and Industry Watch together
    const feed = buildNewsFeed(newsItems || [], industryNews || [])

    // Building material prices — latest + previous approved price per item/city
    const { data: priceRows } = await supabase
        .from('material_prices')
        .select('item_key, city, price_min, price_max, source_name, source_url, effective_date, created_at')
        .eq('status', 'published')
        .order('effective_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1000)
    const prices = buildPriceBoard(priceRows || [])

    return (
        <>
            <Breadcrumbs items={[{ name: 'News + Events', path: '/news-events' }]} schemaOnly />
            <Navigation />
            <HeroCarousel
                label="Latest"
                title="News + Events"
                description="The latest news, press coverage, project announcements, and upcoming events."
                slides={NEWS_HERO_SLIDES}
            />
            <NewsEventsClient
                feed={feed}
                events={events || []}
                prices={prices}
            />
            <Footer />
            <CookieBanner />
        </>
    )
}
