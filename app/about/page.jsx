import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'
import { ShieldCheck, Lightbulb, Target, Users, Medal } from "lucide-react";

export const metadata = {
  title: 'About - ARTEMIS ATELIER LTD',
  description: 'Construction without limits — residential, commercial, civil, and beyond.',
}

const stats = [
  { number: '30+', label: 'Design Professionals' },
  { number: '2', label: 'Studios Worldwide' },
  { number: '1', label: 'Continents' },
  { number: '15+', label: 'Years of Experience' },
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
  { year: '2010', event: 'Artemis Atelier Ltd is founded in Ikeja, Lagos by Edward Makama.' },
  { year: '2012', event: 'Artemis Atelier Ltd designs its first major project.' },
  { year: '2016', event: 'Artemis Atelier Ltd expands and begins its federal government practice.' },
  { year: '2020', event: 'Artemis Atelier Ltd expands its global presence with offices in Asia and the Middle East.' },
  { year: '2026', event: 'Artemis expands global Sports, Recreation and Entertainment practice.' },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity & Ethics",
    text: "We conduct all our business activities with the highest standards of integrity, honesty, and transparency. Trust forms the foundation of our relationships with clients, partners, and employees, fostering long-term collaboration and mutual success.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Efficiency",
    text: "We leverage innovative technologies and best-practice methodologies to enhance productivity, optimize costs, and deliver exceptional value while maintaining the highest standards of quality and performance.",
  },
  {
    icon: Target,
    title: "Commitment",
    text: "We are dedicated to achieving our goals through professionalism, accountability, and a relentless pursuit of excellence in everything we do.",
  },
  {
    icon: Users,
    title: "Client Focus & Satisfaction",
    text: "Our clients' success is at the heart of our business. We strive to exceed expectations by understanding their unique requirements and delivering tailored solutions that create sustainable value and lasting partnerships.",
  },
  {
    icon: Medal,
    title: "Quality Excellence",
    text: "We are committed to delivering excellence across every aspect of our operations. By adhering to international standards and embracing continuous improvement, we ensure superior outcomes and consistent quality.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Who We Are"
        title="About Artemis Atelier Ltd"
        description="Construction without limits — residential, commercial, civil, and beyond."
        image="/100.jpeg"
      />

      {/* Mission */}
      <section className="px-6 md:px-10 py-20 max-w-400 mx-auto border-b border-[#e0e0e0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[28px] tracking-[0.14em] uppercase text-[#08b796] mb-4 font-medium">Our Vision</p>
            <p className="text-[15px] text-black leading-relaxed mb-5 font-light text-justify">
              To redefine the built environment through
              visionary architecture, creating timeless spaces
              that balance aesthetics, functionality, and
              sustainability while establishing lasting trust
              with clients, partners, and communities.
            </p>
          </div>

          <div>
            <p className="text-[28px] tracking-[0.14em] uppercase text-[#08b796] mb-4 font-medium">Our Mission</p>
            <p className="text-[15px] text-black leading-relaxed mb-5 font-light text-justify">
              To shape meaningful and enduring spaces
              through innovative design, technical excellence,
              and sustainable practices. We are dedicated to
              transforming our clients' visions into inspiring
              architectural solutions that balance aesthetics,
              functionality, and environmental responsibility.
            </p>
            <p className="text-[15px] text-black leading-relaxed mb-5 font-light text-justify">
              Through collaboration, integrity, and attention
              to detail, we cultivate lasting partnerships and
              deliver projects that enrich communities and
              stand the test of time.
            </p>
          </div>

          <div>
            <p className="text-[28px] tracking-[0.14em] uppercase text-[#08b796] mb-4 font-medium">Our Core Values</p>
            <div className="flex flex-col gap-5">
              {values.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 items-start">
                  <Icon className="w-5 h-5 text-[#08b796] mt-1 shrink-0" />
                  <div>
                    <p className="text-[15px] text-black font-medium mb-1">{title}</p>
                    <p className="text-[14px] text-[#6b6b6b] leading-relaxed font-light text-justify">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img
              src="/101.jpeg"
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
              <p className="text-[14px] text-[#1a1a1a] leading-relaxed font-light text-justify">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recognition */}
      {/* <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
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
      </section> */}

      {/* Sustainability commitment */}
      {/* <section className="bg-[#f5f5f5] py-20 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80" alt="HOK sustainability" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-4 font-medium">Environment</p>
            <h2 className="text-[28px] md:text-[38px] font-light text-[#1a1a1a] mb-6">Sustainability</h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-5 font-light text-justify">
              HOK is committed to achieving net-zero carbon in the buildings we design by 2030. We have been carbon neutral in our own operations since 2022.
            </p>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-8 font-light text-justify">
              We pursue regenerative design strategies that not only minimize environmental impact but actively restore and improve the ecosystems in which our buildings exist.
            </p>
            <Link href="#" className="text-[12px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity">
              Corporate Responsibility
            </Link>
          </div>
        </div>
      </section> */}

      <Footer />
      <CookieBanner />
    </>
  )
}

