'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

// ─── Date Range Picker ────────────────────────────────────────────────────────

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function formatDateRange(start, end) {
    if (!start) return ''
    const s = new Date(start + 'T12:00:00')
    if (!end || end === start) {
        return `${MONTHS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`
    }
    const e = new Date(end + 'T12:00:00')
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        return `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
    }
    if (s.getFullYear() === e.getFullYear()) {
        return `${SHORT_MONTHS[s.getMonth()]} ${s.getDate()} – ${SHORT_MONTHS[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`
    }
    return `${SHORT_MONTHS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} – ${SHORT_MONTHS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`
}

function DateRangePicker({ value, onChange }) {
    const today = new Date()
    const [open, setOpen] = useState(false)
    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [hovered, setHovered] = useState('')
    const ref = useRef(null)

    // parse incoming value back to start/end on mount
    useEffect(() => {
        if (!value) { setStart(''); setEnd(''); return }
        // if it already looks like an ISO date pair we stored, use it
        // otherwise just show the string as-is in the input
    }, [value])

    useEffect(() => {
        function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
    function getFirstDayOfMonth(y, m) { return new Date(y, m, 1).getDay() }

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1) }
        else setViewMonth(m => m - 1)
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1) }
        else setViewMonth(m => m + 1)
    }

    function toISO(y, m, d) {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    }

    function handleDayClick(iso) {
        if (!start || (start && end)) {
            // fresh selection
            setStart(iso); setEnd(''); setHovered('')
        } else {
            // second click — set end
            if (iso < start) { setEnd(start); setStart(iso) }
            else { setEnd(iso) }
            // emit and close after a tick
            const s = iso < start ? iso : start
            const e = iso < start ? start : iso
            const label = formatDateRange(s, e === s ? '' : e)
            onChange(label)
            setTimeout(() => setOpen(false), 120)
        }
    }

    function handleDayHover(iso) { if (start && !end) setHovered(iso) }

    function inRange(iso) {
        const e = end || hovered
        if (!start || !e) return false
        const lo = start < e ? start : e
        const hi = start < e ? e : start
        return iso > lo && iso < hi
    }

    function isStart(iso) { return iso === start }
    function isEnd(iso) { return iso === (end || hovered) }

    const days = getDaysInMonth(viewYear, viewMonth)
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

    const displayValue = value || ''

    return (
        <div style={{ position: 'relative' }} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="text-input date-picker-trigger"
                style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <span style={{ color: displayValue ? '#e8e2d9' : '#2a2a2a' }}>
                    {displayValue || 'Pick a date…'}
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: '#3a3530' }}>
                    <rect x="1" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1 6h12M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            </button>

            {open && (
                <div className="dp-popup">
                    {/* Nav */}
                    <div className="dp-nav">
                        <button type="button" className="dp-nav-btn" onClick={prevMonth}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <span className="dp-month-label">{MONTHS[viewMonth]} {viewYear}</span>
                        <button type="button" className="dp-nav-btn" onClick={nextMonth}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="dp-grid">
                        {DAYS.map(d => <span key={d} className="dp-day-header">{d}</span>)}

                        {/* Empty cells */}
                        {Array.from({ length: firstDay }).map((_, i) => <span key={'e' + i} />)}

                        {/* Days */}
                        {Array.from({ length: days }).map((_, i) => {
                            const d = i + 1
                            const iso = toISO(viewYear, viewMonth, d)
                            const sel = isStart(iso) || isEnd(iso)
                            const range = inRange(iso)
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    className={`dp-day ${sel ? 'dp-day-sel' : ''} ${range ? 'dp-day-range' : ''}`}
                                    onClick={() => handleDayClick(iso)}
                                    onMouseEnter={() => handleDayHover(iso)}
                                >
                                    {d}
                                </button>
                            )
                        })}
                    </div>

                    {/* Footer */}
                    <div className="dp-footer">
                        {start ? (
                            <span className="dp-hint">
                                {end ? formatDateRange(start, end) : `${formatDateRange(start, '')} — pick end date or click same day`}
                            </span>
                        ) : (
                            <span className="dp-hint">Click a start date</span>
                        )}
                        {(start || value) && (
                            <button type="button" className="dp-clear" onClick={() => { setStart(''); setEnd(''); setHovered(''); onChange('') }}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const EVENT_TYPES = ['Conference', 'Event', 'Trade Show', 'Webinar', 'Workshop']

const TYPE_COLORS = {
    'Conference': '#2a3a2a',
    'Event': '#2a2a3a',
    'Trade Show': '#3a2a2a',
    'Webinar': '#2a3a3a',
    'Workshop': '#3a302a',
}

export default function AdminEventsPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [toast, setToast] = useState(null)
    const [form, setForm] = useState({ title: '', type: 'Event', date: '', location: '', href: '' })
    const [editForm, setEditForm] = useState({})

    useEffect(() => { fetchItems() }, [])

    async function fetchItems() {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase.from('events').select('*').order('position', { ascending: true })
        setItems(data || [])
        setLoading(false)
    }

    function showToast(msg, type = 'success') {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 2800)
    }

    async function addItem() {
        if (!form.title.trim() || !form.date.trim()) return showToast('Title and date are required.', 'error')
        setSaving(true)
        const supabase = createClient()
        const position = items.length ? Math.max(...items.map(i => i.position)) + 1 : 0
        const { data, error } = await supabase.from('events').insert([{ ...form, position, href: form.href || '#' }]).select().single()
        if (!error) {
            setItems(prev => [...prev, data])
            setForm({ title: '', type: 'Event', date: '', location: '', href: '' })
            showToast('Event added')
        } else showToast('Error: ' + error.message, 'error')
        setSaving(false)
    }

    async function deleteItem(id) {
        const supabase = createClient()
        const { error } = await supabase.from('events').delete().eq('id', id)
        if (!error) { setItems(prev => prev.filter(i => i.id !== id)); showToast('Event deleted') }
    }

    function startEdit(item) {
        setEditingId(item.id)
        setEditForm({ title: item.title, type: item.type, date: item.date, location: item.location || '', href: item.href || '' })
    }

    async function saveEdit(id) {
        setSaving(true)
        const supabase = createClient()
        const { data, error } = await supabase.from('events').update({ ...editForm, href: editForm.href || '#' }).eq('id', id).select().single()
        if (!error) {
            setItems(prev => prev.map(i => i.id === id ? data : i))
            setEditingId(null)
            showToast('Changes saved')
        } else showToast('Error: ' + error.message, 'error')
        setSaving(false)
    }

    async function moveItem(id, dir) {
        const idx = items.findIndex(i => i.id === id)
        const swapIdx = idx + dir
        if (swapIdx < 0 || swapIdx >= items.length) return
        const next = [...items]
        const posA = next[idx].position, posB = next[swapIdx].position
            ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
        next[idx].position = posA; next[swapIdx].position = posB
        setItems(next)
        const supabase = createClient()
        await supabase.from('events').update({ position: posA }).eq('id', next[idx].id)
        await supabase.from('events').update({ position: posB }).eq('id', next[swapIdx].id)
    }

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div className="loading-dots"><span /><span /><span /></div>
            </div>
        </>
    )

    return (
        <>
            <style>{styles}</style>
            <div className="admin-page">
                <div className="admin-container">

                    {/* Header */}
                    <div className="admin-header animate-in">
                        <div>
                            <p className="admin-eyebrow">Admin</p>
                            <h1 className="admin-title">Events</h1>
                        </div>
                        <Link href="/admin/news" className="back-btn">
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M4 1L1 5M1 5L4 9M1 5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            News Admin
                        </Link>
                    </div>

                    {/* Add form */}
                    <div className="add-card animate-in delay-1">
                        <p className="add-card-label">New Event</p>

                        <div className="field-group">
                            <label className="field-label">Title</label>
                            <input
                                type="text" placeholder="Event title…" value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                className="text-input"
                            />
                        </div>

                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label">Type</label>
                                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="text-input select-input">
                                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="field-group">
                                <label className="field-label">Date</label>
                                <DateRangePicker
                                    value={form.date}
                                    onChange={val => setForm(f => ({ ...f, date: val }))}
                                />
                            </div>
                        </div>

                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label">Location</label>
                                <input type="text" placeholder="Chicago, IL" value={form.location}
                                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                    className="text-input" />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Link <span style={{ color: '#2e2e2e' }}>(optional)</span></label>
                                <input type="text" placeholder="https://…" value={form.href}
                                    onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                                    className="text-input" />
                            </div>
                        </div>

                        <button onClick={addItem} disabled={saving} className="add-btn">
                            {saving ? <span className="btn-loading" /> : (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Add Event
                                </>
                            )}
                        </button>
                    </div>

                    {/* List */}
                    <div className="animate-in delay-2">
                        <div className="list-meta">
                            <span>{items.length} {items.length !== 1 ? 'events' : 'event'}</span>
                        </div>

                        {items.length === 0 ? (
                            <div className="empty-state">
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: '12px', opacity: 0.2 }}>
                                    <rect x="3" y="7" width="30" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M3 14h30M12 3v8M24 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p>No events yet.</p>
                            </div>
                        ) : (
                            <ul className="event-list">
                                {items.map((item, i) => (
                                    <li key={item.id} className="event-item">
                                        {editingId === item.id ? (
                                            <div className="edit-panel">
                                                <p className="edit-panel-label">Editing</p>
                                                <div className="field-group">
                                                    <label className="field-label">Title</label>
                                                    <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="text-input" />
                                                </div>
                                                <div className="field-row">
                                                    <div className="field-group">
                                                        <label className="field-label">Type</label>
                                                        <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))} className="text-input select-input">
                                                            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="field-group">
                                                        <label className="field-label">Date</label>
                                                        <DateRangePicker
                                                            value={editForm.date}
                                                            onChange={val => setEditForm(f => ({ ...f, date: val }))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="field-row">
                                                    <div className="field-group">
                                                        <label className="field-label">Location</label>
                                                        <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} className="text-input" />
                                                    </div>
                                                    <div className="field-group">
                                                        <label className="field-label">Link</label>
                                                        <input value={editForm.href} onChange={e => setEditForm(f => ({ ...f, href: e.target.value }))} className="text-input" />
                                                    </div>
                                                </div>
                                                <div className="edit-actions">
                                                    <button onClick={() => saveEdit(item.id)} disabled={saving} className="add-btn" style={{ padding: '9px 20px' }}>
                                                        {saving ? <span className="btn-loading" /> : 'Save'}
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="event-row">
                                                <div className="event-drag">
                                                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                                                        <circle cx="3" cy="3" r="1.2" fill="currentColor" />
                                                        <circle cx="9" cy="3" r="1.2" fill="currentColor" />
                                                        <circle cx="3" cy="7" r="1.2" fill="currentColor" />
                                                        <circle cx="9" cy="7" r="1.2" fill="currentColor" />
                                                        <circle cx="3" cy="11" r="1.2" fill="currentColor" />
                                                        <circle cx="9" cy="11" r="1.2" fill="currentColor" />
                                                    </svg>
                                                </div>

                                                <div className="event-info">
                                                    <div className="event-meta-row">
                                                        <span className="type-badge" style={{ background: TYPE_COLORS[item.type] || '#2a2a2a' }}>
                                                            {item.type}
                                                        </span>
                                                        <span className="meta-text">{item.date}</span>
                                                        {item.location && <><span className="meta-sep">·</span><span className="meta-text">{item.location}</span></>}
                                                    </div>
                                                    <p className="event-title">{item.title}</p>
                                                </div>

                                                <div className="event-actions">
                                                    <button onClick={() => moveItem(item.id, -1)} disabled={i === 0} className="icon-btn" title="Move up">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => moveItem(item.id, 1)} disabled={i === items.length - 1} className="icon-btn" title="Move down">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M6 2v8M10 6l-4 4-4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => startEdit(item)} className="icon-btn" title="Edit">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M8.5 1.5l2 2L3 11H1v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => deleteItem(item.id)} className="icon-btn delete-btn" title="Delete">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {toast && (
                <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
                    {toast.type !== 'error' && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    {toast.msg}
                </div>
            )}
        </>
    )
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

    .admin-page {
        font-family: 'DM Sans', sans-serif;
        background: #0c0c0c;
        min-height: 100vh;
        color: #e8e2d9;
    }
    .admin-container {
        max-width: 760px;
        margin: 0 auto;
        padding: 64px 32px 96px;
    }

    /* Header */
    .admin-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 52px;
    }
    .admin-eyebrow {
        font-size: 10px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #3a3530;
        margin: 0 0 8px;
    }
    .admin-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 42px;
        font-weight: 300;
        color: #e8e2d9;
        margin: 0;
        line-height: 1;
        letter-spacing: -0.01em;
    }
    .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #4a4540;
        text-decoration: none;
        border: 1px solid #1e1e1e;
        padding: 9px 16px;
        border-radius: 3px;
        transition: color 0.2s, border-color 0.2s;
    }
    .back-btn:hover { color: #e8e2d9; border-color: #3a3530; }

    /* Form card */
    .add-card {
        background: #111;
        border: 1px solid #1e1e1e;
        border-radius: 6px;
        padding: 28px;
        margin-bottom: 40px;
    }
    .add-card-label {
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #3a3530;
        margin: 0 0 24px;
    }
    .field-group {
        display: flex;
        flex-direction: column;
        gap: 7px;
        margin-bottom: 16px;
        flex: 1;
    }
    .field-label {
        font-size: 10px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #3a3530;
    }
    .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .text-input {
        width: 100%;
        background: #0c0c0c;
        border: 1px solid #1e1e1e;
        border-radius: 4px;
        padding: 10px 13px;
        font-size: 13px;
        font-family: 'DM Sans', sans-serif;
        color: #e8e2d9;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
    }
    .text-input::placeholder { color: #2a2a2a; }
    .text-input:focus { border-color: #3a3530; }
    .select-input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%233a3530' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
    .select-input option { background: #111; }

    .add-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        background: #e8e2d9;
        color: #0c0c0c;
        border: none;
        border-radius: 4px;
        padding: 11px 22px;
        font-size: 12px;
        font-family: 'DM Sans', sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, opacity 0.2s;
    }
    .add-btn:hover { background: #f5f0e8; }
    .add-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    .cancel-btn {
        display: inline-flex;
        align-items: center;
        background: transparent;
        color: #3a3530;
        border: 1px solid #1e1e1e;
        border-radius: 4px;
        padding: 9px 18px;
        font-size: 12px;
        font-family: 'DM Sans', sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
    }
    .cancel-btn:hover { color: #e8e2d9; border-color: #3a3530; }

    .btn-loading {
        display: inline-block;
        width: 14px; height: 14px;
        border: 1.5px solid rgba(12,12,12,0.2);
        border-top-color: #0c0c0c;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }

    /* List */
    .list-meta {
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #2e2e2e;
        margin-bottom: 16px;
    }
    .event-list {
        list-style: none;
        margin: 0; padding: 0;
        border: 1px solid #1a1a1a;
        border-radius: 6px;
        overflow: hidden;
    }
    .event-item {
        border-bottom: 1px solid #141414;
        background: #0e0e0e;
        transition: background 0.15s;
    }
    .event-item:last-child { border-bottom: none; }

    /* Row */
    .event-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 18px 20px;
    }
    .event-item:hover { background: #111; }

    .event-drag {
        color: #2a2a2a;
        cursor: grab;
        flex-shrink: 0;
        transition: color 0.15s;
    }
    .event-item:hover .event-drag { color: #3a3530; }

    .event-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .event-meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }
    .type-badge {
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #9e9588;
        padding: 3px 8px;
        border-radius: 2px;
    }
    .meta-text {
        font-size: 11px;
        color: #3a3530;
    }
    .meta-sep { font-size: 11px; color: #2a2a2a; }
    .event-title {
        font-size: 14px;
        color: #c8c2b9;
        font-weight: 300;
        margin: 0;
    }

    /* Edit panel */
    .edit-panel {
        padding: 20px;
        background: #111;
        border-top: 1px solid #1e1e1e;
        border-bottom: 1px solid #1e1e1e;
    }
    .edit-panel-label {
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #3a3530;
        margin: 0 0 20px;
    }
    .edit-actions {
        display: flex;
        gap: 10px;
        margin-top: 8px;
    }

    /* Icon buttons */
    .event-actions {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
    }
    .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px; height: 30px;
        border: 1px solid #1e1e1e;
        border-radius: 3px;
        background: transparent;
        color: #3a3530;
        cursor: pointer;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
    }
    .icon-btn:hover { color: #e8e2d9; border-color: #3a3530; background: #141414; }
    .icon-btn:disabled { opacity: 0.15; cursor: not-allowed; }
    .icon-btn:disabled:hover { color: #3a3530; border-color: #1e1e1e; background: transparent; }
    .delete-btn:hover { color: #e05c5c; border-color: #3a1e1e; background: #1a0e0e; }

    /* Empty */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 24px;
        color: #3a3530;
        font-size: 14px;
        font-weight: 300;
        border: 1px solid #1a1a1a;
        border-radius: 6px;
    }

    /* Date picker */
    .date-picker-trigger {
        width: 100%;
        background: #0c0c0c;
        border: 1px solid #1e1e1e;
        border-radius: 4px;
        padding: 10px 13px;
        font-size: 13px;
        font-family: 'DM Sans', sans-serif;
        color: #e8e2d9;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
        cursor: pointer;
    }
    .date-picker-trigger:hover,
    .date-picker-trigger:focus { border-color: #3a3530; }

    .dp-popup {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        z-index: 200;
        background: #111;
        border: 1px solid #1e1e1e;
        border-radius: 6px;
        padding: 20px;
        width: 280px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.6);
        animation: fadeUp 0.18s ease both;
    }
    .dp-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }
    .dp-month-label {
        font-size: 12px;
        letter-spacing: 0.06em;
        color: #c8c2b9;
    }
    .dp-nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px; height: 26px;
        background: transparent;
        border: 1px solid #1e1e1e;
        border-radius: 3px;
        color: #3a3530;
        cursor: pointer;
        transition: color 0.15s, border-color 0.15s;
    }
    .dp-nav-btn:hover { color: #e8e2d9; border-color: #3a3530; }
    .dp-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }
    .dp-day-header {
        text-align: center;
        font-size: 10px;
        letter-spacing: 0.08em;
        color: #2e2e2e;
        padding: 4px 0 8px;
        text-transform: uppercase;
    }
    .dp-day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #6b6460;
        background: transparent;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
        font-family: 'DM Sans', sans-serif;
    }
    .dp-day:hover { background: #1e1e1e; color: #e8e2d9; }
    .dp-day-sel { background: #e8e2d9 !important; color: #0c0c0c !important; font-weight: 500; }
    .dp-day-range { background: #1e1a18; color: #9e9588; }
    .dp-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid #1a1a1a;
        gap: 8px;
    }
    .dp-hint { font-size: 11px; color: #3a3530; flex: 1; line-height: 1.4; }
    .dp-clear {
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #3a3530;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: color 0.15s;
        white-space: nowrap;
        font-family: 'DM Sans', sans-serif;
    }
    .dp-clear:hover { color: #e05c5c; }

    /* Toast */
    .toast {
        position: fixed;
        bottom: 28px; right: 28px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: #e8e2d9;
        color: #0c0c0c;
        font-size: 13px;
        font-family: 'DM Sans', sans-serif;
        padding: 12px 18px;
        border-radius: 4px;
        z-index: 100;
        animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .toast-error { background: #3a1e1e; color: #e8c8c8; }

    /* Animations */
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-in { animation: fadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
    .delay-1 { animation-delay: 0.08s; }
    .delay-2 { animation-delay: 0.16s; }

    .loading-dots { display: flex; gap: 6px; }
    .loading-dots span {
        width: 5px; height: 5px;
        border-radius: 50%;
        background: #3a3530;
        animation: pulse 1.2s ease-in-out infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse {
        0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1); }
    }
`

// 'use client'
//
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { createClient } from '@/utils/supabase/client'
//
// const EVENT_TYPES = ['Conference', 'Event', 'Trade Show', 'Webinar', 'Workshop']
//
// const TYPE_COLORS = {
//     'Conference': '#2a3a2a',
//     'Event':      '#2a2a3a',
//     'Trade Show': '#3a2a2a',
//     'Webinar':    '#2a3a3a',
//     'Workshop':   '#3a302a',
// }
//
// export default function AdminEventsPage() {
//     const [items, setItems]         = useState([])
//     const [loading, setLoading]     = useState(true)
//     const [saving, setSaving]       = useState(false)
//     const [editingId, setEditingId] = useState(null)
//     const [toast, setToast]         = useState(null)
//     const [form, setForm]           = useState({ title: '', type: 'Event', date: '', location: '', href: '' })
//     const [editForm, setEditForm]   = useState({})
//
//     useEffect(() => { fetchItems() }, [])
//
//     async function fetchItems() {
//         setLoading(true)
//         const supabase = createClient()
//         const { data } = await supabase.from('events').select('*').order('position', { ascending: true })
//         setItems(data || [])
//         setLoading(false)
//     }
//
//     function showToast(msg, type = 'success') {
//         setToast({ msg, type })
//         setTimeout(() => setToast(null), 2800)
//     }
//
//     async function addItem() {
//         if (!form.title.trim() || !form.date.trim()) return showToast('Title and date are required.', 'error')
//         setSaving(true)
//         const supabase = createClient()
//         const position = items.length ? Math.max(...items.map(i => i.position)) + 1 : 0
//         const { data, error } = await supabase.from('events').insert([{ ...form, position, href: form.href || '#' }]).select().single()
//         if (!error) {
//             setItems(prev => [...prev, data])
//             setForm({ title: '', type: 'Event', date: '', location: '', href: '' })
//             showToast('Event added')
//         } else showToast('Error: ' + error.message, 'error')
//         setSaving(false)
//     }
//
//     async function deleteItem(id) {
//         const supabase = createClient()
//         const { error } = await supabase.from('events').delete().eq('id', id)
//         if (!error) { setItems(prev => prev.filter(i => i.id !== id)); showToast('Event deleted') }
//     }
//
//     function startEdit(item) {
//         setEditingId(item.id)
//         setEditForm({ title: item.title, type: item.type, date: item.date, location: item.location || '', href: item.href || '' })
//     }
//
//     async function saveEdit(id) {
//         setSaving(true)
//         const supabase = createClient()
//         const { data, error } = await supabase.from('events').update({ ...editForm, href: editForm.href || '#' }).eq('id', id).select().single()
//         if (!error) {
//             setItems(prev => prev.map(i => i.id === id ? data : i))
//             setEditingId(null)
//             showToast('Changes saved')
//         } else showToast('Error: ' + error.message, 'error')
//         setSaving(false)
//     }
//
//     async function moveItem(id, dir) {
//         const idx = items.findIndex(i => i.id === id)
//         const swapIdx = idx + dir
//         if (swapIdx < 0 || swapIdx >= items.length) return
//         const next = [...items]
//         const posA = next[idx].position, posB = next[swapIdx].position
//         ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
//         next[idx].position = posA; next[swapIdx].position = posB
//         setItems(next)
//         const supabase = createClient()
//         await supabase.from('events').update({ position: posA }).eq('id', next[idx].id)
//         await supabase.from('events').update({ position: posB }).eq('id', next[swapIdx].id)
//     }
//
//     if (loading) return (
//         <>
//             <style>{styles}</style>
//             <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
//                 <div className="loading-dots"><span /><span /><span /></div>
//             </div>
//         </>
//     )
//
//     return (
//         <>
//             <style>{styles}</style>
//             <div className="admin-page">
//                 <div className="admin-container">
//
//                     {/* Header */}
//                     <div className="admin-header animate-in">
//                         <div>
//                             <p className="admin-eyebrow">Admin</p>
//                             <h1 className="admin-title">Events</h1>
//                         </div>
//                         <Link href="/admin/news" className="back-btn">
//                             <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
//                                 <path d="M4 1L1 5M1 5L4 9M1 5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                             </svg>
//                             News Admin
//                         </Link>
//                     </div>
//
//                     {/* Add form */}
//                     <div className="add-card animate-in delay-1">
//                         <p className="add-card-label">New Event</p>
//
//                         <div className="field-group">
//                             <label className="field-label">Title</label>
//                             <input
//                                 type="text" placeholder="Event title…" value={form.title}
//                                 onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                                 className="text-input"
//                             />
//                         </div>
//
//                         <div className="field-row">
//                             <div className="field-group">
//                                 <label className="field-label">Type</label>
//                                 <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="text-input select-input">
//                                     {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
//                                 </select>
//                             </div>
//                             <div className="field-group">
//                                 <label className="field-label">Date</label>
//                                 <input type="text" placeholder="June 3–5, 2026" value={form.date}
//                                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
//                                        className="text-input" />
//                             </div>
//                         </div>
//
//                         <div className="field-row">
//                             <div className="field-group">
//                                 <label className="field-label">Location</label>
//                                 <input type="text" placeholder="Chicago, IL" value={form.location}
//                                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
//                                        className="text-input" />
//                             </div>
//                             <div className="field-group">
//                                 <label className="field-label">Link <span style={{ color: '#2e2e2e' }}>(optional)</span></label>
//                                 <input type="text" placeholder="https://…" value={form.href}
//                                        onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
//                                        className="text-input" />
//                             </div>
//                         </div>
//
//                         <button onClick={addItem} disabled={saving} className="add-btn">
//                             {saving ? <span className="btn-loading" /> : (
//                                 <>
//                                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                                         <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                                     </svg>
//                                     Add Event
//                                 </>
//                             )}
//                         </button>
//                     </div>
//
//                     {/* List */}
//                     <div className="animate-in delay-2">
//                         <div className="list-meta">
//                             <span>{items.length} {items.length !== 1 ? 'events' : 'event'}</span>
//                         </div>
//
//                         {items.length === 0 ? (
//                             <div className="empty-state">
//                                 <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: '12px', opacity: 0.2 }}>
//                                     <rect x="3" y="7" width="30" height="26" rx="3" stroke="currentColor" strokeWidth="1.5"/>
//                                     <path d="M3 14h30M12 3v8M24 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                                 </svg>
//                                 <p>No events yet.</p>
//                             </div>
//                         ) : (
//                             <ul className="event-list">
//                                 {items.map((item, i) => (
//                                     <li key={item.id} className="event-item">
//                                         {editingId === item.id ? (
//                                             <div className="edit-panel">
//                                                 <p className="edit-panel-label">Editing</p>
//                                                 <div className="field-group">
//                                                     <label className="field-label">Title</label>
//                                                     <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="text-input" />
//                                                 </div>
//                                                 <div className="field-row">
//                                                     <div className="field-group">
//                                                         <label className="field-label">Type</label>
//                                                         <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))} className="text-input select-input">
//                                                             {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
//                                                         </select>
//                                                     </div>
//                                                     <div className="field-group">
//                                                         <label className="field-label">Date</label>
//                                                         <input value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} className="text-input" />
//                                                     </div>
//                                                 </div>
//                                                 <div className="field-row">
//                                                     <div className="field-group">
//                                                         <label className="field-label">Location</label>
//                                                         <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} className="text-input" />
//                                                     </div>
//                                                     <div className="field-group">
//                                                         <label className="field-label">Link</label>
//                                                         <input value={editForm.href} onChange={e => setEditForm(f => ({ ...f, href: e.target.value }))} className="text-input" />
//                                                     </div>
//                                                 </div>
//                                                 <div className="edit-actions">
//                                                     <button onClick={() => saveEdit(item.id)} disabled={saving} className="add-btn" style={{ padding: '9px 20px' }}>
//                                                         {saving ? <span className="btn-loading" /> : 'Save'}
//                                                     </button>
//                                                     <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="event-row">
//                                                 <div className="event-drag">
//                                                     <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
//                                                         <circle cx="3" cy="3" r="1.2" fill="currentColor"/>
//                                                         <circle cx="9" cy="3" r="1.2" fill="currentColor"/>
//                                                         <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
//                                                         <circle cx="9" cy="7" r="1.2" fill="currentColor"/>
//                                                         <circle cx="3" cy="11" r="1.2" fill="currentColor"/>
//                                                         <circle cx="9" cy="11" r="1.2" fill="currentColor"/>
//                                                     </svg>
//                                                 </div>
//
//                                                 <div className="event-info">
//                                                     <div className="event-meta-row">
//                                                         <span className="type-badge" style={{ background: TYPE_COLORS[item.type] || '#2a2a2a' }}>
//                                                             {item.type}
//                                                         </span>
//                                                         <span className="meta-text">{item.date}</span>
//                                                         {item.location && <><span className="meta-sep">·</span><span className="meta-text">{item.location}</span></>}
//                                                     </div>
//                                                     <p className="event-title">{item.title}</p>
//                                                 </div>
//
//                                                 <div className="event-actions">
//                                                     <button onClick={() => moveItem(item.id, -1)} disabled={i === 0} className="icon-btn" title="Move up">
//                                                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                                                             <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//                                                         </svg>
//                                                     </button>
//                                                     <button onClick={() => moveItem(item.id, 1)} disabled={i === items.length - 1} className="icon-btn" title="Move down">
//                                                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                                                             <path d="M6 2v8M10 6l-4 4-4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//                                                         </svg>
//                                                     </button>
//                                                     <button onClick={() => startEdit(item)} className="icon-btn" title="Edit">
//                                                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                                                             <path d="M8.5 1.5l2 2L3 11H1v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
//                                                         </svg>
//                                                     </button>
//                                                     <button onClick={() => deleteItem(item.id)} className="icon-btn delete-btn" title="Delete">
//                                                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                                                             <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 </div>
//             </div>
//
//             {toast && (
//                 <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
//                     {toast.type !== 'error' && (
//                         <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
//                             <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                     )}
//                     {toast.msg}
//                 </div>
//             )}
//         </>
//     )
// }
//
// const styles = `
//     @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
//
//     .admin-page {
//         font-family: 'DM Sans', sans-serif;
//         background: #0c0c0c;
//         min-height: 100vh;
//         color: #e8e2d9;
//     }
//     .admin-container {
//         max-width: 760px;
//         margin: 0 auto;
//         padding: 64px 32px 96px;
//     }
//
//     /* Header */
//     .admin-header {
//         display: flex;
//         align-items: flex-end;
//         justify-content: space-between;
//         margin-bottom: 52px;
//     }
//     .admin-eyebrow {
//         font-size: 10px;
//         letter-spacing: 0.2em;
//         text-transform: uppercase;
//         color: #3a3530;
//         margin: 0 0 8px;
//     }
//     .admin-title {
//         font-family: 'Cormorant Garamond', serif;
//         font-size: 42px;
//         font-weight: 300;
//         color: #e8e2d9;
//         margin: 0;
//         line-height: 1;
//         letter-spacing: -0.01em;
//     }
//     .back-btn {
//         display: inline-flex;
//         align-items: center;
//         gap: 10px;
//         font-size: 11px;
//         letter-spacing: 0.12em;
//         text-transform: uppercase;
//         color: #4a4540;
//         text-decoration: none;
//         border: 1px solid #1e1e1e;
//         padding: 9px 16px;
//         border-radius: 3px;
//         transition: color 0.2s, border-color 0.2s;
//     }
//     .back-btn:hover { color: #e8e2d9; border-color: #3a3530; }
//
//     /* Form card */
//     .add-card {
//         background: #111;
//         border: 1px solid #1e1e1e;
//         border-radius: 6px;
//         padding: 28px;
//         margin-bottom: 40px;
//     }
//     .add-card-label {
//         font-size: 10px;
//         letter-spacing: 0.18em;
//         text-transform: uppercase;
//         color: #3a3530;
//         margin: 0 0 24px;
//     }
//     .field-group {
//         display: flex;
//         flex-direction: column;
//         gap: 7px;
//         margin-bottom: 16px;
//         flex: 1;
//     }
//     .field-label {
//         font-size: 10px;
//         letter-spacing: 0.14em;
//         text-transform: uppercase;
//         color: #3a3530;
//     }
//     .field-row {
//         display: grid;
//         grid-template-columns: 1fr 1fr;
//         gap: 16px;
//     }
//     .text-input {
//         width: 100%;
//         background: #0c0c0c;
//         border: 1px solid #1e1e1e;
//         border-radius: 4px;
//         padding: 10px 13px;
//         font-size: 13px;
//         font-family: 'DM Sans', sans-serif;
//         color: #e8e2d9;
//         outline: none;
//         transition: border-color 0.2s;
//         box-sizing: border-box;
//     }
//     .text-input::placeholder { color: #2a2a2a; }
//     .text-input:focus { border-color: #3a3530; }
//     .select-input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%233a3530' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
//     .select-input option { background: #111; }
//
//     .add-btn {
//         display: inline-flex;
//         align-items: center;
//         gap: 8px;
//         margin-top: 8px;
//         background: #e8e2d9;
//         color: #0c0c0c;
//         border: none;
//         border-radius: 4px;
//         padding: 11px 22px;
//         font-size: 12px;
//         font-family: 'DM Sans', sans-serif;
//         letter-spacing: 0.08em;
//         text-transform: uppercase;
//         font-weight: 500;
//         cursor: pointer;
//         transition: background 0.2s, opacity 0.2s;
//     }
//     .add-btn:hover { background: #f5f0e8; }
//     .add-btn:disabled { opacity: 0.35; cursor: not-allowed; }
//
//     .cancel-btn {
//         display: inline-flex;
//         align-items: center;
//         background: transparent;
//         color: #3a3530;
//         border: 1px solid #1e1e1e;
//         border-radius: 4px;
//         padding: 9px 18px;
//         font-size: 12px;
//         font-family: 'DM Sans', sans-serif;
//         letter-spacing: 0.08em;
//         text-transform: uppercase;
//         cursor: pointer;
//         transition: color 0.2s, border-color 0.2s;
//     }
//     .cancel-btn:hover { color: #e8e2d9; border-color: #3a3530; }
//
//     .btn-loading {
//         display: inline-block;
//         width: 14px; height: 14px;
//         border: 1.5px solid rgba(12,12,12,0.2);
//         border-top-color: #0c0c0c;
//         border-radius: 50%;
//         animation: spin 0.7s linear infinite;
//     }
//
//     /* List */
//     .list-meta {
//         font-size: 10px;
//         letter-spacing: 0.15em;
//         text-transform: uppercase;
//         color: #2e2e2e;
//         margin-bottom: 16px;
//     }
//     .event-list {
//         list-style: none;
//         margin: 0; padding: 0;
//         border: 1px solid #1a1a1a;
//         border-radius: 6px;
//         overflow: hidden;
//     }
//     .event-item {
//         border-bottom: 1px solid #141414;
//         background: #0e0e0e;
//         transition: background 0.15s;
//     }
//     .event-item:last-child { border-bottom: none; }
//
//     /* Row */
//     .event-row {
//         display: flex;
//         align-items: center;
//         gap: 16px;
//         padding: 18px 20px;
//     }
//     .event-item:hover { background: #111; }
//
//     .event-drag {
//         color: #2a2a2a;
//         cursor: grab;
//         flex-shrink: 0;
//         transition: color 0.15s;
//     }
//     .event-item:hover .event-drag { color: #3a3530; }
//
//     .event-info {
//         flex: 1;
//         min-width: 0;
//         display: flex;
//         flex-direction: column;
//         gap: 6px;
//     }
//     .event-meta-row {
//         display: flex;
//         align-items: center;
//         gap: 8px;
//         flex-wrap: wrap;
//     }
//     .type-badge {
//         font-size: 10px;
//         letter-spacing: 0.12em;
//         text-transform: uppercase;
//         color: #9e9588;
//         padding: 3px 8px;
//         border-radius: 2px;
//     }
//     .meta-text {
//         font-size: 11px;
//         color: #3a3530;
//     }
//     .meta-sep { font-size: 11px; color: #2a2a2a; }
//     .event-title {
//         font-size: 14px;
//         color: #c8c2b9;
//         font-weight: 300;
//         margin: 0;
//     }
//
//     /* Edit panel */
//     .edit-panel {
//         padding: 20px;
//         background: #111;
//         border-top: 1px solid #1e1e1e;
//         border-bottom: 1px solid #1e1e1e;
//     }
//     .edit-panel-label {
//         font-size: 10px;
//         letter-spacing: 0.18em;
//         text-transform: uppercase;
//         color: #3a3530;
//         margin: 0 0 20px;
//     }
//     .edit-actions {
//         display: flex;
//         gap: 10px;
//         margin-top: 8px;
//     }
//
//     /* Icon buttons */
//     .event-actions {
//         display: flex;
//         align-items: center;
//         gap: 4px;
//         flex-shrink: 0;
//     }
//     .icon-btn {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         width: 30px; height: 30px;
//         border: 1px solid #1e1e1e;
//         border-radius: 3px;
//         background: transparent;
//         color: #3a3530;
//         cursor: pointer;
//         transition: color 0.15s, border-color 0.15s, background 0.15s;
//     }
//     .icon-btn:hover { color: #e8e2d9; border-color: #3a3530; background: #141414; }
//     .icon-btn:disabled { opacity: 0.15; cursor: not-allowed; }
//     .icon-btn:disabled:hover { color: #3a3530; border-color: #1e1e1e; background: transparent; }
//     .delete-btn:hover { color: #e05c5c; border-color: #3a1e1e; background: #1a0e0e; }
//
//     /* Empty */
//     .empty-state {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;
//         padding: 64px 24px;
//         color: #3a3530;
//         font-size: 14px;
//         font-weight: 300;
//         border: 1px solid #1a1a1a;
//         border-radius: 6px;
//     }
//
//     /* Toast */
//     .toast {
//         position: fixed;
//         bottom: 28px; right: 28px;
//         display: flex;
//         align-items: center;
//         gap: 10px;
//         background: #e8e2d9;
//         color: #0c0c0c;
//         font-size: 13px;
//         font-family: 'DM Sans', sans-serif;
//         padding: 12px 18px;
//         border-radius: 4px;
//         z-index: 100;
//         animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
//         box-shadow: 0 8px 32px rgba(0,0,0,0.4);
//     }
//     .toast-error { background: #3a1e1e; color: #e8c8c8; }
//
//     /* Animations */
//     @keyframes fadeUp {
//         from { opacity: 0; transform: translateY(12px); }
//         to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes slideUp {
//         from { opacity: 0; transform: translateY(8px); }
//         to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes spin { to { transform: rotate(360deg); } }
//     .animate-in { animation: fadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
//     .delay-1 { animation-delay: 0.08s; }
//     .delay-2 { animation-delay: 0.16s; }
//
//     .loading-dots { display: flex; gap: 6px; }
//     .loading-dots span {
//         width: 5px; height: 5px;
//         border-radius: 50%;
//         background: #3a3530;
//         animation: pulse 1.2s ease-in-out infinite;
//     }
//     .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
//     .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
//     @keyframes pulse {
//         0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
//         40% { opacity: 1; transform: scale(1); }
//     }
// `
//
//
// // 'use client'
// //
// // import { useState, useEffect } from 'react'
// // import Link from 'next/link'
// // import { createClient } from '@/utils/supabase/client'
// //
// // const EVENT_TYPES = ['Conference', 'Event', 'Trade Show', 'Webinar', 'Workshop']
// //
// // export default function AdminEventsPage() {
// //     const [items, setItems]         = useState([])
// //     const [loading, setLoading]     = useState(true)
// //     const [saving, setSaving]       = useState(false)
// //     const [editingId, setEditingId] = useState(null)
// //     const [toast, setToast]         = useState('')
// //     const [form, setForm]           = useState({
// //         title: '', type: 'Event', date: '', location: '', href: ''
// //     })
// //     const [editForm, setEditForm] = useState({})
// //
// //     useEffect(() => { fetchItems() }, [])
// //
// //     async function fetchItems() {
// //         setLoading(true)
// //         const supabase = createClient()
// //         const { data } = await supabase
// //             .from('events')
// //             .select('*')
// //             .order('position', { ascending: true })
// //         setItems(data || [])
// //         setLoading(false)
// //     }
// //
// //     function showToast(msg) {
// //         setToast(msg)
// //         setTimeout(() => setToast(''), 2500)
// //     }
// //
// //     async function addItem() {
// //         if (!form.title.trim() || !form.date.trim()) return showToast('Title and date required.')
// //         setSaving(true)
// //         const supabase = createClient()
// //         const position = items.length ? Math.max(...items.map(i => i.position)) + 1 : 0
// //         const { data, error } = await supabase
// //             .from('events')
// //             .insert([{ ...form, position, href: form.href || '#' }])
// //             .select().single()
// //         if (!error) {
// //             setItems(prev => [...prev, data])
// //             setForm({ title: '', type: 'Event', date: '', location: '', href: '' })
// //             showToast('Added ✓')
// //         } else showToast('Error: ' + error.message)
// //         setSaving(false)
// //     }
// //
// //     async function deleteItem(id) {
// //         const supabase = createClient()
// //         const { error } = await supabase.from('events').delete().eq('id', id)
// //         if (!error) { setItems(prev => prev.filter(i => i.id !== id)); showToast('Deleted') }
// //     }
// //
// //     function startEdit(item) {
// //         setEditingId(item.id)
// //         setEditForm({
// //             title: item.title, type: item.type,
// //             date: item.date, location: item.location || '',
// //             href: item.href || ''
// //         })
// //     }
// //
// //     async function saveEdit(id) {
// //         setSaving(true)
// //         const supabase = createClient()
// //         const { data, error } = await supabase
// //             .from('events')
// //             .update({ ...editForm, href: editForm.href || '#' })
// //             .eq('id', id).select().single()
// //         if (!error) {
// //             setItems(prev => prev.map(i => i.id === id ? data : i))
// //             setEditingId(null)
// //             showToast('Saved ✓')
// //         } else showToast('Error: ' + error.message)
// //         setSaving(false)
// //     }
// //
// //     async function moveItem(id, dir) {
// //         const idx = items.findIndex(i => i.id === id)
// //         const swapIdx = idx + dir
// //         if (swapIdx < 0 || swapIdx >= items.length) return
// //         const next = [...items]
// //         const posA = next[idx].position
// //         const posB = next[swapIdx].position
// //         ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
// //         next[idx].position = posA
// //         next[swapIdx].position = posB
// //         setItems(next)
// //         const supabase = createClient()
// //         await supabase.from('events').update({ position: posA }).eq('id', next[idx].id)
// //         await supabase.from('events').update({ position: posB }).eq('id', next[swapIdx].id)
// //     }
// //
// //     if (loading) return (
// //         <div className="flex items-center justify-center min-h-screen text-[14px] text-[#6b6b6b]">Loading…</div>
// //     )
// //
// //     return (
// //         <div className="max-w-3xl mx-auto px-6 py-10">
// //             <div className="flex items-center justify-between mb-8">
// //                 <h1 className="text-[24px]  text-[#1a1a1a]">Events Admin</h1>
// //                 <Link
// //                     href="/admin/news"
// //                     className="text-[12px] uppercase tracking-wide text-[#6b6b6b] border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors"
// //                 >
// //                     ← News Admin
// //                 </Link>
// //             </div>
// //
// //             {/* Add form */}
// //             <div className="bg-[#f7f7f7] border border-[#e5e5e5] rounded-lg p-6 mb-8">
// //                 <h2 className="text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a] mb-4">Add Event</h2>
// //                 <div className="mb-3">
// //                     <label className="block text-[11px] text-[#6b6b6b] mb-1">Title</label>
// //                     <input
// //                         type="text" placeholder="Event title…" value={form.title}
// //                         onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
// //                         className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                     />
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-3 mb-3">
// //                     <div>
// //                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Type</label>
// //                         <select
// //                             value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
// //                             className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                         >
// //                             {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
// //                         </select>
// //                     </div>
// //                     <div>
// //                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Date</label>
// //                         <input
// //                             type="text" placeholder="June 3–5, 2026" value={form.date}
// //                             onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
// //                             className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                         />
// //                     </div>
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-3 mb-4">
// //                     <div>
// //                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Location</label>
// //                         <input
// //                             type="text" placeholder="Chicago, IL" value={form.location}
// //                             onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
// //                             className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                         />
// //                     </div>
// //                     <div>
// //                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Link (optional)</label>
// //                         <input
// //                             type="text" placeholder="https://…" value={form.href}
// //                             onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
// //                             className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                         />
// //                     </div>
// //                 </div>
// //                 <button
// //                     onClick={addItem} disabled={saving}
// //                     className="bg-[#1a1a1a] text-white text-[12px] tracking-wide uppercase px-5 py-2.5 rounded hover:bg-[#333] transition-colors disabled:opacity-40"
// //                 >
// //                     + Add Event
// //                 </button>
// //             </div>
// //
// //             {/* List */}
// //             <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wide mb-2">
// //                 All Events ({items.length})
// //             </div>
// //
// //             {items.length === 0 && (
// //                 <p className="text-[13px] text-[#6b6b6b] py-8 text-center">No events yet.</p>
// //             )}
// //
// //             <ul>
// //                 {items.map((item, i) => (
// //                     <li key={item.id} className="border-b border-[#e5e5e5] last:border-b-0">
// //                         {editingId === item.id ? (
// //                             <div className="py-4">
// //                                 <div className="mb-3">
// //                                     <label className="block text-[11px] text-[#6b6b6b] mb-1">Title</label>
// //                                     <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
// //                                            className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded" />
// //                                 </div>
// //                                 <div className="grid grid-cols-2 gap-3 mb-3">
// //                                     <div>
// //                                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Type</label>
// //                                         <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
// //                                                 className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded">
// //                                             {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
// //                                         </select>
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Date</label>
// //                                         <input value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
// //                                                className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded" />
// //                                     </div>
// //                                 </div>
// //                                 <div className="grid grid-cols-2 gap-3 mb-3">
// //                                     <div>
// //                                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Location</label>
// //                                         <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
// //                                                className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded" />
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-[11px] text-[#6b6b6b] mb-1">Link</label>
// //                                         <input value={editForm.href} onChange={e => setEditForm(f => ({ ...f, href: e.target.value }))}
// //                                                className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded" />
// //                                     </div>
// //                                 </div>
// //                                 <div className="flex gap-2">
// //                                     <button onClick={() => saveEdit(item.id)} disabled={saving}
// //                                             className="bg-[#1a1a1a] text-white text-[11px] tracking-wide uppercase px-4 py-2 rounded hover:bg-[#333] transition-colors disabled:opacity-40">Save</button>
// //                                     <button onClick={() => setEditingId(null)}
// //                                             className="border border-[#e0e0e0] text-[11px] tracking-wide uppercase px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors">Cancel</button>
// //                                 </div>
// //                             </div>
// //                         ) : (
// //                             <div className="flex items-start gap-3 py-4">
// //                                 <div className="flex-1 min-w-0">
// //                                     <div className="flex items-center gap-2 mb-1">
// //                                         <span className="text-[10px] uppercase tracking-wide bg-[#f0f0f0] text-[#6b6b6b] px-2 py-0.5 rounded">{item.type}</span>
// //                                         <span className="text-[11px] text-[#6b6b6b]">{item.date}</span>
// //                                         {item.location && <span className="text-[11px] text-[#6b6b6b]">· {item.location}</span>}
// //                                     </div>
// //                                     <p className="text-[13px] text-[#1a1a1a] leading-snug ">{item.title}</p>
// //                                 </div>
// //                                 <div className="flex items-center gap-1 flex-shrink-0">
// //                                     <button onClick={() => moveItem(item.id, -1)} disabled={i === 0}
// //                                             className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-25 transition-colors text-[12px]">↑</button>
// //                                     <button onClick={() => moveItem(item.id, 1)} disabled={i === items.length - 1}
// //                                             className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-25 transition-colors text-[12px]">↓</button>
// //                                     <button onClick={() => startEdit(item)}
// //                                             className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors text-[12px]">✎</button>
// //                                     <button onClick={() => deleteItem(item.id)}
// //                                             className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-red-600 hover:bg-red-50 transition-colors text-[12px]">✕</button>
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </li>
// //                 ))}
// //             </ul>
// //
// //             {toast && (
// //                 <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded z-50">
// //                     {toast}
// //                 </div>
// //             )}
// //         </div>
// //     )
// // }