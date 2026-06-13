import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Ideas - Artemis Atelier',
  description: 'Discover our insights and research on how design, planning and engineering impact the built environment.',
}

const designPerspectives = [
  {
    title: 'Visions for the Future of U.S. High-Speed Rail',
    category: 'Design Perspectives',
    date: 'May 2026',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  },
  {
    title: 'Designing for Climate Resilience in Coastal Cities',
    category: 'Design Perspectives',
    date: 'April 2026',
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80',
  },
  {
    title: 'The Future of Workplace: Beyond Hybrid',
    category: 'Design Perspectives',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
]

const publications = [
  {
    title: 'AAL 2026 Design Annual',
    category: 'Annual',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
  },
  {
    title: 'Pediatric Design for Improved Patient Experiences',
    category: 'Publication',
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&q=80',
  },
  {
    title: 'AAL Forward 2025: The Evolution of' +
      ' Neuroinclusive Workplaces',
    category: 'Publication',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600&q=80',
  },
  {
    title: 'Neuroinclusive Design Guide by AAL\'s Kay' +
      ' Sargent',
    category: 'Publication',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600&q=80',
  },
]

const voices = [
  {
    title: 'How do I conceive a new idea? | Aman Krishan',
    category: 'AAL Voices',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80',
  },
  {
    title: 'Why I Design for Community | Kimberly Dowdell',
    category: 'AAL Voices',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80',
  },
]

function IdeaCard({ item, large = false }) {
  return (
    <Link href="#" className="block group">
      <div className={`overflow-hidden mb-4 ${large ? '' : ''}`} style={{ aspectRatio: large ? '16/9' : '3/2' }}>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium">{item.category}</span>
      {item.date && <span className="text-[10px] text-[#6b6b6b] ml-3">{item.date}</span>}
      <h3 className={`font-light text-[#1a1a1a] mt-1.5 leading-snug group-hover:opacity-60 transition-opacity ${large ? 'text-[20px] md:text-[24px]' : 'text-[14px] md:text-[15px]'}`}>
        {item.title}
      </h3>
    </Link>
  )
}

export default function IdeasPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Thinking"
        title="Ideas"
        description="Discover our insights and research on how design, planning and engineering impact the built environment."
        image="/104.jpeg"
      />

      {/* Design Perspectives */}
      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Thinking</p>
            <h2 className="text-[26px] md:text-[32px] font-light text-[#1a1a1a]">Design Perspectives</h2>
          </div>
          <Link href="/ideas/design-perspectives" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {designPerspectives.map((item, i) => (
            <IdeaCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Research</p>
            <h2 className="text-[26px] md:text-[32px] font-light text-[#1a1a1a]">Publications</h2>
          </div>
          <Link href="/ideas/publications" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {publications.map((item, i) => (
            <IdeaCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* HOK Voices */}
      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Perspectives</p>
            <h2 className="text-[26px] md:text-[32px] font-light text-[#1a1a1a]">HOK Voices</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {voices.map((item, i) => (
            <IdeaCard key={i} item={item} large />
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
