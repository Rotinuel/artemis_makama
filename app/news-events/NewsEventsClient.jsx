'use client'

import { useState } from 'react'
import Link from 'next/link'

const FILTERS = ['All', 'Firm News', 'Project News', 'Media Coverage', 'Award', 'Event']

export default function NewsEventsClient({ newsItems, events }) {
    const [activeFilter, setActiveFilter] = useState('All')

    const filtered = activeFilter === 'All'
        ? newsItems
        : newsItems.filter(item => item.type === activeFilter)

    const featured  = filtered[0]
    const remaining = filtered.slice(1)

    return (
        <>
            {/* Filter bar */}
            <div className="border-b border-[#e0e0e0] px-6 md:px-10 sticky top-[72px] bg-white z-10">
                <div className="max-w-[1600px] mx-auto flex gap-0 overflow-x-auto">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`text-[12px] tracking-wide py-4 px-4 border-b-2 flex-shrink-0 transition-colors ${
                                activeFilter === f
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

                    {/* ── Main news ── */}
                    <div className="lg:col-span-2">
                        <h2 className="text-[22px] font-light text-[#1a1a1a] mb-8 border-b border-[#e0e0e0] pb-4">
                            News
                        </h2>

                        {newsItems.length === 0 && (
                            <p className="text-[14px] text-[#6b6b6b] py-8">No news items yet.</p>
                        )}

                        {filtered.length === 0 && newsItems.length > 0 && (
                            <p className="text-[14px] text-[#6b6b6b] py-8">No items in this category.</p>
                        )}

                        {/* Featured first item */}
                        {featured && (
                            <Link href={featured.href || '#'} className="block group mb-10">
                                {featured.image && (
                                    <div className="overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
                                        <img
                                            src={featured.image}
                                            alt={featured.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] tracking-[0.12em] uppercase text-[#6b6b6b] font-medium">
                    {featured.type}
                  </span>
                                    <span className="text-[#ddd]">·</span>
                                    <span className="text-[12px] text-[#6b6b6b]">{featured.date}</span>
                                </div>
                                <h3 className="text-[20px] font-light text-[#1a1a1a] leading-snug group-hover:opacity-60 transition-opacity">
                                    {featured.title}
                                </h3>
                            </Link>
                        )}

                        {/* Remaining list */}
                        {remaining.length > 0 && (
                            <ul>
                                {remaining.map(item => (
                                    <li key={item.id} className="border-b border-[#e0e0e0] last:border-b-0">
                                        <Link href={item.href || '#'} className="flex gap-5 py-5 group">
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
                                                <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] tracking-[0.1em] uppercase text-[#6b6b6b] font-medium">
                            {item.type}
                          </span>
                                                    <span className="text-[#ddd]">·</span>
                                                    <span className="text-[11px] text-[#6b6b6b]">{item.date}</span>
                                                </div>
                                                <p className="text-[14px] text-[#1a1a1a] font-light leading-snug group-hover:opacity-60 transition-opacity">
                                                    {item.title}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div>
                        {/* Upcoming Events */}
                        <h2 className="text-[22px] font-light text-[#1a1a1a] mb-8 border-b border-[#e0e0e0] pb-4">
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
                            <p className="text-[13px] text-[#6b6b6b] leading-relaxed mb-4 font-light">
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