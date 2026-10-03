import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import Breadcrumbs from '../components/content/Breadcrumbs'
import Faq from '../components/content/Faq'
import ConsultCard from '../components/content/ConsultCard'
import { PLAN_TYPES, GALLERY, PLAN_FAQS } from '@/lib/content/house-plans'
import { pageMetadata, ORG_ID } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

const PATH = '/house-plans'
export const metadata = pageMetadata({
    title: 'House Plans & Building Plans in Nigeria | Artemis Atelier',
    description: 'Nigerian house plans and building plans for 2- to 5-bedroom bungalows and duplexes, designed for your plot, with typical floor areas and 2026 build costs.',
    path: PATH,
    image: '/33.jpg',
    imageAlt: 'Residential design visual by Artemis Atelier',
})

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

export default function HousePlansPage() {
    return (
        <>
            <JsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'House plans and designs',
                url: absoluteUrl(PATH),
                publisher: { '@id': ORG_ID },
                hasPart: GALLERY.map(g => ({ '@type': 'ImageObject', contentUrl: absoluteUrl(g.src), caption: g.caption, creator: { '@id': ORG_ID } })),
            }} />
            <Navigation />
            <main className="pt-[72px]">
                <header className="bg-[#111] text-white">
                    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
                        <Breadcrumbs items={[{ name: 'House plans', path: PATH }]} light />
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">House plans and designs</p>
                        <h1 className="max-w-3xl text-[38px] leading-[1.08] md:text-[54px]" style={serif}>House plans for Nigeria, designed for your plot</h1>
                        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75">
                            Bungalow and duplex building plans from 2 to 5 bedrooms. Every plan we draw is fitted to your plot, your budget and Lagos approval rules, with structural and services drawings, so it can be priced and built.
                        </p>
                    </div>
                </header>

                <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0">
                        <h2 className="mb-6 text-[30px] text-[#1a1a1a]" style={serif}>Popular plan types</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {PLAN_TYPES.map(p => (
                                <article key={p.key} className="border border-[#e6e6e6] p-6">
                                    <h3 className="mb-2 text-[18px] font-semibold text-[#1a1a1a]">{p.h}</h3>
                                    <dl className="space-y-1.5 text-[14px] text-[#555]">
                                        <div><dt className="inline font-medium text-[#1a1a1a]">Typical size: </dt><dd className="inline">~{p.m2} m²</dd></div>
                                        <div><dt className="inline font-medium text-[#1a1a1a]">Rooms: </dt><dd className="inline">{p.rooms}</dd></div>
                                        <div><dt className="inline font-medium text-[#1a1a1a]">Fits: </dt><dd className="inline">{p.fits}</dd></div>
                                        <div><dt className="inline font-medium text-[#1a1a1a]">Build cost (standard finish): </dt><dd className="inline">{p.cost}</dd></div>
                                    </dl>
                                </article>
                            ))}
                        </div>
                        <p className="mt-4 text-[13px] text-[#8a8a8a]">Costs: Lagos, 2026, excluding land. See the <Link href="/guides/cost-of-building-a-house-in-nigeria" className="underline">full cost guide</Link>.</p>
                        <p className="mt-6 border-l-2 border-[#08b796] pl-4 text-[15px] leading-relaxed text-[#333]">
                            Building with your own contractor? Our <Link href="/services/design-only-package" className="underline decoration-[#08b796] underline-offset-[3px]">design-only package</Link> gives you architectural and structural drawings and approval support, ready for any builder.
                        </p>

                        <h2 className="mb-6 mt-14 text-[30px] text-[#1a1a1a]" style={serif}>Designs we have drawn</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {GALLERY.map(g => (
                                <Link key={g.src} href={g.href} className="group block">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f2f2f2]">
                                        <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <p className="mt-2 text-[14px] text-[#333]">{g.caption}</p>
                                </Link>
                            ))}
                        </div>

                        <h2 className="mb-6 mt-14 text-[30px] text-[#1a1a1a]" style={serif}>What you get with a plan from us</h2>
                        <ul className="space-y-2.5 text-[15px] leading-relaxed text-[#333]">
                            {['Concept options and 3D visuals', 'Architectural drawings: plans, elevations, sections and site plan', 'Structural drawings by a COREN-registered engineer', 'Electrical and plumbing layouts', 'Permit application drawings for LASPPPA', 'An open-book BOQ so you know what it costs to build'].map(t => (
                                <li key={t} className="flex gap-3"><span className="text-[#08b796]">✓</span>{t}</li>
                            ))}
                        </ul>

                        <div className="mt-14"><Faq faqs={PLAN_FAQS} title="Building plan questions" /></div>
                    </div>
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <ConsultCard title="Request a plan consultation" text="Tell us your plot size, rooms and budget. We’ll show you what fits." primary={{ label: 'Request a plan consultation', href: '/contact#enquiry' }} whatsappText="Hi Artemis, I would like a house plan for my plot." />
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    )
}
