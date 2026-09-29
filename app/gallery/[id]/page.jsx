import { notFound, permanentRedirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Old single-image URLs (/gallery/<image id>) now open that image
// inside its project page: /portfolio/<project slug>?image=<image id>
export default async function GalleryImageRedirect({ params }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: image } = await supabase
        .from('gallery_images')
        .select('id, gallery_categories(slug)')
        .eq('id', id)
        .maybeSingle()

    if (!image?.gallery_categories?.slug) notFound()

    permanentRedirect(`/portfolio/${image.gallery_categories.slug}?image=${image.id}`)
}
