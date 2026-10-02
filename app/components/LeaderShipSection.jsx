'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

/*
 * "Our People" — scroll-driven showcase.
 * When the section reaches the top of the screen it pins in place; scrolling
 * down the page steps through each person (photo + bio), and the dash bar
 * follows whoever is showing. After the last person the page scrolls on.
 */

const NAV_HEIGHT = 72     // fixed top navigation
const STEP_VH = 60        // page scroll (in vh) spent on each person
const CARD_HEIGHT = 420

const ArrowIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
)

function initials(name = '') {
    return name
        .replace(/\b(Chief|Dr|Mr|Mrs|Ms|Engr|Arc|MBA|OON|ESQ|MNSE|COREN)\b\.?/gi, '')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase()
}

function Portrait({ person, size = 'full' }) {
    if (person.image) {
        return <img src={person.image} alt={person.name} className="ls-img" />
    }
    return (
        <div className={`ls-placeholder ${size}`} aria-hidden="true">
            <span>{initials(person.name)}</span>
        </div>
    )
}

function CollapsedCard({ person, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`ls-card collapsed${active ? ' is-active' : ''}`}
            aria-label={`Show ${person.name}`}
        >
            <span className="ls-arrow"><ArrowIcon /></span>
            <span className="ls-vertical">
                <span className="ls-vname">{person.name}</span>
                <span className="ls-vtitle">{person.title}</span>
            </span>
            <span className="ls-avatar"><Portrait person={person} size="small" /></span>
        </button>
    )
}

function OpenCard({ person, index, total }) {
    const bio = person.bio || ''
    return (
        <article className="ls-card open" aria-live="polite">
            <div className="ls-photo">
                <Portrait person={person} />
                <span className="ls-count">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            </div>
            <div className="ls-bio">
                <h3 className="ls-name">{person.name}</h3>
                <p className="ls-title">{person.title}</p>
                <div className="ls-rule" />
                {bio && <p className="ls-text">{bio}</p>}
            </div>
        </article>
    )
}

