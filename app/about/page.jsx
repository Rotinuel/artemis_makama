import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'About - ARTEMIS ATELIER LTD',
  description: 'Artemis Atelier Ltd is a global design, architecture,' +
      ' engineering and planning firm.',
}

const stats = [
  { number: '1,800+', label: 'Design Professionals' },
  { number: '27', label: 'Studios Worldwide' },
  { number: '3', label: 'Continents' },
  { number: '70+', label: 'Years of Experience' },
]

const recognitions = [
  { year: '2026', award: "Fast Company's Most Innovative Companies", category: 'Innovation' },
  { year: '2025', award: 'AIA Architecture Firm Award', category: 'Architecture' },
  { year: '2025', award: "IIDA's Firm of the Year", category: 'Interior Design' },
  { year: '2025', award: "Architect Magazine's Top 50 Firms", category: 'Recognition' },
  { year: '2025', award: 'ENR Top 500 Design Firms', category: 'Engineering' },
  { year: '2024', award: 'Interior Design Hall of Fame', category: 'Interior Design' },
]

const milestones = [
  { year: '1955', event: 'HOK is founded in St. Louis by Gyo Obata, George Hellmuth, and George Kassabaum.' },
  { year: '1963', event: 'HOK designs Priory Chapel, which wins the AIA\'s National Honor Award.' },
  { year: '1975', event: 'HOK expands to Washington, D.C. and begins its federal government practice.' },
  { year: '1985', event: 'HOK opens its first international office in London.' },
  { year: '1994', event: 'HOK designs Oriole Park at Camden Yards, the first of many landmark sports venues.' },
  { year: '2000', event: 'HOK expands its global presence with offices in Asia and the Middle East.' },
  { year: '2010', event: 'HOK becomes carbon neutral in its operations—one of the first large firms to do so.' },
  { year: '2013', event: 'HOK\'s Sports + Entertainment practice spins off as Populous.' },
  { year: '2022', event: 'HOK achieves carbon neutrality across all global operations.' },
  { year: '2026', event: 'HOK and ROSSETTI join forces to expand global Sports, Recreation and Entertainment practice.' },
]

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Who We Are"
        title="About AAL"
        description="A global design, architecture, engineering and planning firm."
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1900&q=80"
      />

      {/* Mission */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-4 font-medium">Our Mission</p>
            <h2 className="text-[28px] md:text-[42px] font-light text-[#1a1a1a] leading-tight mb-8">
              To deliver design solutions that solve our clients&apos; most complex challenges
            </h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-5 font-light">
              Artemis Atelier Limited is one of Nigeria's leading architectural
            and construction companies, headquartered in Lagos. Established by
            Mr. C. E. Makama in 2010, the company was founded with a clear
            vision to render services in the field of Architecture and
            construction and also as general contractors. Delivering exceptional
            service across multiple disciplines. Our core areas of
            specialization include architectural design, building construction,
            facility management, real estate development, and architectural
            drafting services. With a deep understanding of both modern and
            traditional design principles, Artemis Atelier merges creativity
            with functionality to produce spaces that are not only aesthetically
            compelling but also structurally sound and environmentally
            sustainable.
            </p>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed font-light">
              Our process is rooted in collaboration, innovation, and
            a commitment to excellence, ensuring that every project—regardless
            of scale—is delivered with precision and care. Over the years, we
            have built a reputation for integrity, reliability, and
            forward-thinking solutions. Our diverse portfolio spans residential,
            commercial, and institutional developments, each reflecting our
            dedication to quality and our passion for reshaping the Nigerian
            architectural landscape. We have served many individuals and firms in our capacity as contractors, designers, suppliers and facility managers. The management team converge with years of experience working together on projects for banks, merchants and individuals.
            </p>
          </div>
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=900&q=80"
              alt="AAL office"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a1a1a] py-16 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center md:text-left border-r border-[#333] last:border-r-0 pr-8 last:pr-0">
              <p className="text-[40px] md:text-[56px] font-light text-white leading-none">{s.number}</p>
              <p className="text-[13px] text-[#888] mt-2 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">Our Story</p>
          <h2 className="text-[28px] md:text-[40px] font-light text-[#1a1a1a]">History</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-6 border-b border-[#f0f0f0] pb-8">
              <span className="text-[13px] font-medium text-[#6b6b6b] flex-shrink-0 w-12">{m.year}</span>
              <p className="text-[14px] text-[#1a1a1a] leading-relaxed font-light">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recognition */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">Accolades</p>
          <h2 className="text-[28px] md:text-[40px] font-light text-[#1a1a1a]">Recognition</h2>
        </div>
        <ul>
          {recognitions.map((r, i) => (
            <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 py-5 border-b border-[#e0e0e0] last:border-b-0">
              <span className="text-[12px] text-[#6b6b6b] flex-shrink-0 sm:w-14">{r.year}</span>
              <span className="flex-1 text-[15px] text-[#1a1a1a] font-light">{r.award}</span>
              <span className="text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] border border-[#e0e0e0] px-3 py-1 flex-shrink-0">{r.category}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sustainability commitment */}
      <section className="bg-[#f5f5f5] py-20 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80" alt="HOK sustainability" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-4 font-medium">Environment</p>
            <h2 className="text-[28px] md:text-[38px] font-light text-[#1a1a1a] mb-6">Sustainability</h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-5 font-light">
              HOK is committed to achieving net-zero carbon in the buildings we design by 2030. We have been carbon neutral in our own operations since 2022.
            </p>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-8 font-light">
              We pursue regenerative design strategies that not only minimize environmental impact but actively restore and improve the ecosystems in which our buildings exist.
            </p>
            <Link href="#" className="text-[12px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity">
              Corporate Responsibility
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
