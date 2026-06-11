import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CookieBanner from '../../components/CookieBanner'
import PageHero from '../../components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Careers at AAL',
  description: "Join AAL's diverse team of innovative," +
      " entrepreneurial designers and create the world's best, most sustainable places.",
}

const openings = [
  { title: 'Senior Architect', location: 'New York, NY', department: 'Architecture', type: 'Full-Time' },
  { title: 'Interior Designer', location: 'Washington, D.C.', department: 'Interiors', type: 'Full-Time' },
  { title: 'Structural Engineer', location: 'Chicago, IL', department: 'Engineering', type: 'Full-Time' },
  { title: 'Urban Planner', location: 'Los Angeles, CA', department: 'Planning + Urban Design', type: 'Full-Time' },
  { title: 'Landscape Architect', location: 'Dallas, TX', department: 'Landscape Architecture', type: 'Full-Time' },
  { title: 'Healthcare Design Lead', location: 'Houston, TX', department: 'Healthcare', type: 'Full-Time' },
  { title: 'Sustainability Analyst', location: 'San Francisco, CA', department: 'Sustainable Design', type: 'Full-Time' },
  { title: 'Aviation Project Manager', location: 'Atlanta, GA', department: 'Aviation + Transportation', type: 'Full-Time' },
  { title: 'BIM Coordinator', location: 'Boston, MA', department: 'Technology', type: 'Full-Time' },
  { title: 'Graduate Architect', location: 'London, UK', department: 'Architecture', type: 'Full-Time' },
]

const benefits = [
  { title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage for you and your family.' },
  { title: 'Flexible Work', description: 'Hybrid work options that balance studio collaboration with personal flexibility.' },
  { title: 'Professional Development', description: 'Continuing education support, licensure assistance, and leadership programs.' },
  { title: 'Retirement Planning', description: '401(k) with company match and financial planning resources.' },
  { title: 'Parental Leave', description: 'Generous paid parental leave for primary and secondary caregivers.' },
  { title: 'Community Impact', description: 'Paid volunteer time and pro bono design opportunities.' },
]

export default function CareersPage() {
  return (
    <>
      <Navigation />
      <PageHero
        label="Join Us"
        title="Careers at AAL"
        description="We're excited about the future. Join our team and design it with us."
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1900&q=80"
      />

      {/* Mission statement */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto border-b border-[#e0e0e0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[28px] md:text-[42px] font-light text-[#1a1a1a] leading-tight mb-6">
              Create the world&apos;s best, most sustainable places
            </h2>
            <p className="text-[15px] text-[#1a1a1a] leading-relaxed mb-6 font-light" style={{ textAlign: "justify" }}>
              AAL designs buildings and spaces that inspire people. We&apos;re a diverse team of innovative, entrepreneurial people with an ambitious vision. We think the warm, friendly culture in our studios—each with its own local vibe—is pretty special.
            </p>
            <p className="text-[15px] text-[#6b6b6b] leading-relaxed font-light">
              We&apos;re a highly collaborative group of people who enjoy working together and are generous about sharing our knowledge, research and innovations.
            </p>
          </div>
          <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80" alt="HOK workplace" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#f5f5f5] px-6 md:px-10 py-20">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-[26px] md:text-[36px] font-light text-[#1a1a1a] mb-12">Why HOK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-8">
                <h3 className="text-[16px] font-medium text-[#1a1a1a] mb-3">{b.title}</h3>
                <p className="text-[13px] text-[#6b6b6b] leading-relaxed font-light">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job openings */}
      <section className="px-6 md:px-10 py-20 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-[26px] md:text-[36px] font-light text-[#1a1a1a]">Open Positions</h2>
          <div className="flex gap-3">
            {['All', 'Architecture', 'Interiors', 'Engineering', 'Planning'].map(f => (
              <button key={f} className={`text-[12px] px-3 py-1.5 border transition-colors ${f === 'All' ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <ul>
          {openings.map((job, i) => (
            <li key={i} className="border-b border-[#e0e0e0] last:border-b-0">
              <Link href="#" className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-3 group">
                <div>
                  <h3 className="text-[15px] font-medium text-[#1a1a1a] group-hover:opacity-60 transition-opacity">{job.title}</h3>
                  <p className="text-[13px] text-[#6b6b6b] mt-1">{job.department}</p>
                </div>
                <div className="flex items-center gap-6 text-[13px] text-[#6b6b6b] flex-shrink-0">
                  <span>{job.location}</span>
                  <span className="text-[10px] tracking-widest uppercase border border-[#e0e0e0] px-2 py-1">{job.type}</span>
                  <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
      <CookieBanner />
    </>
  )
}
