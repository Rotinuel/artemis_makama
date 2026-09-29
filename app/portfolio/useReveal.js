'use client'

import { useEffect } from 'react'

// Adds `.in` to every `.pf-reveal` element as it scrolls into view.
// `deps` re-scans when the rendered list changes (e.g. switching views).
export default function useReveal(deps = []) {
    useEffect(() => {
        const els = document.querySelectorAll('.pf-reveal:not(.in)')
        if (!('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('in'))
            return
        }
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in')
                    io.unobserve(entry.target)
                }
            })
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
        els.forEach(el => io.observe(el))
        return () => io.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
