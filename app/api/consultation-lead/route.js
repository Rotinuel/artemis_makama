import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const body = await request.json()

    const { name, country, location, hasLand, budget, contact } = body

    // Minimal server-side validation — mirrors the `required` fields on the form
    if (!name || !country || !location || !contact) {
        return NextResponse.json(
            { error: 'Missing required fields.' },
            { status: 400 }
        )
    }

    const supabase = await createClient()

    const { error } = await supabase.from('consultation_leads').insert({
        name,
        country,
        location,
        has_land: hasLand || null,
        budget: budget || null,
        contact,
        source: 'diaspora-consultation',
    })

    if (error) {
        console.error('consultation_leads insert failed:', error)
        return NextResponse.json(
            { error: 'Could not save your details. Please try again.' },
            { status: 500 }
        )
    }

    // Optional: trigger a notification (email/WhatsApp) here so your team
    // knows immediately instead of having to poll the database.
    // e.g. await fetch('https://api.resend.com/emails', { ... })

    return NextResponse.json({ ok: true })
}



// import { createClient } from '@/utils/supabase/server'
// import { NextResponse } from 'next/server'

// export async function POST(request) {
//     const body = await request.json()

//     const { name, country, location, hasLand, budget, timeline } = body

//     // Minimal server-side validation — mirrors the `required` fields on the form
//     if (!name || !country || !location) {
//         return NextResponse.json(
//             { error: 'Missing required fields.' },
//             { status: 400 }
//         )
//     }

//     const supabase = await createClient()

//     const { error } = await supabase.from('consultation_leads').insert({
//         name,
//         country,
//         location,
//         has_land: hasLand || null,
//         budget: budget || null,
//         timeline: timeline || null,
//         source: 'diaspora-consultation',
//     })

//     if (error) {
//         console.error('consultation_leads insert failed:', error)
//         return NextResponse.json(
//             { error: 'Could not save your details. Please try again.' },
//             { status: 500 }
//         )
//     }

//     // Optional: trigger a notification (email/WhatsApp) here so your team
//     // knows immediately instead of having to poll the database.
//     // e.g. await fetch('https://api.resend.com/emails', { ... })

//     return NextResponse.json({ ok: true })
// }