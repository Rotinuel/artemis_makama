import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'
import LeadershipSection
  from "../components/LeaderShipSection";

export const metadata = {
  title: 'People - AAL',
  description: "Artemis Atelier Ltd's team brings together a global" +
    " network of experts across architecture, urban design, engineering, and planning.",
}

const leaders = [
  { name: 'Chief Chinedu Edward Makama MBA', title: 'Managing Director', bio: ''},
  { name: 'Ewomazino Makama', title: 'Director', bio: '' },
  {
    name: 'Awojobi Tobi PMP NIQS RIQS', title: 'Head of ' +
      ' Operations', bio: 'Tobi Awojobi is a business development and operations leader with a focus on driving growth, strategic partnerships, and market expansion. He combines strong commercial insight with operational leadership to identify opportunities, structure deals, and deliver sustainable revenue streams. His experience spans project development, stakeholder engagement, and business scaling within the built environment sector. At ARTEMIS ATELIER LTD, he oversees operations and business development, ensuring efficient execution while positioning the company for continued growth and competitive advantage.'
  },
  { name: 'Zeb Ejiro OON', title: 'Director', bio: '' },
  {
    name: 'Collins Nneji', title: 'Consultant' +
      ' Civil Engineer MNSE COREN', bio: ''
  },
  { name: 'Ajayi Olanrewaju', title: 'IT/ELV', bio: '' },
  {
    name: 'Emmanuel Okhuarobo', title: 'IT Team' +
      ' Lead', bio: ''
  },
  {
    name: 'Olasunkammi Oladiran ESQ', title: 'Head' +
      ' of legal', bio: ''
  },

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
        image="/102.jpeg"
      />


      {/* Intro */}
      <section className="px-6 md:px-10 py-16 max-w-400 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-light text-[#1a1a1a] leading-tight mb-6">
              Future-forward thinkers and designers
            </h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-6 font-light">
              Artemis Atelier Ltd is a collective of future-forward thinkers and designers who are driven to face the critical challenges of our time. We are dedicated to improving people&apos;s lives, serving our clients and healing the planet.
            </p>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed font-light">
              Together, we cultivate a culture of design excellence at the confluence of art and science, blending the power of creative expression with a clear sense of purpose.
            </p>
          </div>
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img
              src="/103.jpeg"
              alt="AAL team collaborating"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Featured leaders */}
        <LeadershipSection leaders={leaders} />
      </section>

      {/* Culture callout */}
      <section className="bg-[#f5f5f5] py-20 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img src="/104.jpeg" alt="Culture" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">Our Studios</p>
            <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a] mb-5">Culture</h2>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed mb-6 font-light">
              We think the warm, friendly culture in our studios—each with its own local vibe—is pretty special. We&apos;re a highly collaborative group of people who enjoy working together and are generous about sharing our knowledge.
            </p>
            {/* <Link href="/people/culture" className="text-[12px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity">
              Explore Culture
            </Link> */}
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
