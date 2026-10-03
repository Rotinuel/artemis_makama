import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/content/Breadcrumbs'
import SubscribeForm from '../components/SubscribeForm'
import { pageMetadata } from '@/lib/seo'
import { COST_GUIDE_PDF, whatsappLink } from '@/lib/site'

const PATH = '/cost-guide'

export const metadata = pageMetadata({
    title: 'Free 2026 Cost Guide: Building a House in Nigeria | Artemis',
    description: 'Free 2026 PDF on the cost of building a house in Nigeria: cost per m², bungalow and duplex budgets, stage-by-stage costs and rules that protect your money.',
    path: PATH,
    image: '/10.jpg',
    imageAlt: 'Three-storey building nearing completion',
})

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }

const INSIDE = [
    'Cost per square metre in Lagos for basic, standard and premium finishes',
    'Budgets for 2-, 3- and 4-bedroom bungalows and 4- and 5-bedroom duplexes',
    'Where the money goes, stage by stage, from foundation to finishing',
    'What is not included, so you can budget for land, approvals and external works',
    'Five rules that protect your money when you build from abroad',
    'A one-page checklist for vetting any building contractor in Nigeria',
]

function Download() {
    return (
        <div className="space-y-4">
            <p className="text-[15px] leading-relaxed text-[#067a64]">Thank you. Your guide is ready.</p>
            <a
                href={COST_GUIDE_PDF}
                download
                className="block rounded-full bg-[#08b796] px-8 py-4 text-center text-[13px] font-medium text-white hover:bg-[#079e82]"
            >
                Download the 2026 cost guide (PDF)
            </a>
            <a
                href="/downloads/contractor-verification-checklist.pdf"
                download
                className="block rounded-full border border-[#1a1a1a] px-8 py-4 text-center text-[13px] font-medium hover:bg-[#1a1a1a] hover:text-white"
            >
                Download the contractor checklist (PDF)
            </a>
            <p className="pt-2 text-[14px] leading-relaxed text-[#555]">
                Want a figure for your own plot? <Link href="/build-from-abroad#book" className="underline decoration-[#08b796] underline-offset-[3px]">Book a free 20-minute call</Link> at a time that suits your time zone.
            </p>
        </div>
    )
}

export default function CostGuidePage() {
    return (
        <>
            <Navigation />
            <main className="bg-white pt-[72px]">
                <section className="mx-auto grid max-w-[1200px] items-start gap-12 px-6 pb-16 pt-10 md:grid-cols-2 md:px-10 md:pb-24 md:pt-14">
                    <div>
                        <Breadcrumbs items={[{ name: 'Guides', path: '/guides' }, { name: 'Free cost guide', path: PATH }]} />
                        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Free PDF · 2026 edition</p>
                        <h1 className="mb-6 text-[38px] leading-[1.05] md:text-[52px]" style={serif}>The 2026 cost guide to building a house in Nigeria</h1>
                        <p className="mb-8 max-w-md text-[16px] leading-relaxed text-[#555]">
                            The figures we use with clients in London, Houston and Toronto, in one short PDF you can share with family. Enter your email and the download starts straight away.
                        </p>
                        <h2 className="mb-4 text-[22px] text-[#1a1a1a]" style={serif}>What is inside</h2>
                        <ul className="space-y-3">
                            {INSIDE.map(t => (
                                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-[#333]">
                                    <span aria-hidden="true" className="mt-[2px] text-[#08b796]">✓</span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-8 text-[14px] leading-relaxed text-[#777]">
                            Prefer to read online? The <Link href="/guides/cost-of-building-a-house-in-nigeria" className="underline">full cost guide</Link> is free on the site, with live exchange rates and material prices.
                        </p>
                    </div>

                    <div className="border border-[#e6e6e6] bg-[#fafaf8] p-6 md:p-10">
                        <div className="relative mb-6 hidden aspect-[4/3] overflow-hidden md:block">
                            <Image src="/10.jpg" alt="Three-storey building nearing completion" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                        </div>
                        <h2 className="mb-2 text-[26px] text-[#1a1a1a]" style={serif}>Get the free guide</h2>
                        <p className="mb-6 text-[14px] leading-relaxed text-[#666]">We’ll email you when the figures are updated. No spam, and you can unsubscribe at any time.</p>
                        <SubscribeForm
                            list="cost-guide"
                            button="Send me the guide"
                            busyLabel="One moment…"
                            note={<>By signing up you agree to our <a href="/privacy" className="underline">privacy policy</a>. We never share your email.</>}
                            done={<Download />}
                        />
                        <p className="mt-6 text-[13px] text-[#888]">
                            Questions? <a href={whatsappLink('Hi Artemis, I have a question about the 2026 cost guide.')} target="_blank" rel="noopener noreferrer" className="underline">Message us on WhatsApp</a>.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
