'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

function toSlug(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Field({ label, children }) {
    return (
        <div>
            <label style={{
                display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'rgba(240,236,228,0.32)', marginBottom: 6
            }}>
                {label}
            </label>
            {children}
        </div>
    )
}

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10, padding: '10px 13px', fontFamily: 'inherit', fontSize: 13, fontWeight: 300,
    color: '#f0ece4', outline: 'none', transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box',
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
                ...(focused ? { borderColor: 'rgba(196,140,40,0.5)', background: 'rgba(196,140,40,0.05)', boxShadow: '0 0 0 3px rgba(196,140,40,0.08)' } : {}),
                ...style,
            }}
        />
    )
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => { fetchCategories() }, [])

    async function fetchCategories() {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase
            .from('gallery_categories')
            .select('*, gallery_images(count)')
            .order('position', { ascending: true })
        setCategories(data || [])
        setLoading(false)
    }

    function showToast(msg, type = 'success') {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 2500)
    }

    async function addCategory() {
        if (!name.trim()) return showToast('Enter a category name.', 'error')
        setSaving(true)
        const supabase = createClient()
        const slug = toSlug(name)
        const position = categories.length ? Math.max(...categories.map(c => c.position)) + 1 : 0
        const { data, error } = await supabase
            .from('gallery_categories')
            .insert([{ name: name.trim(), slug, position }])
            .select().single()
        if (!error) {
            setCategories(prev => [...prev, data])
            setName('')
            showToast('Category added successfully')
        } else showToast('Error: ' + error.message, 'error')
        setSaving(false)
    }

    async function deleteCategory(id) {
        const supabase = createClient()
        const { error } = await supabase.from('gallery_categories').delete().eq('id', id)
        if (!error) {
            setCategories(prev => prev.filter(c => c.id !== id))
            showToast('Deleted — all images in this category were also removed.')
        }
    }

    async function moveCategory(id, dir) {
        const idx = categories.findIndex(c => c.id === id)
        const swapIdx = idx + dir
        if (swapIdx < 0 || swapIdx >= categories.length) return
        const next = [...categories]
        const posA = next[idx].position
        const posB = next[swapIdx].position
            ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
        next[idx].position = posA
        next[swapIdx].position = posB
        setCategories(next)
        const supabase = createClient()
        await supabase.from('gallery_categories').update({ position: posA }).eq('id', next[idx].id)
        await supabase.from('gallery_categories').update({ position: posB }).eq('id', next[swapIdx].id)
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

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                body { margin: 0; }
                ::placeholder { color: rgba(240,236,228,0.2) !important; }

                .cat-page {
                    min-height: 100vh;
                    background: #0b0b0b;
                    font-family: 'DM Sans', sans-serif;
                    color: #f0ece4;
                    padding: 0 0 6rem;
                    position: relative;
                }
                .cat-page::before {
                    content: '';
                    position: fixed; top: -200px; left: -200px;
                    width: 600px; height: 600px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(196,140,40,0.08) 0%, transparent 65%);
                    pointer-events: none; z-index: 0;
                }
                .inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; padding: 0 2rem; }

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
                .back-btn {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    color: rgba(240,236,228,0.35);
                    border: 1px solid rgba(255,255,255,0.1);
                    background: transparent;
                    padding: 7px 16px; border-radius: 8px; cursor: pointer;
                    text-decoration: none;
                    transition: color 0.2s, border-color 0.2s, background 0.2s;
                    display: inline-block;
                }
                .back-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

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
                    position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(196,140,40,0.4), transparent);
                }
                .section-label {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase;
                    color: #c48c28; margin-bottom: 1.25rem;
                    display: flex; align-items: center; gap: 8px;
                }
                .section-label::after {
                    content: ''; flex: 1; height: 1px; background: rgba(196,140,40,0.15);
                }
                .input-row { display: flex; gap: 10px; align-items: flex-end; }
                .slug-hint {
                    margin-top: 8px; font-size: 11px; font-weight: 300;
                    color: rgba(240,236,228,0.25); letter-spacing: 0.04em;
                }
                .slug-hint code {
                    font-family: 'DM Mono', 'Courier New', monospace;
                    color: rgba(196,140,40,0.6); font-size: 11px;
                }

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
                    white-space: nowrap; flex-shrink: 0;
                }
                .add-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 55%); pointer-events:none; }
                .add-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(196,140,40,0.35); }
                .add-btn:active:not(:disabled) { transform: translateY(0); }
                .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .list-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .list-count {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    color: rgba(240,236,228,0.3);
                }
                .cat-list { list-style: none; padding: 0; margin: 0; }
                .cat-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 16px 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    transition: background 0.15s;
                }
                .cat-item:last-child { border-bottom: none; }
                .cat-item:hover { background: rgba(255,255,255,0.015); border-radius: 12px; }
                .cat-body { flex: 1; min-width: 0; }
                .cat-name {
                    font-size: 14px; font-weight: 400; color: #f0ece4; margin: 0 0 3px;
                }
                .cat-slug {
                    font-size: 11px; font-weight: 300;
                    font-family: 'DM Mono', 'Courier New', monospace;
                    color: rgba(196,140,40,0.5);
                }

                .icon-btn {
                    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px; cursor: pointer; color: rgba(240,236,228,0.4);
                    font-size: 13px; transition: all 0.15s; flex-shrink: 0;
                }
                .icon-btn:hover { background: rgba(255,255,255,0.08); color: #f0ece4; border-color: rgba(255,255,255,0.14); }
                .icon-btn.del:hover { background: rgba(220,60,60,0.1); color: #f09090; border-color: rgba(220,60,60,0.25); }
                .icon-btn:disabled { opacity: 0.2; cursor: default; }
                .icon-btn-group { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

                .empty { text-align: center; padding: 4rem 0; color: rgba(240,236,228,0.2); font-size: 13px; font-weight: 300; }

                @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                .toast {
                    position: fixed; bottom: 28px; right: 28px; z-index: 999;
                    padding: 11px 18px; border-radius: 12px;
                    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
                    animation: slideUp 0.3s ease;
                    display: flex; align-items: center; gap: 8px;
                }
                .toast.success { background: #1a1a1a; border: 1px solid rgba(196,140,40,0.3); color: #f0ece4; }
                .toast.error   { background: #1a1a1a; border: 1px solid rgba(220,60,60,0.35); color: #f09090; }
                .toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
                .toast.success .toast-dot { background: #c48c28; }
                .toast.error   .toast-dot { background: #e05050; }

                .fade-in { animation: fadeIn 0.5s ease; }
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            <div className="cat-page">
                <div className="inner fade-in">

                    {/* ── Top bar ── */}
                    <div className="top-bar">
                        <div className="top-brand">
                            Gallery <span>Categories</span>
                        </div>
                        <Link href="/admin/gallery" className="back-btn">← Back to Gallery</Link>
                    </div>

                    {/* ── Add form ── */}
                    <div className="add-card">
                        <div className="section-label">Add Category</div>
                        <Field label="Category Name">
                            <div className="input-row">
                                <StyledInput
                                    type="text"
                                    placeholder="e.g. Architecture, Interiors, Landscapes…"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addCategory()}
                                    style={{ flex: 1 }}
                                />
                                <button className="add-btn" onClick={addCategory} disabled={saving}>
                                    + Add
                                </button>
                            </div>
                        </Field>
                        {name && (
                            <p className="slug-hint">
                                Slug: <code>/{toSlug(name)}</code>
                            </p>
                        )}
                    </div>

                    {/* ── List ── */}
                    <div className="list-header">
                        <div className="list-count">
                            {categories.length} Categor{categories.length !== 1 ? 'ies' : 'y'}
                        </div>
                    </div>

                    {categories.length === 0 && (
                        <div className="empty">No categories yet. Add one above.</div>
                    )}

                    <ul className="cat-list">
                        {categories.map((cat, i) => (
                            <li key={cat.id} className="cat-item">
                                <div className="cat-body">
                                    <p className="cat-name">{cat.name}</p>
                                    <p className="cat-slug">/{cat.slug}</p>
                                </div>
                                <div className="icon-btn-group">
                                    <button className="icon-btn" onClick={() => moveCategory(cat.id, -1)} disabled={i === 0} title="Move up">↑</button>
                                    <button className="icon-btn" onClick={() => moveCategory(cat.id, 1)} disabled={i === categories.length - 1} title="Move down">↓</button>
                                    <button
                                        className="icon-btn del"
                                        title="Delete"
                                        onClick={() => {
                                            if (confirm(`Delete "${cat.name}"? All images in this category will also be deleted.`)) {
                                                deleteCategory(cat.id)
                                            }
                                        }}
                                    >✕</button>
                                </div>
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
// import Link from 'next/link'
// import { createClient } from '@/utils/supabase/client'
//
// function toSlug(str) {
//     return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// }
//
// export default function AdminCategoriesPage() {
//     const [categories, setCategories] = useState([])
//     const [loading, setLoading]       = useState(true)
//     const [name, setName]             = useState('')
//     const [saving, setSaving]         = useState(false)
//     const [toast, setToast]           = useState('')
//
//     useEffect(() => { fetchCategories() }, [])
//
//     async function fetchCategories() {
//         setLoading(true)
//         const supabase = createClient()
//         const { data } = await supabase
//             .from('gallery_categories')
//             .select('*, gallery_images(count)')
//             .order('position', { ascending: true })
//         setCategories(data || [])
//         setLoading(false)
//     }
//
//     function showToast(msg) {
//         setToast(msg)
//         setTimeout(() => setToast(''), 2500)
//     }
//
//     async function addCategory() {
//         if (!name.trim()) return showToast('Enter a category name.')
//         setSaving(true)
//         const supabase = createClient()
//         const slug = toSlug(name)
//         const position = categories.length ? Math.max(...categories.map(c => c.position)) + 1 : 0
//         const { data, error } = await supabase
//             .from('gallery_categories')
//             .insert([{ name: name.trim(), slug, position }])
//             .select().single()
//         if (!error) {
//             setCategories(prev => [...prev, data])
//             setName('')
//             showToast('Category added ✓')
//         } else showToast('Error: ' + error.message)
//         setSaving(false)
//     }
//
//     async function deleteCategory(id) {
//         const supabase = createClient()
//         const { error } = await supabase.from('gallery_categories').delete().eq('id', id)
//         if (!error) {
//             setCategories(prev => prev.filter(c => c.id !== id))
//             showToast('Deleted — all images in this category were also deleted.')
//         }
//     }
//
//     async function moveCategory(id, dir) {
//         const idx = categories.findIndex(c => c.id === id)
//         const swapIdx = idx + dir
//         if (swapIdx < 0 || swapIdx >= categories.length) return
//         const next = [...categories]
//         const posA = next[idx].position
//         const posB = next[swapIdx].position
//         ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
//         next[idx].position = posA
//         next[swapIdx].position = posB
//         setCategories(next)
//         const supabase = createClient()
//         await supabase.from('gallery_categories').update({ position: posA }).eq('id', next[idx].id)
//         await supabase.from('gallery_categories').update({ position: posB }).eq('id', next[swapIdx].id)
//     }
//
//     if (loading) return (
//         <div className="flex items-center justify-center min-h-screen text-[14px] text-[#6b6b6b]">Loading…</div>
//     )
//
//     return (
//         <div className="max-w-2xl mx-auto px-6 py-10">
//             <div className="flex items-center justify-between mb-8">
//                 <h1 className="text-[24px]  text-[#1a1a1a]">Manage Categories</h1>
//                 <Link
//                     href="/admin/gallery"
//                     className="text-[12px] uppercase tracking-wide text-[#6b6b6b] border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors"
//                 >
//                     ← Back to Gallery
//                 </Link>
//             </div>
//
//             {/* Add category */}
//             <div className="bg-[#f7f7f7] border border-[#e5e5e5] rounded-lg p-6 mb-8">
//                 <h2 className="text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a] mb-4">Add Category</h2>
//                 <div className="flex gap-3">
//                     <input
//                         type="text" placeholder="e.g. Architecture, Interiors, Landscapes…"
//                         value={name} onChange={e => setName(e.target.value)}
//                         onKeyDown={e => e.key === 'Enter' && addCategory()}
//                         className="flex-1 border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
//                     />
//                     <button
//                         onClick={addCategory} disabled={saving}
//                         className="bg-[#1a1a1a] text-white text-[12px] tracking-wide uppercase px-5 py-2 rounded hover:bg-[#333] transition-colors disabled:opacity-40 whitespace-nowrap"
//                     >
//                         + Add
//                     </button>
//                 </div>
//                 {name && (
//                     <p className="mt-2 text-[11px] text-[#6b6b6b]">
//                         Slug: <span className="font-mono">{toSlug(name)}</span>
//                     </p>
//                 )}
//             </div>
//
//             {/* Category list */}
//             <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wide mb-3">
//                 {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
//             </div>
//
//             {categories.length === 0 && (
//                 <p className="text-[13px] text-[#6b6b6b] text-center py-10">No categories yet.</p>
//             )}
//
//             <ul>
//                 {categories.map((cat, i) => (
//                     <li key={cat.id} className="flex items-center gap-3 py-4 border-b border-[#e5e5e5] last:border-b-0">
//                         <div className="flex-1 min-w-0">
//                             <p className="text-[14px] text-[#1a1a1a] font-medium">{cat.name}</p>
//                             <p className="text-[11px] text-[#6b6b6b] font-mono mt-0.5">/{cat.slug}</p>
//                         </div>
//                         <div className="flex items-center gap-1 flex-shrink-0">
//                             <button onClick={() => moveCategory(cat.id, -1)} disabled={i === 0}
//                                     className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-25 transition-colors text-[12px]">↑</button>
//                             <button onClick={() => moveCategory(cat.id, 1)} disabled={i === categories.length - 1}
//                                     className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-25 transition-colors text-[12px]">↓</button>
//                             <button
//                                 onClick={() => {
//                                     if (confirm(`Delete "${cat.name}"? All images in this category will also be deleted.`)) {
//                                         deleteCategory(cat.id)
//                                     }
//                                 }}
//                                 className="p-1.5 border border-[#e5e5e5] rounded text-[#6b6b6b] hover:text-red-600 hover:bg-red-50 transition-colors text-[12px]"
//                             >✕</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//
//             {toast && (
//                 <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded z-50">
//                     {toast}
//                 </div>
//             )}
//         </div>
//     )
// }
