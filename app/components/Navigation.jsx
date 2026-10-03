'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const markets = [
    'Civic + Justice', 'Corporate + Commercial',
    'Healthcare', 'Higher Education', 'Lifestyle',
    'Mixed-Use', 'Renovation + Refurbishment',
    'Sports + Rec + Entertainment',
]

const disciplines = [
    'Architecture', 'Landscape Architecture', 'Lighting Design',
    'Experience Design', 'Interiors', 'Planning + Urban Design',
    'Sustainable Design', 'Engineering', 'Consulting',
]

// Main menu (from the SEO & conversion audit). `children` show as a
// dropdown in the top bar and as an indented list on mobile.
const NAV_ITEMS = [
    {
        label: 'Services', href: '/services', children: [
            { label: 'Design and build', href: '/services/design-and-build' },
            { label: 'Renovation and interiors', href: '/services/renovation-and-interior-finishing' },
            { label: 'Facility management and commercial', href: '/services/facility-management-and-commercial' },
            { label: 'Building contractor in Lagos', href: '/building-contractor-lagos' },
            { label: 'House plans', href: '/house-plans' },
            { label: 'Feasibility and cost report', href: '/services/feasibility-and-cost-report' },
            { label: 'Land title verification', href: '/services/land-title-verification' },
            { label: 'Design-only package', href: '/services/design-only-package' },
            { label: 'Construction monitoring', href: '/services/build-monitoring' },
        ],
    },
    { label: 'Projects', href: '/portfolio' },
    {
        label: 'Build from Abroad', href: '/build-from-abroad', children: [
            { label: 'How it works', href: '/build-from-abroad' },
            { label: 'Cost of building in Nigeria', href: '/guides/cost-of-building-a-house-in-nigeria' },
            { label: 'Buying land from abroad', href: '/guides/buying-land-in-nigeria-from-abroad' },
            { label: 'Scams to avoid', href: '/guides/property-scams-in-nigeria-to-avoid' },
            { label: 'All guides', href: '/guides' },
        ],
    },
    { label: 'Process', href: '/how-we-build' },
    {
        label: 'About', href: '/about', children: [
            { label: 'About us', href: '/about' },
            { label: 'People', href: '/people' },
            { label: 'Partners', href: '/partners' },
            { label: 'News + Events', href: '/news-events' },
            { label: 'Material prices', href: '/news/material-prices' },
        ],
    },
    { label: 'Contact', href: '/contact' },
]

const SCROLL_THRESHOLD = 120

