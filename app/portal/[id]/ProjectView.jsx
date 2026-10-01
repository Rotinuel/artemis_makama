'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
    PROJECT_STATUS, STAGE_STATUS, PAYMENT_STATUS, DOC_CATEGORIES, DEFECT_STATUS,
    formatMoney, formatDate, formatBytes, stageProgress, cameraEmbed,
} from '@/lib/portal'
import { whatsappLink } from '@/lib/site'
import DefectForm from './DefectForm'

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'progress', label: 'Stages' },
    { key: 'updates', label: 'Site updates' },
    { key: 'payments', label: 'Payments' },
    { key: 'documents', label: 'Documents' },
    { key: 'camera', label: 'Live camera' },
    { key: 'defects', label: 'Defects & warranty' },
]

const PROJECT_TONE = { planning: 'info', in_progress: 'good', on_hold: 'warn', completed: 'good', handed_over: 'good' }
const STAGE_TONE = { pending: '', in_progress: 'info', awaiting_inspection: 'warn', approved: 'good' }
const PAY_TONE = { upcoming: '', due: 'warn', paid: 'info', verified: 'good' }
const DEFECT_TONE = { open: 'warn', in_progress: 'info', resolved: 'good', closed: '' }

function fileBadge(path = '') {
    const ext = path.split('.').pop()?.toLowerCase() || ''
    return ext.length <= 4 ? ext.toUpperCase() : 'FILE'
}

