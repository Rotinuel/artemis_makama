'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { CATEGORIES } from '@/lib/industry-news/sources'

const TABS = [
    { key: 'pending', label: 'Awaiting review' },
    { key: 'published', label: 'Published' },
    { key: 'rejected', label: 'Rejected' },
]

function fmtDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminIndustryNewsPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('pending')
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [busyId, setBusyId] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('industry_news')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(300)
        if (error) showToast('Could not load: ' + error.message, 'error')
        setItems(data || [])
        setLoading(false)
    }

    function showToast(msg, type = 'success', ms = 3200) {
        setToast({ msg, type })
        setTimeout(() => setToast(null), ms)
    }

    const counts = useMemo(() => {
        const c = { pending: 0, published: 0, rejected: 0 }
        items.forEach(i => { c[i.status] = (c[i.status] || 0) + 1 })
        return c
    }, [items])

    const visible = items.filter(i => i.status === tab)

    async function setStatus(ids, status) {
        const list = Array.isArray(ids) ? ids : [ids]
        setBusyId(list.length === 1 ? list[0] : 'bulk')
        const supabase = createClient()
        const reviewed_at = new Date().toISOString()
        const { error } = await supabase
            .from('industry_news')
            .update({ status, reviewed_at })
            .in('id', list)
        setBusyId(null)
        if (error) return showToast('Error: ' + error.message, 'error')
        setItems(prev => prev.map(i => list.includes(i.id) ? { ...i, status, reviewed_at } : i))
        const n = list.length
        const word = n === 1 ? 'Story' : `${n} stories`
        showToast(
            status === 'published' ? `${word} published to News + Events`
                : status === 'rejected' ? `${word} rejected`
                    : `${word} moved back to review`
        )
    }

    async function remove(id) {
        if (!confirm('Delete this story permanently? (Rejecting keeps it out of future suggestions.)')) return
        setBusyId(id)
        const supabase = createClient()
        const { error } = await supabase.from('industry_news').delete().eq('id', id)
        setBusyId(null)
        if (error) return showToast('Error: ' + error.message, 'error')
        setItems(prev => prev.filter(i => i.id !== id))
        showToast('Story deleted')
    }

    function startEdit(item) {
        setEditingId(item.id)
        setEditForm({ headline: item.headline, summary: item.summary || '', category: item.category || CATEGORIES[0] })
    }

    async function saveEdit(id) {
        if (!editForm.headline?.trim()) return showToast('Headline is required.', 'error')
        setBusyId(id)
        const supabase = createClient()
        const patch = {
            headline: editForm.headline.trim(),
            summary: editForm.summary.trim(),
            category: editForm.category,
        }
        const { error } = await supabase.from('industry_news').update(patch).eq('id', id)
        setBusyId(null)
        if (error) return showToast('Error: ' + error.message, 'error')
        setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
        setEditingId(null)
        showToast('Changes saved')
    }

    async function fetchNow() {
        setFetching(true)
        try {
            const res = await fetch('/api/cron/industry-news', { method: 'POST' })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.ok) throw new Error(data.error || `Request failed (${res.status})`)
            await load()
            setTab('pending')
            const failed = (data.sources || []).filter(s => !s.ok).map(s => s.name)
            showToast(
                (data.inserted
                    ? `${data.inserted} new stor${data.inserted === 1 ? 'y' : 'ies'} added for review`
                    : 'No new stories worth adding right now') +
                (failed.length ? ` · couldn't reach ${failed.join(', ')}` : ''),
                'success', 5000
            )
        } catch (err) {
            showToast(err.message, 'error', 6000)
        }
        setFetching(false)
    }

    const lastRun = items.reduce((max, i) => (i.created_at > max ? i.created_at : max), '')

    if (loading) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
            background: '#0b0b0b', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            color: 'rgba(240,236,228,0.3)', letterSpacing: '0.06em'
        }}>
            Loading…
        </div>
    )

    return (
        <>
            <style>{styles}</style>
            <div className="iw-page">
                <div className="inner fade-in">

                    {/* ── Top bar ── */}
                    <div className="top-bar">
                        <div className="top-brand">Industry <span>Watch</span></div>
                        <div className="nav-btns">
                            <button className="nav-btn primary" onClick={fetchNow} disabled={fetching}>
                                {fetching ? 'Fetching… (up to a minute)' : '↻ Fetch now'}
                            </button>
                            <Link href="/admin" className="nav-btn">← Dashboard</Link>
                        </div>
                    </div>

                    <p className="intro">
                        Every morning Claude reads the latest architecture, construction and engineering news
                        and suggests a few stories here. Nothing appears on the website until you approve it.
                        {lastRun && <> Last suggestions: <strong>{fmtDate(lastRun)}</strong>.</>}
                    </p>

                    {/* ── Tabs ── */}
                    <div className="tabs-row">
                        <div className="tabs">
                            {TABS.map(t => (
                                <button
                                    key={t.key}
                                    className={`tab${tab === t.key ? ' active' : ''}`}
                                    onClick={() => { setTab(t.key); setEditingId(null) }}
                                >
                                    {t.label}
                                    <span className="tab-count">{counts[t.key] || 0}</span>
                                </button>
                            ))}
                        </div>
                        {tab === 'pending' && visible.length > 1 && (
                            <button
                                className="btn approve"
                                disabled={busyId === 'bulk'}
                                onClick={() => {
                                    if (confirm(`Publish all ${visible.length} stories?`)) setStatus(visible.map(i => i.id), 'published')
                                }}
                            >
                                Approve all
                            </button>
                        )}
                    </div>

                    {/* ── List ── */}
                    {visible.length === 0 ? (
                        <div className="empty">
                            {tab === 'pending'
                                ? 'Nothing waiting for review. New suggestions arrive each morning — or press “Fetch now”.'
                                : tab === 'published' ? 'No published stories yet.' : 'No rejected stories.'}
                        </div>
                    ) : (
                        <ul className="list">
                            {visible.map(item => {
                                const editing = editingId === item.id
                                const busy = busyId === item.id || busyId === 'bulk'
                                return (
                                    <li key={item.id} className={`card${busy ? ' busy' : ''}`}>
                                        <div className="meta">
                                            <span className="chip">{item.category || 'Uncategorised'}</span>
                                            <span>{item.source}</span>
                                            <span className="dot">·</span>
                                            <span>{fmtDate(item.published_at)}</span>
                                        </div>

                                        {editing ? (
                                            <div className="edit">
                                                <label>Headline</label>
                                                <input
                                                    value={editForm.headline}
                                                    maxLength={140}
                                                    onChange={e => setEditForm(f => ({ ...f, headline: e.target.value }))}
                                                />
                                                <label>Summary</label>
                                                <textarea
                                                    rows={3}
                                                    value={editForm.summary}
                                                    maxLength={400}
                                                    onChange={e => setEditForm(f => ({ ...f, summary: e.target.value }))}
                                                />
                                                <label>Category</label>
                                                <select
                                                    value={editForm.category}
                                                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                                                >
                                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="headline">{item.headline}</h3>
                                                {item.summary && <p className="summary">{item.summary}</p>}
                                            </>
                                        )}

                                        <a className="original" href={item.url} target="_blank" rel="noopener noreferrer">
                                            Original: {item.original_title || item.url} ↗
                                        </a>

                                        <div className="actions">
                                            {editing ? (
                                                <>
                                                    <button className="btn approve" disabled={busy} onClick={() => saveEdit(item.id)}>Save</button>
                                                    <button className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    {item.status === 'pending' && (
                                                        <>
                                                            <button className="btn approve" disabled={busy} onClick={() => setStatus(item.id, 'published')}>Approve</button>
                                                            <button className="btn" onClick={() => startEdit(item)}>Edit</button>
                                                            <button className="btn reject" disabled={busy} onClick={() => setStatus(item.id, 'rejected')}>Reject</button>
                                                        </>
                                                    )}
                                                    {item.status === 'published' && (
                                                        <>
                                                            <button className="btn" onClick={() => startEdit(item)}>Edit</button>
                                                            <button className="btn" disabled={busy} onClick={() => setStatus(item.id, 'pending')}>Unpublish</button>
                                                        </>
                                                    )}
                                                    {item.status === 'rejected' && (
                                                        <>
                                                            <button className="btn" disabled={busy} onClick={() => setStatus(item.id, 'pending')}>Restore</button>
                                                            <button className="btn reject" disabled={busy} onClick={() => remove(item.id)}>Delete</button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {toast && (
                <div className={`toast ${toast.type}`}>
                    <span className="toast-dot" />
                    {toast.msg}
                </div>
            )}
        </>
    )
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
select option { background: #1a1a1a; color: #f0ece4; }

.iw-page {
    min-height: 100vh; background: #0b0b0b;
    font-family: 'DM Sans', sans-serif; color: #f0ece4;
    padding: 0 0 6rem; position: relative;
}
.iw-page::before {
    content: ''; position: fixed; top: -200px; right: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(8,183,150,0.14) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
}
.inner { position: relative; z-index: 1; max-width: 880px; margin: 0 auto; padding: 0 2rem; }

.top-bar {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 1.5rem 0; margin-bottom: 2rem;
    display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.top-brand { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; letter-spacing: 0.02em; }
.top-brand span { color: #08b796; font-style: italic; }
.nav-btns { display: flex; align-items: center; gap: 8px; }
.nav-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(240,236,228,0.45); border: 1px solid rgba(255,255,255,0.1);
    background: transparent; padding: 8px 16px; border-radius: 8px; cursor: pointer;
    text-decoration: none; display: inline-block;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.nav-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
.nav-btn.primary { color: #08b796; border-color: rgba(8,183,150,0.35); }
.nav-btn.primary:hover { background: rgba(8,183,150,0.08); border-color: rgba(8,183,150,0.6); }
.nav-btn:disabled { opacity: 0.6; cursor: progress; }

.intro { font-size: 13px; font-weight: 300; line-height: 1.7; color: rgba(240,236,228,0.5); margin: 0 0 2rem; max-width: 640px; }
.intro strong { color: rgba(240,236,228,0.8); font-weight: 400; }

.tabs-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 1.5rem; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.09); background: transparent; color: rgba(240,236,228,0.45);
    display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
}
.tab:hover { color: #f0ece4; border-color: rgba(255,255,255,0.18); }
.tab.active { background: rgba(8,183,150,0.12); border-color: rgba(8,183,150,0.45); color: #08b796; }
.tab-count { font-size: 10px; padding: 1px 7px; border-radius: 20px; background: rgba(255,255,255,0.06); letter-spacing: 0.04em; }

.empty {
    text-align: center; padding: 4rem 2rem;
    border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;
    font-size: 13px; font-weight: 300; color: rgba(240,236,228,0.35);
}

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 1.25rem 1.4rem; transition: opacity 0.2s, border-color 0.2s;
}
.card:hover { border-color: rgba(255,255,255,0.13); }
.card.busy { opacity: 0.5; pointer-events: none; }
.meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: rgba(240,236,228,0.4); margin-bottom: 10px; }
.meta .dot { opacity: 0.4; }
.chip {
    font-size: 9px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 5px; background: rgba(8,183,150,0.12); color: #08b796;
}
.headline { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; line-height: 1.25; margin: 0 0 6px; color: #f0ece4; }
.summary { font-size: 13px; font-weight: 300; line-height: 1.65; color: rgba(240,236,228,0.62); margin: 0 0 10px; }
.original {
    display: inline-block; font-size: 11px; color: rgba(240,236,228,0.35); text-decoration: none;
    max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 14px;
}
.original:hover { color: #08b796; }

.edit { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.edit label { font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(240,236,228,0.35); margin-top: 6px; }
.edit input, .edit textarea, .edit select {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 12px; font-family: inherit; font-size: 13px; font-weight: 300;
    color: #f0ece4; outline: none; resize: vertical;
}
.edit input:focus, .edit textarea:focus, .edit select:focus { border-color: rgba(8,183,150,0.5); }

.actions { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.12); background: transparent; color: rgba(240,236,228,0.7);
    transition: all 0.15s;
}
.btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }
.btn.approve { background: #08b796; border-color: #08b796; color: #04120f; }
.btn.approve:hover { background: #0ccfa9; border-color: #0ccfa9; color: #04120f; }
.btn.reject:hover { background: rgba(180,40,40,0.35); border-color: rgba(220,60,60,0.5); color: #ffcccc; }
.btn:disabled { opacity: 0.4; cursor: default; }

@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 999; max-width: min(460px, calc(100vw - 56px));
    padding: 11px 18px; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    animation: slideUp 0.3s ease; display: flex; align-items: center; gap: 8px;
}
.toast.success { background: #1a1a1a; border: 1px solid rgba(8,183,150,0.35); color: #f0ece4; }
.toast.error { background: #1a1a1a; border: 1px solid rgba(220,60,60,0.35); color: #f09090; }
.toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.toast.success .toast-dot { background: #08b796; }
.toast.error .toast-dot { background: #e05050; }

.fade-in { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 600px) { .inner { padding: 0 1rem; } }
`
