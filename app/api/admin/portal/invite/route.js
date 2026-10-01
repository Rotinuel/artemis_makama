import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * POST { projectId, email, fullName }
 * Gives a client access to a project and returns a one-time "set your
 * password" link for the admin to send (WhatsApp, email, …).
 * - New email      → creates the account (invite link)
 * - Existing email → just adds them to the project (password-setup link)
 * No email is sent by Supabase, so it works without SMTP set up.
 */
export async function POST(request) {
    const { response } = await requireAdmin()
    if (response) return response

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json(
            { error: 'SUPABASE_SERVICE_ROLE_KEY is missing from the server environment (.env).' },
            { status: 500 }
        )
    }

    const body = await request.json().catch(() => ({}))
    const projectId = String(body.projectId || '')
    const email = String(body.email || '').trim().toLowerCase()
    const fullName = String(body.fullName || '').trim().slice(0, 120)

    if (!/^[0-9a-f-]{36}$/i.test(projectId)) {
        return NextResponse.json({ error: 'Unknown project.' }, { status: 400 })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: project, error: projectError } = await admin
        .from('projects').select('id, name').eq('id', projectId).maybeSingle()
    if (projectError || !project) {
        return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
    }

    // New account → invite link. Already registered → password-setup link.
    let type = 'invite'
    let { data, error } = await admin.auth.admin.generateLink({
        type: 'invite',
        email,
        options: { data: fullName ? { full_name: fullName } : undefined },
    })
    if (error && /already|registered|exists/i.test(error.message || '')) {
        type = 'recovery'
        ;({ data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email }))
    }
    if (error || !data?.user?.id || !data?.properties?.hashed_token) {
        console.error('[portal invite] generateLink failed:', error)
        return NextResponse.json({ error: error?.message || 'Could not create the sign-in link.' }, { status: 500 })
    }

    const { error: memberError } = await admin.from('project_members').upsert(
        { project_id: projectId, user_id: data.user.id, email, full_name: fullName || null },
        { onConflict: 'project_id,user_id' }
    )
    if (memberError) {
        console.error('[portal invite] membership failed:', memberError)
        return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    // The link opens a small "Continue" page first, so WhatsApp / email link
    // previews can't use up the one-time token before the client clicks.
    const origin = request.nextUrl.origin
    const params = new URLSearchParams({ token_hash: data.properties.hashed_token, type })
    const link = `${origin}/auth/confirm?${params.toString()}`

    return NextResponse.json({
        ok: true,
        link,
        existing: type === 'recovery',
        project: project.name,
        member: { user_id: data.user.id, email, full_name: fullName || null },
    })
}
