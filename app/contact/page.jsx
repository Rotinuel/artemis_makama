'use client'

import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import PageHero from '../components/PageHero'
import { useState } from 'react'
import Link from 'next/link'
import ConsultationBooking from '../components/ConsultationBooking'
import { SITE, mailtoLink } from '@/lib/site'
import { FALLBACK, fromNaira, formatMoney } from '@/lib/fx'
import { track } from '@/lib/track'

const studios = [
  { city: 'Anthony Village, Lagos', address: '70B Olorunlogbon Street, Anthony Village', cityState: 'Lagos, Nigeria', phone: '+2348033502393', phoneDisplay: '+234 803 350 2393' },
]

const locations = ['Lagos', 'Elsewhere in Nigeria', 'United Kingdom', 'United States', 'Canada', 'Other']
const projectTypes = ['New build', 'Renovation', 'Interiors', 'Commercial / institutional', 'Project management', 'Design only']
// Budget bands in naira, with approximate pound/dollar equivalents for diaspora clients
const conv = (n, c) => formatMoney(fromNaira(n, c, FALLBACK), c)
const band = (label, min, max) => max == null
  ? `${label} (≈ ${conv(min, 'GBP')}+ / ${conv(min, 'USD')}+)`
  : `${label} (≈ ${conv(min, 'GBP')}–${conv(max, 'GBP')} / ${conv(min, 'USD')}–${conv(max, 'USD')})`
const budgets = [
  band('Under ₦50 million', 0, 50e6).replace('≈ £0–', '≈ up to ').replace(' / $0–', ' / up to '),
  band('₦50 – 150 million', 50e6, 150e6),
  band('₦150 – 400 million', 150e6, 400e6),
  band('Over ₦400 million', 400e6, null),
  'Not sure yet',
]
const ABROAD = ['United Kingdom', 'United States', 'Canada', 'Other']
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
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', inquiry: '', location: '', projectType: '', budget: '', land: '', message: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  // 1) Save the enquiry on our server (Admin → Leads)  2) offer WhatsApp as a second step
  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/consultation-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact-form',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          contact: [formData.email, formData.phone].filter(Boolean).join(' / '),
          company: formData.company,
          inquiry: formData.inquiry,
          country: formData.location,
          projectType: formData.projectType,
          budget: formData.budget,
          hasLand: formData.land,
          message: formData.message,
          website: formData.website,
          page: '/contact',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not send your message.')
      track('generate_lead', { form: 'contact', inquiry: formData.inquiry || 'none', based_in: formData.location || 'unknown' })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Could not send. Please try WhatsApp or email instead.')
    } finally {
      setSending(false)
    }
  }
  const abroad = ABROAD.includes(formData.location)

  return (
    <>
      <Navigation />
      <PageHero
        label="Get in Touch"
        title="Tell us about your project."
        description="We reply within one working day. Prefer to talk? Call or WhatsApp +234 803 350 2393, Monday to Saturday, or email info@artemisatelierltd.com."
      />

      <div className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact form */}
          <div id="enquiry" className="scroll-mt-24">
            <h2 className="text-[22px]  text-[#1a1a1a] mb-8">Send a Message</h2>
            {submitted ? (
              <div className="bg-[#f5f5f5] p-10 text-center">
                <svg className="mx-auto mb-4 text-[#1a1a1a]" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
                  <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-[18px]  text-[#1a1a1a] mb-2">Message received</h3>
                <p className="text-[14px] text-[#6b6b6b] mb-6">
                  Thank you, {formData.name.split(' ')[0] || 'there'}. We'll reply within one working day.
                  Want a faster answer? Send the same message on WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(formData))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#08b796] text-[#04120f] text-[12px] tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors"
                  >
                    Also send on WhatsApp
                  </a>
                  {abroad && (
                    <Link href="#book" className="border border-[#1a1a1a] text-[12px] tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                      Pick a call time
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
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
                {abroad && (
                  <p className="text-[13px] text-[#067a64] bg-[#08b796]/10 px-4 py-3">
                    Building from abroad? You can also <Link href="#book" className="underline">pick a call time in your time zone</Link>.
                  </p>
                )}
                {error && <p className="text-[13px] text-[#c0392b]" role="alert">{error}</p>}
                <button type="submit" disabled={sending} className="w-full bg-[#1a1a1a] text-white text-[12px] tracking-[0.12em] uppercase py-4 hover:bg-[#333] transition-colors disabled:opacity-60">
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
                <p className="text-[11px] text-[#8a8a8a] leading-relaxed">
                  We use your details only to reply to you — see our <Link href="/privacy" className="underline">privacy policy</Link>.
                </p>
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
                  <a href={mailtoLink('Project enquiry')} className="text-[12px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors block">{SITE.email}</a>
                  <p className="text-[12px] text-[#6b6b6b] mt-1">{SITE.hours.days}, {SITE.hours.opens}–{SITE.hours.closes} Lagos time</p>
                  <p className="text-[12px] text-[#6b6b6b] mt-1">Calling from the UK or US? Dial +234 803 350 2393 or WhatsApp — or book a video call below.</p>
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

      {/* Time-zone call booking */}
      <section id="book" className="scroll-mt-20 bg-[#f4f2ee]">
        <div className="px-6 md:px-10 py-16 md:py-20 max-w-[760px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-3 text-center">Free 20-minute consultation</p>
          <h2 className="text-[28px] md:text-[36px] text-center mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Book a call in your time zone</h2>
          <p className="text-[14px] text-[#6b6b6b] text-center mb-10">London, New York, Toronto, Sydney or Lagos: pick a time and we&apos;ll confirm by WhatsApp or email.</p>
          <ConsultationBooking source="booking" heading="" />
        </div>
      </section>

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
