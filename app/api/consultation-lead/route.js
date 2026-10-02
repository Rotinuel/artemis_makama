import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Stores every enquiry from the website in consultation_leads (Admin → Leads):
//   source 'diaspora-consultation' / 'booking' — consultation + optional call slot
//   source 'contact-form'                      — the /contact form
// Extra columns come from supabase/seo_conversion.sql. If that hasn't been
// run yet, the extras are folded into the `contact` text so nothing is lost.

const clip = (v, n = 500) => (v == null ? null : String(v).trim().slice(0, n) || null)
const SOURCES = ['diaspora-consultation', 'booking', 'contact-form', 'project-page', 'service-page']

export async function POST(request) {
    let body
    try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

    // Spam trap: the hidden "website" field is only ever filled by bots
    if (body.website) return NextResponse.json({ ok: true })

    const source = SOURCES.includes(body.source) ? body.source : 'diaspora-consultation'
    const name = clip(body.name, 120)
    const contact = clip(body.contact, 200) || clip(body.email, 200) || clip(body.phone, 60)

    if (!name || !contact) {
        return NextResponse.json({ error: 'Please give your name and a way to reach you.' }, { status: 400 })
    }
    if (source !== 'contact-form' && (!clip(body.country) || !clip(body.location))) {
        return NextResponse.json({ error: 'Please say where you are based and where you are building.' }, { status: 400 })
    }

    let preferredSlot = null
    if (body.preferredSlot) {
        const d = new Date(body.preferredSlot)
        if (!isNaN(d) && d.getTime() > Date.now() - 864e5 && d.getTime() < Date.now() + 90 * 864e5) preferredSlot = d.toISOString()
    }

    const base = {
        name,
        country: clip(body.country, 80) || (source === 'contact-form' ? 'Not given' : null),
        location: clip(body.location, 160) || (source === 'contact-form' ? 'Not given' : null),
        has_land: clip(body.hasLand, 40),
        budget: clip(body.budget, 80),
        contact,
        source,
    }
    const extra = {
        email: clip(body.email, 200),
        phone: clip(body.phone, 60),
        message: clip(body.message, 4000),
        project_type: clip(body.projectType, 80),
        inquiry: clip(body.inquiry, 80),
        organization: clip(body.company, 160),
        preferred_slot: preferredSlot,
        timezone: clip(body.timezone, 64),
        page: clip(body.page, 200),
    }

    const supabase = await createClient()
    let { error } = await supabase.from('consultation_leads').insert({ ...base, ...stripEmpty(extra) })

    // Columns not added yet (PGRST204 / 42703): save the essentials + a summary
    if (error && /PGRST204|42703|column/i.test(`${error.code} ${error.message}`)) {
        const summary = Object.entries(stripEmpty(extra)).map(([k, v]) => `${k}: ${v}`).join(' | ')
        ;({ error } = await supabase.from('consultation_leads').insert({ ...base, contact: [contact, summary].filter(Boolean).join(' | ').slice(0, 3900) }))
    }

    if (error) {
        console.error('consultation_leads insert failed:', error)
        return NextResponse.json({ error: 'Could not save your details. Please try again, or WhatsApp us.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}

function stripEmpty(o) {
    return Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== ''))
}
