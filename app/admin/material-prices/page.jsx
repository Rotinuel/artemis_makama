'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { MATERIALS, CITIES, formatRange, midpoint } from '@/lib/material-prices/items'

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })

function fmtDay(ymd) {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function pct(from, to) {
    if (!from || !to) return null
    return ((midpoint(to) - midpoint(from)) / midpoint(from)) * 100
}

export default function AdminMaterialPricesPage() {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [city, setCity] = useState(CITIES[0])
    const [editing, setEditing] = useState(null) // item key
    const [form, setForm] = useState({ min: '', max: '', source_name: '', source_url: '' })
    const [busy, setBusy] = useState(null)
    const [checking, setChecking] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('material_prices')
            .select('*')
            .in('status', ['published', 'pending'])
            .order('effective_date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(2000)
        if (error) showToast('Could not load: ' + error.message, 'error')
        setRows(data || [])
        setLoading(false)
    }

    function showToast(msg, type = 'success', ms = 3500) {
        setToast({ msg, type })
        setTimeout(() => setToast(null), ms)
    }

    // current published + open suggestion per item for the selected city
    const table = useMemo(() => MATERIALS.map(m => {
        const mine = rows.filter(r => r.item_key === m.key && r.city === city)
        return {
            ...m,
            current: mine.find(r => r.status === 'published') || null,
            pending: mine.find(r => r.status === 'pending') || null,
        }
    }), [rows, city])

    const pendingCount = useMemo(() => {
        const c = {}
        CITIES.forEach(x => { c[x] = rows.filter(r => r.city === x && r.status === 'pending').length })
        return c
    }, [rows])

    async function approve(ids) {
        const list = Array.isArray(ids) ? ids : [ids]
        setBusy(list.length > 1 ? 'bulk' : list[0])
        const supabase = createClient()
        const patch = { status: 'published', reviewed_at: new Date().toISOString(), effective_date: today() }
        const { error } = await supabase.from('material_prices').update(patch).in('id', list)
        setBusy(null)
        if (error) return showToast('Error: ' + error.message, 'error')
        await load()
        showToast(list.length > 1 ? `${list.length} prices published` : 'Price published')
    }

    async function reject(id) {
        setBusy(id)
        const supabase = createClient()
        const { error } = await supabase.from('material_prices')
            .update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
        setBusy(null)
        if (error) return showToast('Error: ' + error.message, 'error')
        setRows(prev => prev.filter(r => r.id !== id))
        showToast('Suggestion rejected')
    }

    function startEdit(item) {
        const base = item.pending || item.current
        setEditing(item.key)
        setForm({
            min: base ? String(Math.round(base.price_min)) : '',
            max: base?.price_max != null ? String(Math.round(base.price_max)) : '',
            source_name: '',
            source_url: '',
        })
    }

    async function saveManual(item) {
        const min = Number(String(form.min).replace(/[^\d.]/g, ''))
        const max = form.max === '' ? min : Number(String(form.max).replace(/[^\d.]/g, ''))
        if (!(min > 0)) return showToast('Enter a valid price.', 'error')
        if (!(max >= min)) return showToast('Maximum must be at least the minimum.', 'error')
        setBusy(item.key)
        const supabase = createClient()
        const { error } = await supabase.from('material_prices').insert({
            item_key: item.key,
            city,
            price_min: min,
            price_max: max,
            source_name: form.source_name.trim() || 'Artemis Atelier',
            source_url: form.source_url.trim() || null,
            effective_date: today(),
            origin: 'manual',
            status: 'published',
            reviewed_at: new Date().toISOString(),
        })
        // A manual price replaces any open suggestion for the same item
        if (!error && item.pending) {
            await supabase.from('material_prices')
                .update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', item.pending.id)
        }
        setBusy(null)
        if (error) return showToast('Error: ' + error.message, 'error')
        setEditing(null)
        await load()
        showToast(`${item.name} (${city}) updated`)
    }

    async function checkNow() {
        setChecking(true)
        try {
            const res = await fetch('/api/cron/material-prices', { method: 'POST' })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.ok) throw new Error(data.error || `Request failed (${res.status})`)
            await load()
            const n = (data.suggested || 0) + (data.updatedPending || 0)
            showToast(
                n ? `${n} price change${n === 1 ? '' : 's'} to review (${data.unchanged || 0} unchanged)`
                    : data.found ? `No changes — ${data.found} prices checked, all the same`
                        : 'No reliable recent prices found this time',
                'success', 6000
            )
        } catch (err) {
            showToast(err.message, 'error', 8000)
        }
        setChecking(false)
    }

    if (loading) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
            background: '#0b0b0b', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            color: 'rgba(240,236,228,0.3)', letterSpacing: '0.06em'
        }}>
            Loading…
        </div>
    )

    const cityPending = table.filter(t => t.pending).map(t => t.pending.id)

    return (
        <>
            <style>{styles}</style>
            <div className="mp-page">
                <div className="inner fade-in">
                    <div className="top-bar">
                        <div className="top-brand">Material <span>Prices</span></div>
                        <div className="nav-btns">
                            <button className="nav-btn primary" onClick={checkNow} disabled={checking}>
                                {checking ? 'Researching… (1–3 min)' : '↻ Check prices now'}
                            </button>
                            <Link href="/admin" className="nav-btn">← Dashboard</Link>
                        </div>
                    </div>

                    <p className="intro">
                        Each morning Claude searches the web for current prices and suggests changes here, with the source it used.
                        Nothing changes on the website until you approve it. You can also set a price yourself with <strong>Edit</strong>.
                    </p>

                    <div className="tabs-row">
                        <div className="tabs">
                            {CITIES.map(c => (
                                <button key={c} className={`tab${city === c ? ' active' : ''}`} onClick={() => { setCity(c); setEditing(null) }}>
                                    {c}
                                    {pendingCount[c] > 0 && <span className="tab-count">{pendingCount[c]}</span>}
                                </button>
                            ))}
                        </div>
                        {cityPending.length > 1 && (
                            <button className="btn approve" disabled={busy === 'bulk'}
                                onClick={() => confirm(`Publish all ${cityPending.length} suggested ${city} prices?`) && approve(cityPending)}>
                                Approve all for {city}
                            </button>
                        )}
                    </div>

                    <ul className="list">
                        {table.map(item => {
                            const change = item.pending && item.current ? pct(item.current, item.pending) : null
                            const isBusy = busy === item.key || busy === item.pending?.id || busy === 'bulk'
                            return (
                                <li key={item.key} className={`card${isBusy ? ' busy' : ''}`}>
                                    <div className="card-head">
                                        <div>
                                            <h3 className="name">{item.name}</h3>
                                            <p className="spec">{item.spec}</p>
                                        </div>
                                        <div className="current">
                                            <span className="lbl">On website</span>
                                            <span className="val">
                                                {item.current ? formatRange(Number(item.current.price_min), item.current.price_max != null ? Number(item.current.price_max) : null) : '—'}
                                                <small>/{item.unit}</small>
                                            </span>
                                            {item.current && (
                                                <span className="sub">
                                                    {fmtDay(item.current.effective_date)} · {item.current.origin === 'ai' ? 'AI, approved' : 'Manual'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {item.pending && editing !== item.key && (
                                        <div className="suggestion">
                                            <div className="sugg-main">
                                                <span className="chip">Suggested</span>
                                                <span className="sugg-val">
                                                    {formatRange(Number(item.pending.price_min), Number(item.pending.price_max))}
                                                </span>
                                                {change != null && (
                                                    <span className={`delta ${change > 0 ? 'up' : 'down'}`}>
                                                        {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                                                    </span>
                                                )}
                                                {!item.current && <span className="delta new">First price</span>}
                                            </div>
                                            <p className="sugg-meta">
                                                {item.pending.source_url ? (
                                                    <a href={item.pending.source_url} target="_blank" rel="noopener noreferrer">
                                                        {item.pending.source_name || item.pending.source_url} ↗
                                                    </a>
                                                ) : (item.pending.source_name || 'No source')}
                                                {item.pending.source_date && <> · source dated {fmtDay(item.pending.source_date)}</>}
                                                {item.pending.note && <> · {item.pending.note}</>}
                                            </p>
                                        </div>
                                    )}

                                    {editing === item.key && (
                                        <div className="edit">
                                            <div className="edit-grid">
                                                <label>Min price (₦)<input inputMode="numeric" value={form.min} onChange={e => setForm(f => ({ ...f, min: e.target.value }))} /></label>
                                                <label>Max price (₦) <em>optional</em><input inputMode="numeric" value={form.max} onChange={e => setForm(f => ({ ...f, max: e.target.value }))} /></label>
                                                <label>Source name <em>optional</em><input value={form.source_name} placeholder="e.g. Supplier quote" onChange={e => setForm(f => ({ ...f, source_name: e.target.value }))} /></label>
                                                <label>Source link <em>optional</em><input value={form.source_url} placeholder="https://…" onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} /></label>
                                            </div>
                                        </div>
                                    )}

                                    <div className="actions">
                                        {editing === item.key ? (
                                            <>
                                                <button className="btn approve" disabled={isBusy} onClick={() => saveManual(item)}>Publish price</button>
                                                <button className="btn" onClick={() => setEditing(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                {item.pending && (
                                                    <>
                                                        <button className="btn approve" disabled={isBusy} onClick={() => approve(item.pending.id)}>Approve</button>
                                                        <button className="btn reject" disabled={isBusy} onClick={() => reject(item.pending.id)}>Reject</button>
                                                    </>
                                                )}
                                                <button className="btn" onClick={() => startEdit(item)}>{item.pending ? 'Edit & publish' : 'Edit'}</button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
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

.mp-page { min-height: 100vh; background: #0b0b0b; font-family: 'DM Sans', sans-serif; color: #f0ece4; padding: 0 0 6rem; position: relative; }
.mp-page::before {
    content: ''; position: fixed; top: -200px; right: -200px; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(8,183,150,0.14) 0%, transparent 65%); pointer-events: none; z-index: 0;
}
.inner { position: relative; z-index: 1; max-width: 880px; margin: 0 auto; padding: 0 2rem; }
.top-bar { border-bottom: 1px solid rgba(255,255,255,0.06); padding: 1.5rem 0; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.top-brand { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; letter-spacing: 0.02em; }
.top-brand span { color: #08b796; font-style: italic; }
.nav-btns { display: flex; align-items: center; gap: 8px; }
.nav-btn {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(240,236,228,0.45); border: 1px solid rgba(255,255,255,0.1); background: transparent; padding: 8px 16px;
    border-radius: 8px; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s;
}
.nav-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
.nav-btn.primary { color: #08b796; border-color: rgba(8,183,150,0.35); }
.nav-btn.primary:hover { background: rgba(8,183,150,0.08); border-color: rgba(8,183,150,0.6); }
.nav-btn:disabled { opacity: 0.6; cursor: progress; }
.intro { font-size: 13px; font-weight: 300; line-height: 1.7; color: rgba(240,236,228,0.5); margin: 0 0 2rem; max-width: 660px; }
.intro strong { color: rgba(240,236,228,0.85); font-weight: 400; }

.tabs-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 1.5rem; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(255,255,255,0.09); background: transparent;
    color: rgba(240,236,228,0.45); display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
}
.tab:hover { color: #f0ece4; border-color: rgba(255,255,255,0.18); }
.tab.active { background: rgba(8,183,150,0.12); border-color: rgba(8,183,150,0.45); color: #08b796; }
.tab-count { font-size: 10px; padding: 1px 7px; border-radius: 20px; background: #08b796; color: #04120f; letter-spacing: 0.04em; }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.2rem 1.4rem; transition: opacity 0.2s; }
.card.busy { opacity: 0.5; pointer-events: none; }
.card-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
.name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin: 0; }
.spec { font-size: 12px; font-weight: 300; color: rgba(240,236,228,0.4); margin: 2px 0 0; }
.current { text-align: right; display: flex; flex-direction: column; gap: 2px; }
.current .lbl { font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,236,228,0.35); }
.current .val { font-size: 17px; font-variant-numeric: tabular-nums; }
.current .val small { font-size: 11px; color: rgba(240,236,228,0.4); margin-left: 3px; }
.current .sub { font-size: 11px; color: rgba(240,236,228,0.35); }

.suggestion { margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: rgba(8,183,150,0.06); border: 1px solid rgba(8,183,150,0.2); }
.sugg-main { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.chip { font-size: 9px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; padding: 3px 8px; border-radius: 5px; background: rgba(8,183,150,0.15); color: #08b796; }
.sugg-val { font-size: 16px; font-variant-numeric: tabular-nums; }
.delta { font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
.delta.up { color: #f08080; }
.delta.down { color: #08b796; }
.delta.new { color: rgba(240,236,228,0.5); font-weight: 400; }
.sugg-meta { font-size: 11px; color: rgba(240,236,228,0.45); margin: 8px 0 0; line-height: 1.6; }
.sugg-meta a { color: rgba(240,236,228,0.7); }
.sugg-meta a:hover { color: #08b796; }

.edit { margin-top: 14px; }
.edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 600px) { .edit-grid { grid-template-columns: 1fr; } .inner { padding: 0 1rem; } }
.edit label { display: flex; flex-direction: column; gap: 6px; font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,236,228,0.4); }
.edit label em { font-style: normal; letter-spacing: 0.06em; text-transform: none; color: rgba(240,236,228,0.25); }
.edit input {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px;
    font-family: inherit; font-size: 13px; color: #f0ece4; outline: none; letter-spacing: normal; text-transform: none;
}
.edit input:focus { border-color: rgba(8,183,150,0.5); }

.actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.btn {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); background: transparent;
    color: rgba(240,236,228,0.7); transition: all 0.15s;
}
.btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }
.btn.approve { background: #08b796; border-color: #08b796; color: #04120f; }
.btn.approve:hover { background: #0ccfa9; border-color: #0ccfa9; }
.btn.reject:hover { background: rgba(180,40,40,0.35); border-color: rgba(220,60,60,0.5); color: #ffcccc; }
.btn:disabled { opacity: 0.4; cursor: default; }

@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.toast { position: fixed; bottom: 28px; right: 28px; z-index: 999; max-width: min(480px, calc(100vw - 56px)); padding: 11px 18px; border-radius: 12px; font-size: 13px; animation: slideUp 0.3s ease; display: flex; align-items: center; gap: 8px; }
.toast.success { background: #1a1a1a; border: 1px solid rgba(8,183,150,0.35); color: #f0ece4; }
.toast.error { background: #1a1a1a; border: 1px solid rgba(220,60,60,0.35); color: #f09090; }
.toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.toast.success .toast-dot { background: #08b796; }
.toast.error .toast-dot { background: #e05050; }
.fade-in { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
`
