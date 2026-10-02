import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import LeadershipSection from '../components/LeaderShipSection'
import Reveal from '../components/Reveal'
import { pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { TRUST } from '@/lib/trust'
import { SITE } from '@/lib/site'
import JsonLd from '../components/JsonLd'
import TrustEvidence from '../components/content/TrustEvidence'
import Image from 'next/image'

export const metadata = pageMetadata({
  title: 'Our Team: Architects & Engineers in Lagos | Artemis Atelier',
  description: 'Meet the directors, COREN-registered engineer, project managers and specialists behind every Artemis Atelier project in Lagos, with roles and credentials.',
  path: '/people',
})

const leaders = [
  { name: 'Chief Chinedu Edward Makama MBA', title: 'Managing Director', bio: '' },
  { name: 'Ewomazino Makama', title: 'Director', bio: '' },
  {
    name: 'Tobi Awojobi',
    title: 'ED Operations and Business Development',
    bio: 'Tobi Awojobi is a business development and operations leader with a focus on driving growth, strategic partnerships, and market expansion. He combines strong commercial insight with operational leadership to identify opportunities, structure deals, and deliver sustainable revenue streams. His experience spans project development, stakeholder engagement, and business scaling within the built environment sector. At ARTEMIS ATELIER LTD, he oversees operations and business development, ensuring efficient execution while positioning the company for continued growth and competitive advantage.',
  },
  { name: 'Zeb Ejiro OON', title: 'Director', bio: '' },
  { name: 'Collins Nneji', title: 'Consultant Civil Engineer MNSE COREN', bio: '' },
  { name: 'Ajayi Olanrewaju', title: 'IT/ELV', bio: '' },
  { name: 'Emmanuel Okhuarobo', title: 'IT Team Lead', bio: '' },
  { name: 'Olasunkammi Oladiran ESQ', title: 'Head of legal', bio: '' },
]

// Bios from lib/trust.js replace empty ones (real bios only — empty ones show just the role)
const leadersWithBios = leaders.map(l => ({ ...l, bio: l.bio || TRUST.bios?.[l.name] || '' }))

// Headline numbers. Years in practice comes from the founding year; the
// others only show once lib/trust.js links to a list that backs them up.
const stats = [
  { value: `${new Date().getFullYear() - Number(SITE.founded)}+`, label: 'Years in practice' },
  TRUST.stats.projectsDelivered.evidenceUrl && { value: TRUST.stats.projectsDelivered.value, label: 'Projects delivered', href: TRUST.stats.projectsDelivered.evidenceUrl },
  { value: String(leaders.length), label: 'People on the leadership team' },
  TRUST.stats.countriesServed.evidenceUrl && { value: TRUST.stats.countriesServed.value, label: 'Countries served', href: TRUST.stats.countriesServed.evidenceUrl },
].filter(Boolean)

// Person schema for each team member (credentials from lib/trust.js where given)
const peopleSchema = leaders.map(l => {
  const reg = (TRUST.registrations || []).find(r => r.person && l.name.includes(r.person))
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: l.name,
    jobTitle: l.title,
    worksFor: { '@id': `${SITE.url}/#organization` },
    ...(reg ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Professional registration', name: `${reg.body} ${reg.number}` } } : {}),
  }
})

export default function PeoplePage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: 'People', path: '/people' }]), ...peopleSchema]} />
      <Navigation />
      <PageHero
        label="Our Team"
        title="People"
        description="Our team is made up of talented, experienced, and passionate architects, designers, planners, engineers, and project specialists who are dedicated to delivering exceptional design solutions. Combining creativity with technical expertise, we approach every project with innovation, precision, and a deep understanding of our clients' unique goals. We believe that every successful project begins with listening, thoughtful planning, and a commitment to transforming ideas into functional, inspiring, and enduring spaces."
        image="/ja.jpeg"
      />

      {/* Intro */}
      <section className="px-6 md:px-10 py-20 md:py-28 max-w-400 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <Reveal>
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#08b796] mb-3 font-medium">
                Who We Are
              </p>
              <h2
                className="text-[28px] md:text-[42px] text-aal-black leading-[1.1] mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Future-forward thinkers and designers
              </h2>
              <p className="text-[15px] text-aal-gray leading-relaxed mb-6">
                Artemis Atelier Ltd is a collective of future-forward thinkers and designers who are driven to face the critical challenges of our time. We are dedicated to improving people&apos;s lives, serving our clients and healing the planet.
              </p>
              <p className="text-[15px] text-aal-gray leading-relaxed">
                Together, we cultivate a culture of design excellence at the confluence of art and science, blending the power of creative expression with a clear sense of purpose.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div
              style={{ aspectRatio: '4/3' }}
              className="overflow-hidden group relative"
            >
              <Image src="/3.jpg" alt="AAL team collaborating" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 ring-1 ring-inset ring-[#08b796]/20 pointer-events-none" />
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 border-y border-aal-black/10 py-10 mb-24">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-4 text-center md:text-left ${
                  i > 0 ? 'md:border-l md:border-aal-black/10' : ''
                }`}
              >
                <p
                  className="text-[32px] md:text-[40px] text-[#08b796] leading-none mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {s.value}
                </p>
                <p className="text-[13px] text-aal-gray uppercase tracking-[0.08em]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Featured leaders */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#08b796] mb-3 font-medium">
              Leadership
            </p>
            <h2
              className="text-[28px] md:text-[38px] text-aal-black leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              The people steering the practice
            </h2>
          </div>
        </Reveal>
        {/* Not wrapped in <Reveal>: this section is very tall (it pins while you
            scroll through each person) and must be visible immediately */}
        <LeadershipSection leaders={leadersWithBios} />
        <div className="mt-16 max-w-3xl"><TrustEvidence title="Registrations you can check" /></div>
      </section>

      {/* Culture callout */}
      <section className="bg-aal-light-gray py-24 px-6 md:px-10 overflow-hidden">
        <div className="max-w-400 mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div
              style={{ aspectRatio: '4/3' }}
              className="overflow-hidden group relative"
            >
              <Image src="/104.jpeg" alt="Culture" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#08b796] mb-3 font-medium">
                Our Studios
              </p>
              <h2
                className="text-[28px] md:text-[38px] text-aal-black mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Culture
              </h2>
              <p className="text-[15px] text-aal-gray leading-relaxed mb-8">
                We think the warm, friendly culture in our studios—each with its own local vibe—is pretty special. We&apos;re a highly collaborative group of people who enjoy working together and are generous about sharing our knowledge.
              </p>
              <blockquote className="border-l-2 border-[#08b796] pl-6">
                <p
                  className="text-[19px] md:text-[22px] text-aal-black leading-snug"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}
                >
                  &ldquo;Great design starts with listening—to the client, the site, and each other.&rdquo;
                </p>
              </blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Join us CTA */}
      <section className="bg-aal-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#08b796] mb-4 font-medium">
              Careers
            </p>
            <h2
              className="text-[30px] md:text-[42px] mb-6 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Think you&apos;d fit in?
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mx-auto mb-10">
              We're always looking for architects, engineers, and planners who want to do the best work of their career alongside people who care about the outcome as much as they do.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3.5 rounded-full bg-[#08b796] text-aal-black font-medium hover:bg-white transition-colors"
            >
              Get in Touch
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
