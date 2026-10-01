import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { isAdminUser } from '@/lib/auth/roles'
import { PROJECT_STATUS, formatDate, stageProgress } from '@/lib/portal'
import { whatsappLink } from '@/lib/site'
import PortalHeader from './PortalHeader'

export const dynamic = 'force-dynamic'

const STATUS_TONE = { planning: 'info', in_progress: 'good', on_hold: 'warn', completed: 'good', handed_over: 'good' }

export default async function PortalHomePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login?redirectTo=/portal')

    const isAdmin = await isAdminUser(supabase, user.id)

    const { data: projects, error } = await supabase
        .from('projects')
        .select('id, name, code, location, status, start_date, target_completion, project_stages(status)')
        .order('created_at', { ascending: false })

    // A client with one project goes straight to it
    if (!error && !isAdmin && projects?.length === 1) redirect(`/portal/${projects[0].id}`)

    const notSetUp = error && /does not exist|could not find the table|42P01|PGRST205/i.test(`${error.code} ${error.message}`)

    return (
        <>
            <PortalHeader email={user.email} isAdmin={isAdmin} />
            <main className="pt-main">
                {isAdmin && (
                    <div className="pt-admin-note">
                        <span>You’re signed in as an admin, so you can see every client project here exactly as clients see it.</span>
                        <Link href="/admin/portal">Manage projects →</Link>
                    </div>
                )}

                <p className="pt-eyebrow">Welcome</p>
                <h1 className="pt-title">Your projects</h1>
                <p className="pt-sub" style={{ marginBottom: 28 }}>
                    Progress, payments, documents and your live site camera, all in one place.
                </p>

                {notSetUp ? (
                    <div className="pt-empty">
                        The client portal isn’t set up yet. Run <code>supabase/client_portal.sql</code> in Supabase first.
                    </div>
                ) : error ? (
                    <div className="pt-error">Couldn’t load your projects: {error.message}</div>
                ) : !projects?.length ? (
                    <div className="pt-empty">
                        <p style={{ margin: '0 0 14px' }}>
                            There’s no project linked to <strong>{user.email}</strong> yet.
                            <br />If you’ve signed a contract with us, we’ll connect it shortly.
                        </p>
                        <a
                            className="pt-btn green"
                            href={whatsappLink(`Hi Artemis, I've signed in to the client portal (${user.email}) but can't see my project yet.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Message us on WhatsApp
                        </a>
                    </div>
                ) : (
                    <div className="pt-grid cols-2">
                        {projects.map(p => {
                            const pct = stageProgress(p.project_stages || [])
                            return (
                                <Link key={p.id} href={`/portal/${p.id}`} className="pt-card pt-project-card">
                                    <div className="pt-card-head">
                                        <h2 className="pt-card-title">{p.name}</h2>
                                        <span className={`pt-chip ${STATUS_TONE[p.status] || ''}`}>{PROJECT_STATUS[p.status] || p.status}</span>
                                    </div>
                                    <p className="pt-muted" style={{ margin: '0 0 14px' }}>
                                        {[p.code, p.location].filter(Boolean).join(' · ') || ' '}
                                    </p>
                                    <div className="pt-progress" aria-label={`${pct}% of stages approved`}><span style={{ width: `${pct}%` }} /></div>
                                    <p className="pt-stat-note" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                        <span>{pct}% of stages signed off</span>
                                        {p.target_completion && <span>Target: {formatDate(p.target_completion)}</span>}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </main>
        </>
    )
}
