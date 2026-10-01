import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { safeNext } from '@/lib/auth/roles'

// Landing point for links in Supabase auth emails (e.g. password reset).
// Turns the one-time code in the link into a signed-in session, then
// sends the user on to `next` (only same-site paths are allowed).
export async function GET(request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    // Default: the login page, which forwards admins to /admin and clients to /portal
    const next = safeNext(searchParams.get('next')) || '/login'

    const supabase = await createClient()
    let error = null

    if (code) {
        ({ error } = await supabase.auth.exchangeCodeForSession(code))
    } else if (tokenHash && type) {
        ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }))
    } else {
        error = new Error('Missing code')
    }

    if (error) {
        return NextResponse.redirect(`${origin}/forgot-password?error=link`)
    }
    return NextResponse.redirect(`${origin}${next}`)
}
