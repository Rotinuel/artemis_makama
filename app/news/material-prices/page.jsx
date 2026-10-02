import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import JsonLd from '../../components/JsonLd'
import Breadcrumbs from '../../components/content/Breadcrumbs'
import PriceBoardTable from '../../components/content/PriceBoardTable'
import Faq from '../../components/content/Faq'
import ConsultCard from '../../components/content/ConsultCard'
import SubscribeForm from '../../components/SubscribeForm'
import { getPriceBoard, getPriceHistory } from '@/lib/material-prices/fetch'
import { MATERIALS, formatRange, midpoint } from '@/lib/material-prices/items'
import { pageMetadata, ORG_ID } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

const PATH = '/news/material-prices'
const YEAR = new Date().getFullYear()

export async function generateMetadata() {
    return pageMetadata({
        title: `Price of Building Materials in Nigeria (${YEAR}) | Artemis`,
        description: `Current cement, iron rod (rebar), granite, sharp sand, aggregate and ready-mix concrete prices in Nigeria, updated as they change, with history.`,
        path: PATH,
        image: '/5.jpg',
        imageAlt: 'Building materials on site',
    })
}

function fmtDay(ymd) {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const FAQS = [
    { q: 'What is the price of cement in Nigeria today?', a: 'See the cement row in the table above: it shows the latest price per 50kg bag in Lagos and the date it was checked. Prices vary by brand (Dangote, BUA, Lafarge), supplier and quantity.' },
    { q: 'What is the price of iron rods (rebar) in Nigeria?', a: 'The table shows the current price per tonne of 12mm high-yield rebar in Lagos. Thicker rods cost more per piece; price per tonne is the fairest comparison.' },
    { q: 'Why do building material prices in Nigeria change so often?', a: 'Cement, rebar and many finishes depend on imported inputs and fuel, so they move with the exchange rate, diesel prices and transport costs.' },
    { q: 'How are these prices collected?', a: 'Our system gathers prices from public market sources each day; an Artemis Atelier staff member checks every change before it is published. Each price links to its source.' },
]

export default async function MaterialPricesPage() {
    const [board, history] = await Promise.all([getPriceBoard(), getPriceHistory('Lagos')])

    // Price history: one row per material, newest first, Lagos
    const byItem = MATERIALS.map(m => ({
        ...m,
        rows: history.filter(h => h.item_key === m.key).slice(-12).reverse(),
    })).filter(m => m.rows.length)

    return (
        <>
            <JsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'Dataset',
                name: `Building material prices in Nigeria (${YEAR})`,
                description: 'Indicative prices of cement, rebar, granite, sharp sand, aggregate and ready-mix concrete in Lagos, Abuja and Port Harcourt, with dates and sources.',
                url: absoluteUrl(PATH),
                creator: { '@id': ORG_ID },
                ...(board.lastUpdated ? { dateModified: board.lastUpdated } : {}),
                spatialCoverage: 'Nigeria',
                isAccessibleForFree: true,
            }} />
            <Navigation />
            <main className="pt-[72px]">
                <header className="bg-[#111] text-white">
                    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
                        <Breadcrumbs items={[{ name: 'News', path: '/news-events' }, { name: 'Material prices', path: PATH }]} light />
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Price tracker{board.lastUpdated ? ` · updated ${fmtDay(board.lastUpdated)}` : ''}</p>
                        <h1 className="max-w-3xl text-[38px] leading-[1.08] md:text-[54px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Price of building materials in Nigeria ({YEAR})</h1>
                        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75">
                            Current prices for cement, iron rods, granite, sand, aggregate and ready-mix concrete, checked by our team before they go live, with the date and source for every figure.
                        </p>
                    </div>
                </header>

                <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0">
                        <h2 className="mb-5 text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Current prices</h2>
                        <PriceBoardTable board={board} />

                        {byItem.length > 0 && (
                            <>
                                <h2 className="mb-5 mt-14 text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Price history in Lagos</h2>
                                <div className="space-y-8">
                                    {byItem.map(m => (
                                        <section key={m.key} aria-labelledby={`hist-${m.key}`}>
                                            <h3 id={`hist-${m.key}`} className="mb-2 text-[16px] font-semibold text-[#1a1a1a]">{m.name} <span className="font-normal text-[#8a8a8a]">({m.spec})</span></h3>
                                            <div className="overflow-x-auto border border-[#e6e6e6]">
                                                <table className="w-full text-[14px]">
                                                    <thead><tr className="bg-[#f6f5f2]"><th scope="col" className="px-4 py-2 text-left text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b]">Date</th><th scope="col" className="px-4 py-2 text-left text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b]">Price</th><th scope="col" className="px-4 py-2 text-left text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b]">Change</th></tr></thead>
                                                    <tbody>
                                                        {m.rows.map((r, i) => {
                                                            const prev = m.rows[i + 1]
                                                            const pct = prev ? ((midpoint(r) - midpoint(prev)) / midpoint(prev)) * 100 : null
                                                            return (
                                                                <tr key={`${r.effective_date}-${i}`} className="border-t border-[#efefef]">
                                                                    <td className="px-4 py-2 whitespace-nowrap">{fmtDay(r.effective_date)}</td>
                                                                    <td className="px-4 py-2 tabular-nums whitespace-nowrap">{formatRange(Number(r.price_min), r.price_max != null ? Number(r.price_max) : null)} /{m.unit}</td>
                                                                    <td className={`px-4 py-2 tabular-nums ${pct > 0 ? 'text-[#c8102e]' : pct < 0 ? 'text-[#067a64]' : 'text-[#9a9a9a]'}`}>{pct == null || Math.abs(pct) < 0.05 ? '—' : `${pct > 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}%`}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            </>
                        )}

                        <h2 className="mb-4 mt-14 text-[28px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>What these prices mean for your build</h2>
                        <p className="mb-4 text-[16px] leading-[1.75] text-[#333]">
                            Materials are roughly half of a building budget. A 4-bedroom duplex uses several hundred bags of cement and several tonnes of rebar, so a 10% move in either changes your budget noticeably. See our <Link href="/guides/cost-of-building-a-house-in-nigeria" className="underline">2026 building cost guide</Link> for whole-house figures, and the <Link href="/guides/cost-of-building-a-duplex-in-nigeria" className="underline">duplex</Link> and <Link href="/guides/cost-of-building-a-bungalow-in-nigeria" className="underline">bungalow</Link> breakdowns.
                        </p>

                        <div className="mt-14"><Faq faqs={FAQS} title="Material price questions" /></div>
                    </div>

                    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                        <div className="border border-[#e6e6e6] p-6">
                            <p className="mb-2 text-[22px] leading-tight text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Monthly price update</p>
                            <p className="mb-4 text-[14px] leading-relaxed text-[#555]">One email a month with the prices that moved and what it means for builds in progress.</p>
                            <SubscribeForm list="material-prices" button="Subscribe" note="No spam. Unsubscribe any time. See our privacy policy." />
                        </div>
                        <ConsultCard title="Price your build" text="Get an open-book BOQ for your drawings at today’s prices." primary={{ label: 'Get a BOQ estimate', href: '/build-from-abroad#book' }} />
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    )
}
