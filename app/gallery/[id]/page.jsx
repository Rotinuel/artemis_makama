import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import Link from 'next/link'

export async function generateMetadata({ params }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: image } = await supabase
        .from('gallery_images')
        .select('title, description')
        .eq('id', id)
        .single()

    return {
        title: image?.title || 'Gallery Image',
        description: image?.description || '',
    }
}

export default async function GalleryImagePage({ params }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: image } = await supabase
        .from('gallery_images')
        .select('*, gallery_categories(id, name, slug)')
        .eq('id', id)
        .single()

    if (!image) notFound()

    const { data: related } = await supabase
        .from('gallery_images')
        .select('id, title, url')
        .eq('category_id', image.gallery_categories.id)
        .neq('id', image.id)
        .order('position', { ascending: true })
        .limit(4)

    return (
        <>
            <Navigation />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                .gallery-page {
                    font-family: 'DM Sans', sans-serif;
                    background: #0c0c0c;
                    color: #e8e2d9;
                    min-height: 100vh;
                }

                /* Breadcrumb */
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 11px;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #5a5a5a;
                    margin-bottom: 52px;
                }
                .breadcrumb a {
                    color: #5a5a5a;
                    text-decoration: none;
                    transition: color 0.25s ease;
                }
                .breadcrumb a:hover { color: #e8e2d9; }
                .breadcrumb-sep {
                    color: #2e2e2e;
                    font-size: 14px;
                }
                .breadcrumb-current { color: #9e9588; }

                /* Main grid */
                .image-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 48px;
                }
                @media (min-width: 1024px) {
                    .image-grid {
                        grid-template-columns: 1fr 360px;
                        gap: 64px;
                        align-items: start;
                    }
                }

                /* Image panel */
                .image-panel {
                    position: relative;
                }
                .image-frame {
                    position: relative;
                    background: #111;
                    overflow: hidden;
                }
                .image-frame::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
                    z-index: 1;
                    pointer-events: none;
                }
                .image-frame img {
                    width: 100%;
                    max-height: 78vh;
                    object-fit: contain;
                    display: block;
                    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .image-frame:hover img { transform: scale(1.015); }

                /* Corner accents */
                .corner {
                    position: absolute;
                    width: 18px;
                    height: 18px;
                    border-color: rgba(232, 226, 217, 0.2);
                    border-style: solid;
                    z-index: 2;
                }
                .corner-tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
                .corner-tr { top: 12px; right: 12px; border-width: 1px 1px 0 0; }
                .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 1px 1px; }
                .corner-br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }

                /* Sidebar */
                .sidebar {
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 80px;
                }
                .category-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #6b6460;
                    margin-bottom: 20px;
                }
                .category-tag::before {
                    content: '';
                    display: block;
                    width: 24px;
                    height: 1px;
                    background: #3a3530;
                }

                .image-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(32px, 3.5vw, 52px);
                    font-weight: 300;
                    line-height: 1.1;
                    color: #e8e2d9;
                    margin: 0 0 24px;
                    letter-spacing: -0.01em;
                }

                .divider {
                    width: 32px;
                    height: 1px;
                    background: #2e2e2e;
                    margin-bottom: 24px;
                }

                .image-description {
                    font-size: 14px;
                    line-height: 1.75;
                    color: #6b6460;
                    font-weight: 300;
                    margin: 0 0 40px;
                }

                /* Back link */
                .sidebar-footer {
                    margin-top: auto;
                    padding-top: 40px;
                    border-top: 1px solid #1e1e1e;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 11px;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #5a5a5a;
                    text-decoration: none;
                    transition: color 0.25s ease, gap 0.25s ease;
                }
                .back-link:hover { color: #e8e2d9; gap: 16px; }
                .back-link svg {
                    transition: transform 0.25s ease;
                }
                .back-link:hover svg { transform: translateX(-4px); }

                /* Related section */
                .related-section {
                    margin-top: 96px;
                    padding-top: 48px;
                    border-top: 1px solid #1a1a1a;
                }
                .related-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 36px;
                }
                .related-label {
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #3a3530;
                }
                .related-title {
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #6b6460;
                }
                .related-line {
                    flex: 1;
                    height: 1px;
                    background: #1e1e1e;
                }

                /* Related grid */
                .related-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }
                @media (min-width: 768px) {
                    .related-grid { grid-template-columns: repeat(4, 1fr); }
                }

                .related-item {
                    text-decoration: none;
                    display: block;
                    group: true;
                }
                .related-thumb {
                    overflow: hidden;
                    background: #111;
                    aspect-ratio: 4/3;
                    position: relative;
                    margin-bottom: 12px;
                }
                .related-thumb::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0);
                    transition: background 0.4s ease;
                }
                .related-item:hover .related-thumb::after {
                    background: rgba(0,0,0,0.2);
                }
                .related-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .related-item:hover .related-thumb img { transform: scale(1.08); }
                .related-item-title {
                    font-size: 12px;
                    color: #5a5a5a;
                    font-weight: 300;
                    transition: color 0.25s ease;
                }
                .related-item:hover .related-item-title { color: #9e9588; }

                /* Page animation */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-in { animation: fadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.35s; }
            `}</style>

            <main className="gallery-page" style={{ paddingTop: '88px', paddingBottom: '96px' }}>
                <div style={{ padding: '0 clamp(24px, 5vw, 80px)', maxWidth: '1600px', margin: '0 auto' }}>

                    {/* Breadcrumb */}
                    <nav className="breadcrumb animate-in">
                        <Link href="/gallery">Gallery</Link>
                        <span className="breadcrumb-sep">—</span>
                        <Link href={`/gallery?category=${image.gallery_categories.slug}`}>
                            {image.gallery_categories.name}
                        </Link>
                        {image.title && (
                            <>
                                <span className="breadcrumb-sep">—</span>
                                <span className="breadcrumb-current">{image.title}</span>
                            </>
                        )}
                    </nav>

                    {/* Main layout */}
                    <div className="image-grid">

                        {/* Image */}
                        <div className="image-panel animate-in delay-1">
                            <div className="image-frame">
                                <div className="corner corner-tl" />
                                <div className="corner corner-tr" />
                                <div className="corner corner-bl" />
                                <div className="corner corner-br" />
                                <img
                                    src={image.url}
                                    alt={image.title || 'Gallery image'}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="sidebar animate-in delay-2">
                            <span className="category-tag">{image.gallery_categories.name}</span>

                            {image.title && (
                                <h1 className="image-title">{image.title}</h1>
                            )}

                            <div className="divider" />

                            {image.description && (
                                <p className="image-description">{image.description}</p>
                            )}

                            <div className="sidebar-footer">
                                <Link href="/gallery" className="back-link">
                                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                                        <path d="M5 1L1 5M1 5L5 9M1 5H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Back to Gallery
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Related */}
                    {related && related.length > 0 && (
                        <div className="related-section animate-in delay-3">
                            <div className="related-header">
                                <span className="related-label">More</span>
                                <span className="related-title">{image.gallery_categories.name}</span>
                                <div className="related-line" />
                            </div>
                            <div className="related-grid">
                                {related.map(rel => (
                                    <Link key={rel.id} href={`/gallery/${rel.id}`} className="related-item">
                                        <div className="related-thumb">
                                            <img src={rel.url} alt={rel.title || 'Gallery image'} />
                                        </div>
                                        {rel.title && (
                                            <p className="related-item-title">{rel.title}</p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </>
    )
}

// import { createClient } from '@/utils/supabase/server'
// import { notFound } from 'next/navigation'
// import Link from 'next/link'
// // import Navigation from '@/components/Navigation'
// // import Footer from '@/components/Footer'
//
// export async function generateMetadata({ params }) {
//     const { id } = await params
//     const supabase = await createClient()
//     const { data: image } = await supabase
//         .from('gallery_images')
//         .select('title, description')
//         .eq('id', id)
//         .single()
//
//     return {
//         title: image?.title || 'Gallery Image',
//         description: image?.description || '',
//     }
// }
//
// export default async function GalleryImagePage({ params }) {
//     const { id } = await params
//     const supabase = await createClient()
//
//     const { data: image } = await supabase
//         .from('gallery_images')
//         .select('*, gallery_categories(id, name, slug)')
//         .eq('id', id)
//         .single()
//
//     if (!image) notFound()
//
//     const { data: related } = await supabase
//         .from('gallery_images')
//         .select('id, title, url')
//         .eq('category_id', image.gallery_categories.id)
//         .neq('id', image.id)
//         .order('position', { ascending: true })
//         .limit(4)
//
//     return (
//         <>
//             {/* <Navigation /> */}
//
//             <main className="pt-24 pb-20">
//                 <div className="px-6 md:px-10 max-w-[1600px] mx-auto">
//
//                     {/* Breadcrumb */}
//                     <nav className="flex items-center gap-2 text-[12px] text-[#6b6b6b] mb-8">
//                         <Link href="/gallery" className="hover:text-[#1a1a1a] transition-colors">
//                             Gallery
//                         </Link>
//                         <span>/</span>
//                         <Link
//                             href={`/gallery?category=${image.gallery_categories.slug}`}
//                             className="hover:text-[#1a1a1a] transition-colors"
//                         >
//                             {image.gallery_categories.name}
//                         </Link>
//                         {image.title && (
//                             <>
//                                 <span>/</span>
//                                 <span className="text-[#1a1a1a]">{image.title}</span>
//                             </>
//                         )}
//                     </nav>
//
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//                         {/* Main image */}
//                         <div className="lg:col-span-2">
//                             <div className="bg-[#f0f0f0] rounded-sm overflow-hidden">
//                                 <img
//                                     src={image.url}
//                                     alt={image.title || 'Gallery image'}
//                                     className="w-full object-contain max-h-[75vh]"
//                                 />
//                             </div>
//                         </div>
//
//                         {/* Details sidebar */}
//                         <div className="flex flex-col">
//                             <div className="mb-2">
//                 <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium">
//                   {image.gallery_categories.name}
//                 </span>
//                             </div>
//
//                             {image.title && (
//                                 <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a] leading-tight mb-4">
//                                     {image.title}
//                                 </h1>
//                             )}
//
//                             {image.description && (
//                                 <p className="text-[14px] text-[#6b6b6b] leading-relaxed mb-8 font-light">
//                                     {image.description}
//                                 </p>
//                             )}
//
//                             <div className="mt-auto pt-8 border-t border-[#e0e0e0]">
//                                 <Link
//                                     href="/gallery"
//                                     className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity"
//                                 >
//                                     ← Back to Gallery
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Related images */}
//                     {related && related.length > 0 && (
//                         <div className="mt-16 pt-10 border-t border-[#e0e0e0]">
//                             <h2 className="text-[13px] uppercase tracking-[0.12em] text-[#6b6b6b] mb-6">
//                                 More from {image.gallery_categories.name}
//                             </h2>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                 {related.map(rel => (
//                                     <Link key={rel.id} href={`/gallery/${rel.id}`} className="group block">
//                                         <div className="overflow-hidden rounded-sm bg-[#f0f0f0] aspect-[4/3]">
//                                             <img
//                                                 src={rel.url}
//                                                 alt={rel.title || 'Gallery image'}
//                                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                                             />
//                                         </div>
//                                         {rel.title && (
//                                             <p className="mt-2 text-[12px] text-[#1a1a1a] font-light group-hover:opacity-60 transition-opacity">
//                                                 {rel.title}
//                                             </p>
//                                         )}
//                                     </Link>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//
//                 </div>
//             </main>
//
//             {/* <Footer /> */}
//         </>
//     )
// }
//
//
// // import { createClient } from '@/utils/supabase/server'
// // import { notFound } from 'next/navigation'
// // import Link from 'next/link'
// // // import Navigation from '@/components/Navigation'
// // // import Footer from '@/components/Footer'
// //
// // export async function generateMetadata({ params }) {
// //     const supabase = await createClient()
// //     const { data: image } = await supabase
// //         .from('gallery_images')
// //         .select('title, description')
// //         .eq('id', params.slug)
// //         .single()
// //
// //     return {
// //         title: image?.title || 'Gallery Image',
// //         description: image?.description || '',
// //     }
// // }
// //
// // export default async function GalleryImagePage({ params }) {
// //     const supabase = await createClient()
// //
// //     // Fetch the current image with its category
// //     const { data: image } = await supabase
// //         .from('gallery_images')
// //         .select('*, gallery_categories(id, name, slug)')
// //         .eq('id', params.slug)
// //         .single()
// //
// //     if (!image) notFound()
// //
// //     // Fetch related images from same category (exclude current)
// //     const { data: related } = await supabase
// //         .from('gallery_images')
// //         .select('id, title, url')
// //         .eq('category_id', image.gallery_categories.id)
// //         .neq('id', image.id)
// //         .order('position', { ascending: true })
// //         .limit(4)
// //
// //     return (
// //         <>
// //             {/*<Navigation />*/}
// //
// //             <main className="pt-24 pb-20">
// //                 <div className="px-6 md:px-10 max-w-[1600px] mx-auto">
// //
// //                     {/* Breadcrumb */}
// //                     <nav className="flex items-center gap-2 text-[12px] text-[#6b6b6b] mb-8">
// //                         <Link href="/gallery" className="hover:text-[#1a1a1a] transition-colors">
// //                             Gallery
// //                         </Link>
// //                         <span>/</span>
// //                         <Link
// //                             href={`/gallery?category=${image.gallery_categories.slug}`}
// //                             className="hover:text-[#1a1a1a] transition-colors"
// //                         >
// //                             {image.gallery_categories.name}
// //                         </Link>
// //                         {image.title && (
// //                             <>
// //                                 <span>/</span>
// //                                 <span className="text-[#1a1a1a]">{image.title}</span>
// //                             </>
// //                         )}
// //                     </nav>
// //
// //                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
// //                         {/* Main image */}
// //                         <div className="lg:col-span-2">
// //                             <div className="bg-[#f0f0f0] rounded-sm overflow-hidden">
// //                                 <img
// //                                     src={image.url}
// //                                     alt={image.title || 'Gallery image'}
// //                                     className="w-full object-contain max-h-[75vh]"
// //                                 />
// //                             </div>
// //                         </div>
// //
// //                         {/* Details sidebar */}
// //                         <div className="flex flex-col">
// //                             <div className="mb-2">
// //                 <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium">
// //                   {image.gallery_categories.name}
// //                 </span>
// //                             </div>
// //
// //                             {image.title && (
// //                                 <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a] leading-tight mb-4">
// //                                     {image.title}
// //                                 </h1>
// //                             )}
// //
// //                             {image.description && (
// //                                 <p className="text-[14px] text-[#6b6b6b] leading-relaxed mb-8 font-light">
// //                                     {image.description}
// //                                 </p>
// //                             )}
// //
// //                             <div className="mt-auto pt-8 border-t border-[#e0e0e0]">
// //                                 <Link
// //                                     href="/gallery"
// //                                     className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity"
// //                                 >
// //                                     ← Back to Gallery
// //                                 </Link>
// //                             </div>
// //                         </div>
// //                     </div>
// //
// //                     {/* Related images */}
// //                     {related && related.length > 0 && (
// //                         <div className="mt-16 pt-10 border-t border-[#e0e0e0]">
// //                             <h2 className="text-[13px] uppercase tracking-[0.12em] text-[#6b6b6b] mb-6">
// //                                 More from {image.gallery_categories.name}
// //                             </h2>
// //                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                                 {related.map(rel => (
// //                                     <Link key={rel.id} href={`/gallery/${rel.id}`} className="group block">
// //                                         <div className="overflow-hidden rounded-sm bg-[#f0f0f0] aspect-[4/3]">
// //                                             <img
// //                                                 src={rel.url}
// //                                                 alt={rel.title || 'Gallery image'}
// //                                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
// //                                             />
// //                                         </div>
// //                                         {rel.title && (
// //                                             <p className="mt-2 text-[12px] text-[#1a1a1a] font-light group-hover:opacity-60 transition-opacity">
// //                                                 {rel.title}
// //                                             </p>
// //                                         )}
// //                                     </Link>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     )}
// //
// //                 </div>
// //             </main>
// //
// //             {/*<Footer />*/}
// //         </>
// //     )
// // }
