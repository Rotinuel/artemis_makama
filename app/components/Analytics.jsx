'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/track'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID // e.g. G-XXXXXXXXXX
const VERCEL_ANALYTICS = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== 'off'

export const CONSENT_KEY = 'aal-consent' // 'granted' | 'denied'

/**
 * Google Analytics 4 (with Consent Mode: nothing is stored until the
 * visitor accepts cookies) + Vercel Web Analytics (cookie-free).
 * Also tracks every WhatsApp, phone, email and file-download click
 * site-wide, so individual buttons don't need wiring.
 */
export default function Analytics() {
    const pathname = usePathname() || ''
    const isPrivate = pathname.startsWith('/admin') || pathname.startsWith('/portal')

    // One delegated listener for outbound contact clicks
    useEffect(() => {
        function onClick(e) {
            const a = e.target?.closest?.('a[href]')
            if (!a) return
            const href = a.getAttribute('href') || ''
            const where = window.location.pathname
            if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) track('whatsapp_click', { page: where })
            else if (href.startsWith('tel:')) track('phone_click', { page: where })
            else if (href.startsWith('mailto:')) track('email_click', { page: where })
            else if (/\.(pdf|docx?|xlsx?)($|\?)/i.test(href)) track('file_download', { file: href, page: where })
        }
        document.addEventListener('click', onClick, { capture: true })
        return () => document.removeEventListener('click', onClick, { capture: true })
    }, [])

    if (isPrivate) return null

    return (
        <>
            {VERCEL_ANALYTICS && (
                <>
                    <Script id="va-init" strategy="afterInteractive">
                        {`window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`}
                    </Script>
                    <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
                </>
            )}
            {GA_ID && (
                <>
                    <Script id="ga-consent" strategy="afterInteractive">
                        {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        window.gtag = gtag;
                        var c = null; try { c = localStorage.getItem('${CONSENT_KEY}'); } catch (e) {}
                        gtag('consent', 'default', {
                          ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
                          analytics_storage: c === 'granted' ? 'granted' : 'denied'
                        });
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}', { anonymize_ip: true });
                        `}
                    </Script>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                </>
            )}
        </>
    )
}

/** Called by the cookie banner */
export function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value) } catch { /* ignore */ }
    try {
        window.gtag?.('consent', 'update', { analytics_storage: value === 'granted' ? 'granted' : 'denied' })
    } catch { /* ignore */ }
}
