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
import { InspectionOptions } from '../components/infographics/Infographics'
import { TRACK_RECORD } from '@/lib/content/track-record'
import Image from 'next/image'

export const metadata = pageMetadata({
  title: 'Our Team: Architects & Engineers in Lagos | Artemis Atelier',
  description: 'Meet the directors, COREN-registered engineer, project managers and specialists behind every Artemis Atelier project in Lagos, with roles and credentials.',
  path: '/people',
})

const leaders = [
  {
    name: 'Chief Chinedu Edward Makama, MBA',
    title: 'Managing Director',
    bio: 'An architect by training, Chief Makama founded Artemis Atelier in 2010 with one conviction: building in Nigeria should never require blind trust. He holds an MBA from Nexford University and brings many years of consulting experience across the architecture, engineering and construction industry. That mix of design skill and business discipline shaped the systems clients rely on today, including open-book costing, inspected stage payments and live site access.',
  },
  {
    name: 'Ewomazino Makama',
    title: 'Director',
    bio: 'Ewomazino holds a BSc in Psychology and has built her career around understanding what clients need, often before they say it. She leads client relationships and brings experience in finance and design oversight. Having worked with diaspora clients for years, particularly in Europe, she knows the worries of building from abroad and makes sure every client feels informed, heard and in control.',
  },
  {
    name: 'Tobi Awojobi',
    title: 'Executive Director, Operations & Business Development',
    bio: 'A quantity surveyor with a BSc and an MSc in Quantity Surveying from the University of Lagos, Tobi makes sure every naira in a project is accounted for. He has spent many years in senior roles across major Nigerian industries, including BCL and Arbico, and brings that large-project discipline to every Artemis site. He oversees operations, keeps budgets honest and leads the firm’s growth among clients at home and abroad.',
  },
  {
    name: 'Zeb Ejiro, OON',
    title: 'Director',
    bio: 'A well-known Nigerian and recipient of the Officer of the Order of the Niger national honour, Zeb Ejiro brings years of experience managing large projects with state governments. As a member of the board, he advises on strategy, governance and partnerships, helping the firm grow with integrity.',
  },
  {
    name: 'Engr. Utibe Collins Nneke, MNSE',
    title: 'Consultant Civil Engineer',
    bio: 'Utibe is a COREN-registered civil engineer (Reg. No. R.74112) with over 10 years of experience on high-end structural projects in Lagos. He designs and checks foundations, frames and slabs, and signs off the structural certificates in each client’s handover pack, so every Artemis building is safe, sound and properly documented.',
  },
  {
    name: 'Ajayi Olanrewaju',
    title: 'IT/ELV',
    bio: 'Ajayi brings many years of experience in IT and extra-low-voltage (ELV) systems, gained working with companies in Nigeria and Turkey. He plans and installs the technology modern buildings depend on, such as structured cabling and networks, CCTV, access control, intercoms and fire alarm systems. At Artemis he builds these systems into each design from the start, so they are installed cleanly rather than added later, and he sets up the live site cameras clients use to watch their build from abroad.',
  },
  {
    name: 'Emmanuel Okhuarobo',
    title: 'IT Team Lead',
    bio: 'Emmanuel studied Chemical Engineering at the University of Benin (UNIBEN) and built his software skills through professional online certifications. He designed and developed the Artemis Atelier platform: this website, the private client portal where clients follow their stages, payments, documents and site camera, and the tools our team uses to run every project. He leads the IT team and makes sure clients can follow their build easily and securely from anywhere in the world.',
  },
  {
    name: 'Olasunkanmi Oladiran, Esq.',
    title: 'Head of Legal',
    bio: 'Called to the Nigerian Bar in 2015, Olasunkanmi has spent over a decade practising law. He drafts the contracts that protect clients’ money: clear scope, staged payments, variation rules and dispute procedures, all in writing. He also advises on land title checks, approvals and property documentation, all of which matter greatly for clients building from abroad.',
  },
]

// Bios from lib/trust.js replace empty ones (real bios only — empty ones show just the role)
const leadersWithBios = leaders.map(l => ({ ...l, bio: l.bio || TRUST.bios?.[l.name] || '' }))

// Headline numbers. Years in practice comes from the founding year; the
// others only show once lib/trust.js links to a list that backs them up.
const stats = [
  { value: `${new Date().getFullYear() - Number(SITE.founded)}+`, label: 'Years in practice' },
  // Projects: counted from the track record list, so it can't overstate
  TRACK_RECORD.length
    ? { value: String(TRACK_RECORD.length), label: 'Projects on our track record', href: '/track-record' }
    : TRUST.stats.projectsDelivered.evidenceUrl && { value: TRUST.stats.projectsDelivered.value, label: 'Projects delivered', href: TRUST.stats.projectsDelivered.evidenceUrl },
  { value: String(leaders.length), label: 'People on the leadership team' },
  TRUST.stats.countriesServed.evidenceUrl && { value: TRUST.stats.countriesServed.value, label: 'Countries served', href: TRUST.stats.countriesServed.evidenceUrl },
].filter(Boolean)

// Person schema for each team member (credentials from lib/trust.js where given)
const peopleSchema = leaders.map(l => {
  const reg = (TRUST.registrations || []).find(r => r.person && (l.name.includes(r.person) || r.person.includes(l.name.split(',')[0])))
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: l.name.split(',')[0].replace(/^(Chief|Engr\.)\s+/, ''),
    ...(l.name.includes(',') ? { honorificSuffix: l.name.split(',').slice(1).join(',').trim() } : {}),
    jobTitle: l.title,
    ...(l.bio ? { description: l.bio } : {}),
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
        title="Architects and engineers in Lagos"
        description="Meet the people behind every Artemis Atelier project: an architect-led leadership team, a COREN-registered civil engineer, a quantity surveyor, our in-house legal team and the inspectors who check each stage before you pay for the next."
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
                  {s.href ? <a href={s.href} className="underline decoration-[#08b796] underline-offset-[3px]">{s.label}</a> : s.label}
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

        {/* Inspection options: our team, the independent panel, or your own inspector (lib/trust.js) */}
        <div id="inspection-team" className="mt-20 scroll-mt-24">
          <InspectionOptions title="Who checks each stage before you pay" eyebrow="Inspection team" />
        </div>
        <div className="mt-16 max-w-3xl"><TrustEvidence title="Registrations you can check" showTeam={false} /></div>
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
                Our Studio
              </p>
              <h2
                className="text-[28px] md:text-[38px] text-aal-black mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Culture
              </h2>
              <p className="text-[15px] text-aal-gray leading-relaxed mb-8">
                Our studio in Anthony Village, Lagos is where design, costing, legal and site teams sit together, so the people who draw your building, price it and inspect it talk to each other every day. Clients are welcome to visit by appointment.
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
