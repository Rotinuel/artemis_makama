import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/content/Breadcrumbs'
import { SERVICES } from '@/lib/content/services'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Construction & Design Services in Lagos | Artemis Atelier',
    description: 'Design and build, renovation and facility management in Lagos, plus feasibility reports, land checks and build monitoring for clients abroad.',
    path: '/services',
})

const EXTRA = [
    { h: 'Building from abroad', p: 'Project management for clients in the UK, US, Canada and beyond: stage payments, inspections and live reporting.', href: '/build-from-abroad' },
    { h: 'Building contractor in Lagos', p: 'Houses, duplexes, estates and churches across Lagos and Ogun State.', href: '/building-contractor-lagos' },
]

function Grid({ items }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(it => (
                <Link key={it.href} href={it.href} className="flex flex-col border border-[#e6e6e6] p-7 transition-colors hover:border-[#1a1a1a]">
                    <span className="mb-4 h-2 w-2 rounded-full bg-[#08b796]" />
                    <span className="mb-2 text-[20px] font-semibold text-[#1a1a1a]">{it.h}</span>
                    <span className="text-[14px] leading-relaxed text-[#666]">{it.p}</span>
                    <span className="mt-4 text-[12px] uppercase tracking-[0.1em] text-[#067a64]">Learn more →</span>
                </Link>
            ))}
        </div>
    )
}

export default function ServicesIndex() {
    const card = s => ({ ...s.card, href: s.path })
    const build = [...SERVICES.filter(s => s.group !== 'advisory').map(card), ...EXTRA]
    const advisory = SERVICES.filter(s => s.group === 'advisory').map(card)
    return (
        <>
            <Navigation />
            <main className="pt-[72px]">
                <header className="bg-[#111] text-white">
                    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
                        <Breadcrumbs items={[{ name: 'Services', path: '/services' }]} light />
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Services</p>
                        <h1 className="max-w-3xl text-[38px] leading-[1.08] md:text-[54px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>One team from drawing to keys</h1>
                        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75">Design, construction, renovation and building care in Lagos, with open-book costs and every stage checked before you pay for the next.</p>
                    </div>
                </header>
                <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10">
                    <h2 className="mb-6 text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Design, build and care</h2>
                    <Grid items={build} />
                    <h2 className="mb-2 mt-16 text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Advisory services</h2>
                    <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-[#666]">Fixed-fee help before and during a build, whoever your builder is.</p>
                    <Grid items={advisory} />
                </div>
            </main>
            <Footer />
        </>
    )
}
