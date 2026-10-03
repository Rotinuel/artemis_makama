'use client'

import { useEffect, useMemo, useState } from 'react'
import { SITE, whatsappLink, COST_GUIDE_PDF } from '@/lib/site'
import { formatMoney, fromNaira, FALLBACK } from '@/lib/fx'
import { track } from '@/lib/track'

// Office hours for calls, Lagos time (WAT = UTC+1 all year)
const OPEN_HOUR = 9
const LAST_START = 16.5 // last call starts 16:30 WAT
const STEP_MIN = 30
const DAYS_AHEAD = 12
const LAGOS_OFFSET_MIN = 60

const ZONES = [
    ['Europe/London', 'London (UK)'],
    ['America/New_York', 'New York / Houston (ET/CT)'],
    ['America/Toronto', 'Toronto (Canada)'],
    ['America/Los_Angeles', 'Los Angeles (PT)'],
    ['Australia/Sydney', 'Sydney (Australia)'],
    ['Europe/Berlin', 'Berlin / Paris'],
    ['Asia/Dubai', 'Dubai (UAE)'],
    ['Africa/Johannesburg', 'Johannesburg'],
    ['Africa/Lagos', 'Lagos (Nigeria)'],
]

const COUNTRIES = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Ireland', 'Germany', 'UAE', 'South Africa', 'Nigeria', 'Other']

const BUDGETS = [
    { label: 'Under ₦50 million', min: 0, max: 50e6 },
    { label: '₦50 – 150 million', min: 50e6, max: 150e6 },
    { label: '₦150 – 400 million', min: 150e6, max: 400e6 },
    { label: 'Over ₦400 million', min: 400e6, max: null },
    { label: 'Not sure yet' },
]

/** Working-day slots in Lagos time, as UTC Date objects */
function buildDays(now = new Date()) {
    const days = []
    // Start from tomorrow (Lagos date)
    const lagosNow = new Date(now.getTime() + LAGOS_OFFSET_MIN * 60000)
    for (let i = 1; days.length < DAYS_AHEAD && i < DAYS_AHEAD * 2; i++) {
        const d = new Date(Date.UTC(lagosNow.getUTCFullYear(), lagosNow.getUTCMonth(), lagosNow.getUTCDate() + i))
        if (d.getUTCDay() === 0) continue // closed Sundays
        const slots = []
        for (let h = OPEN_HOUR; h <= LAST_START; h += STEP_MIN / 60) {
            const hh = Math.floor(h), mm = Math.round((h - hh) * 60)
            // Lagos wall time → UTC
            slots.push(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hh, mm) - LAGOS_OFFSET_MIN * 60000))
        }
        days.push({ key: d.toISOString().slice(0, 10), date: d, slots })
    }
    return days
}

const fmt = (date, tz, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date)

