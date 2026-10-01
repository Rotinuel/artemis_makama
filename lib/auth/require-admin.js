import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isAdminUser } from './roles'

/**
 * For route handlers: returns { user, supabase } when the caller is a signed-in
 * admin, otherwise { response } holding a 401/403 to send back.
 */
export async function requireAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { response: NextResponse.json({ error: 'Please sign in again.' }, { status: 401 }) }
    if (!(await isAdminUser(supabase, user.id))) {
        return { response: NextResponse.json({ error: 'Admins only.' }, { status: 403 }) }
    }
    return { user, supabase }
}
