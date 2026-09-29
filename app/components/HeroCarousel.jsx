'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Full-width page banner with a cross-fading background carousel.
 * Same text layout as PageHero (label + description).
 *
 * slides: [{ src, alt }]
 */
export default function HeroCarousel({ label, title, description, slides = [], interval = 6000 }) {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const count = slides.length

    const go = useCallback(dir => setIndex(i => (i + dir + count) % count), [count])

    useEffect(() => {
        if (count < 2 || paused) return
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (reduce) return
        const t = setInterval(() => {
            if (document.visibilityState === 'visible') setIndex(i => (i + 1) % count)
        }, interval)
        return () => clearInterval(t)
    }, [count, paused, interval])

    return (
        <section
            className="relative w-full flex items-end overflow-hidden bg-[#111]"
            style={{ minHeight: 'clamp(420px, 52vh, 560px)', paddingTop: 64 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label={title}
        >
            <style>{`
                .hc-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.4s ease; }
                .hc-slide.on { opacity: 1; }
                .hc-slide img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.02); }
                .hc-slide.on img { animation: hcZoom ${Math.round(interval / 1000) + 2}s ease-out both; }
                @keyframes hcZoom { from { transform: scale(1.12); } to { transform: scale(1.02); } }
                @media (prefers-reduced-motion: reduce) {
                    .hc-slide { transition: none; }
                    .hc-slide.on img { animation: none; }
                }
            `}</style>

            {/* Slides */}
            {slides.map((s, i) => (
                <div key={s.src} className={`hc-slide${i === index ? ' on' : ''}`} aria-hidden={i !== index}>
                    <img
                        src={s.src}
                        alt={s.alt || ''}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        fetchPriority={i === 0 ? 'high' : 'auto'}
                        draggable="false"
                    />
                </div>
            ))}

            {/* Readability gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.15) 100%)' }}
            />

            {/* Text */}
            <div className="relative z-10 px-6 md:px-10 pb-14 pt-20 max-w-400 mx-auto w-full">
                {title && <h1 className="sr-only">{title}</h1>}
                {label && (
                    <p className="text-[36px] tracking-[0.14em] uppercase font-medium mb-3 text-[#08b796]">
                        {label}
                    </p>
                )}
                {description && (
                    <p className="text-[15px] md:text-[17px] leading-relaxed max-w-2xl text-white/85">
                        {description}
                    </p>
                )}
            </div>

            {/* Controls */}
            {count > 1 && (
                <div className="absolute z-10 right-6 md:right-10 bottom-6 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Show image ${i + 1} of ${count}`}
                                aria-current={i === index}
                                className={`h-[3px] rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#08b796]' : 'w-4 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => go(-1)}
                            aria-label="Previous image"
                            className="w-9 h-9 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
                        >
                            <svg width="14" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"><path d="M5 1L1 5M1 5l4 4M1 5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button
                            onClick={() => go(1)}
                            aria-label="Next image"
                            className="w-9 h-9 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
                        >
                            <svg width="14" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"><path d="M11 1l4 4m0 0l-4 4m4-4H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
