import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { runIndustryNewsJob } from '@/lib/industry-news/job'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // seconds — feeds + one Claude call

// GET — called once a day by the scheduler (Vercel Cron, cron-job.org, etc.)
// Must send:  Authorization: Bearer <CRON_SECRET>
export async function GET(request) {
    const secret = process.env.CRON_SECRET
    const auth = request.headers.get('authorization')
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return run()
}

// POST — "Fetch now" button in the admin page (logged-in admins only)
export async function POST() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return run()
}

async function run() {
    try {
        const report = await runIndustryNewsJob()
        return NextResponse.json({ ok: true, ...report })
    } catch (err) {
        console.error('[industry-news] job failed:', err)
        return NextResponse.json({ ok: false, error: String(err.message || err) }, { status: 500 })
    }
}
