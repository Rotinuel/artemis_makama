'use client'

import { useState, useEffect, useRef } from 'react'
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
    { label: 'Projects', href: '/projects', dropdown: 'projects' },
    { label: 'Ideas',    href: '/ideas',    dropdown: 'ideas'    },
    { label: 'People',  href: '/people',   dropdown: 'people'   },
    { label: 'About',   href: '/about',    dropdown: 'about'        },
]

const SCROLL_THRESHOLD = 120

// variant="hero"  → animated hero effect (homepage only)
// variant="default" (or omitted) → plain white top bar always
export default function Navigation({ variant = 'default' }) {
    const [scrollY,        setScrollY]        = useState(0)
    const [scrolled,       setScrolled]       = useState(false)
    const [mobileOpen,     setMobileOpen]     = useState(false)
    const [searchOpen,     setSearchOpen]     = useState(false)
    const [searchQuery,    setSearchQuery]    = useState('')
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [projectsTab,    setProjectsTab]    = useState('markets')
    const [mobileExpanded, setMobileExpanded] = useState(null)

    const isHero        = variant === 'hero'
    const searchInputRef = useRef(null)
    const dropdownTimer  = useRef(null)

    useEffect(() => {
        if (!isHero) return // no scroll tracking needed on non-hero pages
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

    const progress          = isHero ? Math.min(scrollY / SCROLL_THRESHOLD, 1) : 1
    const heroTranslateY    = -(progress * 55)
    const heroScale         = 1 - progress * 0.4
    const heroOpacity       = Math.max(1 - progress * 1.6, 0)

    // On non-hero pages the top bar is always visible/solid
    const topBarVisible = !isHero || scrolled

    return (
        <>
            {/* ─── HERO NAV (homepage only) ─── */}
            {isHero && (
                <>
                    {/* Big centered serif nav */}
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
                                    {item.dropdown && activeDropdown === item.dropdown && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 'calc(100% + 12px)', left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'white',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                                            zIndex: 100,
                                            minWidth: item.dropdown === 'projects' ? 520 : 220,
                                            borderTop: '2px solid #1a1a1a',
                                        }}>
                                            <DropdownContent type={item.dropdown} projectsTab={projectsTab} setProjectsTab={setProjectsTab} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Hero corner utilities (logo + search) — fade out on scroll */}
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
                            <button onClick={() => setSearchOpen(true)} aria-label="Search" style={iconBtn('white')}>
                                <SearchIcon />
                            </button>
                            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="mobile-only" style={{ ...iconBtn('white'), display: 'none' }}>
                                <HamburgerIcon />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ─── TOP BAR ─── */}
            {/* Hero pages: slides in after scroll threshold */}
            {/* All other pages: always visible, no animation */}
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
                    // Hero: animate in. Default: always shown, no transition
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
                            onMouseEnter={() => item.dropdown && enterDropdown(item.dropdown)}
                            onMouseLeave={leaveDropdown}
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
                            {item.dropdown && activeDropdown === item.dropdown && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0,
                                    background: 'white',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                                    zIndex: 100,
                                    minWidth: item.dropdown === 'projects' ? 520 : 220,
                                    borderTop: '2px solid #1a1a1a',
                                }}>
                                    <DropdownContent type={item.dropdown} projectsTab={projectsTab} setProjectsTab={setProjectsTab} />
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button onClick={() => setSearchOpen(true)} aria-label="Search" style={iconBtn('#1a1a1a')}>
                        <SearchIcon />
                    </button>
                    <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="mobile-only" style={{ ...iconBtn('#1a1a1a'), display: 'none' }}>
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
                            <button
                                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', fontSize: 18, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'sans-serif' }}
                            >
                                {item.label}
                                <ChevronIcon rotated={mobileExpanded === item.label} />
                            </button>
                            {mobileExpanded === item.label && item.dropdown === 'projects' && (
                                <div style={{ paddingLeft: 16, paddingBottom: 16 }}>
                                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: 8 }}>Markets</div>
                                    {markets.map(m => <Link key={m} href="#" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '4px 0', fontSize: 14, color: '#1a1a1a', textDecoration: 'none' }}>{m}</Link>)}
                                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginTop: 16, marginBottom: 8 }}>Disciplines</div>
                                    {disciplines.map(d => <Link key={d} href="#" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '4px 0', fontSize: 14, color: '#1a1a1a', textDecoration: 'none' }}>{d}</Link>)}
                                </div>
                            )}
                            {mobileExpanded === item.label && item.dropdown === 'ideas' && (
                                <div style={{ paddingLeft: 16, paddingBottom: 16 }}>
                                    {[{ label: 'Design Perspectives', href: '/ideas/design-perspectives' }, { label: 'Publications', href: '/ideas/publications' }, { label: 'Research + Insights', href: '/ideas/research' }]
                                        .map(s => <Link key={s.label} href={s.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '6px 0', fontSize: 14, color: '#1a1a1a', textDecoration: 'none' }}>{s.label}</Link>)}
                                </div>
                            )}
                            {mobileExpanded === item.label && item.dropdown === 'people' && (
                                <div style={{ paddingLeft: 16, paddingBottom: 16 }}>
                                    {[{ label: 'Culture', href: '/people/culture' }, { label: 'Leadership', href: '/people/leadership' }, { label: 'Careers', href: '/people/careers' }]
                                        .map(s => <Link key={s.label} href={s.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '6px 0', fontSize: 14, color: '#1a1a1a', textDecoration: 'none' }}>{s.label}</Link>)}
                                </div>
                            )}
                            {mobileExpanded === item.label && item.dropdown === 'about' && (
                                <div style={{
                                    paddingLeft: 16, paddingBottom: 16 }}>
                                    {[{ label: 'Careers', href: '/people/careers'}, { label:'News + Events', href: '/news-events'}, { label: 'Contact', href: '/contact'}]
                                        .map(s => <Link key={s.label} href={s.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '6px 0', fontSize: 14, color: '#1a1a1a', textDecoration: 'none' }}>{s.label}</Link>)}
                                </div>
                            )}
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

