'use client'

import { useState } from 'react'
import Link from 'next/link'
import MaterialPrices from './MaterialPrices'

const BASE_FILTERS = ['All', 'Firm News', 'Project News', 'Media Coverage', 'Award', 'Event']
const INDUSTRY = 'Industry News'

// `feed` arrives already merged + sorted newest-first (see lib/news-feed.js)
export default function NewsEventsClient({ feed = [], events, prices }) {
    const [activeFilter, setActiveFilter] = useState('All')
    const hasIndustry = feed.some(i => i.kind === 'industry')
    const filters = hasIndustry ? [...BASE_FILTERS, INDUSTRY] : BASE_FILTERS

    const filtered = activeFilter === 'All' ? feed
        : activeFilter === INDUSTRY ? feed.filter(i => i.kind === 'industry')
            : feed.filter(i => i.kind === 'firm' && i.label === activeFilter)

    const featured = filtered[0]
    const remaining = filtered.slice(1)

    return (
        <>
            {/* Filter bar */}
            <div className="border-b border-[#e0e0e0] px-6 md:px-10 sticky top-[72px] bg-white z-10">
                <div className="max-w-[1600px] mx-auto flex gap-0 overflow-x-auto">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`text-[12px] tracking-wide py-4 px-4 border-b-2 flex-shrink-0 transition-colors ${activeFilter === f
                                    ? 'border-[#1a1a1a] text-[#1a1a1a] font-medium'
                                    : 'border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 md:px-10 py-16 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* ── Main news (newest first, firm + industry together) ── */}
                    <div className="lg:col-span-2">
                        <h2 className="text-[22px]  text-[#1a1a1a] mb-8 border-b border-[#e0e0e0] pb-4">
                            News
                        </h2>

                        {feed.length === 0 && (
                            <p className="text-[14px] text-[#6b6b6b] py-8">No news items yet.</p>
                        )}

                        {filtered.length === 0 && feed.length > 0 && (
                            <p className="text-[14px] text-[#6b6b6b] py-8">No items in this category.</p>
                        )}

                        {/* Featured (newest) item */}
                        {featured && (
                            <ItemLink item={featured} className="block group mb-10">
                                {featured.image && (
                                    <div className="overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
                                        <img
                                            src={featured.image}
                                            alt={featured.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <Meta item={featured} />
                                <h3 className="text-[20px]  text-[#1a1a1a] leading-snug group-hover:opacity-60 transition-opacity">
                                    {featured.title}
                                </h3>
                                {featured.summary && (
                                    <p className="text-[14px] text-[#6b6b6b] leading-relaxed mt-2">{featured.summary}</p>
                                )}
                                {featured.kind === 'industry' && <ReadOn item={featured} />}
                            </ItemLink>
                        )}

                        {/* Remaining list */}
                        {remaining.length > 0 && (
                            <ul>
                                {remaining.map(item => (
                                    <li key={item.key} className="border-b border-[#e0e0e0] last:border-b-0">
                                        <ItemLink item={item} className="flex gap-5 py-5 group">
                                            {item.image && (
                                                <div className="flex-shrink-0 w-24 h-16 overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <Meta item={item} small />
                                                <p className="text-[14px] text-[#1a1a1a]  leading-snug group-hover:opacity-60 transition-opacity">
                                                    {item.title}
                                                </p>
                                                {item.kind === 'industry' && item.summary && (
                                                    <p className="text-[13px] text-[#6b6b6b] leading-relaxed mt-1">{item.summary}</p>
                                                )}
                                                {item.kind === 'industry' && <ReadOn item={item} />}
                                            </div>
                                        </ItemLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div>
                        {/* Building material prices */}
                        <MaterialPrices board={prices?.board} lastUpdated={prices?.lastUpdated} />

                        {/* Upcoming Events */}
                        <h2 className="text-[22px]  text-[#1a1a1a] mb-8 border-b border-[#e0e0e0] pb-4">
                            Upcoming Events
                        </h2>

                        {events.length === 0 ? (
                            <p className="text-[14px] text-[#6b6b6b] mb-8">No upcoming events.</p>
                        ) : (
                            <ul className="space-y-6 mb-12">
                                {events.map(event => (
                                    <li key={event.id} className="border-b border-[#f0f0f0] pb-6 last:border-b-0 last:pb-0">
                                        <Link href={event.href || '#'} className="group block">
                                            <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium block mb-1">
                                                {event.type}
                                            </span>
                                            <p className="text-[14px] font-medium text-[#1a1a1a] leading-snug mb-2 group-hover:opacity-60 transition-opacity">
                                                {event.title}
                                            </p>
                                            <p className="text-[12px] text-[#6b6b6b]">{event.date}</p>
                                            {event.location && (
                                                <p className="text-[12px] text-[#6b6b6b]">{event.location}</p>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Newsletter */}
                        <div className="bg-[#f5f5f5] p-6">
                            <h3 className="text-[16px] font-medium text-[#1a1a1a] mb-2">Stay Connected</h3>
                            <p className="text-[13px] text-[#6b6b6b] leading-relaxed mb-4 ">
                                Get the latest news and design insights delivered to your inbox.
                            </p>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full border border-[#e0e0e0] px-4 py-3 text-[13px] outline-none focus:border-[#1a1a1a] transition-colors mb-3 bg-white"
                            />
                            <button className="w-full bg-[#1a1a1a] text-white text-[12px] tracking-[0.1em] uppercase py-3 hover:bg-[#333] transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

function ItemLink({ item, className, children }) {
    if (item.external) {
        return (
            <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                {children}
            </a>
        )
    }
    return <Link href={item.href || '#'} className={className}>{children}</Link>
}

function Meta({ item, small = false }) {
    const isIndustry = item.kind === 'industry'
    return (
        <div className={`flex flex-wrap items-center gap-2 ${small ? 'mb-1' : 'mb-2'}`}>
            <span className={`text-[10px] tracking-[0.1em] uppercase font-medium ${isIndustry ? 'text-[#08b796]' : 'text-[#6b6b6b]'}`}>
                {item.label}
            </span>
            {item.date && (
                <>
                    <span className="text-[#ddd]">·</span>
                    <span className={`${small ? 'text-[11px]' : 'text-[12px]'} text-[#6b6b6b]`}>{item.date}</span>
                </>
            )}
            {isIndustry && item.source && (
                <>
                    <span className="text-[#ddd]">·</span>
                    <span className={`${small ? 'text-[11px]' : 'text-[12px]'} text-[#6b6b6b]`}>{item.source}</span>
                </>
            )}
        </div>
    )
}

function ReadOn({ item }) {
    return (
        <span className="inline-block text-[11px] tracking-[0.08em] uppercase text-[#1a1a1a] mt-3 border-b border-[#1a1a1a]/30 group-hover:border-[#1a1a1a] transition-colors">
            Read on {item.source} ↗
        </span>
    )
}
