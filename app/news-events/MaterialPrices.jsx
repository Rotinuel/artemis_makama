'use client'

import { useState } from 'react'
import { CITIES, formatRange } from '@/lib/material-prices/items'

function fmtDay(ymd) {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function Change({ pct }) {
    if (pct == null || Math.abs(pct) < 0.05) {
        return <span className="text-[11px] text-[#9a9a9a]" title="No change since last update">—</span>
    }
    const up = pct > 0
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${up ? 'text-[#c8102e]' : 'text-[#08b796]'}`}
            title={up ? 'Price went up since last update' : 'Price went down since last update'}
        >
            {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
        </span>
    )
}

/** Sidebar board of building-material prices (Lagos / Abuja / Port Harcourt) */
export default function MaterialPrices({ board, lastUpdated }) {
    // Only offer cities that actually have prices
    const cities = CITIES.filter(c => (board?.[c] || []).some(r => r.current))
    const [city, setCity] = useState(cities[0] || CITIES[0])
    const rows = board?.[city] || []
    if (!cities.length) return null

    return (
        <section className="mb-12" aria-labelledby="material-prices-heading">
            <div className="flex items-end justify-between gap-3 mb-4 border-b border-[#e0e0e0] pb-4">
                <h2 id="material-prices-heading" className="text-[22px] text-[#1a1a1a]">
                    Material Prices
                </h2>
                {lastUpdated && (
                    <span className="text-[10px] tracking-[0.12em] uppercase text-[#08b796] font-medium pb-1 whitespace-nowrap">
                        Updated {fmtDay(lastUpdated)}
                    </span>
                )}
            </div>

            {/* City tabs */}
            {cities.length > 1 && <div className="flex gap-1 mb-3" role="tablist" aria-label="City">
                {cities.map(c => (
                    <button
                        key={c}
                        role="tab"
                        aria-selected={city === c}
                        onClick={() => setCity(c)}
                        className={`text-[11px] tracking-[0.06em] px-3 py-1.5 border transition-colors ${city === c
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                            : 'border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>}

            <ul role="tabpanel" aria-label={`${city} prices`}>
                {rows.map(r => (
                    <li key={r.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#f0f0f0] last:border-b-0">
                        <div className="min-w-0">
                            <p className="text-[14px] text-[#1a1a1a] leading-snug">{r.name}</p>
                            <p className="text-[11px] text-[#9a9a9a] leading-snug mt-0.5">{r.spec}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            {r.current ? (
                                <>
                                    <p className="text-[14px] text-[#1a1a1a] font-medium tabular-nums whitespace-nowrap">
                                        {formatRange(Number(r.current.price_min), r.current.price_max != null ? Number(r.current.price_max) : null)}
                                    </p>
                                    <p className="flex items-center justify-end gap-2 mt-0.5">
                                        <Change pct={r.changePct} />
                                        <span className="text-[11px] text-[#9a9a9a]">/{r.unit}</span>
                                        {r.current.source_url && (
                                            <a
                                                href={r.current.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-[#9a9a9a] hover:text-[#1a1a1a]"
                                                title={`Source: ${r.current.source_name || r.current.source_url} · ${fmtDay(r.current.effective_date)}`}
                                                aria-label={`Source for ${r.name} price`}
                                            >
                                                ↗
                                            </a>
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="text-[12px] text-[#9a9a9a]">Not available</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <p className="text-[11px] text-[#9a9a9a] leading-relaxed mt-3">
                Indicative market prices from public sources, reviewed by Artemis Atelier. Actual prices vary
                by supplier, brand, quantity and delivery location — contact us for a project quote.{' '}
                <a href="/news/material-prices" className="underline text-[#1a1a1a]">Price history and monthly updates</a>
            </p>
        </section>
    )
}
