'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const TYPES = ['Firm News', 'Project News', 'Media Coverage', 'Award', 'Event']

const TYPE_COLORS = {
  'Firm News':     { bg: 'rgba(196,140,40,0.12)',  text: '#c48c28' },
  'Project News':  { bg: 'rgba(80,140,200,0.12)',  text: '#5b9fd4' },
  'Media Coverage':{ bg: 'rgba(120,180,120,0.12)', text: '#6db86d' },
  'Award':         { bg: 'rgba(200,100,180,0.12)', text: '#d070c0' },
  'Event':         { bg: 'rgba(200,120,80,0.12)',  text: '#d47850' },
}

/* ─── tiny date-picker helpers ─── */
const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function formatDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${MONTHS[m-1]} ${d}, ${y}`
}

function DatePicker({ value, onChange }) {
  const [open, setOpen]     = useState(false)
  const [view, setView]     = useState(() => {
    if (value) { const [y,m] = value.split('-').map(Number); return { year:y, month:m-1 } }
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() }
  })
  const ref = useRef(null)

  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
  function firstDay(y, m)    { return new Date(y, m, 1).getDay() }

  function pickDay(d) {
    const m = String(view.month + 1).padStart(2,'0')
    const dd = String(d).padStart(2,'0')
    onChange(`${view.year}-${m}-${dd}`)
    setOpen(false)
  }

  function prevMonth() {
    setView(v => v.month === 0 ? { year: v.year-1, month: 11 } : { ...v, month: v.month-1 })
  }
  function nextMonth() {
    setView(v => v.month === 11 ? { year: v.year+1, month: 0 } : { ...v, month: v.month+1 })
  }

  const total = daysInMonth(view.year, view.month)
  const first = firstDay(view.year, view.month)
  const cells = [...Array(first).fill(null), ...Array.from({length: total}, (_,i) => i+1)]

  const [selY, selM, selD] = value ? value.split('-').map(Number) : []

  return (
      <div ref={ref} style={{ position:'relative' }}>
        <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{
              width:'100%', display:'flex', alignItems:'center', gap:8,
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
              borderRadius:10, padding:'10px 13px', cursor:'pointer',
              fontFamily:'inherit', fontSize:13, fontWeight:300,
              color: value ? '#f0ece4' : 'rgba(240,236,228,0.25)',
              transition:'border-color 0.2s, background 0.2s',
              textAlign:'left',
            }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,opacity:0.45}}>
            <rect x="1" y="3" width="14" height="12" rx="2" stroke="#f0ece4" strokeWidth="1.3"/>
            <path d="M1 7h14" stroke="#f0ece4" strokeWidth="1.3"/>
            <path d="M5 1v3M11 1v3" stroke="#f0ece4" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {value ? formatDisplay(value) : 'Pick a date'}
        </button>

        {open && (
            <div style={{
              position:'absolute', top:'calc(100% + 8px)', left:0, zIndex:100,
              background:'#111', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:14, padding:'14px 14px 10px',
              boxShadow:'0 20px 60px rgba(0,0,0,0.7)',
              width:240,
            }}>
              {/* Month nav */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <button onClick={prevMonth} style={navBtn}>‹</button>
                <span style={{ fontSize:12, fontWeight:500, letterSpacing:'0.06em', color:'#f0ece4' }}>
              {MONTHS[view.month]} {view.year}
            </span>
                <button onClick={nextMonth} style={navBtn}>›</button>
              </div>
              {/* Day headers */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
                {DAYS.map(d => (
                    <div key={d} style={{ textAlign:'center', fontSize:9, letterSpacing:'0.08em', color:'rgba(240,236,228,0.3)', padding:'2px 0' }}>
                      {d}
                    </div>
                ))}
              </div>
              {/* Cells */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
                {cells.map((d, i) => {
                  const isSelected = d && selY === view.year && selM === view.month+1 && selD === d
                  return (
                      <button
                          key={i}
                          onClick={() => d && pickDay(d)}
                          disabled={!d}
                          style={{
                            width:'100%', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:11, borderRadius:6, border:'none', cursor: d ? 'pointer' : 'default',
                            background: isSelected ? '#c48c28' : 'transparent',
                            color: isSelected ? '#080808' : d ? '#f0ece4' : 'transparent',
                            fontWeight: isSelected ? 500 : 300,
                            transition:'background 0.15s',
                          }}
                          onMouseEnter={e => { if (d && !isSelected) e.currentTarget.style.background = 'rgba(196,140,40,0.18)' }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                      >
                        {d || ''}
                      </button>
                  )
                })}
              </div>
            </div>
        )}
      </div>
  )
}

const navBtn = {
  background:'none', border:'none', cursor:'pointer',
  color:'rgba(240,236,228,0.5)', fontSize:18, lineHeight:1,
  padding:'0 4px', transition:'color 0.15s',
}

/* ─── Field components ─── */
function Field({ label, children }) {
  return (
      <div>
        <label style={{ display:'block', fontSize:10, fontWeight:500, letterSpacing:'0.22em',
          textTransform:'uppercase', color:'rgba(240,236,228,0.32)', marginBottom:6 }}>
          {label}
        </label>
        {children}
      </div>
  )
}

const inputStyle = {
  width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
  borderRadius:10, padding:'10px 13px', fontFamily:'inherit', fontSize:13, fontWeight:300,
  color:'#f0ece4', outline:'none', transition:'border-color 0.2s, background 0.2s',
  boxSizing:'border-box',
}

function StyledInput({ style, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
      <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e) }}
          onBlur={e => { setFocused(false); props.onBlur?.(e) }}
          style={{
            ...inputStyle,
            ...(focused ? { borderColor:'rgba(196,140,40,0.5)', background:'rgba(196,140,40,0.05)', boxShadow:'0 0 0 3px rgba(196,140,40,0.08)' } : {}),
            ...style,
          }}
      />
  )
}

function StyledTextarea({ style, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
      <textarea
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e) }}
          onBlur={e => { setFocused(false); props.onBlur?.(e) }}
          style={{
            ...inputStyle, resize:'none',
            ...(focused ? { borderColor:'rgba(196,140,40,0.5)', background:'rgba(196,140,40,0.05)', boxShadow:'0 0 0 3px rgba(196,140,40,0.08)' } : {}),
            ...style,
          }}
      />
  )
}

function StyledSelect({ style, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
      <select
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e) }}
          onBlur={e => { setFocused(false); props.onBlur?.(e) }}
          style={{
            ...inputStyle, appearance:'none', cursor:'pointer',
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(240,236,228,0.35)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center',
            paddingRight:32,
            ...(focused ? { borderColor:'rgba(196,140,40,0.5)', background:'rgba(196,140,40,0.05)' } : {}),
            ...style,
          }}
      />
  )
}

/* ─── TypeBadge ─── */
function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || { bg:'rgba(255,255,255,0.08)', text:'rgba(240,236,228,0.5)' }
  return (
      <span style={{
        fontSize:9, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase',
        background: c.bg, color: c.text,
        padding:'3px 8px', borderRadius:6,
        flexShrink:0,
      }}>
      {type}
    </span>
  )
}

/* ─── Main Page ─── */
export default function NewsAdminPage() {
  const router = useRouter()
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast]         = useState(null)
  const [form, setForm]           = useState({ date: '', type: 'Firm News', title: '', href: '' })
  const [editForm, setEditForm]   = useState({})
  const [mounted, setMounted]     = useState(false)

  useEffect(() => { setMounted(true); fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('news_items').select('*').order('position', { ascending: true })
    if (!error) setItems(data || [])
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  async function addItem() {
    if (!form.title.trim() || !form.date.trim()) return showToast('Date and title are required.', 'error')
    setSaving(true)
    const supabase = createClient()
    const position = items.length ? Math.max(...items.map(i => i.position)) + 1 : 0
    const displayDate = formatDisplay(form.date)
    const { data, error } = await supabase.from('news_items')
        .insert([{ ...form, date: displayDate, position, href: form.href || '#' }])
        .select().single()
    if (!error) {
      setItems(prev => [...prev, data].sort((a, b) => a.position - b.position))
      setForm({ date: '', type: 'Firm News', title: '', href: '' })
      showToast('Item added successfully')
    } else showToast('Error: ' + error.message, 'error')
    setSaving(false)
  }

  async function deleteItem(id) {
    const supabase = createClient()
    const { error } = await supabase.from('news_items').delete().eq('id', id)
    if (!error) { setItems(prev => prev.filter(i => i.id !== id)); showToast('Item deleted') }
  }

  function startEdit(item) {
    setEditingId(item.id)
    // Try to reverse-parse display date back to yyyy-mm-dd for the picker
    let rawDate = ''
    if (item.date) {
      const parsed = new Date(item.date)
      if (!isNaN(parsed)) {
        rawDate = parsed.toISOString().split('T')[0]
      }
    }
    setEditForm({ date: rawDate, type: item.type, title: item.title, href: item.href || '' })
  }

  async function saveEdit(id) {
    setSaving(true)
    const supabase = createClient()
    const displayDate = editForm.date ? formatDisplay(editForm.date) : ''
    const { data, error } = await supabase.from('news_items')
        .update({ ...editForm, date: displayDate || editForm.date, href: editForm.href || '#' })
        .eq('id', id).select().single()
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
    const posA = next[idx].position
    const posB = next[swapIdx].position
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    next[idx].position = posA
    next[swapIdx].position = posB
    setItems(next)
    const supabase = createClient()
    await supabase.from('news_items').update({ position: posA }).eq('id', next[idx].id)
    await supabase.from('news_items').update({ position: posB }).eq('id', next[swapIdx].id)
  }

  if (loading) return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh',
        background:'#0b0b0b', fontFamily:'DM Sans, sans-serif', fontSize:13,
        color:'rgba(240,236,228,0.3)', letterSpacing:'0.06em' }}>
        Loading…
      </div>
  )

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin:0; }
        ::placeholder { color: rgba(240,236,228,0.2) !important; }
        select option { background: #1a1a1a; color: #f0ece4; }
        .news-page {
          min-height: 100vh;
          background: #0b0b0b;
          font-family: 'DM Sans', sans-serif;
          color: #f0ece4;
          padding: 0 0 6rem;
          position: relative;
        }
        /* top ambient */
        .news-page::before {
          content: '';
          position: fixed; top:-200px; right:-200px;
          width:600px; height:600px; border-radius:50%;
          background: radial-gradient(circle, rgba(196,140,40,0.10) 0%, transparent 65%);
          pointer-events:none; z-index:0;
        }
        .inner { position:relative; z-index:1; max-width:760px; margin:0 auto; padding:0 2rem; }

        /* header bar */
        .top-bar {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 1.5rem 0;
          margin-bottom: 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .top-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 300; letter-spacing: 0.02em;
          color: #f0ece4;
        }
        .top-brand span { color: #c48c28; font-style: italic; }
        .logout-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(240,236,228,0.35);
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          padding: 7px 16px; border-radius: 8px; cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .logout-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

        /* add card */
        .add-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 1.75rem;
          margin-bottom: 2.5rem;
          position: relative; overflow: hidden;
        }
        .add-card::before {
          content: '';
          position: absolute; top:0; left:12%; right:12%; height:1px;
          background: linear-gradient(90deg, transparent, rgba(196,140,40,0.4), transparent);
        }
        .section-label {
          font-size: 10px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase;
          color: #c48c28; margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label::after {
          content: ''; flex:1; height:1px; background: rgba(196,140,40,0.15);
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .grid-1 { margin-bottom: 12px; }

        /* add button */
        .add-btn {
          background: linear-gradient(135deg, #c48c28, #9a650e);
          border: none; border-radius: 10px;
          padding: 11px 22px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          color: #080808;
          box-shadow: 0 4px 16px rgba(196,140,40,0.25);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative; overflow: hidden;
          margin-top: 4px;
        }
        .add-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 55%); pointer-events:none; }
        .add-btn:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); box-shadow:0 6px 24px rgba(196,140,40,0.35); }
        .add-btn:active:not(:disabled) { transform:translateY(0); }
        .add-btn:disabled { opacity:0.4; cursor:not-allowed; }

        /* list */
        .list-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem;
        }
        .list-count {
          font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(240,236,228,0.3);
        }
        .news-list { list-style: none; padding:0; margin:0; }
        .news-item {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.15s;
        }
        .news-item:last-child { border-bottom: none; }
        .news-item:hover { background: rgba(255,255,255,0.015); border-radius: 12px; }
        .item-row { display:flex; align-items:flex-start; gap:14px; padding: 16px 10px; }
        .item-body { flex:1; min-width:0; }
        .item-meta { display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap; }
        .item-date { font-size:11px; font-weight:300; color:rgba(240,236,228,0.35); }
        .item-title { font-size:13px; font-weight:300; line-height:1.55; color:#f0ece4; }
        .item-link { font-size:11px; color:rgba(196,140,40,0.55); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        /* icon buttons */
        .icon-btn {
          width:30px; height:30px; display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:8px; cursor:pointer; color:rgba(240,236,228,0.4);
          font-size:13px; transition:all 0.15s; flex-shrink:0;
        }
        .icon-btn:hover { background:rgba(255,255,255,0.08); color:#f0ece4; border-color:rgba(255,255,255,0.14); }
        .icon-btn.del:hover { background:rgba(220,60,60,0.1); color:#f09090; border-color:rgba(220,60,60,0.25); }
        .icon-btn:disabled { opacity:0.2; cursor:default; }
        .icon-btn-group { display:flex; align-items:center; gap:4px; flex-shrink:0; padding-top:2px; }

        /* inline edit panel */
        .edit-panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(196,140,40,0.18);
          border-radius: 14px; padding: 1.25rem; margin: 8px 0;
        }
        .edit-actions { display:flex; gap:8px; margin-top:12px; }
        .save-btn {
          background: linear-gradient(135deg, #c48c28, #9a650e);
          border:none; border-radius:8px;
          padding: 8px 18px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500;
          letter-spacing:0.12em; text-transform:uppercase; color:#080808;
          transition:opacity 0.2s; 
        }
        .save-btn:hover:not(:disabled) { opacity:0.9; }
        .save-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .cancel-btn {
          background:transparent; border:1px solid rgba(255,255,255,0.1);
          border-radius:8px; padding:8px 16px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:400;
          letter-spacing:0.1em; text-transform:uppercase;
          color:rgba(240,236,228,0.4); transition:all 0.15s;
        }
        .cancel-btn:hover { color:#f0ece4; border-color:rgba(255,255,255,0.2); }

        /* toast */
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .toast {
          position:fixed; bottom:28px; right:28px; z-index:999;
          padding:11px 18px; border-radius:12px;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400;
          animation: slideUp 0.3s ease;
          display:flex; align-items:center; gap:8px;
        }
        .toast.success { background:#1a1a1a; border:1px solid rgba(196,140,40,0.3); color:#f0ece4; }
        .toast.error   { background:#1a1a1a; border:1px solid rgba(220,60,60,0.35); color:#f09090; }
        .toast-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .toast.success .toast-dot { background:#c48c28; }
        .toast.error   .toast-dot { background:#e05050; }

        /* empty state */
        .empty { text-align:center; padding:4rem 0; color:rgba(240,236,228,0.2); font-size:13px; font-weight:300; }

        /* page load fade */
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

        <div className="news-page">
          <div className="inner fade-in">

            {/* ── Top bar ── */}
            <div className="top-bar">
              <div className="top-brand">
                News <span>Admin</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
            </div>

            {/* ── Add form ── */}
            <div className="add-card">
              <div className="section-label">Add News Item</div>

              <div className="grid-2">
                <Field label="Date">
                  <DatePicker value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
                </Field>
                <Field label="Type">
                  <StyledSelect value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </StyledSelect>
                </Field>
              </div>

              <div className="grid-1">
                <Field label="Headline">
                  <StyledTextarea
                      rows={2}
                      placeholder="Enter news headline…"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </Field>
              </div>

              <div className="grid-1">
                <Field label="Link (optional)">
                  <StyledInput
                      type="text"
                      placeholder="https://…"
                      value={form.href}
                      onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                  />
                </Field>
              </div>

              <button className="add-btn" onClick={addItem} disabled={saving}>
                + Add Item
              </button>
            </div>

            {/* ── List ── */}
            <div className="list-header">
              <div className="list-count">All Items — {items.length}</div>
            </div>

            {items.length === 0 && <div className="empty">No items yet. Add one above.</div>}

            <ul className="news-list">
              {items.map((item, i) => (
                  <li key={item.id} className="news-item">
                    {editingId === item.id ? (
                        <div style={{ padding:'12px 10px' }}>
                          <div className="edit-panel">
                            <div className="section-label" style={{ marginBottom:'1rem' }}>Editing</div>
                            <div className="grid-2">
                              <Field label="Date">
                                <DatePicker value={editForm.date} onChange={v => setEditForm(f => ({ ...f, date: v }))} />
                              </Field>
                              <Field label="Type">
                                <StyledSelect value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}>
                                  {TYPES.map(t => <option key={t}>{t}</option>)}
                                </StyledSelect>
                              </Field>
                            </div>
                            <div className="grid-1" style={{ marginTop:12 }}>
                              <Field label="Headline">
                                <StyledTextarea rows={2} value={editForm.title}
                                                onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                              </Field>
                            </div>
                            <div className="grid-1" style={{ marginTop:12 }}>
                              <Field label="Link">
                                <StyledInput type="text" value={editForm.href}
                                             onChange={e => setEditForm(f => ({ ...f, href: e.target.value }))} />
                              </Field>
                            </div>
                            <div className="edit-actions">
                              <button className="save-btn" onClick={() => saveEdit(item.id)} disabled={saving}>Save Changes</button>
                              <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                          </div>
                        </div>
                    ) : (
                        <div className="item-row">
                          <div className="item-body">
                            <div className="item-meta">
                              <TypeBadge type={item.type} />
                              <span className="item-date">{item.date}</span>
                            </div>
                            <p className="item-title">{item.title}</p>
                            {item.href && item.href !== '#' && (
                                <p className="item-link">{item.href}</p>
                            )}
                          </div>
                          <div className="icon-btn-group">
                            <button className="icon-btn" onClick={() => moveItem(item.id, -1)} disabled={i === 0} title="Move up">↑</button>
                            <button className="icon-btn" onClick={() => moveItem(item.id, 1)} disabled={i === items.length - 1} title="Move down">↓</button>
                            <button className="icon-btn" onClick={() => startEdit(item)} title="Edit">✎</button>
                            <button className="icon-btn del" onClick={() => deleteItem(item.id)} title="Delete">✕</button>
                          </div>
                        </div>
                    )}
                  </li>
              ))}
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

// 'use client'
//
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/utils/supabase/client'
//
// const TYPES = ['Firm News', 'Project News', 'Media Coverage', 'Award', 'Event']
//
// export default function NewsAdminPage() {
//   const router = useRouter()
//   const [items, setItems]         = useState([])
//   const [loading, setLoading]     = useState(true)
//   const [saving, setSaving]       = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [toast, setToast]         = useState('')
//   const [form, setForm]           = useState({ date: '', type: 'Firm News', title: '', href: '' })
//   const [editForm, setEditForm]   = useState({})
//
//   useEffect(() => { fetchItems() }, [])
//
//   async function fetchItems() {
//     setLoading(true)
//     const supabase = createClient()
//     const { data, error } = await supabase
//       .from('news_items')
//       .select('*')
//       .order('position', { ascending: true })
//     if (!error) setItems(data || [])
//     setLoading(false)
//   }
//
//   async function handleLogout() {
//     const supabase = createClient()
//     await supabase.auth.signOut()
//     router.push('/login')
//     router.refresh()
//   }
//
//   function showToast(msg) {
//     setToast(msg)
//     setTimeout(() => setToast(''), 2500)
//   }
//
//   async function addItem() {
//     if (!form.title.trim() || !form.date.trim()) return showToast('Date and title required.')
//     setSaving(true)
//     const supabase = createClient()
//     const position = items.length ? Math.max(...items.map(i => i.position)) + 1 : 0
//     const { data, error } = await supabase
//       .from('news_items')
//       .insert([{ ...form, position, href: form.href || '#' }])
//       .select().single()
//     if (!error) {
//       setItems(prev => [...prev, data].sort((a, b) => a.position - b.position))
//       setForm({ date: '', type: 'Firm News', title: '', href: '' })
//       showToast('Added ✓')
//     } else showToast('Error: ' + error.message)
//     setSaving(false)
//   }
//
//   async function deleteItem(id) {
//     const supabase = createClient()
//     const { error } = await supabase.from('news_items').delete().eq('id', id)
//     if (!error) { setItems(prev => prev.filter(i => i.id !== id)); showToast('Deleted') }
//   }
//
//   function startEdit(item) {
//     setEditingId(item.id)
//     setEditForm({ date: item.date, type: item.type, title: item.title, href: item.href || '' })
//   }
//
//   async function saveEdit(id) {
//     setSaving(true)
//     const supabase = createClient()
//     const { data, error } = await supabase
//       .from('news_items')
//       .update({ ...editForm, href: editForm.href || '#' })
//       .eq('id', id).select().single()
//     if (!error) {
//       setItems(prev => prev.map(i => i.id === id ? data : i))
//       setEditingId(null)
//       showToast('Saved ✓')
//     } else showToast('Error: ' + error.message)
//     setSaving(false)
//   }
//
//   async function moveItem(id, dir) {
//     const idx = items.findIndex(i => i.id === id)
//     const swapIdx = idx + dir
//     if (swapIdx < 0 || swapIdx >= items.length) return
//     const next = [...items]
//     const posA = next[idx].position
//     const posB = next[swapIdx].position
//     ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
//     next[idx].position = posA
//     next[swapIdx].position = posB
//     setItems(next)
//     const supabase = createClient()
//     await supabase.from('news_items').update({ position: posA }).eq('id', next[idx].id)
//     await supabase.from('news_items').update({ position: posB }).eq('id', next[swapIdx].id)
//   }
//
//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen text-[14px] text-[#6b6b6b]">Loading…</div>
//   )
//
//   return (
//     <div className="max-w-3xl mx-auto px-6 py-10">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-[24px] font-light text-[#1a1a1a]">News Admin</h1>
//         <button
//           onClick={handleLogout}
//           className="text-[12px] uppercase tracking-wide text-[#6b6b6b] border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors"
//         >
//           Log out
//         </button>
//       </div>
//
//       {/* Add form */}
//       <div className="bg-[#f7f7f7] border border-[#e5e5e5] rounded-lg p-6 mb-8">
//         <h2 className="text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a] mb-4">Add Item</h2>
//         <div className="grid grid-cols-2 gap-3 mb-3">
//           <div>
//             <label className="block text-[11px] text-[#6b6b6b] mb-1">Date</label>
//             <input
//               type="text" placeholder="May 15, 2026" value={form.date}
//               onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
//               className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-[11px] text-[#6b6b6b] mb-1">Type</label>
//             <select
//               value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
//               className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
//             >
//               {TYPES.map(t => <option key={t}>{t}</option>)}
//             </select>
//           </div>
//         </div>
//         <div className="mb-3">
//           <label className="block text-[11px] text-[#6b6b6b] mb-1">Title</label>
//           <textarea
//             placeholder="Enter news headline…" value={form.title} rows={2}
//             onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//             className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded resize-none"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-[11px] text-[#6b6b6b] mb-1">Link (optional)</label>
//           <input
//             type="text" placeholder="https://…" value={form.href}
//             onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
//             className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
//           />
//         </div>
//         <button
//           onClick={addItem} disabled={saving}
//           className="bg-[#1a1a1a] text-white text-[12px] tracking-wide uppercase px-5 py-2.5 rounded hover:bg-[#333] transition-colors disabled:opacity-40"
//         >
//           + Add Item
//         </button>
//       </div>
//
//       {/* List */}
//       <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wide mb-2">
//         All Items ({items.length})
//       </div>
//
//       {items.length === 0 && (
//         <p className="text-[13px] text-[#6b6b6b] py-8 text-center">No items yet.</p>
//       )}
//
//       <ul>
//         {items.map((item, i) => (
//           <li key={item.id} className="border-b border-[#e5e5e5] last:border-b-0">
//             {editingId === item.id ? (
//               <div className="py-4">
//                 <div className="grid grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <label className="block text-[11px] text-[#6b6b6b] mb-1">Date</label>
//                     <input value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
//                       className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded" />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] text-[#6b6b6b] mb-1">Type</label>
//                     <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
//                       className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded">
//                       {TYPES.map(t => <option key={t}>{t}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-[11px] text-[#6b6b6b] mb-1">Title</label>
//                   <textarea value={editForm.title} rows={2} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
//                     className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded resize-none" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-[11px] text-[#6b6b6b] mb-1">Link</label>
//                   <input value={editForm.href} onChange={e => setEditForm(f => ({ ...f, href: e.target.value }))}
//                     className="w-full border border-[#e0e0e0] px-3 py-1.5 text-[12px] outline-none focus:border-[#1a1a1a] rounded" />
//                 </div>
//                 <div className="flex gap-2">
//                   <button onClick={() => saveEdit(item.id)} disabled={saving}
//                     className="bg-[#1a1a1a] text-white text-[11px] tracking-wide uppercase px-4 py-2 rounded hover:bg-[#333] transition-colors disabled:opacity-40">
//                     Save
//                   </button>
//                   <button onClick={() => setEditingId(null)}
//                     className="border border-[#e0e0e0] text-[#1a1a1a] text-[11px] tracking-wide uppercase px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-start gap-3 py-4">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-[10px] uppercase tracking-wide bg-[#f0f0f0] text-[#6b6b6b] px-2 py-0.5 rounded">{item.type}</span>
//                     <span className="text-[11px] text-[#6b6b6b]">{item.date}</span>
//                   </div>
//                   <p className="text-[13px] text-[#1a1a1a] leading-snug font-light">{item.title}</p>
//                 </div>
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                   <button onClick={() => moveItem(item.id, -1)} disabled={i === 0}
//                     className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-25 transition-colors text-[12px]">↑</button>
//                   <button onClick={() => moveItem(item.id, 1)} disabled={i === items.length - 1}
//                     className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-25 transition-colors text-[12px]">↓</button>
//                   <button onClick={() => startEdit(item)}
//                     className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors text-[12px]">✎</button>
//                   <button onClick={() => deleteItem(item.id)}
//                     className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-red-600 hover:bg-red-50 transition-colors text-[12px]">✕</button>
//                 </div>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//
//       {toast && (
//         <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded z-50">
//           {toast}
//         </div>
//       )}
//     </div>
//   )
// }
