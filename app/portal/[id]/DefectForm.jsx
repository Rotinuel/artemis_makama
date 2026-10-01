'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PORTAL_BUCKET, portalPath } from '@/lib/portal'

const MAX_PHOTOS = 4
const MAX_MB = 10

export default function DefectForm({ projectId, userId }) {
    const router = useRouter()
    const [form, setForm] = useState({ title: '', location: '', description: '' })
    const [files, setFiles] = useState([]) // { file, preview }
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [sent, setSent] = useState(false)

    // free preview URLs when leaving the page
    const filesRef = useRef(files)
    useEffect(() => { filesRef.current = files }, [files])
    useEffect(() => () => filesRef.current.forEach(f => URL.revokeObjectURL(f.preview)), [])

    function removeFile(i) {
        setFiles(prev => {
            if (prev[i]) URL.revokeObjectURL(prev[i].preview)
            return prev.filter((_, j) => j !== i)
        })
    }

    function addFiles(list) {
        setError('')
        const picked = [...list].filter(f => f.type.startsWith('image/'))
        const tooBig = picked.find(f => f.size > MAX_MB * 1024 * 1024)
        if (tooBig) return setError(`“${tooBig.name}” is larger than ${MAX_MB} MB.`)
        setFiles(prev => [...prev, ...picked.map(file => ({ file, preview: URL.createObjectURL(file) }))].slice(0, MAX_PHOTOS))
    }

    async function submit(e) {
        e.preventDefault()
        if (!form.title.trim()) return setError('Give the problem a short title, e.g. “Leaking tap in guest bathroom”.')
        setBusy(true)
        setError('')
        const supabase = createClient()

        const photos = []
        for (const { file } of files) {
            const path = portalPath(projectId, 'defects', file.name)
            const { error: upErr } = await supabase.storage.from(PORTAL_BUCKET).upload(path, file, {
                contentType: file.type, upsert: false,
            })
            if (upErr) {
                setBusy(false)
                return setError(`Couldn’t upload a photo: ${upErr.message}`)
            }
            photos.push(path)
        }

        const { error: insErr } = await supabase.from('defect_requests').insert({
            project_id: projectId,
            created_by: userId,
            title: form.title.trim().slice(0, 160),
            location: form.location.trim().slice(0, 120) || null,
            description: form.description.trim().slice(0, 4000) || null,
            photos,
        })
        setBusy(false)
        if (insErr) return setError(`Couldn’t send your request: ${insErr.message}`)

        setForm({ title: '', location: '', description: '' })
        files.forEach(f => URL.revokeObjectURL(f.preview))
        setFiles([])
        setSent(true)
        router.refresh()
    }

    const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

    return (
        <form className="pt-form" onSubmit={submit}>
            {sent && <div className="pt-success">Thank you. We’ve received your request and will be in touch shortly.</div>}

            <div className="pt-field">
                <label htmlFor="d-title">What’s the problem?</label>
                <input id="d-title" value={form.title} onChange={set('title')} maxLength={160} placeholder="e.g. Crack in living-room wall" />
            </div>
            <div className="pt-field">
                <label htmlFor="d-loc">Where is it?</label>
                <input id="d-loc" value={form.location} onChange={set('location')} maxLength={120} placeholder="e.g. Ground floor, living room, north wall" />
            </div>
            <div className="pt-field">
                <label htmlFor="d-desc">Details</label>
                <textarea id="d-desc" rows={4} value={form.description} onChange={set('description')} maxLength={4000}
                    placeholder="When did you notice it? Is it getting worse?" />
            </div>
            <div className="pt-field">
                <label htmlFor="d-photos">Photos (up to {MAX_PHOTOS})</label>
                <input id="d-photos" type="file" accept="image/*" multiple disabled={files.length >= MAX_PHOTOS}
                    onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
                {!!files.length && (
                    <div className="pt-thumbs">
                        {files.map((f, i) => (
                            <div key={f.preview} className="pt-thumb">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={f.preview} alt="" />
                                <button type="button" aria-label="Remove photo" onClick={() => removeFile(i)}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && <div className="pt-error">{error}</div>}

            <div>
                <button type="submit" className="pt-btn primary" disabled={busy}>
                    {busy ? 'Sending…' : 'Send request'}
                </button>
            </div>
        </form>
    )
}
