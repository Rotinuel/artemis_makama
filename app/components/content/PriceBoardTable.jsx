import Link from 'next/link'
import { CITIES, formatRange } from '@/lib/material-prices/items'

function fmtDay(ymd) {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** Current material prices as a table (cities with at least one price only) */
export default function PriceBoardTable({ board: data, compact = false }) {
    const board = data?.board || {}
    const cities = CITIES.filter(c => (board[c] || []).some(r => r.current))
    if (!cities.length) {
        return (
            <p className="mb-8 border border-dashed border-[#d9d9d9] p-4 text-[14px] text-[#6b6b6b]">
                Live material prices appear here once the first prices are approved in the admin. See{' '}
                <Link href="/news/material-prices" className="underline">building material prices</Link>.
            </p>
        )
    }
    const rows = board[cities[0]]
    return (
        <figure className="mb-8">
            <div className="overflow-x-auto border border-[#e6e6e6]">
                <table className="w-full border-collapse text-[14px]">
                    <caption className="sr-only">Current building material prices in {cities.join(', ')}</caption>
                    <thead>
                        <tr className="bg-[#f6f5f2]">
                            <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b] font-semibold">Material</th>
                            {cities.map(c => <th key={c} scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b] font-semibold whitespace-nowrap">{c}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((m, idx) => (
                            <tr key={m.key} className="border-t border-[#efefef] align-top">
                                <th scope="row" className="px-4 py-3 text-left font-medium text-[#1a1a1a]">
                                    {m.name}
                                    {!compact && <span className="block text-[12px] font-normal text-[#8a8a8a]">{m.spec}</span>}
                                </th>
                                {cities.map(c => {
                                    const r = board[c][idx]
                                    return (
                                        <td key={c} className="px-4 py-3 tabular-nums whitespace-nowrap text-[#333]">
                                            {r?.current
                                                ? <>{formatRange(Number(r.current.price_min), r.current.price_max != null ? Number(r.current.price_max) : null)}<span className="text-[12px] text-[#8a8a8a]"> /{r.unit}</span></>
                                                : <span className="text-[#aaa]">—</span>}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <figcaption className="mt-2 text-[12px] leading-relaxed text-[#8a8a8a]">
                {data?.lastUpdated && <>Prices last updated {fmtDay(data.lastUpdated)}. </>}
                Indicative market prices from public sources, checked by Artemis Atelier; actual prices vary by supplier, quantity and delivery. <Link href="/news/material-prices" className="underline">Full price tracker</Link>.
            </figcaption>
        </figure>
    )
}
