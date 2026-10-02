import { notFound } from 'next/navigation'
import ArticleShell from '../../components/content/ArticleShell'
import { SERVICES } from '@/lib/content/services'
import { pageMetadata } from '@/lib/seo'

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
    return <ArticleShell page={s} />
}