export default function ConsultationBooking({ rates = FALLBACK, source = 'booking', heading = 'Book your free 20-minute consultation', defaultCountry = '' }) {
    const [tz, setTz] = useState('Europe/London')
    const [days, setDays] = useState([])
    const [dayKey, setDayKey] = useState('')
    const [slot, setSlot] = useState(null)
    const [form, setForm] = useState({ name: '', country: defaultCountry, location: '', hasLand: '', budget: '', contact: '', message: '', website: '' })
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)

    // Build the calendar and guess the visitor's time zone on the client only
    useEffect(() => {
        const d = buildDays()
        setDays(d)
        setDayKey(d[0]?.key || '')
        try {
            const guess = Intl.DateTimeFormat().resolvedOptions().timeZone
            if (guess) setTz(guess)
        } catch { /* keep London */ }
    }, [])

    const zoneOptions = useMemo(() => {
        const known = ZONES.some(([z]) => z === tz)
        return known ? ZONES : [[tz, `${tz.replace(/_/g, ' ')} (your time)`], ...ZONES]
    }, [tz])

    const day = days.find(d => d.key === dayKey)
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    const budgetHint = b => {
        if (b.min == null) return ''
        const gbp = v => formatMoney(fromNaira(v, 'GBP', rates), 'GBP')
        const usd = v => formatMoney(fromNaira(v, 'USD', rates), 'USD')
        if (b.max == null) return ` (≈ ${gbp(b.min)}+ / ${usd(b.min)}+)`
        if (!b.min) return ` (≈ up to ${gbp(b.max)} / ${usd(b.max)})`
        return ` (≈ ${gbp(b.min)}–${gbp(b.max)} / ${usd(b.min)}–${usd(b.max)})`
    }

    const slotLabel = s => s
        ? `${fmt(s, tz, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} your time (${fmt(s, 'Africa/Lagos', { hour: '2-digit', minute: '2-digit' })} in Lagos)`
        : ''

    async function submit(e) {
        e.preventDefault()
        setError('')
        if (!form.name.trim() || !form.country || !form.location.trim() || !form.contact.trim()) {
            return setError('Please fill in your name, where you are based, where you are building and how to reach you.')
        }
        setBusy(true)
        try {
            const res = await fetch('/api/consultation-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    source,
                    preferredSlot: slot ? slot.toISOString() : null,
                    timezone: tz,
                    page: typeof window !== 'undefined' ? window.location.pathname : '',
                }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.error || 'Something went wrong.')
            track('generate_lead', { form: source, has_slot: !!slot, country: form.country })
            setDone(true)
        } catch (err) {
            setError(err.message || 'Could not send. Please try again or WhatsApp us.')
        } finally {
            setBusy(false)
        }
    }

    if (done) {
        const msg = `Hi Artemis, this is ${form.name}. I've just booked a consultation on your website` +
            (slot ? ` for ${slotLabel(slot)}` : '') + `. I'm building in ${form.location}.`
        return (
            <div className="border border-[#e0e0e0] bg-white p-8 text-center md:p-10">
                <p className="mb-2 text-[26px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Thank you, {form.name.split(' ')[0]}.</p>
                <p className="mx-auto max-w-md text-[14px] leading-relaxed text-[#555]">
                    {slot
                        ? <>We&apos;ve received your request for <strong>{slotLabel(slot)}</strong>. We&apos;ll confirm by WhatsApp or email within one working day.</>
                        : <>We&apos;ve received your details and will reply within one working day to arrange your call.</>}
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#08b796] px-6 py-3 text-[13px] font-medium text-[#04120f] hover:bg-[#1a1a1a] hover:text-white">
                        Confirm on WhatsApp
                    </a>
                    <a href={COST_GUIDE_PDF} download className="rounded-full border border-[#1a1a1a] px-6 py-3 text-[13px] font-medium text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white">
                        Download the 2026 build cost guide (PDF)
                    </a>
                </div>
            </div>
        )
    }

    const input = 'w-full border border-[#dcdcdc] bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-[#1a1a1a]'
    const label = 'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#6b6b6b]'

    return (
        <form onSubmit={submit} className="space-y-6 border border-[#e0e0e0] bg-white p-6 md:p-10" noValidate>
            {heading && <p className="text-[24px] leading-tight text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{heading}</p>}

            {/* Honeypot: real people never see or fill this */}
            <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            {/* ── 1. Pick a time ── */}
            <fieldset>
                <legend className={label}>1 · Pick a time (optional)</legend>
                <div className="mb-3">
                    <label htmlFor="bk-tz" className="sr-only">Your time zone</label>
                    <select id="bk-tz" value={tz} onChange={e => setTz(e.target.value)} className={input}>
                        {zoneOptions.map(([z, l]) => <option key={z} value={z}>{l}</option>)}
                    </select>
                </div>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="radiogroup" aria-label="Day">
                    {days.map(d => (
                        <button
                            key={d.key}
                            type="button"
                            role="radio"
                            aria-checked={dayKey === d.key}
                            onClick={() => { setDayKey(d.key); setSlot(null) }}
                            className={`shrink-0 border px-3 py-2 text-center text-[12px] leading-tight transition-colors ${dayKey === d.key ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#dcdcdc] text-[#333] hover:border-[#1a1a1a]'}`}
                        >
                            <span className="block font-semibold">{fmt(d.slots[0], 'Africa/Lagos', { weekday: 'short' })}</span>
                            <span className="block">{fmt(d.slots[0], 'Africa/Lagos', { day: 'numeric', month: 'short' })}</span>
                        </button>
                    ))}
                </div>
                {day && (
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Time">
                        {day.slots.map(s => {
                            const on = slot?.getTime() === s.getTime()
                            return (
                                <button
                                    key={s.toISOString()}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    onClick={() => setSlot(on ? null : s)}
                                    className={`border px-2 py-2 text-[13px] tabular-nums transition-colors ${on ? 'border-[#08b796] bg-[#08b796]/10 font-semibold text-[#067a64]' : 'border-[#e3e3e3] text-[#333] hover:border-[#1a1a1a]'}`}
                                >
                                    {fmt(s, tz, { hour: '2-digit', minute: '2-digit' })}
                                </button>
                            )
                        })}
                    </div>
                )}
                <p className="mt-2 text-[12px] text-[#8a8a8a]">
                    {slot ? <>Selected: <strong className="text-[#1a1a1a]">{slotLabel(slot)}</strong></> : `Times shown in your time zone. We take calls ${SITE.hours.days}, 09:00–17:00 Lagos time.`}
                </p>
            </fieldset>

            {/* ── 2. About you ── */}
            <fieldset className="space-y-4">
                <legend className={label}>2 · About you and your project</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="bk-name" className={label}>Full name *</label>
                        <input id="bk-name" required value={form.name} onChange={set('name')} className={input} placeholder="e.g. Chidinma Okafor" autoComplete="name" />
                    </div>
                    <div>
                        <label htmlFor="bk-country" className={label}>Where are you based? *</label>
                        <select id="bk-country" required value={form.country} onChange={set('country')} className={input}>
                            <option value="" disabled>Select a country</option>
                            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="bk-loc" className={label}>Where in Nigeria are you building? *</label>
                        <input id="bk-loc" required value={form.location} onChange={set('location')} className={input} placeholder="e.g. Lekki, Lagos" />
                    </div>
                    <div>
                        <label htmlFor="bk-land" className={label}>Do you own the land?</label>
                        <select id="bk-land" value={form.hasLand} onChange={set('hasLand')} className={input}>
                            <option value="">Select one</option>
                            {['Yes', 'No', 'In progress'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="bk-budget" className={label}>Approximate budget</label>
                    <select id="bk-budget" value={form.budget} onChange={set('budget')} className={input}>
                        <option value="">Select one</option>
                        {BUDGETS.map(b => <option key={b.label} value={b.label}>{b.label}{budgetHint(b)}</option>)}
                    </select>
                    <p className="mt-1 text-[11px] text-[#9a9a9a]">Pound and dollar figures use {rates.source} ({rates.date}).</p>
                </div>
                <div>
                    <label htmlFor="bk-contact" className={label}>WhatsApp number or email *</label>
                    <input id="bk-contact" required value={form.contact} onChange={set('contact')} className={input} placeholder="e.g. +44 7911 123456 or you@email.com" autoComplete="email" />
                </div>
                <div>
                    <label htmlFor="bk-msg" className={label}>Anything we should know? (optional)</label>
                    <textarea id="bk-msg" rows={3} value={form.message} onChange={set('message')} className={`${input} resize-none`} placeholder="e.g. 4-bedroom duplex, land in Ajah, want to start next year" />
                </div>
            </fieldset>

            {error && <p className="text-[13px] text-[#c0392b]" role="alert">{error}</p>}

            <button type="submit" disabled={busy} className="w-full bg-[#08b796] py-4 text-[13px] font-medium tracking-wide text-white transition-colors hover:bg-[#079e82] disabled:cursor-not-allowed disabled:opacity-60">
                {busy ? 'Sending…' : slot ? 'Request this time' : 'Send my details'}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-[#8a8a8a]">
                Free, no obligation. We&apos;ll never ask you to send money before you&apos;ve spoken with us.
                We use your details only to reply about your project — see our <a href="/privacy" className="underline">privacy policy</a>.
            </p>
        </form>
    )
}
