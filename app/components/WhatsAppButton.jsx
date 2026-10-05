'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { whatsappLink } from '@/lib/site'

// Floating "Chat on WhatsApp" button shown on every public page
export default function WhatsAppButton() {
    const pathname = usePathname() || ''
    // When the footer scrolls into view, shrink to a round icon so the
    // button doesn't sit on top of the footer's links and contact details
    const [atFooter, setAtFooter] = useState(false)
    useEffect(() => {
        const footer = document.querySelector('footer')
        if (!footer || !('IntersectionObserver' in window)) return
        const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { rootMargin: '0px 0px -40px 0px' })
        io.observe(footer)
        return () => io.disconnect()
    }, [pathname])
    // Not on the admin area, sign-in pages or the client portal (it has its own contact button)
    if (pathname.startsWith('/admin') || pathname.startsWith('/portal') || pathname.startsWith('/auth') ||
        pathname === '/login' || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password')) return null

    return (
        <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`wa-float${atFooter ? ' wa-compact' : ''}`}
            aria-label="Chat with Artemis Atelier on WhatsApp"
        >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A13 13 0 0 0 16.04 29C23.2 29 29 23.17 29 16S23.2 3 16.04 3Zm0 23.8c-2.02 0-4-.54-5.72-1.57l-.41-.24-3.96 1.04 1.06-3.86-.27-.4A10.78 10.78 0 0 1 5.22 16c0-5.96 4.85-10.8 10.82-10.8 5.96 0 10.8 4.84 10.8 10.8 0 5.96-4.84 10.8-10.8 10.8Zm5.93-8.09c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.27-.63-.54-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71 0 1.6 1.17 3.14 1.33 3.36.16.22 2.3 3.5 5.56 4.91.78.33 1.39.53 1.86.68.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.62-.37Z" />
            </svg>
            <span className="wa-label">Chat with us</span>
            <style>{`
                .wa-float {
                    position: fixed; right: 20px; bottom: 20px; z-index: 900;
                    display: inline-flex; align-items: center; gap: 10px;
                    height: 56px; padding: 0 14px; border-radius: 999px;
                    background: #25d366; color: #fff; text-decoration: none;
                    box-shadow: 0 10px 28px rgba(0,0,0,0.22);
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .wa-float:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,0,0,0.28); }
                .wa-float:focus-visible { outline: 3px solid #08b796; outline-offset: 3px; }
                .wa-label { padding-right: 4px; }
                .wa-compact { width: 52px; height: 52px; padding: 0; justify-content: center; opacity: 0.92; }
                .wa-compact .wa-label { display: none; }
                @media (max-width: 640px) {
                    .wa-float { width: 56px; padding: 0; justify-content: center; right: 16px; bottom: 16px; }
                    .wa-label { display: none; }
                }
                @media print { .wa-float { display: none; } }
            `}</style>
        </a>
    )
}
