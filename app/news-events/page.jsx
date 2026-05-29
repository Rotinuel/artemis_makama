import { createClient } from '@/utils/supabase/server'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import NewsEventsClient from './NewsEventsClient'

export const metadata = {
  title: 'News + Events',
  description: 'The latest news, press coverage, and events.',
}

export default async function NewsEventsPage() {
  const supabase = await createClient()

  const { data: newsItems } = await supabase
      .from('news_items')
      .select('*')
      .order('position', { ascending: true })

  const { data: events } = await supabase
      .from('events')
      .select('*')
      .order('position', { ascending: true })

  return (
      <>
        <Navigation />
        <PageHero
            label="Latest"
            title="News + Events"
            description="The latest news, press coverage, project announcements, and upcoming events."
        />
        <NewsEventsClient
            newsItems={newsItems || []}
            events={events || []}
        />
        <Footer />
        <CookieBanner />
      </>
  )
}


// import Navigation from '../components/Navigation'
// import Footer from '../components/Footer'
// import CookieBanner from '../components/CookieBanner'
// import PageHero from '../components/PageHero'
// import Link from 'next/link'
//
// export const metadata = {
//   title: 'News + Events - HOK',
//   description: 'The latest news, press coverage, and events from HOK.',
// }
//
// const newsItems = [
//   { date: 'May 15, 2026', type: 'Media Coverage', title: "HOK's Rashed Singaby Discusses USL's Promotion and Relegation Plans with Forbes", image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
//   { date: 'May 13, 2026', type: 'Project News', title: "Alaska Airlines' Modernized North Main Terminal Unveiled at Seattle-Tacoma International Airport", image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80' },
//   { date: 'May 11, 2026', type: 'Media Coverage', title: "HOK's John Rhodes Talks Sports Venue Brand Engagement with the Financial Times", image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
//   { date: 'May 6, 2026', type: 'Project News', title: 'Miami to Expand Paddock Club Hospitality With New Extension Overlooking Turn 1, Making It One of the Largest in Formula 1', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80' },
//   { date: 'May 4, 2026', type: 'Firm News', title: 'HOK Names New Leaders to Chicago Office', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80' },
//   { date: 'April 28, 2026', type: 'Firm News', title: 'HOK and ROSSETTI Join Forces to Create Expanded Global Sports, Recreation and Entertainment Design Practice', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80' },
//   { date: 'April 23, 2026', type: 'Firm News', title: 'HOK Promotes Two Senior Executives to New Roles', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80' },
//   { date: 'April 20, 2026', type: 'Project News', title: 'HOK Unveils Design of Major Departure Spaces at Phu Quoc International Airport in Vietnam', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80' },
//   { date: 'April 17, 2026', type: 'Project News', title: 'Toronto Tempo to Develop World-Class Performance Centre', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80' },
//   { date: 'April 15, 2026', type: 'Project News', title: 'Five HOK-Designed Projects Top Out', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' },
//   { date: 'March 28, 2026', type: 'Award', title: 'Fast Company Names HOK a 2026 Most Innovative Company', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
//   { date: 'March 20, 2026', type: 'Project News', title: 'HOK Tops Out New Orleans Jazz Market Project', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' },
// ]
//
// const upcomingEvents = [
//   { date: 'June 3–5, 2026', title: 'HOK at AIA Conference on Architecture', location: 'Chicago, IL', type: 'Conference' },
//   { date: 'June 12, 2026', title: 'Design Futures Symposium: AI in Architecture', location: 'New York, NY', type: 'Event' },
//   { date: 'June 18–21, 2026', title: 'IIDA NEOCON 2026', location: 'Chicago, IL', type: 'Trade Show' },
//   { date: 'July 8, 2026', title: 'Healthcare Design Innovation Summit', location: 'Virtual', type: 'Webinar' },
// ]
//
// const filters = ['All', 'Firm News', 'Project News', 'Media Coverage', 'Award', 'Event']
//
// export default function NewsEventsPage() {
//   return (
//     <>
//       <Navigation />
//       <PageHero
//         label="Latest"
//         title="News + Events"
//         description="The latest news, press coverage, project announcements, and upcoming events from HOK."
//       />
//
//       {/* Filter bar */}
//       <div className="border-b border-[#e0e0e0] px-6 md:px-10 sticky top-16 bg-white z-10">
//         <div className="max-w-[1600px] mx-auto flex gap-6 overflow-x-auto">
//           {filters.map(f => (
//             <button
//               key={f}
//               className={`text-[12px] tracking-wide py-4 border-b-2 flex-shrink-0 transition-colors ${f === 'All' ? 'border-[#1a1a1a] text-[#1a1a1a] font-medium' : 'border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]'}`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>
//
//       <div className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
//           {/* Main news */}
//           <div className="lg:col-span-2">
//             <h2 className="text-[22px] font-light text-[#1a1a1a] mb-8 border-b border-[#e0e0e0] pb-4">News</h2>
//
//             {/* Featured first item */}
//             <Link href="#" className="block group mb-10">
//               <div className="overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
//                 <img src={newsItems[0].image} alt={newsItems[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//               </div>
//               <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium">{newsItems[0].type}</span>
//               <span className="text-[12px] text-[#6b6b6b] ml-3">{newsItems[0].date}</span>
//               <h3 className="text-[20px] font-light text-[#1a1a1a] mt-2 leading-snug group-hover:opacity-60 transition-opacity">{newsItems[0].title}</h3>
//             </Link>
//
//             {/* Remaining as list */}
//             <ul>
//               {newsItems.slice(1).map((item, i) => (
//                 <li key={i} className="border-b border-[#e0e0e0] last:border-b-0">
//                   <Link href="#" className="flex gap-5 py-5 group">
//                     <div className="flex-shrink-0 w-24 h-16 overflow-hidden">
//                       <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="text-[10px] tracking-[0.1em] uppercase text-[#6b6b6b] font-medium">{item.type}</span>
//                         <span className="text-[#ddd]">·</span>
//                         <span className="text-[11px] text-[#6b6b6b]">{item.date}</span>
//                       </div>
//                       <p className="text-[14px] text-[#1a1a1a] font-light leading-snug group-hover:opacity-60 transition-opacity">{item.title}</p>
//                     </div>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//
//           {/* Sidebar: Upcoming Events */}
//           <div>
//             <h2 className="text-[22px] font-light text-[#1a1a1a] mb-8 border-b border-[#e0e0e0] pb-4">Upcoming Events</h2>
//             <ul className="space-y-6">
//               {upcomingEvents.map((event, i) => (
//                 <li key={i} className="border-b border-[#f0f0f0] pb-6 last:border-b-0 last:pb-0">
//                   <Link href="#" className="group block">
//                     <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium block mb-1">{event.type}</span>
//                     <p className="text-[14px] font-medium text-[#1a1a1a] leading-snug mb-2 group-hover:opacity-60 transition-opacity">{event.title}</p>
//                     <p className="text-[12px] text-[#6b6b6b]">{event.date}</p>
//                     <p className="text-[12px] text-[#6b6b6b]">{event.location}</p>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//
//             {/* Newsletter */}
//             <div className="mt-12 bg-[#f5f5f5] p-6">
//               <h3 className="text-[16px] font-medium text-[#1a1a1a] mb-2">Stay Connected</h3>
//               <p className="text-[13px] text-[#6b6b6b] leading-relaxed mb-4 font-light">Get the latest HOK news and design insights delivered to your inbox.</p>
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="w-full border border-[#e0e0e0] px-4 py-3 text-[13px] outline-none focus:border-[#1a1a1a] transition-colors mb-3 bg-white"
//               />
//               <button className="w-full bg-[#1a1a1a] text-white text-[12px] tracking-[0.1em] uppercase py-3 hover:bg-[#333] transition-colors">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       <Footer />
//       <CookieBanner />
//     </>
//   )
// }
