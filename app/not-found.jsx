import Link from 'next/link'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

export const metadata = {
    title: { absolute: 'Page not found | Artemis Atelier' },
    robots: { index: false, follow: true },
}

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/build-from-abroad', label: 'Build from abroad' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Projects' },
    { href: '/guides', label: 'Guides' },
    { href: '/contact', label: 'Contact' },
]

export default function NotFound() {
    return (
        <>
            <Navigation />
            <main className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col justify-center px-6 pt-[72px]">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">Error 404</p>
                <h1 className="mb-4 text-[40px] leading-tight text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>We couldn’t find that page.</h1>
                <p className="mb-8 text-[16px] leading-relaxed text-[#555]">It may have moved when we reorganised the site. Try one of these:</p>
                <ul className="flex flex-wrap gap-3">
                    {LINKS.map(l => (
                        <li key={l.href}><Link href={l.href} className="inline-block rounded-full border border-[#1a1a1a] px-5 py-2.5 text-[13px] hover:bg-[#1a1a1a] hover:text-white">{l.label}</Link></li>
                    ))}
                </ul>
            </main>
            <Footer />
        </>
    )
}
