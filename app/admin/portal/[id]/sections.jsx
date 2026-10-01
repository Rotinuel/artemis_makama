'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    PORTAL_BUCKET, PROJECT_STATUS, STAGE_STATUS, PAYMENT_STATUS, DOC_CATEGORIES, DEFECT_STATUS, DEFAULT_STAGES,
    portalPath, formatMoney, formatDate, formatBytes,
} from '@/lib/portal'

/* ───────────── helpers ───────────── */

const MAX_UPLOAD_MB = 50

async function uploadFile(projectId, folder, file) {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`“${file.name}” is larger than ${MAX_UPLOAD_MB} MB.`)
    const path = portalPath(projectId, folder, file.name)
    const { error } = await createClient().storage.from(PORTAL_BUCKET).upload(path, file, {
        contentType: file.type || undefined, upsert: false,
    })
    if (error) throw new Error(`Upload failed for “${file.name}”: ${error.message}`)
    return path
}

async function removeFiles(paths) {
    const list = (paths || []).filter(Boolean)
    if (list.length) await createClient().storage.from(PORTAL_BUCKET).remove(list)
}

const blank = v => (v === null || v === undefined ? '' : String(v))
const orNull = v => (v === '' || v === undefined ? null : v)
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function Field({ label, span = 6, children }) {
    return <div className={`field span-${span}`}><label>{label}</label>{children}</div>
}

function Thumbs({ paths, urls }) {
    if (!paths?.length) return null
    return (
        <div className="thumbs">
            {paths.map(p => urls[p]
                ? <a key={p} href={urls[p]} target="_blank" rel="noopener noreferrer">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={urls[p]} alt="" /></a>
                : <span key={p} />)}
        </div>
    )
}

/* ───────────── Details ───────────── */

const PROJECT_FIELDS = ['name', 'code', 'location', 'description', 'status', 'start_date', 'target_completion',
    'contract_value', 'currency', 'camera_url', 'camera_note', 'defect_period_end']

