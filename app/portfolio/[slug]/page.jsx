import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createPublicClient } from '@/utils/supabase/public'
import ProjectClient from './ProjectClient'
import NamedProject from './NamedProject'
import Breadcrumbs from '../../components/content/Breadcrumbs'
import { toProject, metaLine } from '../lib'
import { projectBySlug, PROJECTS } from '@/lib/content/projects'
import { pageMetadata } from '@/lib/seo'
import { canonicalSlug } from '@/lib/portfolio-slugs'

export const revalidate = 600

// Keep meta descriptions within 155 characters, cutting at a word
function fitDescription(...parts) {
    const text = parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
    if (text.length <= 155) return text
    const first = parts.filter(Boolean)[0] || text
    const base = first.length <= 155 ? first : first.slice(0, 154).replace(/\s+\S*$/, '') + '…'
    return base
}

// Pre-render every project at build time; new categories render on first
// visit and are then cached (ISR). The page reads no searchParams, so it
// stays static — ?image= deep links are handled in the browser.
export async function generateStaticParams() {
    const named = PROJECTS.map(p => ({ slug: p.slug }))
    try {
        const { data } = await createPublicClient().from('gallery_categories').select('slug')
        const db = (data || []).map(c => ({ slug: canonicalSlug(c.slug) }))
        const seen = new Set()
        return [...named, ...db].filter(p => p.slug && !seen.has(p.slug) && seen.add(p.slug))
    } catch {
        return named
    }
}

// cache() so generateMetadata and the page share one set of queries
const loadProject = cache(async function loadProject(slug) {
    const supabase = createPublicClient()

    // All categories (in order) with image counts — used for numbering + next project
    const { data: categories } = await supabase
        .from('gallery_categories')
        .select('*, gallery_images(count)')
        .order('position', { ascending: true })

    const withImages = (categories || []).filter(c => (c.gallery_images?.[0]?.count ?? 0) > 0)
    const index = withImages.findIndex(c => canonicalSlug(c.slug) === slug)
    if (index === -1) return null
    const category = withImages[index]

    const { data: images } = await supabase
        .from('gallery_images')
        .select('id, title, description, url, category_id, position')
        .eq('category_id', category.id)
        .order('position', { ascending: true })

    const project = toProject(category, images || [], index + 1)

    // Next project (wraps around to the first)
    let next = null
    if (withImages.length > 1) {
        const nextCat = withImages[(index + 1) % withImages.length]
        const { data: nextCover } = await supabase
            .from('gallery_images')
            .select('url')
            .eq('category_id', nextCat.id)
            .order('position', { ascending: true })
            .limit(1)
        next = { slug: canonicalSlug(nextCat.slug), name: nextCat.name, cover: nextCover?.[0]?.url || null }
    }

    return { project, next, total: withImages.length }
})

export async function generateMetadata({ params }) {
    const { slug } = await params
    const path = `/portfolio/${slug}`

    // Named project page (homepage "Project Stories")
    const named = projectBySlug(slug)
    if (named) {
        const title = [`${named.name} | Artemis Atelier`, `${named.name} | Artemis`, named.name].find(t => t.length <= 60) || named.name
        return pageMetadata({
            title,
            description: fitDescription(named.summary, 'See the design and photos, and book a call about a similar build.'),
            path,
            image: named.images[0]?.src,
            imageAlt: named.images[0]?.alt,
        })
    }

    const data = await loadProject(slug)
    if (!data) return { title: { absolute: 'Project not found | Artemis Atelier' }, robots: { index: false } }
    const { project } = data
    const description =
        project.meta?.seoDescription ||
        (project.summary && fitDescription(project.summary)) ||
        `${project.name} by Artemis Atelier, Lagos: ${metaLine(project.meta) || `${project.imageCount} photos`} of projects we have designed and built.`
    return pageMetadata({
        title: `${project.name} Projects in Lagos | Artemis Atelier`,
        description,
        path,
        image: project.cover || undefined,
        imageAlt: project.name,
    })
}

export default async function ProjectPage({ params }) {
    const { slug } = await params

    const named = projectBySlug(slug)
    if (named) {
        const others = PROJECTS.filter(p => p.slug !== slug).slice(0, 3)
        return <NamedProject project={named} others={others} />
    }

    const data = await loadProject(slug)
    if (!data) notFound()

    return (
        <>
            <Breadcrumbs items={[{ name: 'Projects', path: '/portfolio' }, { name: data.project.name, path: `/portfolio/${slug}` }]} schemaOnly />
            <ProjectClient
                project={data.project}
                next={data.next}
                total={data.total}
            />
        </>
    )
}
