import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'
import { allProjects, markets, disciplines } from '../data/projects'

export const metadata = {
  title: 'Projects - AAL',
  description: 'AAL designs buildings and spaces that' +
      ' respond to the needs of people and the environment.',
}

function ProjectCard({ project }) {
  return (
    <Link href={project.href} className="block group">
      <div className="overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <span className="text-[10px] tracking-[0.1em] uppercase text-[#6b6b6b] font-medium">{project.category}</span>
      <h3 className="text-[15px] font-light text-[#1a1a1a] mt-1 leading-snug group-hover:opacity-60 transition-opacity">{project.title}</h3>
      <p className="text-[13px] text-[#6b6b6b] mt-1">{project.location}</p>
    </Link>
  )
}

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Our Work"
        title="Projects"
        description="AAL designs buildings and spaces that respond to the needs of people and the environment."
        image="/51.jpg"
      />

      {/* Filter bar */}
      <div className="border-b border-[#e0e0e0] px-6 md:px-10 py-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium mb-3">Markets</p>
            <div className="flex flex-wrap gap-2">
              {markets.map(m => (
                <button key={m} className="text-[12px] px-3 py-1.5 border border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium mb-3">Disciplines</p>
            <div className="flex flex-wrap gap-2">
              {disciplines.map(d => (
                <button key={d} className="text-[12px] px-3 py-1.5 border border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
          {allProjects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
