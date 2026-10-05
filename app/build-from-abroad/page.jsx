import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import Breadcrumbs from '../components/content/Breadcrumbs'
import Faq from '../components/content/Faq'
import Testimonials from '../components/content/Testimonials'
import TrustEvidence from '../components/content/TrustEvidence'
import ConsultationBooking from '../components/ConsultationBooking'
import { MoneyProtection, InspectionOptions, RemoteJourney, ReportingCadence } from '../components/infographics/Infographics'
import { pageMetadata, serviceSchema } from '@/lib/seo'
import { buildFromAbroadFaqs } from '@/lib/content/process'
import { getFxRates } from '@/lib/fx'
import { SITE } from '@/lib/site'

export const revalidate = 86400

const PATH = '/build-from-abroad'
const TITLE = 'Build a House in Nigeria From Abroad | Artemis Atelier'
const DESCRIPTION = 'Building a house in Nigeria from the UK, US or Canada? Payments released after each stage is inspected, open-book BOQs, a live site camera and a free call.'

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH, image: '/51.jpg', imageAlt: 'Artemis Atelier construction project' })

const WORRIES = [
    'Will they disappear with my money?',
    'Will they inflate the cost of materials?',
    'Will they use inferior materials?',
    'Is the project actually progressing?',
]

const ANSWERS = [
    { h: 'You never pay ahead of the work', p: 'Each payment covers one stage. It is only due after our inspection team has checked the previous stage, and you can bring in an independent inspector too.' },
    { h: 'Every cost is on an open book', p: 'An itemised BOQ: every bag of cement and tonne of rebar, checkable against our live material price tracker.' },
    { h: 'Materials are inspected, not assumed', p: 'Rebar sizes, block quality and concrete cube tests are checked at the stage gates.' },
    { h: 'You can see the site any day', p: 'A live camera, dated weekly reports, drone or video walk-rounds, and your own client portal.' },
]

const HUB = [
    { h: 'How we build', p: 'The six stages, what the inspector checks, and what you receive.', href: '/how-we-build' },
    { h: 'What it costs in 2026', p: 'Bungalow and duplex costs in naira, pounds and dollars.', href: '/guides/cost-of-building-a-house-in-nigeria' },
    { h: 'Buying land from abroad', p: 'C of O, Governor’s Consent, searches and red flags.', href: '/guides/buying-land-in-nigeria-from-abroad' },
    { h: 'Scams to avoid', p: 'The ten that cost diaspora builders most, and the defence for each.', href: '/guides/property-scams-in-nigeria-to-avoid' },
    { h: 'Managing a build remotely', p: 'Who does what, reporting, site visits and change control.', href: '/guides/managing-a-build-in-nigeria-from-abroad' },
    { h: 'Choosing a contractor', p: 'Registrations to check and twelve questions to ask.', href: '/guides/how-to-choose-a-building-contractor-in-nigeria' },
]

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

