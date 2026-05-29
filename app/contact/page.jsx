'use client'

import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import { useState } from 'react'

const studios = [
  { city: 'Atlanta', address: '1230 Peachtree St NE, Suite 900', cityState: 'Atlanta, GA 30309', phone: '+1 404.888.6600' },
  { city: 'Austin', address: '98 San Jacinto Blvd, Suite 100', cityState: 'Austin, TX 78701', phone: '+1 512.220.0820' },
  { city: 'Boston', address: '133 Federal St, 6th Floor', cityState: 'Boston, MA 02110', phone: '+1 617.946.4200' },
  { city: 'Chicago', address: '70 W. Madison St, Suite 2200', cityState: 'Chicago, IL 60602', phone: '+1 312.782.1961' },
  { city: 'Dallas', address: '2828 N Harwood St, Suite 700', cityState: 'Dallas, TX 75201', phone: '+1 214.969.5599' },
  { city: 'Denver', address: '1670 Broadway, Suite 200', cityState: 'Denver, CO 80202', phone: '+1 303.832.7700' },
  { city: 'Houston', address: '1990 Post Oak Blvd, Suite 2400', cityState: 'Houston, TX 77056', phone: '+1 713.407.7300' },
  { city: 'London', address: '210 Euston Road', cityState: 'London, NW1 2DA', phone: '+44 20.3668.4800' },
  { city: 'Los Angeles', address: '1100 S Flower St, Suite 2600', cityState: 'Los Angeles, CA 90015', phone: '+1 213.261.1100' },
  { city: 'New York', address: '7 World Trade Center, 250 Greenwich St', cityState: 'New York, NY 10007', phone: '+1 212.741.1200' },
  { city: 'San Francisco', address: '100 Pine St, Suite 2200', cityState: 'San Francisco, CA 94111', phone: '+1 415.243.0555' },
  { city: 'Washington, D.C.', address: '1899 Pennsylvania Ave NW, Suite 900', cityState: 'Washington, DC 20006', phone: '+1 202.339.8700' },
]

const inquiryTypes = [
  'New Project Inquiry',
  'Careers',
  'Media Inquiry',
  'Speaking Engagement',
  'General Question',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', inquiry: '', message: '', studio: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Navigation />
      <PageHero
        label="Get in Touch"
        title="Contact"
        description="We'd love to hear about your project. Reach out to a studio near you or send us a message."
      />

      <div className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact form */}
          <div>
            <h2 className="text-[22px] font-light text-[#1a1a1a] mb-8">Send a Message</h2>
            {submitted ? (
              <div className="bg-[#f5f5f5] p-10 text-center">
                <svg className="mx-auto mb-4 text-[#1a1a1a]" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
                  <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-[18px] font-light text-[#1a1a1a] mb-2">Message Received</h3>
                <p className="text-[14px] text-[#6b6b6b] font-light">Thank you for reaching out. A member of our team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Name *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Organization</label>
                    <input name="company" value={formData.company} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="Company or institution" />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="+1 (000) 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Nature of Inquiry</label>
                  <select name="inquiry" value={formData.inquiry} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors bg-white appearance-none">
                    <option value="">Select one</option>
                    {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Preferred Studio</label>
                  <select name="studio" value={formData.studio} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors bg-white appearance-none">
                    <option value="">Select a studio</option>
                    {studios.map(s => <option key={s.city} value={s.city}>{s.city}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Message *</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors resize-none" placeholder="Tell us about your project or question..." />
                </div>
                <button type="submit" className="w-full bg-[#1a1a1a] text-white text-[12px] tracking-[0.12em] uppercase py-4 hover:bg-[#333] transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Studio directory */}
          <div>
            <h2 className="text-[22px] font-light text-[#1a1a1a] mb-8">Our Studios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {studios.map((s, i) => (
                <div key={i} className="border-b border-[#f0f0f0] pb-5">
                  <h3 className="text-[14px] font-medium text-[#1a1a1a] mb-1">{s.city}</h3>
                  <p className="text-[12px] text-[#6b6b6b] leading-relaxed">{s.address}</p>
                  <p className="text-[12px] text-[#6b6b6b]">{s.cityState}</p>
                  <a href={`tel:${s.phone}`} className="text-[12px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mt-1 block">{s.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CookieBanner />
    </>
  )
}
