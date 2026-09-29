import { redirect, permanentRedirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// The Gallery has become the Portfolio. Old links keep working:
//   /gallery                  → /portfolio
//   /gallery?category=<slug>  → /portfolio/<slug>
export default async function GalleryRedirect({ searchParams }) {
    const { category } = (await searchParams) || {}

    if (category) {
        const supabase = await createClient()
        const { data } = await supabase
            .from('gallery_categories')
            .select('slug')
            .eq('slug', category)
            .maybeSingle()
        if (data) redirect(`/portfolio/${data.slug}`)
    }

    permanentRedirect('/portfolio')
}
