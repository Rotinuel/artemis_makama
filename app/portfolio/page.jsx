import { createPublicClient } from '@/utils/supabase/public'
import PortfolioClient from './PortfolioClient'
import Breadcrumbs from '../components/content/Breadcrumbs'
import { buildProjects } from './lib'
import { PROJECTS } from '@/lib/content/projects'
import { pageMetadata } from '@/lib/seo'

// Statically generated; new portfolio images appear within 10 minutes
export const revalidate = 600

export const metadata = pageMetadata({
    title: 'Our Projects in Lagos: Homes, Estates & Churches | Artemis Atelier',
    description: 'Homes, estates, churches and commercial buildings we have designed and built across Lagos and Ogun State, with location, scope and photos from foundation to handover.',
    path: '/portfolio',
    image: '/26.jpg',
})

export default async function PortfolioPage() {
    const supabase = createPublicClient()

    const [{ data: categories }, { data: images }] = await Promise.all([
        supabase
            .from('gallery_categories')
            .select('*')
            .order('position', { ascending: true }),
        supabase
            .from('gallery_images')
            .select('id, title, description, url, category_id, position')
            .order('position', { ascending: true }),
    ])

    // Each category is presented as a project; empty ones are skipped
    // (the index only needs each project's cover + count, not every image)
    const projects = buildProjects(categories || [], images || []).map(p => ({
        id: p.id, slug: p.slug, name: p.name, number: p.number,
        cover: p.cover, imageCount: p.imageCount, meta: p.meta,
    }))

    return (
        <>
            <Breadcrumbs items={[{ name: 'Projects', path: '/portfolio' }]} schemaOnly />
            <PortfolioClient
                projects={projects}
                totalImages={(images || []).length}
                stories={PROJECTS}
            />
        </>
    )
}
