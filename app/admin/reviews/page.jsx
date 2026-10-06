import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { setReviewStatus, deleteReview } from './actions'

export const metadata = {
    title: 'Reviews — Admin',
    robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic' // always show the latest submissions

const TABS = [
    { key: 'pending', label: 'Waiting for approval' },
    { key: 'approved', label: 'Published' },
    { key: 'rejected', label: 'Rejected' },
]

const fmt = iso => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// What the public site shows as the name (mirrors the public_reviews view)
function displayName(r) {
    if (r.publish_name) return r.name
    const parts = String(r.name || '').trim().split(/\s+/)
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
}

function Button({ action, id, status, children, tone = 'default' }) {
    const styles = {
        approve: { background: '#08b796', color: '#fff', border: '1px solid #08b796' },
        danger: { background: '#fff', color: '#c0392b', border: '1px solid #e8b4ae' },
        default: { background: '#fff', color: '#1a1a1a', border: '1px solid #d9d9d9' },
    }[tone]
    return (
        <form action={action}>
            <input type="hidden" name="id" value={id} />
            {status && <input type="hidden" name="status" value={status} />}
            <button type="submit" style={{ ...styles, padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{children}</button>
        </form>
    )
}

export default async function AdminReviewsPage({ searchParams }) {
    const { status: s } = (await searchParams) || {}
    const status = TABS.some(t => t.key === s) ? s : 'pending'
    const supabase = createAdminClient()

    const [{ data: reviews, error }, counts] = await Promise.all([
        supabase.from('client_reviews').select('*').eq('status', status).order('created_at', { ascending: false }),
        Promise.all(TABS.map(t => supabase.from('client_reviews').select('id', { count: 'exact', head: true }).eq('status', t.key).then(r => [t.key, r.count || 0]))),
    ])
    const count = Object.fromEntries(counts)
    const missingTable = error && /42P01|PGRST205|does not exist|could not find/i.test(`${error.code} ${error.message}`)

    return (
        <main style={{ fontFamily: 'DM Sans, sans-serif', background: '#fbfaf8', minHeight: '100vh', padding: '40px 24px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
                <p style={{ fontSize: 13, marginBottom: 12 }}><Link href="/admin" style={{ color: '#067a64' }}>← Dashboard</Link></p>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, marginBottom: 4, color: '#1a1a1a' }}>Client reviews</h1>
                <p style={{ fontSize: 14, color: '#6b6b6b', marginBottom: 24, maxWidth: 640, lineHeight: 1.6 }}>
                    Reviews sent through <a href="/review" target="_blank" rel="noopener noreferrer" style={{ color: '#067a64' }}>artemisatelierltd.com/review</a> wait here until you approve them.
                    Approved reviews appear on the homepage and Build from Abroad straight away. Only approve reviews from real clients.
                </p>

                <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                    {TABS.map(t => (
                        <Link key={t.key} href={`/admin/reviews?status=${t.key}`} style={{
                            padding: '8px 16px', borderRadius: 999, fontSize: 13, textDecoration: 'none',
                            background: t.key === status ? '#1a1a1a' : '#fff', color: t.key === status ? '#fff' : '#1a1a1a', border: '1px solid #d9d9d9',
                        }}>
                            {t.label} ({count[t.key] ?? 0})
                        </Link>
                    ))}
                </nav>

                {missingTable && (
                    <p style={{ color: '#c0392b', fontSize: 14 }}>The reviews table doesn’t exist yet. Run <code>supabase/client_reviews.sql</code> in Supabase → SQL Editor.</p>
                )}
                {error && !missingTable && <p style={{ color: '#c0392b', fontSize: 14 }}>Could not load reviews: {error.message}</p>}
                {!error && reviews?.length === 0 && <p style={{ fontSize: 14, color: '#8a8a8a' }}>Nothing here.</p>}

                <div style={{ display: 'grid', gap: 16 }}>
                    {(reviews || []).map(r => (
                        <article key={r.id} style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 24 }}>
                            <p style={{ color: '#eda100', fontSize: 18, letterSpacing: 2, margin: '0 0 8px' }} aria-label={`${r.rating} out of 5`}>
                                {'★'.repeat(r.rating || 0)}<span style={{ color: '#d9d9d9' }}>{'★'.repeat(5 - (r.rating || 0))}</span>
                            </p>
                            <blockquote style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap' }}>“{r.quote}”</blockquote>
                            <p style={{ fontSize: 13, color: '#1a1a1a', margin: '0 0 4px' }}>
                                <strong>{r.name}</strong>
                                {[r.location, r.project, r.year].filter(Boolean).map(x => ` · ${x}`).join('')}
                            </p>
                            <p style={{ fontSize: 12, color: '#8a8a8a', margin: '0 0 16px' }}>
                                Shown on the site as <strong style={{ color: '#555' }}>{displayName(r)}</strong> · <a href={`mailto:${r.email}`} style={{ color: '#067a64' }}>{r.email}</a> (private) · sent {fmt(r.created_at)}
                            </p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {status !== 'approved' && <Button action={setReviewStatus} id={r.id} status="approved" tone="approve">Approve and publish</Button>}
                                {status !== 'rejected' && <Button action={setReviewStatus} id={r.id} status="rejected">{status === 'approved' ? 'Unpublish' : 'Reject'}</Button>}
                                {status !== 'pending' && <Button action={setReviewStatus} id={r.id} status="pending">Move back to waiting</Button>}
                                <Button action={deleteReview} id={r.id} tone="danger">Delete</Button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    )
}
