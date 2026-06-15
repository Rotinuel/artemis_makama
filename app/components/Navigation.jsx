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

const NAV_ITEMS = [
    { label: 'Projects', href: '/projects' },
    { label: 'People', href: '/people' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
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
                        <nav style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(40px, 8vw, 120px)' }}>
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
                                            fontSize: 'clamp(28px, 4vw, 52px)',
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
                        >
                            <Link
                                href={item.href}
                                style={{
                                    color: '#1a1a1a', fontSize: 13,
                                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                    fontWeight: 600, letterSpacing: '0.12em',
                                    textDecoration: 'none', padding: '0 20px',
                                    display: 'flex', alignItems: 'center',
                                    height: '100%', textTransform: 'uppercase',
                                    transition: 'opacity 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                            <Link
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', fontSize: 18, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', fontFamily: 'sans-serif' }}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
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
            `}</style>
        </>
    )
}

function LogoMark({ color = '#07ba93', size = 24 }) {
    return (
        <Image
            src="/logo-bg.png"
            alt="logo"
            className="mr-14 w-7 lg:w-14 cursor-pointer object-cover"
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