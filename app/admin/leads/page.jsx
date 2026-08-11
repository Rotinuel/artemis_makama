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
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <h1
                    style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 36,
                        marginBottom: 4,
                        color: '#1a1a1a',
                    }}
                >
                    Diaspora Consultation Leads
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
                                    {['Name', 'Country', 'Location', 'Has Land', 'Budget', 'Contact', 'Submitted'].map((h) => (
                                        <th key={h} style={{ padding: '12px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{lead.name}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.country}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.location}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.has_land || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.budget ? `₦${lead.budget}` : '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>{lead.contact || '—'}</td>
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



// // import { createAdminClient } from '@/utils/supabase/admin'
// import { createAdminClient } from '@/utils/supabase/admin'

// export const metadata = {
//     title: 'Leads — Admin',
//     robots: { index: false, follow: false },
// }

// export const dynamic = 'force-dynamic' // always show fresh leads, never cache

// function formatDate(iso) {
//     return new Date(iso).toLocaleString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//     })
// }

// export default async function AdminLeadsPage() {
//     const supabase = createAdminClient()

//     const { data: leads, error } = await supabase
//         .from('consultation_leads')
//         .select('*')
//         .order('created_at', { ascending: false })

//     return (
//         <main
//             style={{
//                 fontFamily: 'DM Sans, sans-serif',
//                 background: '#fbfaf8',
//                 minHeight: '100vh',
//                 padding: '40px 24px',
//             }}
//         >
//             <div style={{ maxWidth: 1100, margin: '0 auto' }}>
//                 <h1
//                     style={{
//                         fontFamily: 'Cormorant Garamond, serif',
//                         fontSize: 36,
//                         marginBottom: 4,
//                         color: '#1a1a1a',
//                     }}
//                 >
//                     Diaspora Consultation Leads
//                 </h1>
//                 <p style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 32 }}>
//                     {leads ? `${leads.length} submission${leads.length === 1 ? '' : 's'}` : ''}
//                 </p>

//                 {error && (
//                     <p style={{ color: '#c0392b', fontSize: 14 }}>
//                         Could not load leads: {error.message}
//                     </p>
//                 )}

//                 {!error && leads && leads.length === 0 && (
//                     <p style={{ fontSize: 14, color: '#8a8a8a' }}>
//                         No submissions yet.
//                     </p>
//                 )}

//                 {!error && leads && leads.length > 0 && (
//                     <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e0e0e0' }}>
//                         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//                             <thead>
//                                 <tr style={{ background: '#1a1a1a', color: '#fff', textAlign: 'left' }}>
//                                     {['Name', 'Country', 'Location', 'Has Land', 'Budget', 'Timeline', 'Submitted'].map((h) => (
//                                         <th key={h} style={{ padding: '12px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>
//                                             {h}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {leads.map((lead) => (
//                                     <tr key={lead.id} style={{ borderTop: '1px solid #eee' }}>
//                                         <td style={{ padding: '12px 16px', fontWeight: 500 }}>{lead.name}</td>
//                                         <td style={{ padding: '12px 16px' }}>{lead.country}</td>
//                                         <td style={{ padding: '12px 16px' }}>{lead.location}</td>
//                                         <td style={{ padding: '12px 16px' }}>{lead.has_land || '—'}</td>
//                                         <td style={{ padding: '12px 16px' }}>{lead.budget || '—'}</td>
//                                         <td style={{ padding: '12px 16px' }}>{lead.timeline || '—'}</td>
//                                         <td style={{ padding: '12px 16px', color: '#6b6b6b', whiteSpace: 'nowrap' }}>
//                                             {formatDate(lead.created_at)}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </main>
//     )
// }