import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'

export const metadata = {
  title: 'Leadership - Artemis Atelier Ltd',
  description: "Artemis Atelier Ltd global leadership team driving design excellence across studios.",
}

const leadership = [
  { name: '', credentials: 'FAIA', title: 'President & CEO', studio: '', image: '/' },
  { name: '', credentials: '', title: 'Director of Strategic Relationships', studio: '', image: '' },
  { name: '', credentials: 'FIIDA, LEED AP', title: 'Director of WorkPlace', studio: 'Washington, D.C.', image: '' },
  { name: '', credentials: 'FIIDA, AIA, LEED GA', title: 'Firm-wide Director of Interiors', studio: '', image: '' },
  { name: '', credentials: 'AIA, LEED AP', title: 'Director of Sustainability', studio: '', image: '' },
  { name: '', credentials: 'AIA, NCARB, LEED BD+C', title: 'Technical Principal', studio: '', image: '' },
  
]

export default function LeadershipPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="People"
        title="Leadership"
        description="Our leaders bring decades of experience across architecture, engineering, interiors, planning, and design."
      />

      <section className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
          {leadership.map((person, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="overflow-hidden mb-4" style={{ aspectRatio: '3/4' }}>
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-[13px] font-medium text-[#1a1a1a] leading-snug group-hover:opacity-60 transition-opacity">{person.name}</p>
              {person.credentials && <p className="text-[11px] text-[#6b6b6b] mt-0.5">{person.credentials}</p>}
              <p className="text-[12px] text-[#6b6b6b] mt-1 leading-snug">{person.title}</p>
              <p className="text-[11px] text-[#aaa] mt-0.5">{person.studio}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
