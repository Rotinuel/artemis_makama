// Who is an admin? Admins are the user ids listed in the `admins` table
// (see supabase/client_portal.sql). Everyone else who can sign in is a
// client and only gets the client portal.
//
// Until that SQL has been run the table doesn't exist; in that case we keep
// the old behaviour (every signed-in account is an admin) so nobody gets
// locked out of /admin in the meantime.

function tableMissing(error) {
    if (!error) return false
    const msg = `${error.code || ''} ${error.message || ''}`
    return /42P01|PGRST205|does not exist|could not find the table/i.test(msg)
}

/** @returns {Promise<boolean>} */
export async function isAdminUser(supabase, userId) {
    if (!userId) return false
    const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()
    if (error) return tableMissing(error)
    return !!data
}

/** Where a signed-in user should land by default */
export async function homeFor(supabase, userId) {
    return (await isAdminUser(supabase, userId)) ? '/admin' : '/portal'
}

/** A same-site path or null (blocks open redirects like //evil.com) */
export function safeNext(value) {
    if (!value || typeof value !== 'string') return null
    if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null
    return value
}
