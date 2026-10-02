import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/content/Breadcrumbs'
import { GUIDE_GROUPS } from '@/lib/content/guides'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Building in Nigeria: Cost, Land & Contractor Guides | Artemis',
    description: 'Guides to building in Nigeria from home or abroad: 2026 build costs in ₦, £ and $, buying land safely, avoiding scams and choosing a contractor.',
    path: '/guides',
})

export default function GuidesIndex() {
    return (
        <>
            <Navigation />
            <main className="pt-[72px]">
                <header className="bg-[#111] text-white">
                    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
                        <Breadcrumbs items={[{ name: 'Guides', path: '/guides' }]} light />
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Guides</p>
                        <h1 className="max-w-3xl text-[38px] leading-[1.08] md:text-[54px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Building in Nigeria, explained honestly</h1>
                        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75">What it really costs, how to buy land safely, how to avoid the common scams and how to choose who builds for you. Written for people building in Nigeria, especially from abroad.</p>
                    </div>
                </header>
                <div className="mx-auto max-w-[1200px] space-y-14 px-6 py-14 md:px-10">
                    {GUIDE_GROUPS.map(group => (
                        <section key={group.title} aria-labelledby={`g-${group.title}`}>
                            <h2 id={`g-${group.title}`} className="mb-6 border-b border-[#e6e6e6] pb-3 text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{group.title}</h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {group.guides.map(g => (
                                    <Link key={g.path} href={g.path} className="flex flex-col border border-[#e6e6e6] p-6 transition-colors hover:border-[#1a1a1a]">
                                        <span className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#067a64]">{g.eyebrow}</span>
                                        <span className="mb-2 text-[18px] font-semibold leading-snug text-[#1a1a1a]">{g.h1}</span>
                                        <span className="text-[14px] leading-relaxed text-[#666]">{g.description}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}
