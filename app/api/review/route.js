import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Client review submissions → client_reviews (status 'pending').
// Nothing is published until an admin approves it in Supabase
// (see supabase/client_reviews.sql).
const clean = (v, max) => String(v || '').trim().slice(0, max)

export async function POST(request) {
    let body
    try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
    if (body.website) return NextResponse.json({ ok: true }) // bot trap

    const name = clean(body.name, 120)
    const email = clean(body.email, 200).toLowerCase()
    const quote = clean(body.quote, 1200)
    const rating = Number(body.rating)
    if (!name || !quote) return NextResponse.json({ error: 'Please add your name and your review.' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address (it is never published).' }, { status: 400 })
    if (quote.length < 30) return NextResponse.json({ error: 'Please write a little more about your experience (at least a sentence or two).' }, { status: 400 })
    if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Please choose a rating from 1 to 5.' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase.from('client_reviews').insert({
        name, email, quote, rating,
        publish_name: !!body.publishName,
        location: clean(body.location, 120) || null,
        project: clean(body.project, 160) || null,
        year: clean(body.year, 10) || null,
        source_page: clean(body.page, 200) || null,
        status: 'pending',
    })
    if (error) {
        console.error('review insert failed:', error)
        return NextResponse.json({ error: 'Could not send your review right now. Please try again later, or send it to us on WhatsApp.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
}
