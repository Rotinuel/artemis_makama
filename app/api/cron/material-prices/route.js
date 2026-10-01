import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { runMaterialPricesJob } from '@/lib/material-prices/job'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // web research can take a couple of minutes

// GET — daily scheduler. Must send:  Authorization: Bearer <CRON_SECRET>
export async function GET(request) {
    const secret = process.env.CRON_SECRET
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return run()
}

// POST — "Check prices now" button in the admin (logged-in admins only)
export async function POST() {
    const { response } = await requireAdmin()
    if (response) return response
    return run()
}

async function run() {
    try {
        const report = await runMaterialPricesJob()
        return NextResponse.json({ ok: true, ...report })
    } catch (err) {
        console.error('[material-prices] job failed:', err)
        return NextResponse.json({ ok: false, error: String(err.message || err) }, { status: 500 })
    }
}
