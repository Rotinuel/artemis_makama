'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BreakingNewsBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="bg-[#1a1a1a] text-white text-[12px] tracking-[0.04em] px-6 md:px-10 py-3 flex items-center justify-between gap-4" style={{ paddingTop: 64 }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-[10px] tracking-[0.12em] uppercase font-medium text-[#aaa] flex-shrink-0">Breaking News</span>
        <span className="text-[#e0e0e0] hidden sm:block">·</span>
        <Link
          href="#"
          className="text-white hover:text-[#ccc] transition-colors truncate leading-relaxed"
        >
          AAL tends to Create Expanded Global Sports, Recreation and Entertainment Design Practice
        </Link>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="flex-shrink-0 text-[#aaa] hover:text-white transition-colors ml-4"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
