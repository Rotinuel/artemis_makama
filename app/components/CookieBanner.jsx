'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('aal-cookie-dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem('aal-cookie-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] bg-[#111] text-white px-6 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-[13px] text-[#ccc] leading-relaxed ">
        This site uses cookies.{' '}
        <Link href="#" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
          More Information
        </Link>
      </p>
      <div className="flex gap-4 flex-shrink-0">
        <button
          onClick={dismiss}
          className="text-[12px] tracking-[0.1em] uppercase text-white border border-white px-5 py-2 hover:bg-white hover:text-[#111] transition-all"
        >
          Accept
        </button>
        <button
          onClick={dismiss}
          className="text-[12px] tracking-[0.1em] uppercase text-[#888] hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
