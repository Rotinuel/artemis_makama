import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Culture - AAL',
  description: "AAL's warm, collaborative studio culture across offices worldwide.",
}

const values = [
  { icon: '◈', title: 'Design Excellence', description: 'We cultivate a culture of design excellence at the confluence of art and science, blending creative expression with a clear sense of purpose.' },
  { icon: '◉', title: 'Collaboration', description: 'We\'re a highly collaborative group of people who enjoy working together and are generous about sharing our knowledge, research and innovations.' },
  { icon: '◎', title: 'Sustainability', description: 'HOK has been carbon neutral since 2022 and is dedicated to achieving net-zero emissions in the projects we design by 2030.' },
  { icon: '◐', title: 'Diversity & Inclusion', description: 'We believe that diverse teams produce better design solutions and are committed to building a workforce that reflects the communities we serve.' },
  { icon: '●', title: 'Innovation', description: 'We invest in research and technology to ensure our designers have access to the tools and knowledge they need to solve the most complex design challenges.' },
  { icon: '◆', title: 'Community', description: 'We believe design can improve people\'s lives and are committed to using our skills to benefit the communities where we live and work.' },
]

const galleries = [
  '/24.jpg',
  '/25.jpg',
  '/26.jpg',
  '/29.jpg',
  '/28.jpg',
  '/29.jpg',
]

export default function CulturePage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="People"
        title="Culture"
        description="Each studio has its own local vibe, but we share a commitment to design, collaboration, and making the world a better place."
        image="/24.jpg"
      />

      {/* Values */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">What We Stand For</p>
          <h2 className="text-[28px] md:text-[40px] font-light text-[#1a1a1a]">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {values.map((v, i) => (
            <div key={i}>
              <span className="text-[24px] text-[#1a1a1a] block mb-4">{v.icon}</span>
              <h3 className="text-[18px] font-medium text-[#1a1a1a] mb-3">{v.title}</h3>
              <p className="text-[14px] text-[#6b6b6b] leading-relaxed font-light">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleries.map((img, i) => (
            <div key={i} className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={img} alt="AAL culture" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* DEI section */}
      <section className="bg-[#1a1a1a] py-20 px-6 md:px-10 mt-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#666] mb-4 font-medium">Diversity, Equity & Inclusion</p>
            <h2 className="text-[28px] md:text-[38px] font-light text-white mb-6">Building a more equitable profession</h2>
            <p className="text-[15px] text-[#aaa] leading-relaxed mb-8 font-light">
              AAL is committed to building a diverse and inclusive workforce. We believe that diverse teams produce better design solutions and are dedicated to creating an environment where every person can thrive.
            </p>
            {/* <Link href="#" className="text-[12px] tracking-[0.12em] uppercase text-white border-b border-white pb-1 hover:opacity-60 transition-opacity">
              Learn About Our DEI Initiatives
            </Link> */}
          </div>
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img src="/26.jpg" alt="DEI at AAL" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* <div className="px-6 md:px-10 py-10 max-w-[1600px] mx-auto">
        <Link href="/people/careers" className="inline-flex items-center gap-3 text-[14px] font-medium text-[#1a1a1a] hover:opacity-60 transition-opacity">
          Explore Careers at HOK
          {/* <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg> */}
      {/* </Link> */}
      {/* // </div>  */}

      <Footer />
      <CookieBanner />
    </>
  )
}
