import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function NewsSection() {
    const supabase = await createClient()
    const { data: newsItems = [] } = await supabase
        .from('news_items')
        .select('*')
        .order('position', { ascending: true })

    return (
        <section className="px-6 md:px-10 max-w-[1600px] mx-auto py-20 md:py-28">

            {/* Top border + header row */}
            <div className="border-t border-[#1a1a1a] pt-8 mb-0 flex items-end justify-between">
                <div>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-[#6b6b6b] mb-2 font-medium">
                        Latest
                    </p>
                    <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a] leading-none">
                        News
                    </h2>
                </div>
                <Link
                    href="/news-events"
                    className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] hover:opacity-50 transition-opacity pb-1"
                >
                    See All News
                    <span className="text-[16px] leading-none">→</span>
                </Link>
            </div>

            {/* News list */}
            <div className="mt-10">
                {newsItems.length === 0 ? (
                    <p className="text-[14px] text-[#6b6b6b] py-10 border-t border-[#e0e0e0]">
                        No news items yet.
                    </p>
                ) : (
                    <ul className="border-t border-[#e0e0e0]">
                        {newsItems.map((item) => (
                            <li key={item.id} className="border-b border-[#e0e0e0]">
                                <Link
                                    href={item.href || '#'}
                                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-5 group"
                                >
                                    <span className="text-[11px] text-[#9b9b9b] flex-shrink-0 sm:w-32 tracking-wide">
                                        {item.date}
                                    </span>
                                    <span className="text-[14px] md:text-[15px] text-[#1a1a1a] leading-snug group-hover:opacity-50 transition-opacity font-light">
                                        {item.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Mobile see all */}
            <div className="mt-8 md:hidden">
                <Link
                    href="/news-events"
                    className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5"
                >
                    See All News →
                </Link>
            </div>

        </section>
    )
}

// import Link from 'next/link'
// import { createClient } from '@/utils/supabase/server'
//
// // Server Component — fetches from Supabase at request time
// // Every time someone visits the page, they see the latest news from the admin
// export default async function NewsSection() {
//     const supabase = await createClient()
//     const { data: newsItems = [] } = await supabase
//         .from('news_items')
//         .select('*')
//         .order('position', { ascending: true })
//
//     return (
//         <section className="py-20 md:py-28 px-6 md:px-10 max-w-[1600px] mx-auto">
//             <div className="flex items-end justify-between mb-12 border-b border-[#e0e0e0] pb-6">
//                 <div>
//                     <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Latest</p>
//                     <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a]">News</h2>
//                 </div>
//                 <Link
//                     href="/news-events"
//                     className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block"
//                 >
//                     See All News
//                 </Link>
//             </div>
//
//             {newsItems.length === 0 && (
//                 <p className="text-[14px] text-[#6b6b6b] py-8">No news items yet.</p>
//             )}
//
//             <ul>
//                 {newsItems.map((item) => (
//                     <li key={item.id} className="border-b border-[#e0e0e0] last:border-b-0">
//                         <Link
//                             href={item.href || '#'}
//                             className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8 py-6 group"
//                         >
//               <span className="text-[12px] text-[#6b6b6b] flex-shrink-0 sm:w-28 pt-0.5">
//                 {item.date}
//               </span>
//                             <span className="text-[15px] md:text-[16px] text-[#1a1a1a] leading-snug group-hover:opacity-60 transition-opacity font-light">
//                 {item.title}
//               </span>
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//
//             <div className="mt-8 md:hidden">
//                 <Link href="/news-events" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5">
//                     See All News
//                 </Link>
//             </div>
//         </section>
//     )
// }
//
//
// // import Link from 'next/link'
// //
// // const newsItems = [
// //   {
// //     date: 'May 15, 2026',
// //     title: "AAL's Rashed Singaby Discusses USL's" +
// //         " Promotion and Relegation Plans with Forbes",
// //     href: '#',
// //   },
// //   {
// //     date: 'May 13, 2026',
// //     title: "Alaska Airlines' Modernized North Main Terminal Unveiled at Seattle-Tacoma International Airport",
// //     href: '#',
// //   },
// //   {
// //     date: 'May 11, 2026',
// //     title: "AAL's John Rhodes Talks Sports Venue Brand" +
// //         " Engagement with the Financial Times",
// //     href: '#',
// //   },
// //   {
// //     date: 'May 6, 2026',
// //     title: 'Miami to Expand Paddock Club Hospitality With New Extension Overlooking Turn 1, Making It One of the Largest in Formula 1',
// //     href: '#',
// //   },
// //   {
// //     date: 'May 4, 2026',
// //     title: 'AAL Names New Leaders to Chicago Office',
// //     href: '#',
// //   },
// //   {
// //     date: 'April 28, 2026',
// //     title: 'AAL to Create an Expanded Global Sports,' +
// //         ' Recreation and Entertainment Design Practice',
// //     href: '#',
// //   },
// //   {
// //     date: 'April 23, 2026',
// //     title: 'AAL Promotes Two Senior Executives to New' +
// //         ' Roles',
// //     href: '#',
// //   },
// //   {
// //     date: 'April 20, 2026',
// //     title: 'AAL Unveils Design of Major Departure Spaces' +
// //         ' at Phu Quoc International Airport in Vietnam',
// //     href: '#',
// //   },
// //   {
// //     date: 'April 17, 2026',
// //     title: 'Toronto Tempo to Develop World-Class Performance Centre',
// //     href: '#',
// //   },
// //   {
// //     date: 'April 15, 2026',
// //     title: 'Five AAL-Designed Projects Top Out',
// //     href: '#',
// //   },
// // ]
// //
// // export default function NewsSection() {
// //   return (
// //     <section className="py-20 md:py-28 px-6 md:px-10 max-w-[1600px] mx-auto">
// //       {/* Header */}
// //       <div className="flex items-end justify-between mb-12 border-b border-[#e0e0e0] pb-6">
// //         <div>
// //           <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Latest</p>
// //           <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a]">News</h2>
// //         </div>
// //         <Link
// //           href="/news-events"
// //           className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block"
// //         >
// //           See All News
// //         </Link>
// //       </div>
// //
// //       {/* News List */}
// //       <ul>
// //         {newsItems.map((item, i) => (
// //           <li key={i} className="border-b border-[#e0e0e0] last:border-b-0">
// //             <Link
// //               href={item.href}
// //               className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8 py-6 group"
// //             >
// //               <span className="text-[12px] text-[#6b6b6b] flex-shrink-0 sm:w-28 pt-0.5">{item.date}</span>
// //               <span className="text-[15px] md:text-[16px] text-[#1a1a1a] leading-snug group-hover:opacity-60 transition-opacity font-light">
// //                 {item.title}
// //               </span>
// //             </Link>
// //           </li>
// //         ))}
// //       </ul>
// //
// //       <div className="mt-8 md:hidden">
// //         <Link href="/news-events" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5">
// //           See All News
// //         </Link>
// //       </div>
// //     </section>
// //   )
// // }
