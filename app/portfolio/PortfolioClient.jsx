'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { portfolioStyles } from './styles'
import { pad, metaLine } from './lib'
import useReveal from './useReveal'

const Arrow = ({ size = 18 }) => (
    <svg className="pf-arrow" width={size} height={size * 0.6} viewBox="0 0 20 12" fill="none" aria-hidden="true">
        <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const GridIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="4.5" height="4.5" stroke="currentColor" />
        <rect x="7" y="0.5" width="4.5" height="4.5" stroke="currentColor" />
        <rect x="0.5" y="7" width="4.5" height="4.5" stroke="currentColor" />
        <rect x="7" y="7" width="4.5" height="4.5" stroke="currentColor" />
    </svg>
)

const ListIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M0 1.5h12M0 6h12M0 10.5h12" stroke="currentColor" />
    </svg>
)

export default function PortfolioClient({ projects, totalImages }) {
    const [view, setView] = useState('grid')

    // Remember the visitor's preferred view
    useEffect(() => {
        try {
            const saved = localStorage.getItem('aal-portfolio-view')
            if (saved === 'grid' || saved === 'index') setView(saved)
        } catch { }
    }, [])
    function changeView(v) {
        setView(v)
        try { localStorage.setItem('aal-portfolio-view', v) } catch { }
    }

    useReveal([view, projects.length])

    const [featured, ...rest] = projects

    return (
        <>
            <Navigation />
            <style>{portfolioStyles}</style>

            <main className="pf">
                {/* ── Intro ── */}
                <header className="pf-wrap pf-intro">
                    <div className="pf-reveal">
                        <p className="pf-eyebrow">Selected Work</p>
                        <h1 className="pf-title">Portfolio</h1>
                    </div>
                    <div className="pf-reveal">
                        <p className="pf-lede">
                            Architecture, interiors and construction — a record of spaces
                            designed and delivered by Artemis Atelier, from first sketch to
                            site handover.
                        </p>
                        <dl className="pf-stats">
                            <div><dt>Projects</dt><dd>{pad(projects.length)}</dd></div>
                            <div><dt>Images</dt><dd>{pad(totalImages)}</dd></div>
                        </dl>
                    </div>
                </header>

                {/* ── Toolbar ── */}
                <div className="pf-toolbar">
                    <div className="pf-wrap pf-toolbar-inner">
                        <span className="pf-toolbar-label">
                            {projects.length} Project{projects.length !== 1 ? 's' : ''}
                        </span>
                        <div className="pf-toggle" role="group" aria-label="Layout">
                            <button aria-pressed={view === 'grid'} onClick={() => changeView('grid')}>
                                <GridIcon /> Grid
                            </button>
                            <button aria-pressed={view === 'index'} onClick={() => changeView('index')}>
                                <ListIcon /> Index
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pf-wrap">
                    {projects.length === 0 ? (
                        <p className="pf-empty">Projects are being prepared — please check back soon.</p>
                    ) : view === 'grid' ? (
                        <>
                            <FeaturedProject project={featured} />
                            {rest.length > 0 && (
                                <div className="pf-grid">
                                    {rest.map(p => <ProjectCard key={p.id} project={p} />)}
                                </div>
                            )}
                        </>
                    ) : (
                        <ProjectIndex projects={projects} />
                    )}
                </div>

                <div className="pf-bottom-space" />
            </main>

            <Footer />
        </>
    )
}

function FeaturedProject({ project }) {
    const meta = metaLine(project.meta)
    return (
        <Link href={`/portfolio/${project.slug}`} className="pf-featured pf-reveal">
            {project.cover && <img src={project.cover} alt={project.name} />}
            <div className="pf-featured-body">
                <div>
                    <span className="pf-num">{pad(project.number)} — Featured</span>
                    <h2 className="pf-featured-title">{project.name}</h2>
                    <p className="pf-featured-meta">
                        {meta || `${project.imageCount} image${project.imageCount !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <span className="pf-featured-cta">View project <Arrow /></span>
            </div>
        </Link>
    )
}

function ProjectCard({ project }) {
    const meta = metaLine(project.meta)
    return (
        <Link href={`/portfolio/${project.slug}`} className="pf-card pf-reveal">
            <div className="pf-card-media">
                {project.cover && <img src={project.cover} alt={project.name} loading="lazy" />}
                <span className="pf-card-count">
                    {project.imageCount} image{project.imageCount !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="pf-card-body">
                <span className="pf-num">{pad(project.number)}</span>
                <h3 className="pf-card-title">{project.name}</h3>
                <Arrow size={22} />
                {meta && <p className="pf-card-meta">{meta}</p>}
            </div>
        </Link>
    )
}

function ProjectIndex({ projects }) {
    const previewRef = useRef(null)
    const [hovered, setHovered] = useState(null)
    const hasMeta = projects.some(p => p.meta.sector || p.meta.location || p.meta.year)

    // Floating cover preview that follows the cursor (desktop only)
    function onMove(e) {
        const el = previewRef.current
        if (!el) return
        const w = el.offsetWidth, h = el.offsetHeight
        const x = Math.min(e.clientX + 32, window.innerWidth - w - 16)
        const y = Math.min(Math.max(e.clientY - h / 2, 88), window.innerHeight - h - 16)
        el.style.transform = `translate(${x}px, ${y}px)`
    }

    return (
        <div
            className={`pf-index${hasMeta ? ' has-meta' : ''}`}
            onMouseMove={onMove}
            onMouseLeave={() => setHovered(null)}
        >
            <div className="pf-index-head" aria-hidden="true">
                <span>No.</span>
                <span>Project</span>
                {hasMeta && <><span>Sector</span><span>Location</span><span>Year</span></>}
                <span>Images</span>
                <span />
            </div>

            {projects.map(p => (
                <Link
                    key={p.id}
                    href={`/portfolio/${p.slug}`}
                    className="pf-row"
                    onMouseEnter={() => setHovered(p)}
                >
                    <span className="pf-num">{pad(p.number)}</span>
                    {p.cover && <img className="pf-row-thumb" src={p.cover} alt="" loading="lazy" />}
                    <span className="pf-row-title">
                        {p.name}
                        <span className="pf-row-sub">
                            {metaLine(p.meta) || `${p.imageCount} image${p.imageCount !== 1 ? 's' : ''}`}
                        </span>
                    </span>
                    {hasMeta && (
                        <>
                            <span className="pf-row-cell pf-cell-hide">{p.meta.sector || '—'}</span>
                            <span className="pf-row-cell pf-cell-hide">{p.meta.location || '—'}</span>
                            <span className="pf-row-cell pf-cell-hide">{p.meta.year || '—'}</span>
                        </>
                    )}
                    <span className="pf-row-cell pf-cell-hide">{pad(p.imageCount)}</span>
                    <Arrow />
                </Link>
            ))}

            <div ref={previewRef} className={`pf-preview${hovered ? ' on' : ''}`} aria-hidden="true">
                {hovered?.cover && <img key={hovered.id} src={hovered.cover} alt="" />}
            </div>
        </div>
    )
}
