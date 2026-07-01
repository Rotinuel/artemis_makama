import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'
import Link from 'next/link'
import { allProjects } from '../../data/projects'

export const metadata = {
  title: 'Project Stories - AAL',
  description: 'Explore AAL project stories from around' +
    ' the world.',
}

const featured = allProjects[0]
const rest = allProjects.slice(1)

export default function StoriesPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Portfolio"
        title="Project Stories"
        description="A selection of our most compelling work from across the globe."
        image="/100.jpeg"
      />

      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        {/* Featured */}
        <Link href="#" className="block group mb-16">
          <div className="relative overflow-hidden" style={{ aspectRatio: '21/9' }}>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }}>
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <span className="text-[10px] tracking-[0.12em] uppercase text-white/70 font-medium">{featured.category}</span>
                <h2 className="text-white text-[24px] md:text-[40px]  mt-2 max-w-2xl leading-snug">{featured.title}</h2>
                <p className="text-white/60 text-[13px] mt-2">{featured.location}</p>
                <span className="inline-block mt-5 text-white text-[11px] tracking-[0.12em] uppercase border-b border-white/50 pb-0.5">
                  Read Story
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {rest.map((p, i) => (
            <Link key={i} href="#" className="block group">
              <div className="overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#6b6b6b] font-medium">{p.category}</span>
              <h3 className="text-[16px]  text-[#1a1a1a] mt-1 leading-snug group-hover:opacity-60 transition-opacity">{p.title}</h3>
              <p className="text-[13px] text-[#6b6b6b] mt-1">{p.location}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
