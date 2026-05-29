import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'

export const metadata = {
  title: 'Leadership - HOK',
  description: "HOK's global leadership team driving design excellence across 27 studios.",
}

const leadership = [
  { name: 'Bill Hellmuth', credentials: 'FAIA', title: 'President & CEO', studio: 'Washington, D.C.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { name: 'Kimberly Dowdell', credentials: 'AIA', title: 'Director of Strategic Relationships', studio: 'Detroit', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80' },
  { name: 'Kay Sargent', credentials: 'FIIDA, LEED AP', title: 'Director of WorkPlace', studio: 'Washington, D.C.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name: 'Tom Polucci', credentials: 'FIIDA, AIA, LEED GA', title: 'Firm-wide Director of Interiors', studio: 'New York', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Jonathan Penndorf', credentials: 'AIA, LEED AP', title: 'Director of Sustainability', studio: 'Washington, D.C.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { name: 'Lou Oswald', credentials: 'AIA, NCARB, LEED BD+C', title: 'Technical Principal', studio: 'Chicago', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
  { name: 'Kai Olsen', credentials: 'IIDA', title: 'Director of Design, Interiors', studio: 'Philadelphia', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Emily Payne', credentials: '', title: 'Director of Experience Design', studio: 'Kansas City', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { name: 'Laura Poltronieri', credentials: 'AIA', title: 'Regional Leader of Healthcare, Northeast', studio: 'Philadelphia', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { name: 'Curt Parde', credentials: 'AIA, LEED AP BD+C', title: 'Director of Architecture', studio: 'Dallas', image: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&q=80' },
  { name: 'Chris Patterson', credentials: 'AIA, LEED AP', title: 'Practice Leader of Science + Technology', studio: 'San Francisco', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
  { name: 'David Pugh', credentials: 'AIA, NCARB, LEED AP BD+C', title: 'Managing Principal', studio: 'Los Angeles', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80' },
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
