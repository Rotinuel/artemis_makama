'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { portfolioStyles } from '../styles'
import { pad, metaLine, cleanCaption, FACT_FIELDS } from '../lib'
import useReveal from '../useReveal'

const Arrow = ({ size = 18, left = false }) => (
    <svg
        className="pf-arrow" width={size} height={size * 0.6} viewBox="0 0 20 12" fill="none" aria-hidden="true"
        style={left ? { transform: 'scaleX(-1)' } : undefined}
    >
        <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

// Editorial rhythm for the image sequence: full-bleed, pair, offset single, pair …
const PATTERN = ['full', 'pair', 'offset', 'pair']

// `start` = position of images[0] in the full project list (for numbering + lightbox)
function buildSequence(images, start = 0) {
    const rows = []
    let i = 0, step = 0, offsets = 0
    while (i < images.length) {
        let type = PATTERN[step % PATTERN.length]
        if (type === 'pair' && images.length - i < 2) type = 'full'
        const count = type === 'pair' ? 2 : 1
        rows.push({
            type,
            left: type === 'offset' && offsets++ % 2 === 1,
            items: images.slice(i, i + count).map((img, k) => ({ img, index: start + i + k })),
        })
        i += count
        step++
    }
    return rows
}

export default function ProjectClient({ project, next, total, initialImageId }) {
    const { images, meta } = project
    const initialIndex = initialImageId ? images.findIndex(img => String(img.id) === String(initialImageId)) : -1
    const [lightbox, setLightbox] = useState(initialIndex >= 0 ? initialIndex : null)

    useReveal([project.id])

    // Cover is the hero; the sequence shows the rest
    const [cover, ...restImages] = images
    const rows = buildSequence(restImages, 1)

    const facts = [
        ['Project', `${pad(project.number)} / ${pad(total)}`],
        ...FACT_FIELDS.filter(([key]) => meta[key]).map(([key, label]) => [label, meta[key]]),
        ['Images', pad(images.length)],
    ]
    const line = metaLine(meta)

    return (
        <>
            <Navigation />
            <style>{portfolioStyles}</style>

            <main className="pf">
                {/* ── Hero ── */}
                <section
                    className="pf-hero"
                    onClick={() => cover && setLightbox(0)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${project.name} images full screen`}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && cover && setLightbox(0)}
                >
                    {cover && <Image src={cover.url} alt={cleanCaption(cover.title) || project.name} width={1800} height={1200} sizes="100vw" priority />}
                    <div className="pf-wrap pf-hero-body">
                        <p className="pf-eyebrow">Project {pad(project.number)}</p>
                        <h1 className="pf-hero-title">{project.name}</h1>
                        {line && <p className="pf-hero-meta">{line}</p>}
                    </div>
                </section>

                {/* ── Breadcrumb ── */}
                <nav className="pf-wrap pf-crumbs" aria-label="Breadcrumb">
                    <Link href="/portfolio">Portfolio</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{project.name}</span>
                </nav>

                {/* ── Brief: fact sheet + summary ── */}
                <section className={`pf-wrap pf-brief${project.summary ? '' : ' no-summary'}`}>
                    <dl className="pf-facts pf-reveal">
                        {facts.map(([label, value]) => (
                            <div key={label}>
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                    {project.summary && (
                        <div className="pf-reveal">
                            <p className="pf-eyebrow" style={{ marginBottom: 24 }}>Overview</p>
                            <p className="pf-summary">{project.summary}</p>
                        </div>
                    )}
                </section>

                {/* ── Image sequence ── */}
                {rows.length > 0 && (
                    <section className="pf-wrap pf-seq" aria-label="Project images">
                        {rows.map((row, r) => (
                            <div key={r} className={`pf-seq-row ${row.type}${row.left ? ' left' : ''}`}>
                                {row.items.map(({ img, index }) => {
                                    const caption = cleanCaption(img.title)
                                    return (
                                        <figure key={img.id} className="pf-fig pf-reveal">
                                            <button onClick={() => setLightbox(index)} aria-label={`Open image ${index + 1}`}>
                                                <Image src={img.url} alt={caption || `${project.name} — image ${index + 1}`} width={1200} height={900} sizes="(min-width: 1024px) 50vw, 100vw" />
                                            </button>
                                            <figcaption>
                                                <span className="pf-num">{pad(index + 1)}</span>
                                                {caption && <span>{caption}</span>}
                                            </figcaption>
                                        </figure>
                                    )
                                })}
                                {row.type === 'offset' && (
                                    <p className="pf-fig-note">
                                        {project.name}<br />
                                        {pad(row.items[0].index + 1)} / {pad(images.length)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* ── Next project ── */}
                {next && (
                    <Link href={`/portfolio/${next.slug}`} className="pf-next">
                        {next.cover && <Image src={next.cover} alt="" width={1200} height={800} sizes="100vw" />}
                        <div className="pf-wrap pf-next-body">
                            <p className="pf-eyebrow">Next Project</p>
                            <h2 className="pf-next-title">
                                <span>{next.name}</span>
                                <Arrow size={56} />
                            </h2>
                        </div>
                    </Link>
                )}

                <div className="pf-wrap">
                    <Link href="/portfolio" className="pf-back">
                        <Arrow left /> All projects
                    </Link>
                </div>
            </main>

            <Footer />

            {lightbox !== null && (
                <Lightbox
                    images={images}
                    index={lightbox}
                    title={project.name}
                    onChange={setLightbox}
                    onClose={() => setLightbox(null)}
                />
            )}
        </>
    )
}

function Lightbox({ images, index, title, onChange, onClose }) {
    const count = images.length
    const go = useCallback(dir => onChange((index + dir + count) % count), [index, count, onChange])
    const touchX = useRef(null)
    const img = images[index]
    const caption = cleanCaption(img.title)

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') onClose()
            else if (e.key === 'ArrowRight') go(1)
            else if (e.key === 'ArrowLeft') go(-1)
        }
        window.addEventListener('keydown', onKey)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = prevOverflow
        }
    }, [go, onClose])

    // Preload neighbours so arrowing through feels instant
    useEffect(() => {
        [1, -1].forEach(d => {
            const n = images[(index + d + count) % count]
            if (n) { const p = new Image(); p.src = n.url }
        })
    }, [index, images, count])

    return (
        <div className="pf pf-lb" role="dialog" aria-modal="true" aria-label={`${title} images`} style={{ paddingTop: 0, minHeight: 0 }}>
            <div className="pf-lb-top">
                <span>{title}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <span>{pad(index + 1)} / {pad(count)}</span>
                    <button className="pf-lb-btn" onClick={onClose} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" /></svg>
                    </button>
                </span>
            </div>

            <div
                className="pf-lb-stage"
                onClick={e => e.target === e.currentTarget && onClose()}
                onTouchStart={e => { touchX.current = e.touches[0].clientX }}
                onTouchEnd={e => {
                    if (touchX.current === null) return
                    const dx = e.changedTouches[0].clientX - touchX.current
                    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
                    touchX.current = null
                }}
            >
                <Image key={img.id} src={img.url} alt={caption || `${title} — image ${index + 1}`} width={2000} height={1500} sizes="100vw" />
                {count > 1 && (
                    <>
                        <button className="pf-lb-btn pf-lb-nav prev" onClick={() => go(-1)} aria-label="Previous image"><Arrow left /></button>
                        <button className="pf-lb-btn pf-lb-nav next" onClick={() => go(1)} aria-label="Next image"><Arrow /></button>
                    </>
                )}
            </div>

            <div className="pf-lb-bottom">{caption}</div>
        </div>
    )
}
