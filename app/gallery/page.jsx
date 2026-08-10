import { createClient } from '@/utils/supabase/server'
import GalleryClient from '../gallery/GalleryClient'
import CookieBanner from '../components/CookieBanner'

export const metadata = {
    title: 'Gallery - Artemis Atelier Ltd',
    description: 'Artemis Atelier Ltd designs buildings and spaces that respond to the needs of people and the environment.',
}

export default async function GalleryPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('position', { ascending: true })

    const { data: images } = await supabase
        .from('gallery_images')
        .select('*, gallery_categories(name, slug)')
        .order('position', { ascending: true })

    return (
        <>
            <GalleryClient
                categories={categories || []}
                images={images || []}
            />
            <CookieBanner />
        </>
    )
}




// import { createClient } from '@/utils/supabase/server'
// import GalleryClient from '../gallery/GalleryClient'

// export const metadata = {
//     title: 'Gallery',
//     description: 'Browse our project gallery by category.',
// }

// export default async function GalleryPage() {
//     const supabase = await createClient()

//     const { data: categories } = await supabase
//         .from('gallery_categories')
//         .select('*')
//         .order('position', { ascending: true })

//     const { data: images } = await supabase
//         .from('gallery_images')
//         .select('*, gallery_categories(name, slug)')
//         .order('position', { ascending: true })

//     return (
//         <GalleryClient
//             categories={categories || []}
//             images={images || []}
//         />
//     )
// }
