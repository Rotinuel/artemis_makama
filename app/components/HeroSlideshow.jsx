'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

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
                <div>
                    <p className="hs-eyebrow">Our work</p>
                    <h2 className="hs-title">
                        Artemis Atelier Ltd designs buildings and spaces that respond to the needs of people and the environment
                    </h2>
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
                    background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.65) 100%);
                }
                .hs-bottom {
                    position: absolute; left: 0; right: 0; bottom: 0; z-index: 5;
                    padding: 0 40px 40px; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px;
                }
                .hs-eyebrow {
                    color: #fff; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
                    margin: 0 0 10px; opacity: 0.85; font-family: sans-serif;
                }
                .hs-title {
                    color: #fff; font-size: clamp(16px, 2vw, 22px); font-weight: 300; line-height: 1.45; max-width: 420px;
                    font-family: 'Helvetica Neue', Helvetica, sans-serif; margin: 0;
                }
                .hs-controls { width: min(320px, 40vw); flex-shrink: 0; }
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
                    .hs-bottom { flex-direction: column; align-items: stretch; padding: 0 20px 28px; gap: 20px; }
                    .hs-controls { width: 100%; }
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
