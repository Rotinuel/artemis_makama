'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const CARD_HEIGHT = 420

const ArrowIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
)

function MemberCard({ person, cardState, onAdvance, isActive }) {
    return (
        <div
            onClick={onAdvance}
            style={{
                height: CARD_HEIGHT,
                width: cardState === 0 ? 100 : 280,
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s',
                flexShrink: 0,
                background: '#fff',
                borderRadius: 18,
                border: cardState === 0 && isActive ? '2px solid #1a1a1a' : '1px solid #e5e5e5',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: cardState > 0 ? '0 12px 36px rgba(0,0,0,0.10)' : 'none',
            }}
        >
            {/* STATE 0: COLLAPSED */}
            {cardState === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '16px 8px' }}>
                    <div style={{ width: 36, height: 36, background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ArrowIcon />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5, overflow: 'hidden', margin: '10px 0' }}>
                        <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 13, letterSpacing: '0.04em', color: '#1a1a1a', whiteSpace: 'nowrap', fontWeight: 600 }}>
                            {person.name}
                        </div>
                        <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: 10, color: '#9b9b9b', whiteSpace: 'nowrap', overflow: 'hidden', maxHeight: 80 }}>
                            {person.title}
                        </div>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e5e5', flexShrink: 0 }}>
                        <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            )}

            {/* STATE 1: EXPANDED PHOTO */}
            {cardState === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowIcon />
                        </div>
                    </div>
                    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', borderRadius: 12 }}>
                        <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                        <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)' }}>
                            <div style={{ minWidth: 0, flex: 1, marginRight: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: 11, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.name}</div>
                                <div style={{ fontSize: 10, color: '#6b6b6b', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.title}</div>
                            </div>
                            {person.studio && (
                                <span style={{ fontSize: 10, color: '#9b9b9b', flexShrink: 0 }}>{person.studio}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STATE 2: BIO */}
            {cardState === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 20 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.15, marginBottom: 4, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                        {person.name}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: 8 }}>
                        {person.title}
                    </div>
                    <div style={{ width: 28, height: 1, background: '#1a1a1a', marginBottom: 14 }} />
                    <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.7, flex: 1, overflowY: 'auto', whiteSpace: 'pre-line', paddingRight: 4 }}>
                        {person.bio || `${person.name} is a senior leader at AAL with expertise in ${person.title.toLowerCase()}.`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid #f0f0f0' }}>
                        {person.studio && (
                            <span style={{ fontSize: 10, color: '#9b9b9b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{person.studio}</span>
                        )}
                        <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '1px solid #e5e5e5', marginLeft: 'auto' }}>
                            <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function LeadershipSection({ leaders = [] }) {
    const gridRef   = useRef(null)
    const cardRefs  = useRef([])
    const [activeDash, setActiveDash] = useState(0)
    const [openId,     setOpenId]     = useState(null)
    const [openStep,   setOpenStep]   = useState(0)

    const handleAdvance = (id) => {
        if (openId !== id) {
            setOpenId(id); setOpenStep(1); setActiveDash(id)
        } else if (openStep === 1) {
            setOpenStep(2)
        } else {
            setOpenId(null); setOpenStep(0)
        }
    }

    const getCardState = (id) => (openId !== id ? 0 : openStep)

    const updateDashes = () => {
        const container = gridRef.current
        if (!container || openId !== null) return
        const center = container.scrollLeft + container.clientWidth / 2
        let closestIdx = 0, closestDist = Infinity
        cardRefs.current.forEach((card, i) => {
            if (!card) return
            const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
            if (dist < closestDist) { closestDist = dist; closestIdx = i }
        })
        setActiveDash(closestIdx)
    }

    const scrollToCard = (i) => {
        const container = gridRef.current
        const card = cardRefs.current[i]
        if (!container || !card) return
        container.scrollTo({ left: card.offsetLeft - container.clientWidth / 2 + card.offsetWidth / 2, behavior: 'smooth' })
        setActiveDash(i)
    }

    if (!leaders.length) return null

    return (
        <div className="border-t border-[#1a1a1a] pt-8 mt-0">
            {/* Header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-[#6b6b6b] mb-2 font-medium">Our People</p>
                    <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a] leading-none">Leadership</h2>
                </div>
                <Link
                    href="/people/leadership"
                    className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] hover:opacity-50 transition-opacity pb-1"
                >
                    See All <span className="text-[16px] leading-none">→</span>
                </Link>
            </div>

            {/* Scrollable cards */}
            <div
                ref={gridRef}
                onScroll={updateDashes}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'flex-end',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: 8,
                }}
            >
                {leaders.map((person, i) => (
                    <div
                        key={person.id || i}
                        ref={el => { cardRefs.current[i] = el }}
                        style={{ flexShrink: 0 }}
                    >
                        <MemberCard
                            person={person}
                            cardState={getCardState(person.id || i)}
                            onAdvance={() => handleAdvance(person.id || i)}
                            isActive={activeDash === (person.id || i)}
                        />
                    </div>
                ))}
            </div>

            {/* Dash indicator */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 16 }}>
                {leaders.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => scrollToCard(i)}
                        style={{
                            height: 3,
                            borderRadius: 4,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            flex: activeDash === i ? 2 : 1,
                            background: activeDash === i ? '#1a1a1a' : '#e5e5e5',
                        }}
                    />
                ))}
            </div>

            {/* Mobile see all */}
            <div className="mt-6 md:hidden">
                <Link href="/people/leadership" className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5">
                    See All →
                </Link>
            </div>
        </div>
    )
}