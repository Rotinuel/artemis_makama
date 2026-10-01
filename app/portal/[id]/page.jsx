import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { isAdminUser } from '@/lib/auth/roles'
import { PORTAL_BUCKET } from '@/lib/portal'
import PortalHeader from '../PortalHeader'
import ProjectView from './ProjectView'

export const dynamic = 'force-dynamic'

const SIGNED_URL_SECONDS = 60 * 60 * 2 // links to private files last 2 hours

export async function generateMetadata({ params }) {
    const { id } = await params
    const supabase = await createClient()
    const { data } = await supabase.from('projects').select('name').eq('id', id).maybeSingle()
    return { title: data?.name ? `${data.name} · Client Portal` : 'Client Portal' }
}

export default async function PortalProjectPage({ params, searchParams }) {
    const { id } = await params
    const { tab } = await searchParams
    if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect(`/login?redirectTo=/portal/${id}`)

    // Row-level security only returns this project if the user is on it (or an admin)
    const { data: project } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
    if (!project) notFound()

    const [isAdmin, stages, payments, updates, documents, defects, memberships] = await Promise.all([
        isAdminUser(supabase, user.id),
        supabase.from('project_stages').select('*').eq('project_id', id).order('position').order('created_at'),
        supabase.from('project_payments').select('*').eq('project_id', id).order('position').order('due_date', { nullsFirst: false }),
        supabase.from('project_updates').select('*').eq('project_id', id).order('posted_at', { ascending: false }).limit(60),
        supabase.from('project_documents').select('*').eq('project_id', id).order('uploaded_at', { ascending: false }),
        supabase.from('defect_requests').select('*').eq('project_id', id).order('created_at', { ascending: false }),
        supabase.from('project_members').select('project_id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])

    // Sign every private file this page shows, in one request
    const paths = new Set()
    ;(updates.data || []).forEach(u => (u.photos || []).forEach(p => paths.add(p)))
    ;(defects.data || []).forEach(d => (d.photos || []).forEach(p => paths.add(p)))
    ;(payments.data || []).forEach(p => p.receipt_path && paths.add(p.receipt_path))
    ;(documents.data || []).forEach(d => d.file_path && paths.add(d.file_path))

    const urls = {}
    if (paths.size) {
        const { data: signed } = await supabase.storage.from(PORTAL_BUCKET).createSignedUrls([...paths], SIGNED_URL_SECONDS)
        ;(signed || []).forEach(s => { if (s.signedUrl && s.path) urls[s.path] = s.signedUrl })
    }

    const firstName = (user.user_metadata?.full_name || '').split(' ')[0] || ''

    return (
        <>
            <PortalHeader email={user.email} isAdmin={isAdmin} showAllLink={isAdmin || (memberships.count || 0) > 1} />
            <ProjectView
                project={project}
                stages={stages.data || []}
                payments={payments.data || []}
                updates={updates.data || []}
                documents={documents.data || []}
                defects={defects.data || []}
                urls={urls}
                userId={user.id}
                firstName={firstName}
                isAdmin={isAdmin}
                initialTab={typeof tab === 'string' ? tab : 'overview'}
            />
        </>
    )
}