export function DetailsSection({ data, patch, toast }) {
    const router = useRouter()
    const p = data.project
    const initial = Object.fromEntries(PROJECT_FIELDS.map(k => [k, blank(p[k])]))
    const [f, setF] = useState(initial)
    const [busy, setBusy] = useState(false)
    const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))

    async function save() {
        if (!f.name.trim()) return toast('The project needs a name.', 'error')
        setBusy(true)
        const row = {
            ...Object.fromEntries(PROJECT_FIELDS.map(k => [k, orNull(typeof f[k] === 'string' ? f[k].trim() : f[k])])),
            contract_value: f.contract_value === '' ? null : Number(f.contract_value),
            currency: f.currency || 'NGN',
            status: f.status || 'planning',
        }
        const { data: saved, error } = await createClient().from('projects').update(row).eq('id', p.id).select('*').single()
        setBusy(false)
        if (error) return toast('Error: ' + error.message, 'error', 6000)
        patch('project', saved)
        setF(Object.fromEntries(PROJECT_FIELDS.map(k => [k, blank(saved[k])])))
        toast('Project saved')
    }

    async function remove() {
        if (prompt(`This permanently deletes the project, its stages, payments, updates, documents, defect requests and files.\n\nType the project name to confirm:\n${p.name}`) !== p.name) return
        setBusy(true)
        await removeFiles([
            ...data.updates.flatMap(u => u.photos || []),
            ...data.defects.flatMap(d => d.photos || []),
            ...data.payments.map(x => x.receipt_path),
            ...data.documents.map(d => d.file_path),
        ])
        const { error } = await createClient().from('projects').delete().eq('id', p.id)
        if (error) { setBusy(false); return toast('Error: ' + error.message, 'error', 6000) }
        router.push('/admin/portal')
    }

    return (
        <div className={`card${busy ? ' busy' : ''}`}>
            <div className="grid">
                <Field label="Project name *" span={8}><input value={f.name} onChange={set('name')} /></Field>
                <Field label="Project code" span={4}><input value={f.code} onChange={set('code')} placeholder="AAL-2026-014" /></Field>
                <Field label="Location" span={8}><input value={f.location} onChange={set('location')} /></Field>
                <Field label="Status" span={4}>
                    <select value={f.status} onChange={set('status')}>
                        {Object.entries(PROJECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </Field>
                <Field label="About the project (shown to the client)" span={12}>
                    <textarea rows={3} value={f.description} onChange={set('description')} placeholder="Scope, key features, anything the client should know" />
                </Field>
                <Field label="Start date" span={3}><input type="date" value={f.start_date} onChange={set('start_date')} /></Field>
                <Field label="Target completion" span={3}><input type="date" value={f.target_completion} onChange={set('target_completion')} /></Field>
                <Field label="Contract value" span={4}><input type="number" min="0" step="any" value={f.contract_value} onChange={set('contract_value')} /></Field>
                <Field label="Currency" span={2}>
                    <select value={f.currency} onChange={set('currency')}>
                        {['NGN', 'USD', 'GBP', 'EUR', 'CAD'].map(c => <option key={c}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Live camera link" span={8}>
                    <input value={f.camera_url} onChange={set('camera_url')} placeholder="YouTube Live link, or your camera app's share/viewer link" />
                </Field>
                <Field label="Defect period ends" span={4}><input type="date" value={f.defect_period_end} onChange={set('defect_period_end')} /></Field>
                <Field label="Camera note (shown under the camera)" span={12}>
                    <input value={f.camera_note} onChange={set('camera_note')} placeholder="e.g. Camera faces the front elevation. Live 6am–7pm WAT." />
                </Field>
            </div>
            <p className="muted small" style={{ margin: '10px 0 0' }}>
                YouTube Live links play inside the portal. Links from other camera apps (Hik-Connect, Reolink, EZVIZ, etc.) open in a new tab.
            </p>
            <div className="actions">
                <button className="btn approve" onClick={save} disabled={busy || same(f, initial)}>Save details</button>
                <span style={{ flex: 1 }} />
                <button className="btn reject" onClick={remove} disabled={busy}>Delete project</button>
            </div>
        </div>
    )
}

/* ───────────── Clients ───────────── */

export function ClientsSection({ data, patch, toast, projectId }) {
    const [form, setForm] = useState({ fullName: '', email: '' })
    const [busy, setBusy] = useState(null)
    const [result, setResult] = useState(null) // { link, email, name, existing }

    async function invite(email, fullName) {
        setBusy(email)
        setResult(null)
        try {
            const res = await fetch('/api/admin/portal/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, email, fullName }),
            })
            const body = await res.json().catch(() => ({}))
            if (!res.ok || !body.ok) throw new Error(body.error || `Request failed (${res.status})`)
            patch('members', list => [
                ...list.filter(m => m.user_id !== body.member.user_id),
                { project_id: projectId, created_at: new Date().toISOString(), ...body.member },
            ])
            setResult({ link: body.link, email, name: fullName, existing: body.existing })
            setForm({ fullName: '', email: '' })
        } catch (err) {
            toast(err.message, 'error', 7000)
        }
        setBusy(null)
    }

    async function removeMember(m) {
        if (!confirm(`Remove ${m.full_name || m.email} from this project? Their login stays, but they will no longer see this project.`)) return
        setBusy(m.user_id)
        const { error } = await createClient().from('project_members').delete().eq('project_id', projectId).eq('user_id', m.user_id)
        setBusy(null)
        if (error) return toast('Error: ' + error.message, 'error')
        patch('members', list => list.filter(x => x.user_id !== m.user_id))
        toast('Client removed from project')
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const first = (result?.name || '').split(' ')[0]
    const message = result && `Hello${first ? ` ${first}` : ''}, your Artemis Atelier client portal for "${data.project.name}" is ready.\n\n` +
        `Open this link to ${result.existing ? 'set your password' : 'choose your password'}:\n${result.link}\n\n` +
        `After that you can sign in any time at ${origin}/portal with ${result.email}.`

    async function copy(text) {
        try { await navigator.clipboard.writeText(text); toast('Copied') } catch { toast('Copy failed — select the text and copy it manually.', 'error') }
    }

    return (
        <>
            <div className="card">
                <h2 className="ap-h2">Invite a client</h2>
                <p className="muted small" style={{ marginTop: -4 }}>
                    Creates their login (or reuses it if they already have one) and gives you a one-time link to send them.
                    They choose their own password. Nothing is emailed automatically.
                </p>
                <form className="grid" onSubmit={e => { e.preventDefault(); invite(form.email.trim(), form.fullName.trim()) }}>
                    <Field label="Full name" span={5}><input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="e.g. Ada Okafor" /></Field>
                    <Field label="Email *" span={5}><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="client@example.com" /></Field>
                    <div className="span-2" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn approve" style={{ width: '100%', justifyContent: 'center', height: 38 }} disabled={!!busy || !form.email.trim()}>
                            {busy === form.email.trim() ? 'Working…' : 'Invite'}
                        </button>
                    </div>
                </form>

                {result && (
                    <div className="linkbox">
                        <strong style={{ fontWeight: 500 }}>
                            {result.existing ? 'Added. They already had a login — ' : 'Invite ready — '}
                            send this link to {result.name || result.email}.
                        </strong>
                        <p className="muted small" style={{ margin: '4px 0 0' }}>
                            It works once and expires (1 hour by default; you can raise this in Supabase → Authentication → Email,
                            “Email OTP expiration”). If it expires, press “New sign-in link” below.
                        </p>
                        <code>{result.link}</code>
                        <div className="actions">
                            <button className="btn approve" onClick={() => copy(message)}>Copy message</button>
                            <button className="btn" onClick={() => copy(result.link)}>Copy link only</button>
                            <a className="btn" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
                            <a className="btn" href={`mailto:${result.email}?subject=${encodeURIComponent('Your Artemis Atelier client portal')}&body=${encodeURIComponent(message)}`}>Email</a>
                        </div>
                    </div>
                )}
            </div>

            <div className="card">
                <h2 className="ap-h2">Clients on this project</h2>
                {data.members.length === 0 ? (
                    <p className="muted small" style={{ margin: 0 }}>No clients yet.</p>
                ) : (
                    <ul className="list">
                        {data.members.map(m => (
                            <li key={m.user_id} className="row-head" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                                <div>
                                    <div>{m.full_name || m.email}</div>
                                    <div className="muted small">{m.full_name ? `${m.email} · ` : ''}added {formatDate(m.created_at)}</div>
                                </div>
                                <div className="actions" style={{ marginTop: 0 }}>
                                    <button className="btn" disabled={!!busy || !m.email} onClick={() => invite(m.email, m.full_name || '')}>
                                        {busy === m.email ? 'Working…' : 'New sign-in link'}
                                    </button>
                                    <button className="btn reject" disabled={!!busy} onClick={() => removeMember(m)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

/* ───────────── Stages ───────────── */

const STAGE_FIELDS = ['name', 'status', 'planned_start', 'planned_end', 'completed_at', 'inspector_name', 'inspected_at', 'inspection_note']

function StageRow({ stage, index, total, onSave, onMove, onDelete }) {
    const initial = Object.fromEntries(STAGE_FIELDS.map(k => [k, blank(stage[k])]))
    const [f, setF] = useState(initial)
    const [busy, setBusy] = useState(false)
    const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))
    const dirty = !same(f, initial)

    async function save() {
        setBusy(true)
        const saved = await onSave(stage.id, Object.fromEntries(STAGE_FIELDS.map(k => [k, orNull(f[k].trim())])))
        if (saved) setF(Object.fromEntries(STAGE_FIELDS.map(k => [k, blank(saved[k])])))
        setBusy(false)
    }

    return (
        <li className={`card${busy ? ' busy' : ''}`}>
            <div className="grid">
                <Field label={`Stage ${index + 1}`} span={6}><input value={f.name} onChange={set('name')} /></Field>
                <Field label="Status" span={4}>
                    <select value={f.status} onChange={set('status')}>
                        {Object.entries(STAGE_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </Field>
                <div className="span-2" style={{ display: 'flex', gap: 6, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <button className="btn icon" title="Move up" disabled={index === 0} onClick={() => onMove(index, -1)}>↑</button>
                    <button className="btn icon" title="Move down" disabled={index === total - 1} onClick={() => onMove(index, 1)}>↓</button>
                </div>
                <Field label="Planned start" span={4}><input type="date" value={f.planned_start} onChange={set('planned_start')} /></Field>
                <Field label="Planned end" span={4}><input type="date" value={f.planned_end} onChange={set('planned_end')} /></Field>
                <Field label="Completed on" span={4}><input type="date" value={f.completed_at} onChange={set('completed_at')} /></Field>
                <Field label="Inspector" span={6}><input value={f.inspector_name} onChange={set('inspector_name')} placeholder="Name / firm of the independent inspector" /></Field>
                <Field label="Inspected on" span={6}><input type="date" value={f.inspected_at} onChange={set('inspected_at')} /></Field>
                <Field label="Inspection note (shown to the client)" span={12}>
                    <textarea rows={2} value={f.inspection_note} onChange={set('inspection_note')} />
                </Field>
            </div>
            <div className="actions">
                <button className="btn approve" disabled={!dirty || busy} onClick={save}>Save</button>
                {dirty && <button className="btn" onClick={() => setF(initial)}>Undo</button>}
                <span style={{ flex: 1 }} />
                <button className="btn reject" onClick={() => onDelete(stage)}>Delete</button>
            </div>
        </li>
    )
}

export function StagesSection({ data, patch, toast, projectId }) {
    const [busy, setBusy] = useState(false)
    const stages = data.stages

    async function save(id, row) {
        if (!row.name) return toast('A stage needs a name.', 'error')
        const { data: saved, error } = await createClient().from('project_stages').update(row).eq('id', id).select('*').single()
        if (error) return toast('Error: ' + error.message, 'error', 6000)
        patch('stages', list => list.map(s => s.id === id ? saved : s))
        toast('Stage saved')
        return saved
    }

    async function add(names) {
        setBusy(true)
        const start = stages.reduce((m, s) => Math.max(m, s.position), -1) + 1
        const { data: rows, error } = await createClient().from('project_stages')
            .insert(names.map((name, i) => ({ project_id: projectId, name, position: start + i }))).select('*')
        setBusy(false)
        if (error) return toast('Error: ' + error.message, 'error')
        patch('stages', list => [...list, ...rows].sort((a, b) => a.position - b.position))
    }

    async function move(index, dir) {
        const list = [...stages]
        const [item] = list.splice(index, 1)
        list.splice(index + dir, 0, item)
        const renumbered = list.map((s, i) => ({ ...s, position: i }))
        patch('stages', renumbered)
        const supabase = createClient()
        const changed = renumbered.filter((s, i) => stages.find(o => o.id === s.id)?.position !== i)
        const results = await Promise.all(changed.map(s => supabase.from('project_stages').update({ position: s.position }).eq('id', s.id)))
        const failed = results.find(r => r.error)
        if (failed) toast('Error saving order: ' + failed.error.message, 'error')
    }

    async function remove(stage) {
        if (!confirm(`Delete the stage “${stage.name}”? Payments linked to it are kept.`)) return
        const { error } = await createClient().from('project_stages').delete().eq('id', stage.id)
        if (error) return toast('Error: ' + error.message, 'error')
        patch('stages', list => list.filter(s => s.id !== stage.id))
        patch('payments', list => list.map(p => p.stage_id === stage.id ? { ...p, stage_id: null } : p))
        toast('Stage deleted')
    }

    return (
        <>
            <p className="intro" style={{ marginBottom: 14 }}>
                Mark a stage <strong>Awaiting inspection</strong> when it’s ready, then <strong>Inspected &amp; approved</strong> with the
                inspector’s name, date and note. The client sees this as a timeline with sign-offs.
            </p>
            {stages.length === 0 ? (
                <div className="empty">
                    No stages yet.
                    <div className="actions" style={{ justifyContent: 'center' }}>
                        <button className="btn approve" disabled={busy} onClick={() => add(DEFAULT_STAGES)}>Add the standard {DEFAULT_STAGES.length} stages</button>
                        <button className="btn" disabled={busy} onClick={() => add(['New stage'])}>Add one stage</button>
                    </div>
                </div>
            ) : (
                <>
                    <ul className="list">
                        {stages.map((s, i) => (
                            <StageRow key={s.id} stage={s} index={i} total={stages.length} onSave={save} onMove={move} onDelete={remove} />
                        ))}
                    </ul>
                    <div className="actions"><button className="btn" disabled={busy} onClick={() => add(['New stage'])}>+ Add stage</button></div>
                </>
            )}
        </>
    )
}

/* ───────────── Payments ───────────── */

const PAYMENT_FIELDS = ['label', 'stage_id', 'amount', 'due_date', 'status', 'paid_at', 'note']

function PaymentRow({ payment, stages, urls, onSave, onDelete, onReceipt, onRemoveReceipt }) {
    const initial = Object.fromEntries(PAYMENT_FIELDS.map(k => [k, blank(payment[k])]))
    const [f, setF] = useState(initial)
    const [busy, setBusy] = useState(false)
    const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))
    const dirty = !same(f, initial)

    async function run(fn) { setBusy(true); await fn(); setBusy(false) }

    return (
        <li className={`card${busy ? ' busy' : ''}`}>
            <div className="grid">
                <Field label="Payment" span={5}><input value={f.label} onChange={set('label')} placeholder="e.g. Foundation stage payment" /></Field>
                <Field label="For stage" span={4}>
                    <select value={f.stage_id} onChange={set('stage_id')}>
                        <option value="">—</option>
                        {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </Field>
                <Field label="Amount" span={3}><input type="number" min="0" step="any" value={f.amount} onChange={set('amount')} /></Field>
                <Field label="Due date" span={3}><input type="date" value={f.due_date} onChange={set('due_date')} /></Field>
                <Field label="Status" span={4}>
                    <select value={f.status} onChange={set('status')}>
                        {Object.entries(PAYMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </Field>
                <Field label="Paid on" span={5}><input type="date" value={f.paid_at} onChange={set('paid_at')} /></Field>
                <Field label="Note (shown to the client)" span={12}><input value={f.note} onChange={set('note')} /></Field>
                <div className="field span-12">
                    <label>Receipt</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {payment.receipt_path && (
                            <>
                                {urls[payment.receipt_path] && <a className="btn" href={urls[payment.receipt_path]} target="_blank" rel="noopener noreferrer">View receipt</a>}
                                <button className="btn reject" onClick={() => run(() => onRemoveReceipt(payment))}>Remove</button>
                            </>
                        )}
                        <input type="file" accept="image/*,application/pdf" style={{ maxWidth: 320 }}
                            onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) run(() => onReceipt(payment, file)) }} />
                    </div>
                </div>
            </div>
            <div className="actions">
                <button className="btn approve" disabled={!dirty || busy} onClick={() => run(async () => {
                    const saved = await onSave(payment.id, {
                    label: f.label.trim(),
                    stage_id: orNull(f.stage_id),
                    amount: f.amount === '' ? 0 : Number(f.amount),
                    due_date: orNull(f.due_date),
                    status: f.status,
                    paid_at: orNull(f.paid_at),
                    note: orNull(f.note.trim()),
                    })
                    if (saved) setF(Object.fromEntries(PAYMENT_FIELDS.map(k => [k, blank(saved[k])])))
                })}>Save</button>
                {dirty && <button className="btn" onClick={() => setF(initial)}>Undo</button>}
                <span style={{ flex: 1 }} />
                <button className="btn reject" onClick={() => onDelete(payment)}>Delete</button>
            </div>
        </li>
    )
}

export function PaymentsSection({ data, patch, urls, sign, toast, projectId }) {
    const [busy, setBusy] = useState(false)
    const { payments, stages, project } = data
    const cur = project.currency || 'NGN'
    const total = payments.reduce((t, p) => t + Number(p.amount || 0), 0)
    const paid = payments.filter(p => p.status === 'paid' || p.status === 'verified').reduce((t, p) => t + Number(p.amount || 0), 0)

    async function update(id, row, msg = 'Payment saved') {
        if (row.label !== undefined && !row.label) return toast('A payment needs a name.', 'error')
        const { data: saved, error } = await createClient().from('project_payments').update(row).eq('id', id).select('*').single()
        if (error) return toast('Error: ' + error.message, 'error', 6000)
        patch('payments', list => list.map(p => p.id === id ? saved : p))
        toast(msg)
        return saved
    }

    async function add(rows) {
        setBusy(true)
        const start = payments.reduce((m, p) => Math.max(m, p.position), -1) + 1
        const { data: inserted, error } = await createClient().from('project_payments')
            .insert(rows.map((r, i) => ({ project_id: projectId, amount: 0, position: start + i, ...r }))).select('*')
        setBusy(false)
        if (error) return toast('Error: ' + error.message, 'error')
        patch('payments', list => [...list, ...inserted])
    }

    async function remove(p) {
        if (!confirm(`Delete “${p.label}”?`)) return
        const { error } = await createClient().from('project_payments').delete().eq('id', p.id)
        if (error) return toast('Error: ' + error.message, 'error')
        await removeFiles([p.receipt_path])
        patch('payments', list => list.filter(x => x.id !== p.id))
        toast('Payment deleted')
    }

    async function receipt(p, file) {
        try {
            const path = await uploadFile(projectId, 'receipts', file)
            await sign([path])
            await update(p.id, { receipt_path: path }, 'Receipt uploaded')
            await removeFiles([p.receipt_path])
        } catch (err) { toast(err.message, 'error', 6000) }
    }

    async function removeReceipt(p) {
        if (!confirm('Remove this receipt?')) return
        await update(p.id, { receipt_path: null }, 'Receipt removed')
        await removeFiles([p.receipt_path])
    }

    return (
        <>
            <div className="totals">
                <span>Contract <strong>{formatMoney(project.contract_value, cur)}</strong></span>
                <span>Scheduled <strong>{formatMoney(total, cur)}</strong></span>
                <span>Paid <strong>{formatMoney(paid, cur)}</strong></span>
                {project.contract_value != null && Math.abs(Number(project.contract_value) - total) > 0.5 && (
                    <span style={{ color: '#f0c070' }}>Schedule differs from contract by {formatMoney(Number(project.contract_value) - total, cur)}</span>
                )}
            </div>
            {payments.length === 0 ? (
                <div className="empty">
                    No payments scheduled.
                    <div className="actions" style={{ justifyContent: 'center' }}>
                        {stages.length > 0 && (
                            <button className="btn approve" disabled={busy}
                                onClick={() => add(stages.map(s => ({ label: `${s.name} payment`, stage_id: s.id, due_date: s.planned_start || null })))}>
                                One payment per stage
                            </button>
                        )}
                        <button className="btn" disabled={busy} onClick={() => add([{ label: 'Mobilisation / first payment' }])}>Add a payment</button>
                    </div>
                </div>
            ) : (
                <>
                    <ul className="list">
                        {payments.map(p => (
                            <PaymentRow key={p.id} payment={p} stages={stages} urls={urls} onSave={update} onDelete={remove}
                                onReceipt={receipt} onRemoveReceipt={removeReceipt} />
                        ))}
                    </ul>
                    <div className="actions"><button className="btn" disabled={busy} onClick={() => add([{ label: 'New payment' }])}>+ Add payment</button></div>
                </>
            )}
        </>
    )
}

/* ───────────── Site updates ───────────── */

const today = () => new Date().toISOString().slice(0, 10)

export function UpdatesSection({ data, patch, urls, sign, toast, projectId }) {
    const [form, setForm] = useState({ title: '', body: '', date: today() })
    const [files, setFiles] = useState([])
    const [busy, setBusy] = useState(false)
    const [editing, setEditing] = useState(null) // { id, title, body }

    async function post(e) {
        e.preventDefault()
        if (!form.title.trim()) return toast('Give the update a title.', 'error')
        setBusy(true)
        try {
            const supabase = createClient()
            const photos = []
            for (const file of files) photos.push(await uploadFile(projectId, 'updates', file))
            const { data: { user } } = await supabase.auth.getUser()
            const postedAt = form.date && form.date !== today() ? new Date(`${form.date}T12:00:00`).toISOString() : new Date().toISOString()
            const { data: row, error } = await supabase.from('project_updates').insert({
                project_id: projectId, title: form.title.trim(), body: form.body.trim() || null,
                photos, posted_at: postedAt, created_by: user?.id || null,
            }).select('*').single()
            if (error) { await removeFiles(photos); throw new Error(error.message) }
            await sign(photos)
            patch('updates', list => [row, ...list].sort((a, b) => (a.posted_at < b.posted_at ? 1 : -1)))
            setForm({ title: '', body: '', date: today() })
            setFiles([])
            toast('Update posted — the client can see it now')
        } catch (err) { toast(err.message, 'error', 6000) }
        setBusy(false)
    }

    async function saveEdit() {
        if (!editing.title.trim()) return toast('Title is required.', 'error')
        const { data: row, error } = await createClient().from('project_updates')
            .update({ title: editing.title.trim(), body: editing.body.trim() || null }).eq('id', editing.id).select('*').single()
        if (error) return toast('Error: ' + error.message, 'error')
        patch('updates', list => list.map(u => u.id === row.id ? row : u))
        setEditing(null)
        toast('Update saved')
    }

    async function remove(u) {
        if (!confirm(`Delete the update “${u.title}” and its photos?`)) return
        const { error } = await createClient().from('project_updates').delete().eq('id', u.id)
        if (error) return toast('Error: ' + error.message, 'error')
        await removeFiles(u.photos)
        patch('updates', list => list.filter(x => x.id !== u.id))
        toast('Update deleted')
    }

    return (
        <>
            <form className={`card${busy ? ' busy' : ''}`} onSubmit={post}>
                <h2 className="ap-h2">Post a site update</h2>
                <div className="grid">
                    <Field label="Title *" span={9}><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Ground-floor slab cast" /></Field>
                    <Field label="Date" span={3}><input type="date" value={form.date} max={today()} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
                    <Field label="What happened this week" span={12}>
                        <textarea rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Work done, what's next, anything the client needs to decide" />
                    </Field>
                    <Field label={`Photos${files.length ? ` (${files.length} selected)` : ''}`} span={12}>
                        <input type="file" accept="image/*" multiple onChange={e => setFiles([...e.target.files].slice(0, 12))} />
                    </Field>
                </div>
                <div className="actions"><button className="btn approve" disabled={busy}>{busy ? 'Posting…' : 'Post update'}</button></div>
            </form>

            {data.updates.length === 0 ? <div className="empty" style={{ marginTop: 12 }}>No updates posted yet.</div> : (
                <ul className="list" style={{ marginTop: 12 }}>
                    {data.updates.map(u => (
                        <li key={u.id} className="card">
                            <div className="muted small">{formatDate(u.posted_at)}</div>
                            {editing?.id === u.id ? (
                                <div className="grid" style={{ marginTop: 8 }}>
                                    <Field label="Title" span={12}><input value={editing.title} onChange={e => setEditing(x => ({ ...x, title: e.target.value }))} /></Field>
                                    <Field label="Text" span={12}><textarea rows={4} value={editing.body} onChange={e => setEditing(x => ({ ...x, body: e.target.value }))} /></Field>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: 17, margin: '4px 0' }}>{u.title}</div>
                                    {u.body && <p className="muted small" style={{ whiteSpace: 'pre-line', margin: 0 }}>{u.body}</p>}
                                </>
                            )}
                            <Thumbs paths={u.photos} urls={urls} />
                            <div className="actions">
                                {editing?.id === u.id ? (
                                    <>
                                        <button className="btn approve" onClick={saveEdit}>Save</button>
                                        <button className="btn" onClick={() => setEditing(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <button className="btn" onClick={() => setEditing({ id: u.id, title: u.title, body: u.body || '' })}>Edit</button>
                                )}
                                <span style={{ flex: 1 }} />
                                <button className="btn reject" onClick={() => remove(u)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

/* ───────────── Documents ───────────── */

export function DocumentsSection({ data, patch, urls, sign, toast, projectId }) {
    const [category, setCategory] = useState('contract')
    const [title, setTitle] = useState('')
    const [files, setFiles] = useState([])
    const [busy, setBusy] = useState(false)
    const [inputKey, setInputKey] = useState(0)

    async function upload(e) {
        e.preventDefault()
        if (!files.length) return toast('Choose a file first.', 'error')
        setBusy(true)
        try {
            const supabase = createClient()
            const rows = []
            for (const file of files) {
                const path = await uploadFile(projectId, 'documents', file)
                const name = files.length === 1 && title.trim() ? title.trim() : file.name.replace(/\.[^.]+$/, '')
                const { data: row, error } = await supabase.from('project_documents')
                    .insert({ project_id: projectId, category, title: name, file_path: path, file_size: file.size }).select('*').single()
                if (error) { await removeFiles([path]); throw new Error(error.message) }
                rows.push(row)
            }
            await sign(rows.map(r => r.file_path))
            patch('documents', list => [...rows, ...list])
            setTitle('')
            setFiles([])
            setInputKey(k => k + 1)
            toast(rows.length === 1 ? 'Document uploaded' : `${rows.length} documents uploaded`)
        } catch (err) { toast(err.message, 'error', 6000) }
        setBusy(false)
    }

    async function remove(d) {
        if (!confirm(`Delete “${d.title}”?`)) return
        const { error } = await createClient().from('project_documents').delete().eq('id', d.id)
        if (error) return toast('Error: ' + error.message, 'error')
        await removeFiles([d.file_path])
        patch('documents', list => list.filter(x => x.id !== d.id))
        toast('Document deleted')
    }

    return (
        <>
            <form className={`card${busy ? ' busy' : ''}`} onSubmit={upload}>
                <h2 className="ap-h2">Upload documents</h2>
                <div className="grid">
                    <Field label="Category" span={4}>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            {Object.entries(DOC_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </Field>
                    <Field label="Title (optional, one file only)" span={8}>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Defaults to the file name" disabled={files.length > 1} />
                    </Field>
                    <Field label={`Files (PDF, images, DWG… up to ${MAX_UPLOAD_MB} MB each)`} span={12}>
                        <input key={inputKey} type="file" multiple onChange={e => setFiles([...e.target.files])} />
                    </Field>
                </div>
                <div className="actions"><button className="btn approve" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button></div>
            </form>

            {data.documents.length === 0 ? <div className="empty" style={{ marginTop: 12 }}>No documents yet.</div> : (
                <div className="card" style={{ marginTop: 12 }}>
                    {Object.entries(DOC_CATEGORIES).map(([key, label]) => {
                        const list = data.documents.filter(d => d.category === key)
                        if (!list.length) return null
                        return (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <div className="chip" style={{ display: 'inline-block', marginBottom: 6 }}>{label}</div>
                                {list.map(d => (
                                    <div key={d.id} className="row-head" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <div>{d.title}</div>
                                            <div className="muted small">{formatDate(d.uploaded_at)}{d.file_size ? ` · ${formatBytes(d.file_size)}` : ''}</div>
                                        </div>
                                        <div className="actions" style={{ marginTop: 0 }}>
                                            {urls[d.file_path] && <a className="btn" href={urls[d.file_path]} target="_blank" rel="noopener noreferrer">Open</a>}
                                            <button className="btn reject" onClick={() => remove(d)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

/* ───────────── Defects ───────────── */

const DEFECT_TONE = { open: 'warn', in_progress: 'info', resolved: 'good', closed: '' }

function DefectRow({ defect, reporter, urls, onSave }) {
    const initial = { status: defect.status, admin_note: blank(defect.admin_note) }
    const [f, setF] = useState(initial)
    const [busy, setBusy] = useState(false)
    const dirty = !same(f, initial)

    return (
        <li className={`card${busy ? ' busy' : ''}`}>
            <div className="row-head">
                <div style={{ fontSize: 17 }}>{defect.title}</div>
                <span className={`chip ${DEFECT_TONE[defect.status] || ''}`}>{DEFECT_STATUS[defect.status]}</span>
            </div>
            <div className="muted small" style={{ marginTop: 4 }}>
                {defect.location && <>{defect.location} · </>}
                Reported {formatDate(defect.created_at)}{reporter ? ` by ${reporter}` : ''}
            </div>
            {defect.description && <p className="small" style={{ whiteSpace: 'pre-line', color: 'rgba(240,236,228,0.75)' }}>{defect.description}</p>}
            <Thumbs paths={defect.photos} urls={urls} />
            <div className="grid" style={{ marginTop: 12 }}>
                <Field label="Status" span={4}>
                    <select value={f.status} onChange={e => setF(x => ({ ...x, status: e.target.value }))}>
                        {Object.entries(DEFECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </Field>
                <Field label="Reply to the client" span={8}>
                    <textarea rows={2} value={f.admin_note} onChange={e => setF(x => ({ ...x, admin_note: e.target.value }))}
                        placeholder="e.g. Plumber booked for Thursday morning." />
                </Field>
            </div>
            <div className="actions">
                <button className="btn approve" disabled={!dirty || busy} onClick={async () => {
                    setBusy(true)
                    const saved = await onSave(defect.id, { status: f.status, admin_note: orNull(f.admin_note.trim()) })
                    if (saved) setF({ status: saved.status, admin_note: blank(saved.admin_note) })
                    setBusy(false)
                }}>Save</button>
            </div>
        </li>
    )
}

export function DefectsSection({ data, patch, urls, toast }) {
    const who = Object.fromEntries(data.members.map(m => [m.user_id, m.full_name || m.email]))

    async function save(id, row) {
        const { data: saved, error } = await createClient().from('defect_requests').update(row).eq('id', id).select('*').single()
        if (error) return toast('Error: ' + error.message, 'error')
        patch('defects', list => list.map(d => d.id === id ? saved : d))
        toast('Saved — the client can see the update')
        return saved
    }

    if (!data.defects.length) return <div className="empty">No defect or warranty requests from the client yet.</div>
    return (
        <ul className="list">
            {data.defects.map(d => <DefectRow key={d.id} defect={d} reporter={who[d.created_by]} urls={urls} onSave={save} />)}
        </ul>
    )
}
