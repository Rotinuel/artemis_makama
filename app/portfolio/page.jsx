import { createClient } from '@/utils/supabase/server'
import PortfolioClient from './PortfolioClient'
import CookieBanner from '../components/CookieBanner'
import { buildProjects } from './lib'

export const metadata = {
    title: 'Portfolio - Artemis Atelier Ltd',
    description: 'Selected architecture, interiors and construction projects by Artemis Atelier Ltd.',
}

export default async function PortfolioPage() {
    const supabase = await createClient()

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
            <PortfolioClient
                projects={projects}
                totalImages={(images || []).length}
            />
            <CookieBanner />
        </>
    )
}
