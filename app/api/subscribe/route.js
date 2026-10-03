import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Newsletter, monthly material-price and cost-guide sign-ups → newsletter_subscribers
// (table from supabase/seo_conversion.sql). Export the list from Supabase
// into your email tool (Mailchimp, Brevo, etc.) when you send an update.
export async function POST(request) {
    let body
    try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
    if (body.website) return NextResponse.json({ ok: true }) // bot trap

    const email = String(body.email || '').trim().toLowerCase().slice(0, 200)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    const list = ['news', 'material-prices', 'cost-guide'].includes(body.list) ? body.list : 'news'

    const supabase = await createClient()
    const { error } = await supabase.from('newsletter_subscribers').insert({ email, list, source_page: String(body.page || '').slice(0, 200) || null })
    // Already subscribed (unique email+list) counts as success
    if (error && !/duplicate|23505/i.test(`${error.code} ${error.message}`)) {
        console.error('newsletter insert failed:', error)
        return NextResponse.json({ error: 'Could not subscribe right now. Please try again later.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}
