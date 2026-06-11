import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'
import LeadershipSection
  from "../components/LeaderShipSection";

export const metadata = {
  title: 'People - AAL',
  description: "AAL's team brings together a global" +
      " network of experts across architecture, urban design, engineering, and planning.",
}

const leaders = [
  { name: 'Chief Chinedu Edward Makama MBA', title: 'Managing Director', studio: 'Lagos, Nigeria', image: '' },
  { name: 'Ewomazino Makama', title: 'Director', studio: '', image: '' },
  { name: 'Awojobi Tobi PMP NIQS RIQS', title: 'Head of ' +
        ' Operations' ,studio: '', image: '' },
  { name: 'Zeb Ejiro OON', title: 'Director', studio: '', image: '' },
  { name: 'Collins Nneji', title: 'Consultant' +
        ' Civil Engineer MNSE COREN', studio: '', image: '' },
  { name: 'Ajayi Olanrewaju', title: 'IT/ELV', studio: '', image: ''},
  { name: 'Emmanuel Okhuarobo', title: 'IT Team' +
        ' Lead', studio: '', image: ''},
  { name: 'Olasunkammi Oladiran ESQ', title: 'Head' +
        ' of legal', studio: '', image: '' },

]

export default function PeoplePage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Our Team"
        title="People"
        description="Our team is made up of talented and experienced professionals who
            are dedicated to delivering high-quality designs that meet the needs
            of our clients. We work collaboratively to ensure that every project
            is a success."
        image="/"
      />

      {/* Sub-nav */}
      <div className="border-b border-aal-border px-6 md:px-10">
        <div className="max-w-400 mx-auto flex gap-8">
          {[
            { label: 'Overview', href: '/people' },
            { label: 'Culture', href: '/people/culture' },
            { label: 'Leadership', href: '/people/leadership' },
            { label: 'Careers', href: '/people/careers' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] py-4 border-b-2 border-transparent hover:border-[#1a1a1a] transition-colors text-[#6b6b6b] hover:text-[#1a1a1a]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Intro */}
      <section className="px-6 md:px-10 py-16 max-w-400 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-light text-[#1a1a1a] leading-tight mb-6">
              Future-forward thinkers and designers
            </h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-6 font-light">
              AAL is a collective of future-forward thinkers and designers who are driven to face the critical challenges of our time. We are dedicated to improving people&apos;s lives, serving our clients and healing the planet.
            </p>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed font-light">
              Together, we cultivate a culture of design excellence at the confluence of art and science, blending the power of creative expression with a clear sense of purpose.
            </p>
          </div>
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
              alt="HOK team collaborating"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Featured leaders */}
        <LeadershipSection leaders={leaders}/>
        {/*<div className="border-t border-[#e0e0e0] pt-16">*/}
        {/*  <div className="flex items-end justify-between mb-10">*/}
        {/*    <h2 className="text-[26px] md:text-[32px] font-light text-[#1a1a1a]">Leadership</h2>*/}
        {/*    <Link href="/people/leadership" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block">*/}
        {/*      See All*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">*/}
        {/*    {leaders.map((person, i) => (*/}
        {/*      <Link key={i} href="/people/leadership" className="block group text-center">*/}
        {/*        <div className="overflow-hidden rounded-full mb-4 mx-auto" style={{ width: 120, height: 120 }}>*/}
        {/*          <img src={person.image} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />*/}
        {/*        </div>*/}
        {/*        <p className="text-[13px] font-medium text-[#1a1a1a] group-hover:opacity-60 transition-opacity">{person.name}</p>*/}
        {/*        <p className="text-[11px] text-[#6b6b6b] mt-0.5 leading-tight">{person.title}</p>*/}
        {/*        <p className="text-[11px] text-[#6b6b6b] mt-0.5">{person.studio}</p>*/}
        {/*      </Link>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </section>

      {/* Culture callout */}
      <section className="bg-[#f5f5f5] py-20 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80" alt="Culture" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">Our Studios</p>
            <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a] mb-5">Culture</h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-6 font-light">
              We think the warm, friendly culture in our studios—each with its own local vibe—is pretty special. We&apos;re a highly collaborative group of people who enjoy working together and are generous about sharing our knowledge.
            </p>
            <Link href="/people/culture" className="text-[12px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity">
              Explore Culture
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
