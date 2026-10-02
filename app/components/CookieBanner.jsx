'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CONSENT_KEY, setConsent } from './Analytics'

// The banner is mounted once in the root layout; older pages also render
// it, so only the first instance on a page shows.
let claimed = false

export default function CookieBanner() {
  const pathname = usePathname() || ''
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (claimed) return
    claimed = true
    let choice = null
    try { choice = localStorage.getItem(CONSENT_KEY) || (localStorage.getItem('aal-cookie-dismissed') ? 'denied' : null) } catch { /* ignore */ }
    let timer
    if (!choice) timer = setTimeout(() => setVisible(true), 1200)
    return () => { clearTimeout(timer); claimed = false }
  }, [])

  const choose = value => {
    setConsent(value)
    setVisible(false)
  }

  if (!visible || pathname.startsWith('/admin') || pathname.startsWith('/portal')) return null

  return (
    <div role="dialog" aria-label="Cookie preferences" className="fixed bottom-0 left-0 right-0 z-300 bg-[#111] text-white px-6 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-[13px] text-[#ccc] leading-relaxed max-w-2xl">
        We use analytics cookies to see which pages help visitors, only if you accept. Essential cookies keep the site working.{' '}
        <Link href="/privacy#cookies" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
          Privacy &amp; cookies
        </Link>
      </p>
      <div className="flex gap-4 shrink-0">
        <button
          onClick={() => choose('granted')}
          className="text-[12px] tracking-widest uppercase text-white border border-white px-5 py-2 hover:bg-white hover:text-[#111] transition-all"
        >
          Accept
        </button>
        <button
          onClick={() => choose('denied')}
          className="text-[12px] tracking-widest uppercase text-[#aaa] hover:text-white transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
