'use client'

import { useState } from 'react'
import { track } from '@/lib/track'

/** Email sign-up → /api/subscribe. list: 'news' | 'material-prices' */
export default function SubscribeForm({ list = 'news', button = 'Subscribe', placeholder = 'Your email address', dark = false, note }) {
    const [email, setEmail] = useState('')
    const [hp, setHp] = useState('')
    const [state, setState] = useState('idle') // idle | busy | done | error
    const [msg, setMsg] = useState('')

    async function submit(e) {
        e.preventDefault()
        setState('busy')
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, list, website: hp, page: window.location.pathname }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.error || 'Could not subscribe.')
            track('newsletter_signup', { list })
            setState('done')
        } catch (err) {
            setMsg(err.message)
            setState('error')
        }
    }

    if (state === 'done') {
        return <p className={`text-[14px] ${dark ? 'text-white/80' : 'text-[#067a64]'}`}>Thanks — you’re on the list.</p>
    }
    return (
        <form onSubmit={submit} className="space-y-3">
            <input type="text" value={hp} onChange={e => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <label htmlFor={`sub-${list}`} className="sr-only">Email address</label>
            <input
                id={`sub-${list}`}
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={placeholder}
                className={`w-full border px-4 py-3 text-[14px] outline-none transition-colors ${dark ? 'border-white/25 bg-transparent text-white placeholder:text-white/40 focus:border-white' : 'border-[#e0e0e0] focus:border-[#1a1a1a]'}`}
            />
            <button type="submit" disabled={state === 'busy'} className={`w-full py-3 text-[12px] uppercase tracking-[0.1em] transition-colors disabled:opacity-60 ${dark ? 'bg-white text-[#111] hover:bg-[#08b796]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}>
                {state === 'busy' ? 'Subscribing…' : button}
            </button>
            {state === 'error' && <p className="text-[12px] text-[#c0392b]" role="alert">{msg}</p>}
            {note && <p className={`text-[11px] leading-relaxed ${dark ? 'text-white/50' : 'text-[#9a9a9a]'}`}>{note}</p>}
        </form>
    )
}
