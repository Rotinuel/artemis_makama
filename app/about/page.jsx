import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import Link from 'next/link'
import { ShieldCheck, Lightbulb, Target, Users, Medal, HardHat } from "lucide-react";

export const metadata = {
  title: 'About - ARTEMIS ATELIER LTD',
  description: 'Construction without limits — residential, commercial, civil, and beyond.',
}

const stats = [
  { number: '30+', label: 'Design Professionals' },
  { number: '2', label: 'Studios Worldwide' },
  { number: '1', label: 'Continent' },
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
  {
    icon: HardHat,
    title: "Safety First",
    text: "The health, safety, and well-being of our employees, clients,and communities are our highest priorities.We maintain a zero- tolerance approach to safety violations and are committed to providing a safe, secure, and compliant working environment across all our operations.",
  },
];

const services = [
  {
    title: "Design",
    text: "We create innovative, functional, and aesthetically pleasing architectural designs tailored to meet each client's unique vision and requirements. Our design process combines creativity, technical expertise, and sustainability to deliver spaces that inspire and endure.",
  },
  {
    title: "Construction",
    text: "From groundbreaking to project completion, we provide comprehensive construction services with a strong focus on quality, safety, and efficiency. Our experienced team ensures every project is executed to the highest standards while meeting timelines and budget expectations",
  },
  {
    title: "General Contractors",
    text: "As a trusted general contractor, we coordinate and manage every aspect of the construction process. We oversee subcontractors, procurement, scheduling, and quality control to ensure seamless project delivery and exceptional results.",
  },
  {
    title: "Facility Management",
    text: "The Facility Management department at Artemis Atelier Ltd. is dedicated to preserving the value, functionality, and aesthetic appeal of your real estate investments. We provide comprehensive, proactive management solutions that encompass routine maintenance, structural upkeep, and operational efficiency. By leveraging sustainable practices and meticulous attention to detail, we ensure that every property remains safe, cost-effective, and aligned with its long-term design intent, offering peace of mind to owners and an exceptional experience for occupants.",
  },
  {
    title: "Project Management",
    text: "At Artemis Atelier Ltd., our Project Management department translates vision into reality with precision, efficiency, and excellence. We oversee the entire lifecycle of a project—from initial brief and technical documentation to final site handover. By seamlessly coordinating architects, engineers, and contractors, we ensure that every development is delivered on schedule, within budget, and to the highest quality standards. Our proactive approach minimizes risk and optimizes resources, ensuring a smooth, transparent, and successful delivery for every client",
  },
]

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
      <section className="px-6 md:px-10 py-20 max-w-400 mx-auto border-b border-aal-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[28px] tracking-[0.14em] uppercase text-[#08b796] mb-4 font-medium">Our Vision</p>
            <p className="text-[15px] text-black leading-relaxed mb-5  text-justify">
              To redefine the built environment through visionary architecture that shapes thriving communities and enriches lives. We envision a future where every space we create seamlessly integrates timeless design, exceptional functionality, and sustainable innovation, setting new standards of excellence in the built environment. Through creativity, integrity, and collaboration, we aspire to build enduring landmarks, inspire meaningful human experiences, and cultivate lasting trust with our clients, partners, and communities while leaving a positive legacy for future generations.
            </p>
          </div>

          <div>
            <p className="text-[28px] tracking-[0.14em] uppercase text-[#08b796] mb-4 font-medium">Our Mission</p>
            <p className="text-[15px] text-black leading-relaxed mb-5  text-justify">
              To shape meaningful and enduring spaces
              through innovative design, technical excellence,
              and sustainable practices. We are dedicated to
              transforming our clients' visions into inspiring
              architectural solutions that balance aesthetics,
              functionality, and environmental responsibility.
            </p>
            <p className="text-[15px] text-black leading-relaxed mb-5  text-justify">
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
                    <p className="text-[14px] text-[#6b6b6b] leading-relaxed  text-justify">{text}</p>
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

      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
      <div className="mb-12">
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">Our Services</p>
        <h2 className="text-[28px] md:text-[40px]  text-[#1a1a1a]">What We Do</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#e0e0e0]">
        {services.map((s, i) => (
          <div key={i} className="bg-white p-8 flex flex-col gap-4">
            <div className="w-2 h-2 rounded-full bg-[#08b796]" />
            <p className="text-[18px] font-medium text-[#1a1a1a] leading-snug">{s.title}</p>
            <p className="text-[13px] text-[#6b6b6b] leading-relaxed  text-justify">{s.text}</p>
          </div>
        ))}
      </div>
    </section>

      {/* Stats */}
      <section className="bg-[#1a1a1a] py-16 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center md:text-left border-r border-[#333] last:border-r-0 pr-8 last:pr-0 text-[#08b796]">
              <p className="text-[40px] md:text-[56px] leading-none">{s.number}</p>
              <p className="text-[16px] mt-2 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="mb-12">
          <p className="text-[16px] tracking-[0.14em] uppercase text-[#08b796] mb-3 font-semibold">Our Story</p>
          <h2 className="text-[24px] md:text-[40px] text-[#08b796]">History</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-6 border-b border-[#f0f0f0] pb-8">
              <span className="text-[13px] font-medium text-[#6b6b6b] shrink-0 w-12">{m.year}</span>
              <p className="text-[14px] text-[#1a1a1a] leading-relaxed text-justify">{m.event}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
      <CookieBanner />
    </>
  )
}

