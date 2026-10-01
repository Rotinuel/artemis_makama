'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PROJECT_STATUS, DEFAULT_STAGES, formatDate, stageProgress } from '@/lib/portal'
import { adminPortalStyles } from './admin-portal-styles'

const STATUS_TONE = { planning: 'info', in_progress: 'good', on_hold: 'warn', completed: 'good', handed_over: 'good' }
const EMPTY = { name: '', code: '', location: '', start_date: '', target_completion: '', contract_value: '', currency: 'NGN', withStages: true }

export default function AdminPortalPage() {
    const router = useRouter()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [setupError, setSetupError] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => { load() }, [])

    function showToast(msg, type = 'success', ms = 3500) {
        setToast({ msg, type })
        setTimeout(() => setToast(null), ms)
    }

    async function load() {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('projects')
            .select('id, name, code, location, status, target_completion, created_at, project_members(user_id), project_stages(status), defect_requests(status)')
            .order('created_at', { ascending: false })
        if (error) {
            setSetupError(/does not exist|could not find the table|42P01|PGRST205/i.test(`${error.code} ${error.message}`)
                ? 'The client portal tables don’t exist yet. Run supabase/client_portal.sql in the Supabase SQL Editor, then reload this page.'
                : 'Could not load projects: ' + error.message)
        }
        setProjects(data || [])
        setLoading(false)
    }

    async function create(e) {
        e.preventDefault()
        if (!form.name.trim()) return showToast('Give the project a name.', 'error')
        setSaving(true)
        const supabase = createClient()
        const { data, error } = await supabase.from('projects').insert({
            name: form.name.trim(),
            code: form.code.trim() || null,
            location: form.location.trim() || null,
            start_date: form.start_date || null,
            target_completion: form.target_completion || null,
            contract_value: form.contract_value === '' ? null : Number(form.contract_value),
            currency: form.currency || 'NGN',
        }).select('id').single()
        if (error) {
            setSaving(false)
            return showToast('Error: ' + error.message, 'error', 6000)
        }
        if (form.withStages) {
            await supabase.from('project_stages').insert(
                DEFAULT_STAGES.map((name, position) => ({ project_id: data.id, name, position }))
            )
        }
        router.push(`/admin/portal/${data.id}`)
    }

    const set = key => e => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

    if (loading) return <div className="ap-loading"><style>{adminPortalStyles}</style>Loading…</div>

    return (
        <>
            <style>{adminPortalStyles}</style>
            <div className="ap-page">
                <div className="ap-inner fade-in">
                    <div className="top-bar">
                        <div className="top-brand">Client <span>Portal</span></div>
                        <div className="nav-btns">
                            {!setupError && (
                                <button className="nav-btn primary" onClick={() => setShowNew(v => !v)}>
                                    {showNew ? 'Close' : '+ New project'}
                                </button>
                            )}
                            <Link href="/portal" className="nav-btn">Client view</Link>
                            <Link href="/admin" className="nav-btn">← Dashboard</Link>
                        </div>
                    </div>

                    <p className="intro">
                        Each client signs in at <strong>/portal</strong> and sees only their own project: stage progress and inspection
                        sign-offs, site updates with photos, payments, documents, the live camera and their defect requests.
                        Create a project, then invite the client from its <strong>Clients</strong> tab.
                    </p>

                    {setupError && <div className="empty" style={{ color: '#f0c070' }}>{setupError}</div>}

                    {showNew && (
                        <form className="card" onSubmit={create} style={{ marginBottom: 20 }}>
                            <h2 className="ap-h2">New project</h2>
                            <div className="grid">
                                <div className="field span-8"><label>Project name *</label><input value={form.name} onChange={set('name')} placeholder="e.g. 5-bedroom duplex, Lekki" autoFocus /></div>
                                <div className="field span-4"><label>Project code</label><input value={form.code} onChange={set('code')} placeholder="AAL-2026-014" /></div>
                                <div className="field span-12"><label>Location</label><input value={form.location} onChange={set('location')} placeholder="Lekki Phase 1, Lagos" /></div>
                                <div className="field span-3"><label>Start date</label><input type="date" value={form.start_date} onChange={set('start_date')} /></div>
                                <div className="field span-3"><label>Target completion</label><input type="date" value={form.target_completion} onChange={set('target_completion')} /></div>
                                <div className="field span-4"><label>Contract value</label><input type="number" min="0" step="any" value={form.contract_value} onChange={set('contract_value')} placeholder="0" /></div>
                                <div className="field span-2">
                                    <label>Currency</label>
                                    <select value={form.currency} onChange={set('currency')}>
                                        {['NGN', 'USD', 'GBP', 'EUR', 'CAD'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <label className="check span-12">
                                    <input type="checkbox" checked={form.withStages} onChange={set('withStages')} />
                                    Start with the standard stage plan ({DEFAULT_STAGES.length} stages — you can edit them)
                                </label>
                            </div>
                            <div className="actions">
                                <button className="btn approve" disabled={saving}>{saving ? 'Creating…' : 'Create project'}</button>
                                <button type="button" className="btn" onClick={() => { setShowNew(false); setForm(EMPTY) }}>Cancel</button>
                            </div>
                        </form>
                    )}

                    {!setupError && (projects.length === 0 ? (
                        <div className="empty">No client projects yet. Press “+ New project” to add the first one.</div>
                    ) : (
                        <ul className="list">
                            {projects.map(p => {
                                const openDefects = (p.defect_requests || []).filter(d => d.status === 'open').length
                                return (
                                    <li key={p.id}>
                                        <Link href={`/admin/portal/${p.id}`} className="card card-link">
                                            <div className="row-head">
                                                <div>
                                                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22 }}>{p.name}</div>
                                                    <div className="muted small">{[p.code, p.location].filter(Boolean).join(' · ') || '—'}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                                    {openDefects > 0 && <span className="chip warn">{openDefects} new defect{openDefects > 1 ? 's' : ''}</span>}
                                                    <span className={`chip ${STATUS_TONE[p.status] || ''}`}>{PROJECT_STATUS[p.status] || p.status}</span>
                                                </div>
                                            </div>
                                            <div className="muted small" style={{ marginTop: 10, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                                                <span>{stageProgress(p.project_stages || [])}% stages signed off</span>
                                                <span>{(p.project_members || []).length} client{(p.project_members || []).length === 1 ? '' : 's'}</span>
                                                {p.target_completion && <span>Target {formatDate(p.target_completion)}</span>}
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    ))}
                </div>
            </div>

            {toast && <div className={`toast ${toast.type}`}><span className="toast-dot" />{toast.msg}</div>}
        </>
    )
}
