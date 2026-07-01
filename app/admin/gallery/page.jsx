'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

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

export default function AdminGalleryPage() {
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([])
    const [selectedCat, setSelectedCat] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [toast, setToast] = useState(null)
    const [form, setForm] = useState({ title: '', description: '' })
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef(null)

    useEffect(() => { fetchAll() }, [])
    useEffect(() => { if (selectedCat) fetchImages(selectedCat) }, [selectedCat])

    async function fetchAll() {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase
            .from('gallery_categories')
            .select('*')
            .order('position', { ascending: true })
        const cats = data || []
        setCategories(cats)
        if (cats.length > 0) setSelectedCat(cats[0].id)
        setLoading(false)
    }

    async function fetchImages(catId) {
        const supabase = createClient()
        const { data } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('category_id', catId)
            .order('position', { ascending: true })
        setImages(data || [])
    }

    function showToast(msg, type = 'success') {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 2500)
    }

    async function uploadImages(files) {
        if (!selectedCat) return showToast('Select a category first.', 'error')
        setUploading(true)
        const supabase = createClient()
        const maxPos = images.length ? Math.max(...images.map(i => i.position)) + 1 : 0

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const ext = file.name.split('.').pop()
            const path = `${selectedCat}/${Date.now()}-${i}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(path, file, { upsert: false })

            if (uploadError) { showToast('Upload error: ' + uploadError.message, 'error'); continue }

            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)

            await supabase.from('gallery_images').insert([{
                title: form.title || file.name.replace(/\.[^.]+$/, ''),
                description: form.description,
                category_id: selectedCat,
                url: publicUrl,
                position: maxPos + i,
            }])
        }

        setForm({ title: '', description: '' })
        await fetchImages(selectedCat)
        showToast(`${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`)
        setUploading(false)
    }

    async function deleteImage(img) {
        const supabase = createClient()
        const path = img.url.split('/storage/v1/object/public/gallery/')[1]
        if (path) await supabase.storage.from('gallery').remove([path])
        await supabase.from('gallery_images').delete().eq('id', img.id)
        setImages(prev => prev.filter(i => i.id !== img.id))
        showToast('Image deleted')
    }

    async function moveImage(id, dir) {
        const idx = images.findIndex(i => i.id === id)
        const swapIdx = idx + dir
        if (swapIdx < 0 || swapIdx >= images.length) return
        const next = [...images]
        const posA = next[idx].position
        const posB = next[swapIdx].position
            ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
        next[idx].position = posA
        next[swapIdx].position = posB
        setImages(next)
        const supabase = createClient()
        await supabase.from('gallery_images').update({ position: posA }).eq('id', next[idx].id)
        await supabase.from('gallery_images').update({ position: posB }).eq('id', next[swapIdx].id)
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

    const activeCat = categories.find(c => c.id === selectedCat)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                body { margin: 0; }
                ::placeholder { color: rgba(240,236,228,0.2) !important; }

                .gal-page {
                    min-height: 100vh;
                    background: #0b0b0b;
                    font-family: 'DM Sans', sans-serif;
                    color: #f0ece4;
                    padding: 0 0 6rem;
                    position: relative;
                }
                .gal-page::before {
                    content: '';
                    position: fixed; top: -160px; right: -160px;
                    width: 600px; height: 600px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(196,140,40,0.09) 0%, transparent 65%);
                    pointer-events: none; z-index: 0;
                }
                .inner { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 0 2rem; }

                /* top bar */
                .top-bar {
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    padding: 1.5rem 0;
                    margin-bottom: 2.5rem;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .top-brand {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 22px; font-weight: 300; letter-spacing: 0.02em; color: #f0ece4;
                }
                .top-brand span { color: #c48c28; font-style: italic; }
                .nav-btns { display: flex; align-items: center; gap: 8px; }
                .nav-btn {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    color: rgba(240,236,228,0.35); border: 1px solid rgba(255,255,255,0.1);
                    background: transparent; padding: 7px 16px; border-radius: 8px; cursor: pointer;
                    text-decoration: none; display: inline-block;
                    transition: color 0.2s, border-color 0.2s, background 0.2s;
                }
                .nav-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
                .nav-btn.primary {
                    color: rgba(196,140,40,0.8); border-color: rgba(196,140,40,0.25);
                }
                .nav-btn.primary:hover { color: #c48c28; border-color: rgba(196,140,40,0.5); background: rgba(196,140,40,0.05); }

                /* empty state */
                .empty-state {
                    text-align: center; padding: 5rem 2rem;
                    border: 1px dashed rgba(255,255,255,0.1); border-radius: 18px;
                }
                .empty-state p { font-size: 13px; font-weight: 300; color: rgba(240,236,228,0.3); margin: 0 0 1.25rem; }

                /* category tabs */
                .cat-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 2.5rem; }
                .cat-tab {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
                    padding: 7px 16px; border-radius: 8px; cursor: pointer;
                    border: 1px solid rgba(255,255,255,0.09);
                    background: transparent; color: rgba(240,236,228,0.4);
                    transition: all 0.2s;
                }
                .cat-tab:hover { color: #f0ece4; border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.04); }
                .cat-tab.active {
                    background: linear-gradient(135deg, rgba(196,140,40,0.18), rgba(196,140,40,0.08));
                    border-color: rgba(196,140,40,0.4); color: #c48c28;
                }

                /* upload card */
                .upload-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 18px; padding: 1.75rem;
                    margin-bottom: 2.5rem;
                    position: relative; overflow: hidden;
                }
                .upload-card::before {
                    content: '';
                    position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(196,140,40,0.4), transparent);
                }
                .section-label {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase;
                    color: #c48c28; margin-bottom: 1.25rem;
                    display: flex; align-items: center; gap: 8px;
                }
                .section-label::after { content: ''; flex: 1; height: 1px; background: rgba(196,140,40,0.15); }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }

                /* drop zone */
                .drop-zone {
                    border: 1px dashed rgba(255,255,255,0.12);
                    border-radius: 14px; padding: 3rem 2rem;
                    text-align: center; cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    margin-top: 4px;
                }
                .drop-zone:hover, .drop-zone.over {
                    border-color: rgba(196,140,40,0.45);
                    background: rgba(196,140,40,0.04);
                }
                .drop-zone svg { opacity: 0.25; margin-bottom: 12px; }
                .drop-zone p { margin: 0; }
                .drop-primary { font-size: 13px; font-weight: 300; color: #f0ece4; margin-bottom: 6px !important; }
                .drop-secondary { font-size: 11px; font-weight: 300; color: rgba(240,236,228,0.3); }
                .drop-uploading { font-size: 13px; font-weight: 300; color: #c48c28; letter-spacing: 0.06em; }

                /* grid count */
                .grid-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .grid-count {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
                    color: rgba(240,236,228,0.3);
                }

                /* empty grid */
                .empty-grid {
                    text-align: center; padding: 3.5rem;
                    border: 1px dashed rgba(255,255,255,0.08); border-radius: 14px;
                    font-size: 13px; font-weight: 300; color: rgba(240,236,228,0.2);
                }

                /* image grid */
                .img-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                }
                .img-card { position: relative; }
                .img-thumb {
                    width: 100%; aspect-ratio: 1; overflow: hidden;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                }
                .img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
                .img-card:hover .img-thumb img { transform: scale(1.04); }
                .img-caption {
                    margin-top: 6px; font-size: 11px; font-weight: 300;
                    color: rgba(240,236,228,0.35);
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    padding: 0 2px;
                }

                /* image overlay actions */
                .img-actions {
                    position: absolute; top: 8px; right: 8px;
                    display: flex; gap: 4px;
                    opacity: 0; transition: opacity 0.2s;
                }
                .img-card:hover .img-actions { opacity: 1; }
                .img-btn {
                    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
                    background: rgba(8,8,8,0.75); backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 7px; cursor: pointer;
                    color: rgba(240,236,228,0.7); font-size: 12px;
                    transition: all 0.15s;
                }
                .img-btn:hover { background: rgba(8,8,8,0.9); color: #f0ece4; border-color: rgba(255,255,255,0.22); }
                .img-btn.del:hover { background: rgba(180,40,40,0.7); color: #ffcccc; border-color: rgba(220,60,60,0.4); }
                .img-btn:disabled { opacity: 0.2; cursor: default; }

                /* toast */
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

                .cta-btn {
                    background: linear-gradient(135deg, #c48c28, #9a650e);
                    border: none; border-radius: 10px;
                    padding: 11px 22px; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
                    color: #080808; text-decoration: none; display: inline-block;
                    box-shadow: 0 4px 16px rgba(196,140,40,0.25);
                    transition: opacity 0.2s, transform 0.15s;
                }
                .cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }

                .fade-in { animation: fadeIn 0.5s ease; }
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            <div className="gal-page">
                <div className="inner fade-in">

                    {/* ── Top bar ── */}
                    <div className="top-bar">
                        <div className="top-brand">Gallery <span>Admin</span></div>
                        <div className="nav-btns">
                            <Link href="/admin/gallery/categories" className="nav-btn primary">
                                Manage Categories
                            </Link>
                            <Link href="/admin/news" className="nav-btn">
                                ← News Admin
                            </Link>
                        </div>
                    </div>

                    {categories.length === 0 ? (
                        <div className="empty-state">
                            <p>No categories yet. Create one to get started.</p>
                            <Link href="/admin/gallery/categories" className="cta-btn">
                                Create a Category
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* ── Category tabs ── */}
                            <div className="cat-tabs">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCat(cat.id)}
                                        className={`cat-tab${selectedCat === cat.id ? ' active' : ''}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* ── Upload card ── */}
                            <div className="upload-card">
                                <div className="section-label">Upload to "{activeCat?.name}"</div>

                                <div className="grid-2">
                                    <Field label="Title (optional — applies to all)">
                                        <StyledInput
                                            type="text" placeholder="Image title…"
                                            value={form.title}
                                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        />
                                    </Field>
                                    <Field label="Description (optional)">
                                        <StyledInput
                                            type="text" placeholder="Short description…"
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        />
                                    </Field>
                                </div>

                                <div
                                    className={`drop-zone${dragOver ? ' over' : ''}`}
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); uploadImages([...e.dataTransfer.files]) }}
                                >
                                    {uploading ? (
                                        <p className="drop-uploading">Uploading…</p>
                                    ) : (
                                        <>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ display: 'block', margin: '0 auto 12px' }}>
                                                <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#f0ece4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5" stroke="#f0ece4" strokeWidth="1.4" strokeLinecap="round" />
                                            </svg>
                                            <p className="drop-primary">Drop images here or click to browse</p>
                                            <p className="drop-secondary">JPG, PNG, WebP — multiple files supported</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileRef} type="file" accept="image/*" multiple
                                    style={{ display: 'none' }}
                                    onChange={e => uploadImages([...e.target.files])}
                                />
                            </div>

                            {/* ── Images grid ── */}
                            <div className="grid-header">
                                <div className="grid-count">
                                    {images.length} Image{images.length !== 1 ? 's' : ''} in "{activeCat?.name}"
                                </div>
                            </div>

                            {images.length === 0 ? (
                                <div className="empty-grid">No images yet — upload some above.</div>
                            ) : (
                                <div className="img-grid">
                                    {images.map((img, i) => (
                                        <div key={img.id} className="img-card">
                                            <div className="img-thumb">
                                                <img src={img.url} alt={img.title} />
                                            </div>
                                            {img.title && (
                                                <p className="img-caption">{img.title}</p>
                                            )}
                                            <div className="img-actions">
                                                <button className="img-btn" onClick={() => moveImage(img.id, -1)} disabled={i === 0} title="Move left">←</button>
                                                <button className="img-btn" onClick={() => moveImage(img.id, 1)} disabled={i === images.length - 1} title="Move right">→</button>
                                                <button className="img-btn del" onClick={() => deleteImage(img)} title="Delete">✕</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
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

// 'use client'
//
// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import { createClient } from '@/utils/supabase/client'
//
// export default function AdminGalleryPage() {
//     const [categories, setCategories] = useState([])
//     const [images, setImages]         = useState([])
//     const [selectedCat, setSelectedCat] = useState(null)
//     const [loading, setLoading]       = useState(true)
//     const [uploading, setUploading]   = useState(false)
//     const [toast, setToast]           = useState('')
//     const [form, setForm]             = useState({ title: '', description: '' })
//     const fileRef                     = useRef(null)
//
//     useEffect(() => { fetchAll() }, [])
//     useEffect(() => { if (selectedCat) fetchImages(selectedCat) }, [selectedCat])
//
//     async function fetchAll() {
//         setLoading(true)
//         const supabase = createClient()
//         const { data } = await supabase
//             .from('gallery_categories')
//             .select('*')
//             .order('position', { ascending: true })
//         const cats = data || []
//         setCategories(cats)
//         if (cats.length > 0) {
//             setSelectedCat(cats[0].id)
//         }
//         setLoading(false)
//     }
//
//     async function fetchImages(catId) {
//         const supabase = createClient()
//         const { data } = await supabase
//             .from('gallery_images')
//             .select('*')
//             .eq('category_id', catId)
//             .order('position', { ascending: true })
//         setImages(data || [])
//     }
//
//     function showToast(msg) {
//         setToast(msg)
//         setTimeout(() => setToast(''), 2500)
//     }
//
//     async function uploadImages(files) {
//         if (!selectedCat) return showToast('Select a category first.')
//         setUploading(true)
//         const supabase = createClient()
//         const maxPos = images.length ? Math.max(...images.map(i => i.position)) + 1 : 0
//
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i]
//             const ext  = file.name.split('.').pop()
//             const path = `${selectedCat}/${Date.now()}-${i}.${ext}`
//
//             const { error: uploadError } = await supabase.storage
//                 .from('gallery')
//                 .upload(path, file, { upsert: false })
//
//             if (uploadError) { showToast('Upload error: ' + uploadError.message); continue }
//
//             const { data: { publicUrl } } = supabase.storage
//                 .from('gallery')
//                 .getPublicUrl(path)
//
//             await supabase.from('gallery_images').insert([{
//                 title: form.title || file.name.replace(/\.[^.]+$/, ''),
//                 description: form.description,
//                 category_id: selectedCat,
//                 url: publicUrl,
//                 position: maxPos + i,
//             }])
//         }
//
//         setForm({ title: '', description: '' })
//         await fetchImages(selectedCat)
//         showToast(`${files.length} image${files.length > 1 ? 's' : ''} uploaded ✓`)
//         setUploading(false)
//     }
//
//     async function deleteImage(img) {
//         const supabase = createClient()
//         // Extract storage path from URL
//         const path = img.url.split('/storage/v1/object/public/gallery/')[1]
//         if (path) await supabase.storage.from('gallery').remove([path])
//         await supabase.from('gallery_images').delete().eq('id', img.id)
//         setImages(prev => prev.filter(i => i.id !== img.id))
//         showToast('Deleted')
//     }
//
//     async function moveImage(id, dir) {
//         const idx = images.findIndex(i => i.id === id)
//         const swapIdx = idx + dir
//         if (swapIdx < 0 || swapIdx >= images.length) return
//         const next = [...images]
//         const posA = next[idx].position
//         const posB = next[swapIdx].position
//         ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
//         next[idx].position = posA
//         next[swapIdx].position = posB
//         setImages(next)
//         const supabase = createClient()
//         await supabase.from('gallery_images').update({ position: posA }).eq('id', next[idx].id)
//         await supabase.from('gallery_images').update({ position: posB }).eq('id', next[swapIdx].id)
//     }
//
//     if (loading) return (
//         <div className="flex items-center justify-center min-h-screen text-[14px] text-[#6b6b6b]">Loading…</div>
//     )
//
//     const activeCat = categories.find(c => c.id === selectedCat)
//
//     return (
//         <div className="max-w-5xl mx-auto px-6 py-10">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">
//                 <h1 className="text-[24px]  text-[#1a1a1a]">Gallery Admin</h1>
//                 <div className="flex items-center gap-3">
//                     <Link
//                         href="/admin/gallery/categories"
//                         className="text-[12px] uppercase tracking-wide border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors text-[#1a1a1a]"
//                     >
//                         Manage Categories
//                     </Link>
//                     <Link
//                         href="/admin/news"
//                         className="text-[12px] uppercase tracking-wide text-[#6b6b6b] border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors"
//                     >
//                         ← News Admin
//                     </Link>
//                 </div>
//             </div>
//
//             {categories.length === 0 ? (
//                 <div className="text-center py-20 border border-dashed border-[#e0e0e0] rounded-lg">
//                     <p className="text-[14px] text-[#6b6b6b] mb-4">No categories yet.</p>
//                     <Link
//                         href="/admin/gallery/categories"
//                         className="bg-[#1a1a1a] text-white text-[12px] tracking-wide uppercase px-5 py-2.5 rounded hover:bg-[#333] transition-colors"
//                     >
//                         Create a Category
//                     </Link>
//                 </div>
//             ) : (
//                 <>
//                     {/* Category tabs */}
//                     <div className="flex gap-2 mb-8 flex-wrap">
//                         {categories.map(cat => (
//                             <button
//                                 key={cat.id}
//                                 onClick={() => setSelectedCat(cat.id)}
//                                 className={`px-4 py-2 text-[12px] uppercase tracking-wide rounded transition-colors ${
//                                     selectedCat === cat.id
//                                         ? 'bg-[#1a1a1a] text-white'
//                                         : 'border border-[#e0e0e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
//                                 }`}
//                             >
//                                 {cat.name}
//                             </button>
//                         ))}
//                     </div>
//
//                     {/* Upload area */}
//                     <div className="bg-[#f7f7f7] border border-[#e5e5e5] rounded-lg p-6 mb-8">
//                         <h2 className="text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a] mb-4">
//                             Upload to "{activeCat?.name}"
//                         </h2>
//                         <div className="grid grid-cols-2 gap-3 mb-4">
//                             <div>
//                                 <label className="block text-[11px] text-[#6b6b6b] mb-1">Title (optional — applies to all uploaded)</label>
//                                 <input
//                                     type="text" placeholder="Image title…" value={form.title}
//                                     onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                                     className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-[11px] text-[#6b6b6b] mb-1">Description (optional)</label>
//                                 <input
//                                     type="text" placeholder="Short description…" value={form.description}
//                                     onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                                     className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
//                                 />
//                             </div>
//                         </div>
//
//                         {/* Drop zone */}
//                         <div
//                             onClick={() => fileRef.current?.click()}
//                             onDragOver={e => e.preventDefault()}
//                             onDrop={e => { e.preventDefault(); uploadImages([...e.dataTransfer.files]) }}
//                             className="border-2 border-dashed border-[#d0d0d0] rounded-lg p-10 text-center cursor-pointer hover:border-[#1a1a1a] hover:bg-white transition-all"
//                         >
//                             {uploading ? (
//                                 <p className="text-[13px] text-[#6b6b6b]">Uploading…</p>
//                             ) : (
//                                 <>
//                                     <p className="text-[14px] text-[#1a1a1a] mb-1">Drop images here or click to browse</p>
//                                     <p className="text-[12px] text-[#6b6b6b]">JPG, PNG, WebP — multiple files supported</p>
//                                 </>
//                             )}
//                         </div>
//                         <input
//                             ref={fileRef} type="file" accept="image/*" multiple className="hidden"
//                             onChange={e => uploadImages([...e.target.files])}
//                         />
//                     </div>
//
//                     {/* Images grid */}
//                     <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wide mb-4">
//                         {images.length} image{images.length !== 1 ? 's' : ''} in "{activeCat?.name}"
//                     </div>
//
//                     {images.length === 0 ? (
//                         <p className="text-[13px] text-[#6b6b6b] text-center py-12 border border-dashed border-[#e0e0e0] rounded-lg">
//                             No images yet — upload some above.
//                         </p>
//                     ) : (
//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {images.map((img, i) => (
//                                 <div key={img.id} className="group relative">
//                                     <div className="aspect-square overflow-hidden rounded-lg bg-[#f0f0f0]">
//                                         <img
//                                             src={img.url} alt={img.title}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                     {img.title && (
//                                         <p className="mt-1 text-[11px] text-[#6b6b6b] truncate">{img.title}</p>
//                                     )}
//                                     {/* Actions overlay */}
//                                     <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                         <button
//                                             onClick={() => moveImage(img.id, -1)} disabled={i === 0}
//                                             className="p-1 bg-white rounded shadow text-[11px] text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-30"
//                                             title="Move left"
//                                         >←</button>
//                                         <button
//                                             onClick={() => moveImage(img.id, 1)} disabled={i === images.length - 1}
//                                             className="p-1 bg-white rounded shadow text-[11px] text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-30"
//                                             title="Move right"
//                                         >→</button>
//                                         <button
//                                             onClick={() => deleteImage(img)}
//                                             className="p-1 bg-white rounded shadow text-[11px] text-red-600 hover:bg-red-50"
//                                             title="Delete"
//                                         >✕</button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </>
//             )}
//
//             {toast && (
//                 <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded z-50">
//                     {toast}
//                 </div>
//             )}
//         </div>
//     )
// }
//
//
// // 'use client'
// //
// // import { useState, useEffect, useRef } from 'react'
// // import Link from 'next/link'
// // import { createClient } from '@/utils/supabase/client'
// //
// // export default function AdminGalleryPage() {
// //     const [categories, setCategories] = useState([])
// //     const [images, setImages]         = useState([])
// //     const [selectedCat, setSelectedCat] = useState(null)
// //     const [loading, setLoading]       = useState(true)
// //     const [uploading, setUploading]   = useState(false)
// //     const [toast, setToast]           = useState('')
// //     const [form, setForm]             = useState({ title: '', description: '' })
// //     const fileRef                     = useRef(null)
// //
// //     useEffect(() => { fetchAll() }, [])
// //     useEffect(() => { if (selectedCat) fetchImages(selectedCat) }, [selectedCat])
// //
// //     async function fetchAll() {
// //         setLoading(true)
// //         const supabase = createClient()
// //         const { data } = await supabase
// //             .from('gallery_categories')
// //             .select('*')
// //             .order('position', { ascending: true })
// //         const cats = data || []
// //         setCategories(cats)
// //         if (cats.length > 0) {
// //             setSelectedCat(cats[0].id)
// //         }
// //         setLoading(false)
// //     }
// //
// //     async function fetchImages(catId) {
// //         const supabase = createClient()
// //         const { data } = await supabase
// //             .from('gallery_images')
// //             .select('*')
// //             .eq('category_id', catId)
// //             .order('position', { ascending: true })
// //         setImages(data || [])
// //     }
// //
// //     function showToast(msg) {
// //         setToast(msg)
// //         setTimeout(() => setToast(''), 2500)
// //     }
// //
// //     async function uploadImages(files) {
// //         if (!selectedCat) return showToast('Select a category first.')
// //         setUploading(true)
// //         const supabase = createClient()
// //         const maxPos = images.length ? Math.max(...images.map(i => i.position)) + 1 : 0
// //
// //         for (let i = 0; i < files.length; i++) {
// //             const file = files[i]
// //             const ext  = file.name.split('.').pop()
// //             const path = `${selectedCat}/${Date.now()}-${i}.${ext}`
// //
// //             const { error: uploadError } = await supabase.storage
// //                 .from('gallery')
// //                 .upload(path, file, { upsert: false })
// //
// //             if (uploadError) { showToast('Upload error: ' + uploadError.message); continue }
// //
// //             const { data: { publicUrl } } = supabase.storage
// //                 .from('gallery')
// //                 .getPublicUrl(path)
// //
// //             await supabase.from('gallery_images').insert([{
// //                 title: form.title || file.name.replace(/\.[^.]+$/, ''),
// //                 description: form.description,
// //                 category_id: selectedCat,
// //                 url: publicUrl,
// //                 position: maxPos + i,
// //             }])
// //         }
// //
// //         setForm({ title: '', description: '' })
// //         await fetchImages(selectedCat)
// //         showToast(`${files.length} image${files.length > 1 ? 's' : ''} uploaded ✓`)
// //         setUploading(false)
// //     }
// //
// //     async function deleteImage(img) {
// //         const supabase = createClient()
// //         // Extract storage path from URL
// //         const path = img.url.split('/storage/v1/object/public/gallery/')[1]
// //         if (path) await supabase.storage.from('gallery').remove([path])
// //         await supabase.from('gallery_images').delete().eq('id', img.id)
// //         setImages(prev => prev.filter(i => i.id !== img.id))
// //         showToast('Deleted')
// //     }
// //
// //     async function moveImage(id, dir) {
// //         const idx = images.findIndex(i => i.id === id)
// //         const swapIdx = idx + dir
// //         if (swapIdx < 0 || swapIdx >= images.length) return
// //         const next = [...images]
// //         const posA = next[idx].position
// //         const posB = next[swapIdx].position
// //         ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
// //         next[idx].position = posA
// //         next[swapIdx].position = posB
// //         setImages(next)
// //         const supabase = createClient()
// //         await supabase.from('gallery_images').update({ position: posA }).eq('id', next[idx].id)
// //         await supabase.from('gallery_images').update({ position: posB }).eq('id', next[swapIdx].id)
// //     }
// //
// //     if (loading) return (
// //         <div className="flex items-center justify-center min-h-screen text-[14px] text-[#6b6b6b]">Loading…</div>
// //     )
// //
// //     const activeCat = categories.find(c => c.id === selectedCat)
// //
// //     return (
// //         <div className="max-w-5xl mx-auto px-6 py-10">
// //             {/* Header */}
// //             <div className="flex items-center justify-between mb-8">
// //                 <h1 className="text-[24px]  text-[#1a1a1a]">Gallery Admin</h1>
// //                 <div className="flex items-center gap-3">
// //                     <Link
// //                         href="/admin/gallery/categories"
// //                         className="text-[12px] uppercase tracking-wide border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors text-[#1a1a1a]"
// //                     >
// //                         Manage Categories
// //                     </Link>
// //                     <Link
// //                         href="/admin/news"
// //                         className="text-[12px] uppercase tracking-wide text-[#6b6b6b] border border-[#e0e0e0] px-4 py-2 rounded hover:bg-[#f5f5f5] transition-colors"
// //                     >
// //                         ← News Admin
// //                     </Link>
// //                 </div>
// //             </div>
// //
// //             {categories.length === 0 ? (
// //                 <div className="text-center py-20 border border-dashed border-[#e0e0e0] rounded-lg">
// //                     <p className="text-[14px] text-[#6b6b6b] mb-4">No categories yet.</p>
// //                     <Link
// //                         href="/admin/gallery/categories"
// //                         className="bg-[#1a1a1a] text-white text-[12px] tracking-wide uppercase px-5 py-2.5 rounded hover:bg-[#333] transition-colors"
// //                     >
// //                         Create a Category
// //                     </Link>
// //                 </div>
// //             ) : (
// //                 <>
// //                     {/* Category tabs */}
// //                     <div className="flex gap-2 mb-8 flex-wrap">
// //                         {categories.map(cat => (
// //                             <button
// //                                 key={cat.id}
// //                                 onClick={() => setSelectedCat(cat.id)}
// //                                 className={`px-4 py-2 text-[12px] uppercase tracking-wide rounded transition-colors ${
// //                                     selectedCat === cat.id
// //                                         ? 'bg-[#1a1a1a] text-white'
// //                                         : 'border border-[#e0e0e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
// //                                 }`}
// //                             >
// //                                 {cat.name}
// //                             </button>
// //                         ))}
// //                     </div>
// //
// //                     {/* Upload area */}
// //                     <div className="bg-[#f7f7f7] border border-[#e5e5e5] rounded-lg p-6 mb-8">
// //                         <h2 className="text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a] mb-4">
// //                             Upload to "{activeCat?.name}"
// //                         </h2>
// //                         <div className="grid grid-cols-2 gap-3 mb-4">
// //                             <div>
// //                                 <label className="block text-[11px] text-[#6b6b6b] mb-1">Title (optional — applies to all uploaded)</label>
// //                                 <input
// //                                     type="text" placeholder="Image title…" value={form.title}
// //                                     onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
// //                                     className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-[11px] text-[#6b6b6b] mb-1">Description (optional)</label>
// //                                 <input
// //                                     type="text" placeholder="Short description…" value={form.description}
// //                                     onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
// //                                     className="w-full border border-[#e0e0e0] px-3 py-2 text-[13px] outline-none focus:border-[#1a1a1a] bg-white rounded"
// //                                 />
// //                             </div>
// //                         </div>
// //
// //                         {/* Drop zone */}
// //                         <div
// //                             onClick={() => fileRef.current?.click()}
// //                             onDragOver={e => e.preventDefault()}
// //                             onDrop={e => { e.preventDefault(); uploadImages([...e.dataTransfer.files]) }}
// //                             className="border-2 border-dashed border-[#d0d0d0] rounded-lg p-10 text-center cursor-pointer hover:border-[#1a1a1a] hover:bg-white transition-all"
// //                         >
// //                             {uploading ? (
// //                                 <p className="text-[13px] text-[#6b6b6b]">Uploading…</p>
// //                             ) : (
// //                                 <>
// //                                     <p className="text-[14px] text-[#1a1a1a] mb-1">Drop images here or click to browse</p>
// //                                     <p className="text-[12px] text-[#6b6b6b]">JPG, PNG, WebP — multiple files supported</p>
// //                                 </>
// //                             )}
// //                         </div>
// //                         <input
// //                             ref={fileRef} type="file" accept="image/*" multiple className="hidden"
// //                             onChange={e => uploadImages([...e.target.files])}
// //                         />
// //                     </div>
// //
// //                     {/* Images grid */}
// //                     <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wide mb-4">
// //                         {images.length} image{images.length !== 1 ? 's' : ''} in "{activeCat?.name}"
// //                     </div>
// //
// //                     {images.length === 0 ? (
// //                         <p className="text-[13px] text-[#6b6b6b] text-center py-12 border border-dashed border-[#e0e0e0] rounded-lg">
// //                             No images yet — upload some above.
// //                         </p>
// //                     ) : (
// //                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// //                             {images.map((img, i) => (
// //                                 <div key={img.id} className="group relative">
// //                                     <div className="aspect-square overflow-hidden rounded-lg bg-[#f0f0f0]">
// //                                         <img
// //                                             src={img.url} alt={img.title}
// //                                             className="w-full h-full object-cover"
// //                                         />
// //                                     </div>
// //                                     {img.title && (
// //                                         <p className="mt-1 text-[11px] text-[#6b6b6b] truncate">{img.title}</p>
// //                                     )}
// //                                     {/* Actions overlay */}
// //                                     <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                                         <button
// //                                             onClick={() => moveImage(img.id, -1)} disabled={i === 0}
// //                                             className="p-1 bg-white rounded shadow text-[11px] text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-30"
// //                                             title="Move left"
// //                                         >←</button>
// //                                         <button
// //                                             onClick={() => moveImage(img.id, 1)} disabled={i === images.length - 1}
// //                                             className="p-1 bg-white rounded shadow text-[11px] text-[#1a1a1a] hover:bg-[#f5f5f5] disabled:opacity-30"
// //                                             title="Move right"
// //                                         >→</button>
// //                                         <button
// //                                             onClick={() => deleteImage(img)}
// //                                             className="p-1 bg-white rounded shadow text-[11px] text-red-600 hover:bg-red-50"
// //                                             title="Delete"
// //                                         >✕</button>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     )}
// //                 </>
// //             )}
// //
// //             {toast && (
// //                 <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded z-50">
// //                     {toast}
// //                 </div>
// //             )}
// //         </div>
// //     )
// // }
