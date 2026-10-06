'use client'

import { useState } from 'react'
import { track } from '@/lib/track'

const input = 'w-full min-w-0 border border-[#dcdcdc] bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-[#1a1a1a]'
const label = 'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#6b6b6b]'

/** Review form → /api/review (saved as pending until approved) */
export default function ReviewForm({ googleReviewUrl = '' }) {
    const [f, setF] = useState({ name: '', email: '', location: '', project: '', year: '', rating: 0, quote: '', publishName: false, website: '' })
    const [state, setState] = useState('idle')
    const [msg, setMsg] = useState('')
    const set = k => e => setF(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

    async function submit(e) {
        e.preventDefault()
        setState('busy'); setMsg('')
        try {
            const res = await fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, page: window.location.pathname }) })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.error || 'Could not send your review.')
            track('review_submitted', { rating: f.rating })
            setState('done')
        } catch (err) { setMsg(err.message); setState('error') }
    }

    if (state === 'done') {
        return (
            <div className="space-y-4 border border-[#e0e0e0] bg-white p-6 md:p-10">
                <p className="text-[24px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Thank you for your review.</p>
                <p className="text-[15px] leading-relaxed text-[#555]">We check every review before it appears on the site, usually within a few days.</p>
                {googleReviewUrl && (
                    <p className="text-[15px] leading-relaxed text-[#555]">
                        It would help us a great deal if you also posted it on Google:{' '}
                        <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#067a64] underline">leave a Google review</a>.
                    </p>
                )}
            </div>
        )
    }

    return (
        <form onSubmit={submit} className="w-full min-w-0 space-y-5 border border-[#e0e0e0] bg-white p-6 md:p-10" noValidate>
            <input type="text" value={f.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <fieldset className="min-w-0">
                <legend className={label}>Your rating *</legend>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" role="radio" aria-checked={f.rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
                            onClick={() => setF(v => ({ ...v, rating: n }))}
                            className={`text-[30px] leading-none transition-colors ${n <= f.rating ? 'text-[#eda100]' : 'text-[#d9d9d9] hover:text-[#eda100]/60'}`}>★</button>
                    ))}
                </div>
            </fieldset>
            <div>
                <label htmlFor="rv-quote" className={label}>Your review *</label>
                <textarea id="rv-quote" rows={5} required value={f.quote} onChange={set('quote')} className={`${input} resize-y`} placeholder="What did we build or design for you? How was the process, the reporting, the result?" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="rv-name" className={label}>Full name *</label>
                    <input id="rv-name" required value={f.name} onChange={set('name')} className={input} autoComplete="name" />
                </div>
                <div>
                    <label htmlFor="rv-email" className={label}>Email * (never published)</label>
                    <input id="rv-email" type="email" required value={f.email} onChange={set('email')} className={input} autoComplete="email" />
                </div>
                <div>
                    <label htmlFor="rv-loc" className={label}>Where you live</label>
                    <input id="rv-loc" value={f.location} onChange={set('location')} className={input} placeholder="e.g. London, UK" />
                </div>
                <div>
                    <label htmlFor="rv-proj" className={label}>Your project</label>
                    <input id="rv-proj" value={f.project} onChange={set('project')} className={input} placeholder="e.g. 4-bed duplex, Lekki" />
                </div>
                <div>
                    <label htmlFor="rv-year" className={label}>Year</label>
                    <input id="rv-year" inputMode="numeric" value={f.year} onChange={set('year')} className={input} placeholder="e.g. 2025" />
                </div>
            </div>
            <label className="flex items-start gap-3 text-[14px] leading-relaxed text-[#333]">
                <input type="checkbox" checked={f.publishName} onChange={set('publishName')} className="mt-1 h-4 w-4 accent-[#08b796]" />
                <span>Show my full name with the review. (If unticked, we show only your first name and initial.)</span>
            </label>
            {state === 'error' && <p className="text-[13px] text-[#c0392b]" role="alert">{msg}</p>}
            <button type="submit" disabled={state === 'busy'} className="w-full bg-[#08b796] py-4 text-[13px] font-medium tracking-wide text-white transition-colors hover:bg-[#079e82] disabled:opacity-60">
                {state === 'busy' ? 'Sending…' : 'Send my review'}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-[#8a8a8a]">By sending this you agree we may publish your review on our website. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
        </form>
    )
}
