'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { isAdminUser } from '@/lib/auth/roles'

// Server actions for /admin/reviews. Each one re-checks that the caller is
// a signed-in admin before touching the database.
async function assertAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await isAdminUser(supabase, user.id))) throw new Error('Admins only.')
}

// Pages that show approved reviews: refresh them straight away
function refreshSite() {
    revalidatePath('/')
    revalidatePath('/build-from-abroad')
    revalidatePath('/admin/reviews')
}

const STATUSES = ['pending', 'approved', 'rejected']

export async function setReviewStatus(formData) {
    await assertAdmin()
    const id = Number(formData.get('id'))
    const status = String(formData.get('status'))
    if (!id || !STATUSES.includes(status)) throw new Error('Invalid request.')
    const { error } = await createAdminClient().from('client_reviews').update({ status }).eq('id', id)
    if (error) throw new Error(error.message)
    refreshSite()
}

export async function deleteReview(formData) {
    await assertAdmin()
    const id = Number(formData.get('id'))
    if (!id) throw new Error('Invalid request.')
    const { error } = await createAdminClient().from('client_reviews').delete().eq('id', id)
    if (error) throw new Error(error.message)
    refreshSite()
}
