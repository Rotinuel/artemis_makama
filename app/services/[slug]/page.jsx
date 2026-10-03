import { notFound } from 'next/navigation'
import ArticleShell from '../../components/content/ArticleShell'
import PriceBox from '../../components/content/PriceBox'
import { SERVICES } from '@/lib/content/services'
import { pageMetadata } from '@/lib/seo'
import { priceFor } from '@/lib/pricing'
import { getFxRates } from '@/lib/fx'

export const revalidate = 86400 // refresh exchange rates daily when prices are shown
export const dynamicParams = false

export function generateStaticParams() {
    return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const s = SERVICES.find(x => x.slug === slug)
    return s ? pageMetadata({ title: s.title, description: s.description, path: s.path, image: s.hero, imageAlt: s.heroAlt }) : {}
}

export default async function ServicePage({ params }) {
    const { slug } = await params
    const s = SERVICES.find(x => x.slug === slug)
    if (!s) notFound()
    // Advisory services show a price panel; the currency switch only
    // appears once prices are switched on in lib/pricing.js
    const price = s.group === 'advisory' ? priceFor(slug) : null
    const rates = price ? await getFxRates() : null
    const nodes = s.group === 'advisory' ? { pricing: <PriceBox slug={slug} whatsappText={s.whatsappText} /> } : {}
    return <ArticleShell page={price ? { ...s, currency: true, price } : s} rates={rates} nodes={nodes} />
}
