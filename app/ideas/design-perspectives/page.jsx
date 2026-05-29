import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Design Perspectives - HOK',
  description: 'HOK\'s design perspectives on architecture, planning, and the built environment.',
}

const articles = [
  { title: 'Visions for the Future of U.S. High-Speed Rail', date: 'May 2026', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80', excerpt: 'HOK explores how transformative rail infrastructure can reshape American mobility and urban connectivity.' },
  { title: 'Designing for Climate Resilience in Coastal Cities', date: 'April 2026', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80', excerpt: 'As sea levels rise, cities must rethink their relationship with water through adaptive design strategies.' },
  { title: 'The Future of Workplace: Beyond Hybrid', date: 'March 2026', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', excerpt: 'Workplaces are evolving from fixed destinations into dynamic ecosystems that support diverse work modes.' },
  { title: 'Neuroinclusive Design: Creating Spaces for All Minds', date: 'February 2026', image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&q=80', excerpt: 'Design that accommodates neurodiversity creates better environments for everyone.' },
  { title: 'Aviation Terminals of the Future', date: 'January 2026', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', excerpt: 'Next-generation airports are becoming civic icons that celebrate the joy of travel.' },
  { title: 'Regenerative Design: Beyond Net Zero', date: 'December 2025', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80', excerpt: 'The next frontier of sustainable architecture goes beyond net zero to actively restore ecosystems.' },
]

export default function DesignPerspectivesPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Ideas"
        title="Design Perspectives"
        description="HOK's designers share their thinking on the forces shaping the built environment."
        image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1900&q=80"
      />

      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {articles.map((a, i) => (
            <Link key={i} href="#" className="block group">
              <div className="overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
                <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium mb-2">{a.date}</p>
              <h3 className="text-[18px] font-light text-[#1a1a1a] leading-snug mb-3 group-hover:opacity-60 transition-opacity">{a.title}</h3>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