export default async function BuildFromAbroadPage() {
    const rates = await getFxRates()
    return (
        <>
            <JsonLd data={{
                ...serviceSchema({ name: 'Building a house in Nigeria from abroad', description: DESCRIPTION, path: PATH, serviceType: 'Diaspora construction project management', areaServed: ['Lagos', 'Ogun State', 'Nigeria'] }),
                audience: { '@type': 'Audience', audienceType: 'Nigerians living abroad planning to build in Nigeria' },
                offers: { '@type': 'Offer', name: 'Free 20-minute consultation', price: '0', priceCurrency: 'NGN' },
            }} />
            <Navigation />

            {/* Hero */}
            <section className="bg-white pt-[72px]">
                <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-2 md:px-10 md:pb-24 md:pt-14">
                    <div>
                        <Breadcrumbs items={[{ name: 'Build from abroad', path: PATH }]} />
                        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">For Nigerians building from abroad</p>
                        <h1 className="mb-6 text-[40px] leading-[1.05] md:text-[56px]" style={serif}>Build a house in Nigeria from abroad, and watch every block go in.</h1>
                        <p className="mb-8 max-w-md text-[16px] leading-relaxed text-[#555]">
                            Stage payments released only after each stage is inspected, an open-book bill of quantities, and a live site camera, so you can manage your build from London, Houston, Toronto or Sydney.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <a href="#book" className="rounded-full bg-[#08b796] px-8 py-4 text-center text-[13px] font-medium text-white hover:bg-[#079e82]">Book your free 20-minute consultation</a>
                            <a href="/cost-guide" className="rounded-full border border-[#1a1a1a] px-8 py-4 text-center text-[13px] font-medium hover:bg-[#1a1a1a] hover:text-white">Get the free 2026 cost guide</a>
                        </div>
                        <p className="mt-4 text-[12px] text-[#8a8a8a]">No obligation. No payment required to speak with us. {SITE.rc}.</p>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f2ee]">
                        <Image src="/51.jpg" alt="Artemis Atelier construction project" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                </div>
            </section>

            {/* The worry */}
            <section className="bg-[#1a1a1a] text-white">
                <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
                    <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">The question every diaspora client asks</p>
                    <h2 className="mx-auto mb-12 max-w-2xl text-center text-[28px] leading-snug md:text-[38px]" style={serif}>“If I send money to Nigeria, how do I know the work is actually being done?”</h2>
                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                        {ANSWERS.map((a, i) => (
                            <div key={a.h} className="border-l-2 border-[#08b796] pl-5">
                                <p className="mb-1 text-[12px] text-white/50">{WORRIES[i]}</p>
                                <h3 className="mb-1 text-[17px] font-semibold">{a.h}</h3>
                                <p className="text-[14px] leading-relaxed text-white/70">{a.p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Six steps (infographic) */}
            <section className="mx-auto max-w-[1200px] px-6 md:px-10">
                <RemoteJourney />
            </section>

            {/* Hub */}
            <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24" aria-labelledby="hub-title">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Your building-from-abroad toolkit</p>
                <h2 id="hub-title" className="mb-10 text-[30px] md:text-[42px]" style={serif}>Everything to know before you send a naira</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {HUB.map(h => (
                        <Link key={h.href} href={h.href} className="flex flex-col border border-[#e6e6e6] p-6 transition-colors hover:border-[#1a1a1a]">
                            <span className="mb-2 text-[18px] font-semibold text-[#1a1a1a]">{h.h}</span>
                            <span className="text-[14px] leading-relaxed text-[#666]">{h.p}</span>
                            <span className="mt-4 text-[12px] uppercase tracking-[0.1em] text-[#067a64]">Read the guide →</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* How your money is protected, who inspects, what you see (infographics) */}
            <section className="mx-auto max-w-[1200px] px-6 pb-8 md:px-10">
                <MoneyProtection />
                <InspectionOptions />
                <ReportingCadence />
            </section>

            {/* Insurance */}
            <section className="border-t border-[#e6e6e6]">
                <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
                    <div>
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">An extra layer of protection</p>
                        <h2 className="mb-6 text-[30px] leading-tight md:text-[42px]" style={serif}>Your project, backed by insurance.</h2>
                        <p className="mb-5 max-w-md text-[15px] leading-relaxed text-[#555]">
                            Alongside our reporting and stage inspections, we can arrange contractor’s all-risk and public liability cover for your project with a NAICOM-licensed insurer, so eligible project risks are insured. The insurer and policy are confirmed in writing in your contract.
                        </p>
                        <p className="max-w-md text-[13px] leading-relaxed text-[#8a8a8a]">Coverage is subject to the terms, conditions, exclusions and deductibles of the policy issued. We walk you through exactly what is covered before your first payment.</p>
                        <div className="mt-8"><TrustEvidence title="See the evidence" /></div>
                    </div>
                    <div className="bg-[#f4f2ee] p-8 md:p-10">
                        <p className="mb-6 text-[12px] font-medium uppercase tracking-[0.15em] text-[#5a5a5a]">Depending on your project, cover may include</p>
                        <ul className="space-y-4">
                            {[
                                ['Contractors’ all risks', 'Physical loss or damage during construction.'],
                                ['Third-party / public liability', 'Claims involving injury or property damage to others.'],
                                ['Construction plant and equipment', 'Damage or loss of equipment used on your site.'],
                                ['Fire and theft-related risks', 'Depending on the specific policy issued.'],
                            ].map(([h, p]) => (
                                <li key={h} className="flex items-start gap-3">
                                    <span className="mt-1 text-[13px] text-[#08b796]">✓</span>
                                    <div><p className="text-[14px] font-medium">{h}</p><p className="mt-0.5 text-[13px] text-[#8a8a8a]">{p}</p></div>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 border-t border-[#e0e0e0] pt-6 text-[12px] text-[#8a8a8a]">Policies are issued by a NAICOM-licensed insurer, not by Artemis Atelier Ltd. You receive the policy number, coverage schedule and claims procedure directly.</p>
                    </div>
                </div>
            </section>

            <Testimonials />

            {/* Booking */}
            <section id="book" className="scroll-mt-20 bg-[#f4f2ee]">
                <div className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
                    <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Free diaspora project consultation</p>
                    <h2 className="mb-3 text-center text-[30px] md:text-[40px]" style={serif}>Pick a time that suits your time zone</h2>
                    <p className="mb-10 text-center text-[14px] text-[#6b6b6b]">Takes two minutes. We confirm by WhatsApp or email within one working day.</p>
                    <ConsultationBooking rates={rates} source="diaspora-consultation" heading="" />
                </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto max-w-[900px] px-6 py-16 md:py-24">
                <Faq faqs={buildFromAbroadFaqs} title="Questions diaspora clients ask" />
            </section>

            <Footer />
        </>
    )
}