export default function Navigation({ variant = 'default' }) {
    const [scrollY, setScrollY] = useState(0)
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [projectsTab, setProjectsTab] = useState('markets')
    const [mobileExpanded, setMobileExpanded] = useState(null)

    const isHero = variant === 'hero'
    const searchInputRef = useRef(null)
    const dropdownTimer = useRef(null)
    const heroNavRef = useRef(null)
    const [heroFit, setHeroFit] = useState(1)

    // Shrink the big centred hero nav so it always fits the screen width,
    // however many links there are and whatever the screen size.
    useEffect(() => {
        if (!isHero) return
        const nav = heroNavRef.current
        if (!nav) return
        const measure = () => {
            const side = Math.max(24, window.innerWidth * 0.04)       // breathing room each side
            const available = window.innerWidth - side * 2
            const natural = nav.offsetWidth                             // unaffected by transform
            setHeroFit(natural > 0 ? Math.min(1, available / natural) : 1)
        }
        measure()
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
        ro?.observe(nav)
        window.addEventListener('resize', measure)
        document.fonts?.ready?.then(measure)
        return () => {
            ro?.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [isHero])

    useEffect(() => {
        if (!isHero) return
        const onScroll = () => {
            const y = window.scrollY
            setScrollY(y)
            setScrolled(y > SCROLL_THRESHOLD)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [isHero])

    useEffect(() => {
        if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
    }, [searchOpen])

    useEffect(() => {
        document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen, searchOpen])

    const enterDropdown = (key) => { clearTimeout(dropdownTimer.current); setActiveDropdown(key) }
    const leaveDropdown = () => { dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 80) }

    const progress = isHero ? Math.min(scrollY / SCROLL_THRESHOLD, 1) : 1
    const heroTranslateY = -(progress * 55)
    const heroScale = 1 - progress * 0.4
    const heroOpacity = Math.max(1 - progress * 1.6, 0)

    const topBarVisible = !isHero || scrolled

    return (
        <>
            {/* ─── HERO NAV (homepage only) ─── */}
            {isHero && (
                <>
                    <div
                        aria-hidden={scrolled}
                        className="hero-nav-wrap"
                        style={{
                            position: 'fixed',
                            top: '50vh', left: 0, right: 0,
                            zIndex: 50,
                            display: 'flex', justifyContent: 'center',
                            pointerEvents: scrolled ? 'none' : 'auto',
                            transform: `translateY(calc(-50% + ${heroTranslateY}vh)) scale(${heroScale})`,
                            opacity: heroOpacity,
                            willChange: 'transform, opacity',
                        }}
                    >
                        <nav
                            ref={heroNavRef}
                            style={{
                                display: 'flex', justifyContent: 'center', flexShrink: 0,
                                gap: 'clamp(20px, 3.5vw, 120px)',
                                transform: `scale(${heroFit})`,
                                transformOrigin: 'center',
                            }}
                        >
                            {NAV_ITEMS.map(item => (
                                <div
                                    key={item.label}
                                    style={{ position: 'relative' }}
                                    onMouseEnter={() => item.dropdown && enterDropdown(item.dropdown)}
                                    onMouseLeave={leaveDropdown}
                                >
                                    <Link
                                        href={item.href}
                                        style={{
                                            color: 'white',
                                            fontSize: 'clamp(20px, 3.2vw, 52px)',
                                            fontFamily: "'Georgia', 'Times New Roman', serif",
                                            fontWeight: 400,
                                            letterSpacing: '-0.01em',
                                            textDecoration: 'none',
                                            display: 'block',
                                            lineHeight: 1,
                                            whiteSpace: 'nowrap',
                                            transition: 'opacity 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div
                        aria-hidden={scrolled}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0,
                            zIndex: 51,
                            pointerEvents: scrolled ? 'none' : 'auto',
                            opacity: Math.max(1 - progress * 2, 0),
                        }}
                    >
                        <Link href="/" style={{ position: 'absolute', top: 24, left: 28 }}>
                            <LogoMark color="white" size={56} />
                        </Link>
                        <div style={{ position: 'absolute', top: 28, right: 28, display: 'flex', alignItems: 'center', gap: 24 }}>
                            <a href="tel:+2348033502393" aria-label="Call Artemis Atelier" className="mobile-only" style={{ ...iconBtn('white'), textDecoration: 'none' }}>
                                <PhoneIcon />
                            </a>
                            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="mobile-only" style={iconBtn('white')}>
                                <HamburgerIcon />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ─── TOP BAR ─── */}
            <header
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 50,
                    height: 72,
                    background: 'white',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 28px',
                    opacity: topBarVisible ? 1 : 0,
                    pointerEvents: topBarVisible ? 'auto' : 'none',
                    transform: isHero
                        ? (scrolled ? 'translateY(0)' : 'translateY(-100%)')
                        : 'translateY(0)',
                    transition: isHero
                        ? 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                        : 'none',
                }}
            >
                <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <LogoMark color="#07ba93" size={52} />
                </Link>

                <nav className="scrolled-nav-links" style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
                    {NAV_ITEMS.map(item => (
                        <div
                            key={item.label}
                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => item.children && enterDropdown(item.label)}
                            onMouseLeave={leaveDropdown}
                            onFocus={() => item.children && enterDropdown(item.label)}
                            onBlur={leaveDropdown}
                        >
                            <Link
                                href={item.href}
                                style={{
                                    color: '#1a1a1a', fontSize: 13,
                                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                    fontWeight: 600, letterSpacing: '0.12em',
                                    textDecoration: 'none', padding: '0 16px',
                                    display: 'flex', alignItems: 'center',
                                    height: '100%', textTransform: 'uppercase',
                                    transition: 'opacity 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                aria-haspopup={item.children ? 'true' : undefined}
                                aria-expanded={item.children ? activeDropdown === item.label : undefined}
                            >
                                {item.label}
                            </Link>
                            {/* Always in the HTML so crawlers see the links; shown on hover/focus */}
                            {item.children && (
                                <div
                                    style={{
                                        display: activeDropdown === item.label ? 'block' : 'none',
                                        position: 'absolute', top: '100%', left: 8, minWidth: 260,
                                        background: 'white', border: '1px solid #e5e5e5', borderTop: '2px solid #08b796',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.08)', padding: '8px 0', zIndex: 60,
                                    }}
                                >
                                    {item.children.map(c => (
                                        <Link
                                            key={c.href + c.label}
                                            href={c.href}
                                            onClick={() => setActiveDropdown(null)}
                                            className="nav-drop-link"
                                            style={{ display: 'block', padding: '10px 20px', fontSize: 14, color: '#1a1a1a', textDecoration: 'none', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                                        >
                                            {c.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <a href="tel:+2348033502393" aria-label="Call Artemis Atelier" className="mobile-only" style={{ ...iconBtn('#1a1a1a'), textDecoration: 'none' }}>
                        <PhoneIcon />
                    </a>
                    <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="mobile-only" style={iconBtn('#1a1a1a')}>
                        <HamburgerIcon />
                    </button>
                </div>
            </header>

            {/* ─── MOBILE MENU ─── */}
            <div style={{
                position: 'fixed', inset: 0, background: 'white', zIndex: 200,
                overflowY: 'auto',
                transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, borderBottom: '1px solid #e5e5e5' }}>
                    <Link href="/" onClick={() => setMobileOpen(false)}>
                        <LogoMark color="#07ba93" size={44} />
                    </Link>
                    <button onClick={() => setMobileOpen(false)} aria-label="Close" style={iconBtn('#1a1a1a')}>
                        <CloseIcon />
                    </button>
                </div>
                <nav style={{ padding: '24px 24px 40px' }}>
                    {NAV_ITEMS.map(item => (
                        <div key={item.label} style={{ borderBottom: '1px solid #e5e5e5' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', fontSize: 18, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', fontFamily: 'sans-serif' }}
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <button
                                        type="button"
                                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                                        aria-expanded={mobileExpanded === item.label}
                                        aria-label={`Show ${item.label} pages`}
                                        style={{ ...iconBtn('#1a1a1a'), padding: 12 }}
                                    >
                                        <ChevronIcon rotated={mobileExpanded === item.label} />
                                    </button>
                                )}
                            </div>
                            {item.children && mobileExpanded === item.label && (
                                <div style={{ padding: '0 0 14px 14px' }}>
                                    {item.children.map(c => (
                                        <Link
                                            key={c.href + c.label}
                                            href={c.href}
                                            onClick={() => setMobileOpen(false)}
                                            style={{ display: 'block', padding: '10px 0', fontSize: 15, color: '#444', textDecoration: 'none', fontFamily: 'sans-serif' }}
                                        >
                                            {c.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Link href="/build-from-abroad#book" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', background: '#08b796', color: 'white', padding: '14px 0', borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                            Book a free consultation
                        </Link>
                        <a href="tel:+2348033502393" style={{ display: 'block', textAlign: 'center', border: '1px solid #1a1a1a', color: '#1a1a1a', padding: '13px 0', borderRadius: 999, fontSize: 14, textDecoration: 'none' }}>
                            Call +234 803 350 2393
                        </a>
                    </div>
                </nav>
            </div>

            {/* ─── SEARCH OVERLAY ─── */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'white',
                zIndex: 300,
                display: 'flex',
                flexDirection: 'column',
                transform: searchOpen ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 72, borderBottom: '1px solid #e5e5e5' }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888' }}>Search</span>
                    <button onClick={() => { setSearchOpen(false); setSearchQuery('') }} aria-label="Close search" style={iconBtn('#1a1a1a')}>
                        <CloseIcon />
                    </button>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
                    <div style={{ width: '100%', maxWidth: 640 }}>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 24, letterSpacing: '0.03em' }}>Start typing to search</p>
                        <div style={{ position: 'relative' }}>
                            <input
                                ref={searchInputRef}
                                type="text" value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="e.g. Healthcare, Sports, New York..."
                                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                                style={{
                                    width: '100%', fontSize: 'clamp(20px, 4vw, 32px)',
                                    fontWeight: 300, border: 'none', borderBottom: '2px solid #1a1a1a',
                                    paddingBottom: 12, outline: 'none', background: 'transparent',
                                    fontFamily: "'Georgia', serif", color: '#1a1a1a', boxSizing: 'border-box',
                                }}
                            />
                            <span style={{ position: 'absolute', right: 0, bottom: 14, color: '#888' }}>
                                <SearchIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .hero-nav-wrap      { display: none !important; }
                    .scrolled-nav-links { display: none !important; }
                    .mobile-only        { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .mobile-only { display: none !important; }
                }
                .nav-drop-link:hover, .nav-drop-link:focus-visible { background: #f5f5f3; color: #067a64 !important; }
                @media (min-width: 769px) and (max-width: 1100px) {
                    .scrolled-nav-links > div > a { padding: 0 10px !important; font-size: 12px !important; letter-spacing: 0.08em !important; }
                }
            `}</style>
        </>
    )
}

function LogoMark({ color = '#07ba93', size = 24 }) {
    return (
        <Image
            src="/logo-bg.png"
            alt="Artemis Atelier Ltd"
            className="mr-14 w-7 lg:w-14 h-auto cursor-pointer object-cover"
            width={size}
            height={size}
        />
    )
}
function SearchIcon() {
    return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" strokeLinecap="round" /></svg>
}
function CloseIcon() {
    return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
}
function HamburgerIcon() {
    return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>
}
function ChevronIcon({ rotated }) {
    return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ transform: rotated ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6" strokeLinecap="round" /></svg>
}
const iconBtn = (color) => ({ color, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' })

function PhoneIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
    )
}
