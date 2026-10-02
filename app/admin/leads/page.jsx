import { createAdminClient } from '@/utils/supabase/admin'

export const metadata = {
    title: 'Leads — Admin',
    robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic' // always show fresh leads, never cache

function formatDate(iso) {
    return new Date(iso).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const SOURCE_LABELS = {
    'diaspora-consultation': 'Build from abroad',
    booking: 'Call booking',
    'contact-form': 'Contact form',
}

// Older leads stored budget as digits; newer ones as a band label
function formatBudget(b) {
    if (!b) return '—'
    return /^[\d,]+$/.test(b) ? `₦${b}` : b
}

function formatSlot(iso, timeZone) {
    try {
        return new Date(iso).toLocaleString('en-GB', { timeZone, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    } catch {
        return new Date(iso).toLocaleString('en-GB')
    }
}

export default async function AdminLeadsPage() {
    const supabase = createAdminClient()

    const { data: leads, error } = await supabase
        .from('consultation_leads')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <main
            style={{
                fontFamily: 'DM Sans, sans-serif',
                background: '#fbfaf8',
                minHeight: '100vh',
                padding: '40px 24px',
            }}
        >
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <h1
                    style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 36,
                        marginBottom: 4,
                        color: '#1a1a1a',
                    }}
                >
                    Website Leads
                </h1>
                <p style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 32 }}>
                    {leads ? `${leads.length} submission${leads.length === 1 ? '' : 's'}` : ''}
                </p>

                {error && (
                    <p style={{ color: '#c0392b', fontSize: 14 }}>
                        Could not load leads: {error.message}
                    </p>
                )}

                {!error && leads && leads.length === 0 && (
                    <p style={{ fontSize: 14, color: '#8a8a8a' }}>
                        No submissions yet.
                    </p>
                )}

                {!error && leads && leads.length > 0 && (
                    <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e0e0e0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: '#1a1a1a', color: '#fff', textAlign: 'left' }}>
                                    {['Name', 'Source', 'Based in', 'Building in', 'Land', 'Budget', 'Contact', 'Call slot', 'Message', 'Submitted'].map((h) => (
                                        <th key={h} style={{ padding: '12px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id} style={{ borderTop: '1px solid #eee', verticalAlign: 'top' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                                            {lead.name}
                                            {lead.organization && <div style={{ fontWeight: 400, color: '#8a8a8a' }}>{lead.organization}</div>}
                                        </td>
                                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                                            {SOURCE_LABELS[lead.source] || lead.source || '—'}
                                            {lead.inquiry && <div style={{ color: '#8a8a8a' }}>{lead.inquiry}</div>}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>{lead.country || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.location || '—'}{lead.project_type && <div style={{ color: '#8a8a8a' }}>{lead.project_type}</div>}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.has_land || '—'}</td>
                                        <td style={{ padding: '12px 16px', minWidth: 120 }}>{formatBudget(lead.budget)}</td>
                                        <td style={{ padding: '12px 16px', minWidth: 160, wordBreak: 'break-word' }}>
                                            {lead.email ? <a href={`mailto:${lead.email}`} style={{ color: '#067a64' }}>{lead.email}</a> : null}
                                            {lead.phone ? <div><a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#067a64' }}>{lead.phone}</a></div> : null}
                                            {!lead.email && !lead.phone && (lead.contact || '—')}
                                        </td>
                                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                                            {lead.preferred_slot ? (
                                                <>
                                                    {formatSlot(lead.preferred_slot, 'Africa/Lagos')} Lagos
                                                    {lead.timezone && lead.timezone !== 'Africa/Lagos' && (
                                                        <div style={{ color: '#8a8a8a' }}>{formatSlot(lead.preferred_slot, lead.timezone)} ({lead.timezone.split('/').pop().replace(/_/g, ' ')})</div>
                                                    )}
                                                </>
                                            ) : '—'}
                                        </td>
                                        <td style={{ padding: '12px 16px', minWidth: 220, maxWidth: 360, whiteSpace: 'pre-wrap', color: '#444' }}>{lead.message || '—'}</td>
                                        <td style={{ padding: '12px 16px', color: '#6b6b6b', whiteSpace: 'nowrap' }}>
                                            {formatDate(lead.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )
}