// ─── Dropdown content ─────────────────────────────────────────────────────────
function DropdownContent({ type, projectsTab, setProjectsTab }) {
    if (type === 'projects') {
        return (
            <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', gap: 32 }}>
                    <div style={{ flex: 1 }}>
                        <button onClick={() => setProjectsTab('markets')} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 16, color: projectsTab === 'markets' ? '#1a1a1a' : '#888', background: 'none', border: 'none', borderBottom: `2px solid ${projectsTab === 'markets' ? '#1a1a1a' : 'transparent'}`, paddingBottom: 8, cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'sans-serif' }}>Markets</button>
                        {projectsTab === 'markets' && (
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {markets.map(m => (
                                    <li key={m}><Link href="/projects" style={{ fontSize: 13, color: '#1a1a1a', textDecoration: 'none', display: 'block', padding: '4px 0' }} onMouseEnter={e => e.currentTarget.style.color = '#888'} onMouseLeave={e => e.currentTarget.style.color = '#1a1a1a'}>{m}</Link></li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <button onClick={() => setProjectsTab('disciplines')} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 16, color: projectsTab === 'disciplines' ? '#1a1a1a' : '#888', background: 'none', border: 'none', borderBottom: `2px solid ${projectsTab === 'disciplines' ? '#1a1a1a' : 'transparent'}`, paddingBottom: 8, cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'sans-serif' }}>Disciplines</button>
                        {projectsTab === 'disciplines' && (
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {disciplines.map(d => (
                                    <li key={d}><Link href="/projects" style={{ fontSize: 13, color: '#1a1a1a', textDecoration: 'none', display: 'block', padding: '4px 0' }} onMouseEnter={e => e.currentTarget.style.color = '#888'} onMouseLeave={e => e.currentTarget.style.color = '#1a1a1a'}>{d}</Link></li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e5e5' }}>
                    <Link href="/projects/stories" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>Project Stories →</Link>
                </div>
            </div>
        )
    }
    const links = type === 'ideas'
        ? [{ label: 'Design Perspectives', href: '/ideas/design-perspectives' }, { label: 'Publications', href: '/ideas/publications' }, { label: 'Research + Insights', href: '/ideas/research' }]
        : [{ label: 'Culture', href: '/people/culture' }, { label: 'Leadership', href: '/people/leadership' }, { label: 'Careers', href: '/people/careers' }]
    return (
        <ul style={{ listStyle: 'none', margin: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map(item => (
                <li key={item.label}><Link href={item.href} style={{ fontSize: 13, color: '#1a1a1a', textDecoration: 'none', display: 'block', padding: '5px 0' }} onMouseEnter={e => e.currentTarget.style.color = '#888'} onMouseLeave={e => e.currentTarget.style.color = '#1a1a1a'}>{item.label}</Link></li>
            ))}
        </ul>
    )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function LogoMark({ color = '#07ba93', size = 52 }) {
    const isWhite = color === 'white'
    return (
        <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
            <rect width="52" height="52" fill={isWhite ? 'rgba(255,255,255,0.9)' : color} />
            <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="20" fontWeight="700" fill={isWhite ? '#07ba93' : 'white'} letterSpacing="-0.5">AA</text>
        </svg>
    )
}
function SearchIcon() {
    return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4" strokeLinecap="round"/></svg>
}
function CloseIcon() {
    return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
}
function HamburgerIcon() {
    return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></svg>
}
function ChevronIcon({ rotated }) {
    return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ transform: rotated ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6" strokeLinecap="round"/></svg>
}
const iconBtn = (color) => ({ color, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' })