export default function LeadershipSection({ leaders = [] }) {
    const outerRef = useRef(null)
    const rowRef = useRef(null)
    const cardRefs = useRef([])
    const [active, setActive] = useState(0)
    const total = leaders.length

    // Map page scroll → active person
    useEffect(() => {
        if (!total) return
        let frame = 0
        const update = () => {
            frame = 0
            const el = outerRef.current
            if (!el) return
            const step = (window.innerHeight * STEP_VH) / 100
            const travelled = NAV_HEIGHT - el.getBoundingClientRect().top
            const idx = Math.min(total - 1, Math.max(0, Math.floor(travelled / step)))
            setActive(prev => (prev === idx ? prev : idx))
        }
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [total])

    // Keep the active card centred in the (horizontal) row
    useEffect(() => {
        const row = rowRef.current
        const card = cardRefs.current[active]
        if (!row || !card) return
        const t = setTimeout(() => {
            const left = card.offsetLeft - row.clientWidth / 2 + card.offsetWidth / 2
            row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
        }, 60) // after the width transition starts
        return () => clearTimeout(t)
    }, [active])

    // Clicking a card or dash scrolls the page to that person's position
    const goTo = useCallback(i => {
        const el = outerRef.current
        if (!el) return
        const step = (window.innerHeight * STEP_VH) / 100
        const top = window.scrollY + el.getBoundingClientRect().top - NAV_HEIGHT + i * step + step * 0.5
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    }, [])

    if (!total) return null

    return (
        <div
            ref={outerRef}
            className="ls-outer"
            style={{ height: `calc(100vh - ${NAV_HEIGHT}px + ${total * STEP_VH}vh)` }}
        >
            <style>{styles}</style>

            <div className="ls-sticky" style={{ top: NAV_HEIGHT, height: `calc(100vh - ${NAV_HEIGHT}px)` }}>
                <div className="border-t border-[#1a1a1a] pt-8 w-full">
                    {/* Header */}
                    <div className="flex items-end justify-between mb-8 gap-4">
                        <div>
                            <p className="text-[11px] tracking-[0.18em] uppercase text-[#6b6b6b] mb-2 font-medium">Our People</p>
                            <h2 className="text-[28px] md:text-[36px] text-[#1a1a1a] leading-none">Leadership</h2>
                        </div>
                        <p className="text-[11px] tracking-[0.12em] uppercase text-[#6b6b6b] pb-1 tabular-nums">
                            {active < total - 1 ? 'Scroll to meet the team ↓' : 'That’s the team'}
                        </p>
                    </div>

                    {/* Cards */}
                    <div ref={rowRef} className="ls-row">
                        {leaders.map((person, i) => (
                            <div key={person.id || i} ref={el => { cardRefs.current[i] = el }} className="ls-slot">
                                {i === active
                                    ? <OpenCard person={person} index={i} total={total} />
                                    : <CollapsedCard person={person} active={false} onClick={() => goTo(i)} />}
                            </div>
                        ))}
                    </div>

                    {/* Dash indicator — follows the person on screen */}
                    <div className="ls-dashes" role="tablist" aria-label="Team members">
                        {leaders.map((p, i) => (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={i === active}
                                aria-label={p.name}
                                onClick={() => goTo(i)}
                                className={`ls-dash${i === active ? ' on' : i < active ? ' done' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = `
.ls-outer { position: relative; }
.ls-sticky {
    position: sticky;
    display: flex; align-items: center;
    overflow: hidden;
}
.ls-row {
    display: flex; gap: 10px; align-items: flex-end;
    overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
}
.ls-row::-webkit-scrollbar { display: none; }
.ls-slot { flex-shrink: 0; }

.ls-card {
    height: ${CARD_HEIGHT}px; border-radius: 18px; background: #fff; overflow: hidden;
    transition: width 0.55s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s;
}
.ls-card.collapsed {
    width: 100px; border: 1px solid #e5e5e5; cursor: pointer; padding: 16px 8px;
    display: flex; flex-direction: column; align-items: center; font: inherit; text-align: left;
}
.ls-card.collapsed:hover { border-color: #1a1a1a; }
.ls-card.collapsed:focus-visible { outline: 2px solid #08b796; outline-offset: 2px; }
.ls-arrow {
    width: 36px; height: 36px; border-radius: 50%; background: #1a1a1a; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
}
.ls-vertical { flex: 1; display: flex; align-items: flex-end; justify-content: center; gap: 5px; overflow: hidden; margin: 10px 0; }
.ls-vname, .ls-vtitle { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }
.ls-vname { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; letter-spacing: 0.04em; color: #1a1a1a; font-weight: 600; }
.ls-vtitle { font-size: 10px; color: #9b9b9b; overflow: hidden; max-height: 110px; }
.ls-avatar { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid #e5e5e5; flex-shrink: 0; }

.ls-card.open {
    width: min(620px, calc(100vw - 48px));
    border: 2px solid #1a1a1a;
    box-shadow: 0 16px 44px rgba(0,0,0,0.12);
    display: grid; grid-template-columns: 42% 1fr;
    animation: lsIn 0.5s ease both;
}
@keyframes lsIn { from { opacity: 0.4; } to { opacity: 1; } }
.ls-photo { position: relative; margin: 10px; border-radius: 12px; overflow: hidden; background: #1a1a1a; }
.ls-count {
    position: absolute; left: 10px; bottom: 10px; font-size: 10px; letter-spacing: 0.14em;
    color: #fff; background: rgba(0,0,0,0.45); padding: 4px 8px; border-radius: 20px; font-variant-numeric: tabular-nums;
}
.ls-img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.ls-placeholder {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(145deg, #1a1a1a 0%, #0d3b33 100%);
}
.ls-placeholder span { color: #08b796; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 56px; letter-spacing: 0.04em; }
.ls-placeholder.small span { font-size: 15px; font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 600; }
.ls-bio { display: flex; flex-direction: column; padding: 22px 22px 20px 12px; min-height: 0; }
.ls-name { font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.15; margin: 0 0 6px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
.ls-title { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #08b796; margin: 0 0 10px; }
.ls-rule { width: 28px; height: 1px; background: #1a1a1a; margin-bottom: 14px; flex-shrink: 0; }
.ls-text { font-size: 12px; color: #4b5563; line-height: 1.75; margin: 0; overflow-y: auto; flex: 1; padding-right: 4px; white-space: pre-line; }

@media (max-width: 640px) {
    .ls-card.open { grid-template-columns: 1fr; grid-template-rows: 46% 1fr; }
    .ls-bio { padding: 6px 16px 16px; }
    .ls-placeholder span { font-size: 44px; }
}

.ls-dashes { display: flex; gap: 6px; align-items: center; margin-top: 16px; }
.ls-dash {
    height: 3px; border-radius: 4px; border: 0; padding: 0; cursor: pointer; flex: 1;
    background: #e5e5e5; transition: flex 0.4s ease, background 0.4s ease;
}
.ls-dash.done { background: #9b9b9b; }
.ls-dash.on { flex: 2.5; background: #08b796; }
.ls-dash:focus-visible { outline: 2px solid #08b796; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
    .ls-card, .ls-dash { transition: none; }
    .ls-card.open { animation: none; }
}
`
