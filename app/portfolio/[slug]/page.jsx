import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProjectClient from './ProjectClient'
import CookieBanner from '../../components/CookieBanner'
import { toProject, metaLine } from '../lib'

// cache() so generateMetadata and the page share one set of queries
const loadProject = cache(async function loadProject(slug) {
    const supabase = await createClient()

    // All categories (in order) with image counts — used for numbering + next project
    const { data: categories } = await supabase
        .from('gallery_categories')
        .select('*, gallery_images(count)')
        .order('position', { ascending: true })

    const withImages = (categories || []).filter(c => (c.gallery_images?.[0]?.count ?? 0) > 0)
    const index = withImages.findIndex(c => c.slug === slug)
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
        next = { slug: nextCat.slug, name: nextCat.name, cover: nextCover?.[0]?.url || null }
    }

    return { project, next, total: withImages.length }
})

export async function generateMetadata({ params }) {
    const { slug } = await params
    const data = await loadProject(slug)
    if (!data) return { title: 'Project not found - Artemis Atelier Ltd' }
    const { project } = data
    const description =
        project.summary?.slice(0, 160) ||
        [project.name, metaLine(project.meta)].filter(Boolean).join(' — ')
    return {
        title: `${project.name} - Portfolio - Artemis Atelier Ltd`,
        description,
        openGraph: project.cover ? { images: [project.cover] } : undefined,
    }
}

export default async function ProjectPage({ params, searchParams }) {
    const { slug } = await params
    const { image } = (await searchParams) || {}
    const data = await loadProject(slug)
    if (!data) notFound()

    return (
        <>
            <ProjectClient
                project={data.project}
                next={data.next}
                total={data.total}
                initialImageId={image || null}
            />
            <CookieBanner />
        </>
    )
}
