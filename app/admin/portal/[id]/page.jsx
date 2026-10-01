'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PORTAL_BUCKET } from '@/lib/portal'
import { adminPortalStyles } from '../admin-portal-styles'
import {
    DetailsSection, ClientsSection, StagesSection, PaymentsSection,
    UpdatesSection, DocumentsSection, DefectsSection,
} from './sections'

const TABS = [
    { key: 'details', label: 'Details' },
    { key: 'clients', label: 'Clients' },
    { key: 'stages', label: 'Stages' },
    { key: 'payments', label: 'Payments' },
    { key: 'updates', label: 'Site updates' },
    { key: 'documents', label: 'Documents' },
    { key: 'defects', label: 'Defects' },
]

export default function AdminPortalProjectPage() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [urls, setUrls] = useState({})
    const [error, setError] = useState('')
    const [tab, setTab] = useState('details')
    const [toast, setToast] = useState(null)

    const showToast = useCallback((msg, type = 'success', ms = 3500) => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), ms)
    }, [])

    // Adds short-lived links for private files (thumbnails, "open" buttons)
    const sign = useCallback(async paths => {
        const list = [...new Set(paths.filter(Boolean))]
        if (!list.length) return
        const { data: signed } = await createClient().storage.from(PORTAL_BUCKET).createSignedUrls(list, 60 * 60 * 6)
        const add = {}
        ;(signed || []).forEach(s => { if (s.signedUrl && s.path) add[s.path] = s.signedUrl })
        setUrls(prev => ({ ...prev, ...add }))
    }, [])

    useEffect(() => {
        let cancelled = false
        async function load() {
            const supabase = createClient()
            const q = (table, order, asc = true) =>
                supabase.from(table).select('*').eq('project_id', id).order(order, { ascending: asc })
            const [project, members, stages, payments, updates, documents, defects] = await Promise.all([
                supabase.from('projects').select('*').eq('id', id).maybeSingle(),
                q('project_members', 'created_at'),
                q('project_stages', 'position'),
                q('project_payments', 'position'),
                q('project_updates', 'posted_at', false),
                q('project_documents', 'uploaded_at', false),
                q('defect_requests', 'created_at', false),
            ])
            if (cancelled) return
            const failed = [project, members, stages, payments, updates, documents, defects].find(r => r.error)
            if (failed) return setError(failed.error.message)
            if (!project.data) return setError('Project not found.')
            setData({
                project: project.data,
                members: members.data || [],
                stages: stages.data || [],
                payments: payments.data || [],
                updates: updates.data || [],
                documents: documents.data || [],
                defects: defects.data || [],
            })
            sign([
                ...(updates.data || []).flatMap(u => u.photos || []),
                ...(defects.data || []).flatMap(d => d.photos || []),
                ...(payments.data || []).map(p => p.receipt_path),
                ...(documents.data || []).map(d => d.file_path),
            ])
        }
        load()
        return () => { cancelled = true }
    }, [id, sign])

    // patch('stages', list => newList)
    const patch = useCallback((key, updater) => {
        setData(d => ({ ...d, [key]: typeof updater === 'function' ? updater(d[key]) : updater }))
    }, [])

    if (error) return (
        <div className="ap-loading" style={{ flexDirection: 'column', gap: 16 }}>
            <style>{adminPortalStyles}</style>
            <span style={{ color: '#f09090' }}>{error}</span>
            <Link href="/admin/portal" className="nav-btn">← All projects</Link>
        </div>
    )
    if (!data) return <div className="ap-loading"><style>{adminPortalStyles}</style>Loading…</div>

    const newDefects = data.defects.filter(d => d.status === 'open').length
    const counts = {
        clients: data.members.length, stages: data.stages.length, payments: data.payments.length,
        updates: data.updates.length, documents: data.documents.length, defects: data.defects.length,
    }
    const common = { data, patch, urls, sign, toast: showToast, projectId: id }

    return (
        <>
            <style>{adminPortalStyles}</style>
            <div className="ap-page">
                <div className="ap-inner fade-in">
                    <div className="top-bar">
                        <div className="top-brand">Client <span>Portal</span></div>
                        <div className="nav-btns">
                            <Link href={`/portal/${id}`} className="nav-btn primary" target="_blank">Preview as client ↗</Link>
                            <Link href="/admin/portal" className="nav-btn">← All projects</Link>
                        </div>
                    </div>

                    <h1 className="ap-h1">{data.project.name}</h1>
                    <p className="intro">{[data.project.code, data.project.location].filter(Boolean).join(' · ') || 'Client project'}</p>

                    <div className="tabs">
                        {TABS.map(t => (
                            <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                                {t.label}
                                {t.key === 'defects' && newDefects
                                    ? <span className="tab-count alert">{newDefects} new</span>
                                    : counts[t.key] !== undefined && <span className="tab-count">{counts[t.key]}</span>}
                            </button>
                        ))}
                    </div>

                    {tab === 'details' && <DetailsSection {...common} />}
                    {tab === 'clients' && <ClientsSection {...common} />}
                    {tab === 'stages' && <StagesSection {...common} />}
                    {tab === 'payments' && <PaymentsSection {...common} />}
                    {tab === 'updates' && <UpdatesSection {...common} />}
                    {tab === 'documents' && <DocumentsSection {...common} />}
                    {tab === 'defects' && <DefectsSection {...common} />}
                </div>
            </div>

            {toast && <div className={`toast ${toast.type}`}><span className="toast-dot" />{toast.msg}</div>}
        </>
    )
}
