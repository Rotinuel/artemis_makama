import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Publications - HOK',
  description: 'HOK research publications, reports and guides on design and the built environment.',
}

const publications = [
  { title: 'HOK 2026 Design Annual', type: 'Annual', year: '2026', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', description: 'A showcase of HOK\'s most significant projects and design thinking from the past year.' },
  { title: 'Pediatric Design for Improved Patient Experiences', type: 'Report', year: '2025', image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&q=80', description: 'Evidence-based strategies for designing children\'s healthcare environments.' },
  { title: 'HOK Forward 2025: The Evolution of Neuroinclusive Workplaces', type: 'Guide', year: '2025', image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600&q=80', description: 'A comprehensive guide to creating workplaces that support neurodivergent employees.' },
  { title: 'Neuroinclusive Design Guide', type: 'Guide', year: '2025', image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600&q=80', description: 'Practical frameworks for incorporating neuroinclusive principles into any design project.' },
  { title: 'HOK 2025 Sustainability Report', type: 'Report', year: '2025', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80', description: 'HOK\'s progress toward net-zero design and carbon neutral operations.' },
  { title: 'Sports Venue Design in the 21st Century', type: 'Report', year: '2024', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', description: 'How modern stadiums and arenas are becoming community anchors and year-round destinations.' },
  { title: 'Healthcare Design Futures', type: 'Report', year: '2024', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80', description: 'Anticipating how healthcare delivery changes will reshape facility design.' },
  { title: 'HOK 2024 Design Annual', type: 'Annual', year: '2024', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', description: 'A curated collection of HOK\'s most transformative work from 2024.' },
]

export default function PublicationsPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Ideas"
        title="Publications"
        description="Research, guides and annual reports from HOK's design community."
        image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1900&q=80"
      />

      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {publications.map((pub, i) => (
            <Link key={i} href="#" className="block group">
              <div className="overflow-hidden mb-4" style={{ aspectRatio: '3/4', background: '#f5f5f5' }}>
                <img src={pub.image} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium">{pub.type}</span>
                <span className="text-[10px] text-[#6b6b6b]">·</span>
                <span className="text-[10px] text-[#6b6b6b]">{pub.year}</span>
              </div>
              <h3 className="text-[14px] font-light text-[#1a1a1a] leading-snug mb-2 group-hover:opacity-60 transition-opacity">{pub.title}</h3>
              <p className="text-[12px] text-[#6b6b6b] leading-relaxed">{pub.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
