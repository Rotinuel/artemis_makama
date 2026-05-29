import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Research + Insights - AAL',
  description: 'HOK research and insights on design innovation and the built environment.',
}

const research = [
  { title: 'Energy Use Intensity in Healthcare Facilities', category: 'Sustainability', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', excerpt: 'HOK\'s projects achieved a 68% reduction in energy use intensity versus baseline in 2024.' },
  { title: 'Post-Occupancy Evaluation: Corporate Workplaces', category: 'Workplace', image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80', excerpt: 'How do employees actually use the spaces we design? A multi-year study across 40 workplaces.' },
  { title: 'Structural Optimization for Embodied Carbon', category: 'Sustainability', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80', excerpt: 'Novel structural systems that dramatically reduce embodied carbon in tall buildings.' },
  { title: 'Fan Experience in the Modern Sports Venue', category: 'Sports + Entertainment', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', excerpt: 'What drives fan loyalty and engagement, and how design can amplify those moments.' },
  { title: 'Biophilic Design Outcomes in Healthcare', category: 'Healthcare', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', excerpt: 'Measuring the clinical outcomes associated with nature-integrated healthcare design.' },
  { title: 'Campus Planning for the Next Generation', category: 'Higher Education', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', excerpt: 'How universities are reimagining their physical environments in the post-pandemic era.' },
]

export default function ResearchPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Ideas"
        title="Research + Insights"
        description="Evidence-based insights that shape how we design the built environment."
      />

      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {['All', 'Sustainability', 'Workplace', 'Healthcare', 'Sports + Entertainment', 'Higher Education'].map(cat => (
            <button key={cat} className={`text-[12px] px-4 py-2 border transition-colors ${cat === 'All' ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {research.map((r, i) => (
            <Link key={i} href="#" className="block group">
              <div className="overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
                <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium">{r.category}</span>
              <h3 className="text-[18px] font-light text-[#1a1a1a] leading-snug mt-2 mb-3 group-hover:opacity-60 transition-opacity">{r.title}</h3>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed">{r.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