export default function ProjectView({
    project, stages, payments, updates, documents, defects, urls, userId, firstName, isAdmin, initialTab = 'overview',
}) {
    const [tab, setTab] = useState(TABS.some(t => t.key === initialTab) ? initialTab : 'overview')
    const [lightbox, setLightbox] = useState(null)

    const go = useCallback(key => {
        setTab(key)
        const url = new URL(window.location.href)
        if (key === 'overview') url.searchParams.delete('tab')
        else url.searchParams.set('tab', key)
        window.history.replaceState(null, '', url)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    useEffect(() => {
        if (!lightbox) return
        const onKey = e => e.key === 'Escape' && setLightbox(null)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightbox])

    const pct = stageProgress(stages)
    const currentStage = stages.find(s => s.status !== 'approved')
    const stageName = useMemo(() => Object.fromEntries(stages.map(s => [s.id, s.name])), [stages])

    const money = useMemo(() => {
        const sum = list => list.reduce((t, p) => t + Number(p.amount || 0), 0)
        const scheduled = sum(payments)
        const verified = sum(payments.filter(p => p.status === 'verified'))
        const paid = sum(payments.filter(p => p.status === 'paid' || p.status === 'verified'))
        const next = payments.find(p => p.status === 'due') || payments.find(p => p.status === 'upcoming')
        return { scheduled, verified, paid, next, contract: project.contract_value ?? scheduled }
    }, [payments, project.contract_value])

    const openDefects = defects.filter(d => d.status === 'open' || d.status === 'in_progress').length
    const latest = updates[0]
    const cur = project.currency || 'NGN'
    const embed = cameraEmbed(project.camera_url)

    const waText = `Hi Artemis, this is ${firstName || 'your client'} about my project "${project.name}"${project.code ? ` (${project.code})` : ''}.`

    const counts = { updates: updates.length, documents: documents.length, defects: openDefects }

    const renderPhotos = list => (list?.length ? (
        <div className="pt-photos">
            {list.map(p => urls[p] && (
                <button key={p} type="button" className="pt-photo" onClick={() => setLightbox(urls[p])} aria-label="Open photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={urls[p]} alt="" loading="lazy" />
                </button>
            ))}
        </div>
    ) : null)

    return (
        <main className="pt-main">
            {isAdmin && (
                <div className="pt-admin-note">
                    <span>Admin preview — this is what the client sees.</span>
                    <Link href={`/admin/portal/${project.id}`}>Edit this project →</Link>
                </div>
            )}

            {/* ── Hero ── */}
            <div className="pt-hero">
                <div>
                    <p className="pt-eyebrow">{firstName ? `Welcome back, ${firstName}` : 'Your project'}</p>
                    <h1 className="pt-title">{project.name}</h1>
                    <p className="pt-sub">
                        <span className={`pt-chip ${PROJECT_TONE[project.status] || ''}`}>{PROJECT_STATUS[project.status] || project.status}</span>
                        {project.code && <span>{project.code}</span>}
                        {project.location && <span>{project.location}</span>}
                    </p>
                </div>
                <div className="pt-hero-actions">
                    {project.camera_url && (
                        <button type="button" className="pt-btn" onClick={() => go('camera')}>
                            <span className="pt-live" style={{ letterSpacing: '.1em' }}>LIVE</span> Site camera
                        </button>
                    )}
                    <a className="pt-btn green" href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer">
                        Message your project team
                    </a>
                </div>
            </div>

            {/* ── Tabs ── */}
            <nav className="pt-tabs" aria-label="Project sections">
                {TABS.map(t => (
                    <button key={t.key} type="button" className={`pt-tab${tab === t.key ? ' on' : ''}`} onClick={() => go(t.key)}
                        aria-current={tab === t.key ? 'page' : undefined}>
                        {t.label}
                        {!!counts[t.key] && <span className="pt-tab-count">{counts[t.key]}</span>}
                    </button>
                ))}
            </nav>

            {/* ── Overview ── */}
            {tab === 'overview' && (
                <>
                    <div className="pt-grid cols-4">
                        <div className="pt-card">
                            <p className="pt-stat-label">Progress</p>
                            <p className="pt-stat-value">{pct}%</p>
                            <div className="pt-progress" style={{ marginTop: 10 }}><span style={{ width: `${pct}%` }} /></div>
                            <p className="pt-stat-note">{stages.filter(s => s.status === 'approved').length} of {stages.length} stages signed off</p>
                        </div>
                        <div className="pt-card">
                            <p className="pt-stat-label">Current stage</p>
                            <p className="pt-stat-value" style={{ fontSize: 17 }}>{currentStage?.name || (stages.length ? 'All stages complete' : 'Being planned')}</p>
                            {currentStage && <p className="pt-stat-note">{STAGE_STATUS[currentStage.status]}</p>}
                        </div>
                        <div className="pt-card">
                            <p className="pt-stat-label">Paid so far</p>
                            <p className="pt-stat-value">{formatMoney(money.paid, cur)}</p>
                            <p className="pt-stat-note">of {formatMoney(money.contract, cur)}</p>
                        </div>
                        <div className="pt-card">
                            <p className="pt-stat-label">Target completion</p>
                            <p className="pt-stat-value" style={{ fontSize: 17 }}>{formatDate(project.target_completion)}</p>
                            <p className="pt-stat-note">Started {formatDate(project.start_date)}</p>
                        </div>
                    </div>

                    <div className="pt-grid cols-2 pt-section">
                        <div className="pt-card">
                            <div className="pt-card-head">
                                <h2 className="pt-card-title">Latest from site</h2>
                                {updates.length > 1 && <button type="button" className="pt-link" onClick={() => go('updates')}>All updates →</button>}
                            </div>
                            {latest ? (
                                <>
                                    <p className="pt-update-date">{formatDate(latest.posted_at)}</p>
                                    <h3 className="pt-update-title">{latest.title}</h3>
                                    {latest.body && <p className="pt-update-body">{latest.body.length > 320 ? `${latest.body.slice(0, 320)}…` : latest.body}</p>}
                                    {renderPhotos((latest.photos || []).slice(0, 6))}
                                </>
                            ) : (
                                <p className="pt-muted" style={{ margin: 0 }}>Your first site update will appear here once work begins.</p>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
                            <div className="pt-card">
                                <div className="pt-card-head">
                                    <h2 className="pt-card-title">Next payment</h2>
                                    <button type="button" className="pt-link" onClick={() => go('payments')}>Schedule →</button>
                                </div>
                                {money.next ? (
                                    <>
                                        <p className="pt-stat-value">{formatMoney(money.next.amount, cur)}</p>
                                        <p className="pt-stat-note">
                                            {money.next.label}
                                            {money.next.due_date && <> · due {formatDate(money.next.due_date)}</>}
                                        </p>
                                        <p className="pt-hint" style={{ marginTop: 10 }}>
                                            Stage payments are only requested after the previous stage has been inspected.
                                        </p>
                                    </>
                                ) : (
                                    <p className="pt-muted" style={{ margin: 0 }}>Nothing due right now.</p>
                                )}
                            </div>

                            <div className="pt-card">
                                <h2 className="pt-card-title">Need something fixed?</h2>
                                <p className="pt-muted" style={{ marginTop: 0 }}>
                                    {project.defect_period_end
                                        ? <>Your defect liability period runs until <strong>{formatDate(project.defect_period_end)}</strong>. </>
                                        : null}
                                    Report a problem with photos and track it until it’s fixed.
                                </p>
                                <button type="button" className="pt-btn primary small" onClick={() => go('defects')}>
                                    Report a defect{openDefects ? ` · ${openDefects} open` : ''}
                                </button>
                            </div>
                        </div>
                    </div>

                    {project.description && (
                        <div className="pt-card pt-section">
                            <h2 className="pt-card-title">About this project</h2>
                            <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{project.description}</p>
                        </div>
                    )}
                </>
            )}

            {/* ── Stages ── */}
            {tab === 'progress' && (
                <div className="pt-card">
                    <div className="pt-card-head">
                        <h2 className="pt-card-title">Stage-by-stage progress</h2>
                        <span className="pt-muted">{pct}% signed off</span>
                    </div>
                    <p className="pt-muted" style={{ marginTop: -4, marginBottom: 22, maxWidth: 640 }}>
                        Each stage is checked by an independent inspector before we move on and before the next payment is requested.
                    </p>
                    {stages.length ? (
                        <ol className="pt-timeline">
                            {stages.map((s, i) => {
                                const cls = s.status === 'approved' ? 'done' : s.status === 'awaiting_inspection' ? 'waiting' : s === currentStage ? 'active' : ''
                                return (
                                    <li key={s.id} className={`pt-step ${cls}`}>
                                        <span className="pt-dot">{s.status === 'approved' ? '✓' : i + 1}</span>
                                        <div>
                                            <div className="pt-step-head">
                                                <span className="pt-step-name">{s.name}</span>
                                                <span className={`pt-chip ${STAGE_TONE[s.status] || ''}`}>{STAGE_STATUS[s.status] || s.status}</span>
                                            </div>
                                            <p className="pt-step-dates">
                                                {s.planned_start || s.planned_end
                                                    ? <>Planned {formatDate(s.planned_start, false)} – {formatDate(s.planned_end)}</>
                                                    : 'Dates to be confirmed'}
                                                {s.completed_at && <> · Completed {formatDate(s.completed_at)}</>}
                                            </p>
                                            {(s.inspected_at || s.inspector_name) && (
                                                <div className="pt-signoff">
                                                    <strong>Inspection sign-off</strong>
                                                    {s.inspector_name && <> · {s.inspector_name}</>}
                                                    {s.inspected_at && <> · {formatDate(s.inspected_at)}</>}
                                                    {s.inspection_note && <p style={{ margin: '6px 0 0', whiteSpace: 'pre-line' }}>{s.inspection_note}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ol>
                    ) : (
                        <div className="pt-empty">Your stage plan is being prepared and will appear here shortly.</div>
                    )}
                </div>
            )}

            {/* ── Updates ── */}
            {tab === 'updates' && (
                updates.length ? (
                    <div className="pt-feed">
                        {updates.map(u => (
                            <article key={u.id} className="pt-card">
                                <p className="pt-update-date">{formatDate(u.posted_at)}</p>
                                <h2 className="pt-update-title">{u.title}</h2>
                                {u.body && <p className="pt-update-body">{u.body}</p>}
                                {renderPhotos(u.photos)}
                            </article>
                        ))}
                    </div>
                ) : <div className="pt-empty">No site updates yet. We post dated updates with photos as work progresses.</div>
            )}

            {/* ── Payments ── */}
            {tab === 'payments' && (
                <>
                    <div className="pt-grid cols-4">
                        <div className="pt-card"><p className="pt-stat-label">Contract value</p><p className="pt-stat-value">{formatMoney(money.contract, cur)}</p></div>
                        <div className="pt-card"><p className="pt-stat-label">Paid</p><p className="pt-stat-value">{formatMoney(money.paid, cur)}</p></div>
                        <div className="pt-card"><p className="pt-stat-label">Verified by us</p><p className="pt-stat-value">{formatMoney(money.verified, cur)}</p></div>
                        <div className="pt-card"><p className="pt-stat-label">Remaining</p><p className="pt-stat-value">{formatMoney(Math.max(0, Number(money.contract || 0) - money.paid), cur)}</p></div>
                    </div>
                    <div className="pt-card pt-section">
                        <h2 className="pt-card-title">Stage payment schedule</h2>
                        {payments.length ? (
                            <div className="pt-table-wrap">
                                <table className="pt-table">
                                    <thead>
                                        <tr>
                                            <th>Payment</th>
                                            <th className="hide-sm">Stage</th>
                                            <th className="num">Amount</th>
                                            <th>Due</th>
                                            <th>Status</th>
                                            <th>Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    <strong style={{ fontWeight: 600 }}>{p.label}</strong>
                                                    {p.note && <div className="pt-hint">{p.note}</div>}
                                                </td>
                                                <td className="hide-sm pt-muted">{stageName[p.stage_id] || '—'}</td>
                                                <td className="num">{formatMoney(p.amount, cur)}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {formatDate(p.due_date)}
                                                    {p.paid_at && <div className="pt-hint">Paid {formatDate(p.paid_at)}</div>}
                                                </td>
                                                <td><span className={`pt-chip ${PAY_TONE[p.status] || ''}`}>{PAYMENT_STATUS[p.status] || p.status}</span></td>
                                                <td className="rcpt">
                                                    {p.receipt_path && urls[p.receipt_path]
                                                        ? <a className="pt-link" href={urls[p.receipt_path]} target="_blank" rel="noopener noreferrer">View</a>
                                                        : <span className="pt-muted">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <div className="pt-empty">Your payment schedule will appear here once the contract is signed.</div>}
                        <p className="pt-hint" style={{ marginTop: 16 }}>
                            Always confirm our bank details by phone before transferring. We will never change them by email or WhatsApp alone.
                        </p>
                    </div>
                </>
            )}

            {/* ── Documents ── */}
            {tab === 'documents' && (
                <div className="pt-card">
                    <h2 className="pt-card-title">Project documents</h2>
                    {documents.length ? (
                        Object.entries(DOC_CATEGORIES).map(([key, label]) => {
                            const list = documents.filter(d => (d.category || 'other') === key)
                            if (!list.length) return null
                            return (
                                <section key={key} className="pt-doc-group">
                                    <h3>{label}</h3>
                                    {list.map(d => (
                                        <div key={d.id} className="pt-doc">
                                            <span className="pt-doc-icon">{fileBadge(d.file_path)}</span>
                                            <div className="pt-doc-main">
                                                <div className="pt-doc-title">{d.title}</div>
                                                <div className="pt-doc-meta">{formatDate(d.uploaded_at)}{d.file_size ? ` · ${formatBytes(d.file_size)}` : ''}</div>
                                            </div>
                                            {urls[d.file_path]
                                                ? <a className="pt-btn small" href={urls[d.file_path]} target="_blank" rel="noopener noreferrer">Open</a>
                                                : <span className="pt-muted">Unavailable</span>}
                                        </div>
                                    ))}
                                </section>
                            )
                        })
                    ) : (
                        <div className="pt-empty">Your contract, bill of quantities, drawings, inspection reports and handover pack will be stored here.</div>
                    )}
                </div>
            )}

            {/* ── Camera ── */}
            {tab === 'camera' && (
                <div className="pt-card">
                    <div className="pt-card-head">
                        <h2 className="pt-card-title">Live site camera</h2>
                        {project.camera_url && <span className="pt-live">LIVE</span>}
                    </div>
                    {project.camera_url ? (
                        <>
                            <div className="pt-camera">
                                {embed ? (
                                    <iframe src={embed} title="Live site camera" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" />
                                ) : (
                                    <div className="pt-camera-cta">
                                        <span className="pt-live">LIVE</span>
                                        <p style={{ margin: 0, maxWidth: 420, color: 'rgba(255,255,255,.75)' }}>
                                            Your camera opens in the camera provider’s viewer.
                                        </p>
                                        <a className="pt-btn green" href={project.camera_url} target="_blank" rel="noopener noreferrer">Open live camera ↗</a>
                                    </div>
                                )}
                            </div>
                            {project.camera_note && <p className="pt-muted" style={{ margin: '14px 0 0', whiteSpace: 'pre-line' }}>{project.camera_note}</p>}
                            {embed && (
                                <p className="pt-hint" style={{ marginTop: 10 }}>
                                    Picture not loading? <a className="pt-link" href={project.camera_url} target="_blank" rel="noopener noreferrer">Open it in a new tab ↗</a>
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="pt-empty">Your live camera will be connected once work starts on site.</div>
                    )}
                </div>
            )}

            {/* ── Defects ── */}
            {tab === 'defects' && (
                <div className="pt-grid cols-2" style={{ alignItems: 'start' }}>
                    <div className="pt-card">
                        <h2 className="pt-card-title">Report a defect</h2>
                        <p className="pt-muted" style={{ marginTop: -6 }}>
                            {project.defect_period_end
                                ? <>Defect liability period ends <strong>{formatDate(project.defect_period_end)}</strong>.</>
                                : 'Tell us what needs attention and where. Photos help us fix it faster.'}
                        </p>
                        <DefectForm projectId={project.id} userId={userId} />
                    </div>
                    <div className="pt-card">
                        <h2 className="pt-card-title">Your requests</h2>
                        {defects.length ? (
                            <div className="pt-feed" style={{ gap: 0 }}>
                                {defects.map((d, i) => (
                                    <div key={d.id} style={{ padding: '14px 0', borderTop: i ? '1px solid #f0ede8' : 0 }}>
                                        <div className="pt-step-head" style={{ paddingTop: 0 }}>
                                            <strong>{d.title}</strong>
                                            <span className={`pt-chip ${DEFECT_TONE[d.status] || ''}`}>{DEFECT_STATUS[d.status] || d.status}</span>
                                        </div>
                                        <p className="pt-step-dates">
                                            {d.location && <>{d.location} · </>}Reported {formatDate(d.created_at)}
                                            {d.updated_at && d.updated_at !== d.created_at && <> · Updated {formatDate(d.updated_at)}</>}
                                        </p>
                                        {d.description && <p style={{ margin: '6px 0 0', whiteSpace: 'pre-line' }}>{d.description}</p>}
                                        {renderPhotos(d.photos)}
                                        {d.admin_note && <div className="pt-reply"><strong>Artemis:</strong> {d.admin_note}</div>}
                                    </div>
                                ))}
                            </div>
                        ) : <p className="pt-muted" style={{ margin: 0 }}>No requests yet.</p>}
                    </div>
                </div>
            )}

            {lightbox && (
                <div className="pt-lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={lightbox} alt="" onClick={e => e.stopPropagation()} />
                    <button type="button" aria-label="Close" onClick={() => setLightbox(null)}>×</button>
                </div>
            )}
        </main>
    )
}
