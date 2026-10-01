'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { whatsappLink } from '@/lib/site'

/*
 * Home page hero — full-screen slideshow of Artemis Atelier's own work:
 * design visuals alongside photos of completed buildings.
 * Photo guideline (international audience): no bamboo/stick scaffolding,
 * no workers without proper clothing/PPE.
 * Add/remove slides in SLIDES below; files live in /public.
 */
const SLIDES = [
    { src: '/31.jpg', stage: 'Design · Residential development, Arepo', alt: 'Design visual of a residential development at Arepo' },
    { src: '/5.jpg', stage: 'On site · Blockwork materials', alt: 'Sandcrete blocks curing on site' },
    { src: '/33.jpg', stage: 'Design · Residential development, Opic', alt: 'Design visual of a residential development at Opic' },
    { src: '/100.jpeg', stage: 'Completed · Private residence', alt: 'Completed home with paved courtyard' },
    { src: '/36.jpg', stage: 'Design · Catholic Church complex, Epe', alt: 'Design visual of a church complex at Epe' },
    { src: '/101-hero.jpeg', stage: 'Completed · Gate and boundary works', alt: 'Completed residence with gate and boundary wall' },
]

const INTERVAL = 5500

export default function HeroSlideshow() {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const [reduced, setReduced] = useState(false)
    const count = SLIDES.length

    useEffect(() => {
        const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
        setReduced(!!mq?.matches)
    }, [])

    useEffect(() => {
        if (paused || reduced) return
        const t = setTimeout(() => {
            if (document.visibilityState === 'visible') setIndex(i => (i + 1) % count)
        }, INTERVAL)
        return () => clearTimeout(t)
    }, [index, paused, reduced, count])

    const go = useCallback(i => setIndex((i + count) % count), [count])

    return (
        <section
            className="hs-root"
            aria-roledescription="carousel"
            aria-label="Our work"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slides (only current, previous and next are mounted with images) */}
            {SLIDES.map((s, i) => {
                const near = i === index || i === (index + 1) % count || i === (index - 1 + count) % count
                return (
                    <div key={s.src} className={`hs-slide${i === index ? ' on' : ''}`} aria-hidden={i !== index}>
                        {near && (
                            <Image
                                src={s.src}
                                alt={s.alt}
                                fill
                                sizes="100vw"
                                quality={78}
                                priority={i === 0}
                                className="hs-img"
                            />
                        )}
                    </div>
                )
            })}

            {/* Gradient overlay */}
            <div className="hs-shade" />

            {/* Bottom content */}
            <div className="hs-bottom">
                <div className="hs-copy">
                    <p className="hs-eyebrow">Design · Build · Renovate — Lagos</p>
                    <h1 className="hs-h1">Build your home in Nigeria. <span className="hs-line">Watch every block go in.</span></h1>
                    <p className="hs-sub">
                        Artemis Atelier designs, builds and renovates homes and commercial spaces in Lagos for clients at home
                        and abroad. You see the site live, approve every cost, and pay only when each stage has been
                        independently checked.
                    </p>
                    <div className="hs-ctas">
                        <Link href="/contact" className="hs-btn primary">Book a free consultation</Link>
                        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hs-btn ghost">
                            Chat with us on WhatsApp
                        </a>
                    </div>
                    <p className="hs-trust">
                        <span>Since 2010</span><span>COREN-registered engineer</span><span>Insured</span><span>Live site cameras</span>
                    </p>
                    <Link href="/diaspora-consultation" className="hs-abroad">Living abroad? See how we build for you →</Link>
                </div>

                <div className="hs-controls">
                    <p className="hs-stage" aria-live="polite">
                        <span className="hs-count">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
                        {SLIDES[index].stage}
                    </p>
                    <div className="hs-bars">
                        {SLIDES.map((s, i) => (
                            <button
                                key={s.src}
                                type="button"
                                onClick={() => go(i)}
                                aria-label={`Show photo ${i + 1}: ${s.stage}`}
                                aria-current={i === index}
                                className="hs-bar"
                            >
                                <span
                                    key={i === index ? `on-${index}` : 'off'}
                                    className={`hs-fill${i < index ? ' done' : ''}${i === index ? (paused || reduced ? ' hold' : ' run') : ''}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="hs-scroll" aria-hidden="true">
                <div />
            </div>

            <style>{`
                .hs-root { position: relative; width: 100%; height: 100vh; min-height: 500px; background: #111; overflow: hidden; }
                .hs-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.4s ease; }
                .hs-slide.on { opacity: 1; z-index: 1; }
                .hs-img { object-fit: cover; transform: scale(1.03); }
                .hs-slide.on .hs-img { animation: hsZoom ${INTERVAL + 1800}ms ease-out both; }
                @keyframes hsZoom { from { transform: scale(1.14); } to { transform: scale(1.03); } }

                .hs-shade {
                    position: absolute; inset: 0; z-index: 2; pointer-events: none;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.78) 100%);
                }
                .hs-bottom {
                    position: absolute; left: 0; right: 0; bottom: 0; z-index: 5;
                    padding: 0 40px 40px; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px;
                }
                .hs-eyebrow {
                    color: #fff; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
                    margin: 0 0 10px; opacity: 0.85; font-family: sans-serif;
                }
                .hs-copy { max-width: 620px; }
                .hs-line { display: block; }
                .hs-h1 {
                    color: #fff; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400;
                    font-size: clamp(30px, 3.6vw, 52px); line-height: 1.05; letter-spacing: -0.01em; margin: 0 0 14px;
                    text-shadow: 0 2px 18px rgba(0,0,0,0.35);
                }
                .hs-sub {
                    color: rgba(255,255,255,0.88); font-family: 'Helvetica Neue', Helvetica, sans-serif; font-weight: 300;
                    font-size: clamp(14px, 1.15vw, 16px); line-height: 1.6; margin: 0 0 20px; max-width: 560px;
                }
                .hs-ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
                .hs-btn {
                    display: inline-flex; align-items: center; height: 46px; padding: 0 22px; border-radius: 999px;
                    font-family: 'Helvetica Neue', Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;
                    text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s;
                }
                .hs-btn.primary { background: #08b796; color: #04120f; }
                .hs-btn.primary:hover { background: #fff; }
                .hs-btn.ghost { border: 1px solid rgba(255,255,255,0.6); color: #fff; }
                .hs-btn.ghost:hover { background: rgba(255,255,255,0.12); border-color: #fff; }
                .hs-trust {
                    display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0 0 10px; color: rgba(255,255,255,0.8);
                    font-family: 'Helvetica Neue', Helvetica, sans-serif; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
                }
                .hs-trust span::before { content: '✓'; color: #08b796; margin-right: 6px; }
                .hs-abroad {
                    color: #fff; font-family: 'Helvetica Neue', Helvetica, sans-serif; font-size: 13px; text-decoration: none;
                    border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 2px;
                }
                .hs-abroad:hover { border-bottom-color: #08b796; color: #08b796; }
                /* Desktop: the big centred menu sits mid-screen, so keep this block
                   compact on shorter screens to avoid overlapping it */
                @media (min-width: 769px) and (max-height: 879px) {
                    .hs-eyebrow, .hs-sub { display: none; }
                }
                .hs-controls { width: min(320px, 40vw); flex-shrink: 0; margin-bottom: 76px; } /* clear the WhatsApp button */
                .hs-stage {
                    color: #fff; font-size: 12px; letter-spacing: 0.06em; margin: 0 0 10px; text-align: right;
                    font-family: 'Helvetica Neue', Helvetica, sans-serif; opacity: 0.9;
                }
                .hs-count { color: #08b796; margin-right: 10px; font-variant-numeric: tabular-nums; letter-spacing: 0.12em; }
                .hs-bars { display: flex; gap: 6px; }
                .hs-bar { position: relative; flex: 1; height: 14px; padding: 0; border: 0; background: none; cursor: pointer; }
                .hs-bar::after, .hs-fill {
                    position: absolute; left: 0; top: 50%; height: 2px; margin-top: -1px; border-radius: 2px;
                }
                .hs-bar::after { content: ''; right: 0; background: rgba(255,255,255,0.3); }
                .hs-fill { z-index: 1; width: 0; background: #fff; }
                .hs-fill.done { width: 100%; }
                .hs-fill.hold { width: 100%; background: #08b796; }
                .hs-fill.run { background: #08b796; animation: hsFill ${INTERVAL}ms linear both; }
                @keyframes hsFill { from { width: 0; } to { width: 100%; } }

                .hs-scroll { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); z-index: 5; opacity: 0.5; }
                .hs-scroll > div { width: 1px; height: 48px; background: #fff; animation: scrollDown 2s infinite; }
                @keyframes scrollDown {
                    0%   { transform: scaleY(0); transform-origin: top; }
                    49%  { transform: scaleY(1); transform-origin: top; }
                    51%  { transform: scaleY(1); transform-origin: bottom; }
                    100% { transform: scaleY(0); transform-origin: bottom; }
                }
                @media (max-width: 768px) {
                    .hs-scroll { display: none; }
                    .hs-bottom { flex-direction: column; align-items: stretch; padding: 0 20px 88px; gap: 18px; }
                    .hs-controls { width: 100%; margin-bottom: 0; }
                    .hs-btn { height: 42px; padding: 0 16px; font-size: 12px; }
                    .hs-sub { font-size: 14px; margin-bottom: 16px; }
                    .hs-stage { text-align: left; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .hs-slide { transition: none; }
                    .hs-slide.on .hs-img { animation: none; }
                }
            `}</style>
        </section>
    )
}
