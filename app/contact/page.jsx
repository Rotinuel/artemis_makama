'use client'

import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import { useState } from 'react'

const studios = [
  { city: 'Anthony Village, Lagos', address: '70B Olorunlogbon Street, Anthony Village', cityState: 'Lagos, Nigeria', phone: '+2348033502393', phoneDisplay: '+234 803 350 2393' },
]

const locations = ['Lagos', 'Elsewhere in Nigeria', 'United Kingdom', 'United States', 'Canada', 'Other']
const projectTypes = ['New build', 'Renovation', 'Interiors', 'Commercial / institutional', 'Project management', 'Design only']
// Budget bands in naira. Add dollar/pound equivalents here if you want them shown.
const budgets = [
  'Under ₦50 million',
  '₦50 – 150 million',
  '₦150 – 400 million',
  'Over ₦400 million',
  'Not sure yet',
]
const landOptions = ['Yes', 'No', 'In progress']

// The WhatsApp number the form should message. Digits only, with country code, no + or spaces.
const WHATSAPP_NUMBER = '2348033502393'

const inquiryTypes = [
  'New Project Inquiry',
  'Careers',
  'Media Inquiry',
  'Speaking Engagement',
  'General Question',
]

// Builds a readable WhatsApp message from the form fields.
function buildWhatsAppMessage(formData) {
  const lines = [
    `New inquiry from artemisatelierltd.com`,
    ``,
    `Name: ${formData.name}`,
    `Email: ${formData.email}`,
  ]
  if (formData.company) lines.push(`Organization: ${formData.company}`)
  if (formData.phone) lines.push(`Phone: ${formData.phone}`)
  if (formData.inquiry) lines.push(`Inquiry type: ${formData.inquiry}`)
  if (formData.location) lines.push(`Based in: ${formData.location}`)
  if (formData.projectType) lines.push(`Project type: ${formData.projectType}`)
  if (formData.budget) lines.push(`Approximate budget: ${formData.budget}`)
  if (formData.land) lines.push(`Owns the land: ${formData.land}`)
  lines.push(``, `Message:`, formData.message)
  return lines.join('\n')
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', inquiry: '', location: '', projectType: '', budget: '', land: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    const text = encodeURIComponent(buildWhatsAppMessage(formData))
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <>
      <Navigation />
      <PageHero
        label="Get in Touch"
        title="Tell us about your project."
        description="We reply within one working day. Prefer to talk? Call or WhatsApp +234 803 350 2393, Monday to Saturday."
      />

      <div className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact form */}
          <div>
            <h2 className="text-[22px]  text-[#1a1a1a] mb-8">Send a Message</h2>
            {submitted ? (
              <div className="bg-[#f5f5f5] p-10 text-center">
                <svg className="mx-auto mb-4 text-[#1a1a1a]" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
                  <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-[18px]  text-[#1a1a1a] mb-2">Almost done</h3>
                <p className="text-[14px] text-[#6b6b6b]">
                  We've opened WhatsApp with your message ready to go — just hit send there to reach us.
                  Didn't open?{' '}
                  <button
                    type="button"
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(formData))}`, '_blank', 'noopener,noreferrer')}
                    className="underline text-[#1a1a1a]"
                  >
                    Open WhatsApp again
                  </button>
                </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectField label="Where are you based?" name="location" value={formData.location} onChange={handleChange} options={locations} />
                  <SelectField label="Project type" name="projectType" value={formData.projectType} onChange={handleChange} options={projectTypes} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectField label="Approximate budget" name="budget" value={formData.budget} onChange={handleChange} options={budgets} />
                  <SelectField label="Do you already own the land?" name="land" value={formData.land} onChange={handleChange} options={landOptions} />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Message *</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors resize-none" placeholder="Tell us about your project or question..." />
                </div>
                <button type="submit" className="w-full bg-[#1a1a1a] text-white text-[12px] tracking-[0.12em] uppercase py-4 hover:bg-[#333] transition-colors">
                  Send Message via WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Studio directory */}
          <div>
            <h2 className="text-[22px]  text-[#1a1a1a] mb-8">Our Studio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {studios.map((s, i) => (
                <div key={i} className="border-b border-[#f0f0f0] pb-5">
                  <h3 className="text-[14px] font-medium text-[#1a1a1a] mb-1">{s.city}</h3>
                  <p className="text-[12px] text-[#6b6b6b] leading-relaxed">{s.address}</p>
                  <p className="text-[12px] text-[#6b6b6b]">{s.cityState}</p>
                  <a href={`tel:${s.phone}`} className="text-[12px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mt-1 block">{s.phoneDisplay || s.phone}</a>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors block">WhatsApp</a>
                  <p className="text-[12px] text-[#6b6b6b] mt-1">Monday to Saturday</p>
                </div>
              ))}
            </div>
            <div className="mt-8 overflow-hidden border border-[#f0f0f0]" style={{ aspectRatio: '16/10' }}>
              <iframe
                title="Map showing the Artemis Atelier studio in Anthony Village, Lagos"
                src="https://www.google.com/maps?q=70B%20Olorunlogbon%20Street%2C%20Anthony%20Village%2C%20Lagos&output=embed"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CookieBanner />
    </>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={`f-${name}`} className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">{label}</label>
      <select id={`f-${name}`} name={name} value={value} onChange={onChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors bg-white appearance-none">
        <option value="">Select one</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}





// 'use client'

// import Navigation from '../components/Navigation'
// import Footer from '../components/Footer'
// import CookieBanner from '../components/CookieBanner'
// import PageHero from '../components/PageHero'
// import { useState } from 'react'

// const studios = [
//   { city: 'Ikeja', address: '70b Olorunlogbon St, Anthony', cityState: 'Lagos', phone: '+2348033502393' },
// ]

// const inquiryTypes = [
//   'New Project Inquiry',
//   'Careers',
//   'Media Inquiry',
//   'Speaking Engagement',
//   'General Question',
// ]

// export default function ContactPage() {
//   const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', inquiry: '', message: '', studio: '' })
//   const [submitted, setSubmitted] = useState(false)

//   const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
//   const handleSubmit = e => {
//     e.preventDefault()
//     setSubmitted(true)
//   }

//   return (
//     <>
//       <Navigation />
//       <PageHero
//         label="Get in Touch"
//         title="Contact"
//         description="We'd love to hear about your project. Reach out to a studio near you or send us a message."
//       />

//       <div className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

//           {/* Contact form */}
//           <div>
//             <h2 className="text-[22px]  text-[#1a1a1a] mb-8">Send a Message</h2>
//             {submitted ? (
//               <div className="bg-[#f5f5f5] p-10 text-center">
//                 <svg className="mx-auto mb-4 text-[#1a1a1a]" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                   <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
//                   <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//                 <h3 className="text-[18px]  text-[#1a1a1a] mb-2">Message Received</h3>
//                 <p className="text-[14px] text-[#6b6b6b] ">Thank you for reaching out. A member of our team will be in touch shortly.</p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Name *</label>
//                     <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="Jane Smith" />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Email *</label>
//                     <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="jane@company.com" />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Organization</label>
//                     <input name="company" value={formData.company} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="Company or institution" />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Phone</label>
//                     <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors" placeholder="+1 (000) 000-0000" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Nature of Inquiry</label>
//                   <select name="inquiry" value={formData.inquiry} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors bg-white appearance-none">
//                     <option value="">Select one</option>
//                     {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Preferred Studio</label>
//                   <select name="studio" value={formData.studio} onChange={handleChange} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors bg-white appearance-none">
//                     <option value="">Select a studio</option>
//                     {studios.map(s => <option key={s.city} value={s.city}>{s.city}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6b6b] mb-1.5 font-medium">Message *</label>
//                   <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full border border-[#e0e0e0] px-4 py-3 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors resize-none" placeholder="Tell us about your project or question..." />
//                 </div>
//                 <button type="submit" className="w-full bg-[#1a1a1a] text-white text-[12px] tracking-[0.12em] uppercase py-4 hover:bg-[#333] transition-colors">
//                   Send Message
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* Studio directory */}
//           <div>
//             <h2 className="text-[22px]  text-[#1a1a1a] mb-8">Our Studios</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {studios.map((s, i) => (
//                 <div key={i} className="border-b border-[#f0f0f0] pb-5">
//                   <h3 className="text-[14px] font-medium text-[#1a1a1a] mb-1">{s.city}</h3>
//                   <p className="text-[12px] text-[#6b6b6b] leading-relaxed">{s.address}</p>
//                   <p className="text-[12px] text-[#6b6b6b]">{s.cityState}</p>
//                   <a href={`tel:${s.phone}`} className="text-[12px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mt-1 block">{s.phone}</a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//       <CookieBanner />
//     </>
//   )
// }
