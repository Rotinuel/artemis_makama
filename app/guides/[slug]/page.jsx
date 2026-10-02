import { notFound } from 'next/navigation'
import ArticleShell from '../../components/content/ArticleShell'
import { GUIDES, guideBySlug, guideSlug } from '@/lib/content/guides'
import { pageMetadata } from '@/lib/seo'
import { getFxRates } from '@/lib/fx'
import { getPriceBoard } from '@/lib/material-prices/fetch'

export const revalidate = 3600 // refresh live prices and exchange rates hourly
export const dynamicParams = false

export function generateStaticParams() {
    return GUIDES.map(g => ({ slug: guideSlug(g) }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const g = guideBySlug(slug)
    if (!g) return {}
    return pageMetadata({
        title: g.title, description: g.description, path: g.path, image: g.hero, imageAlt: g.heroAlt,
        type: 'article', publishedTime: g.published, modifiedTime: g.updated,
    })
}

export default async function GuidePage({ params }) {
    const { slug } = await params
    const g = guideBySlug(slug)
    if (!g) notFound()
    const needsPrices = (g.blocks || []).some(b => b.t === 'prices')
    const [rates, priceBoard] = await Promise.all([
        g.currency ? getFxRates() : null,
        needsPrices ? getPriceBoard() : null,
    ])
    return <ArticleShell page={g} rates={rates} priceBoard={priceBoard} />
}
