// Shared labels and helpers for the client portal and its admin pages.

export const PORTAL_BUCKET = 'portal'

export const PROJECT_STATUS = {
    planning: 'Planning',
    in_progress: 'In progress',
    on_hold: 'On hold',
    completed: 'Completed',
    handed_over: 'Handed over',
}

export const STAGE_STATUS = {
    pending: 'Not started',
    in_progress: 'In progress',
    awaiting_inspection: 'Awaiting inspection',
    approved: 'Inspected & approved',
}

export const PAYMENT_STATUS = {
    upcoming: 'Upcoming',
    due: 'Due',
    paid: 'Paid — awaiting check',
    verified: 'Received & verified',
}

export const DOC_CATEGORIES = {
    contract: 'Contract',
    boq: 'Bill of quantities',
    drawing: 'Drawings',
    inspection: 'Inspection reports',
    handover: 'Handover pack',
    receipt: 'Receipts',
    other: 'Other',
}

export const DEFECT_STATUS = {
    open: 'Received',
    in_progress: 'Being fixed',
    resolved: 'Fixed',
    closed: 'Closed',
}

// The usual stage-gate plan, offered when a project has no stages yet
export const DEFAULT_STAGES = [
    'Design & approvals',
    'Site preparation & setting out',
    'Foundation',
    'Frame & blockwork',
    'Roofing',
    'Services (electrical & plumbing)',
    'Finishing',
    'Handover',
]

export function formatMoney(amount, currency = 'NGN') {
    if (amount === null || amount === undefined || amount === '') return '—'
    const n = Number(amount)
    if (!Number.isFinite(n)) return '—'
    try {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency || 'NGN',
            maximumFractionDigits: n % 1 === 0 ? 0 : 2,
        }).format(n)
    } catch {
        return `${currency} ${n.toLocaleString('en-GB')}`
    }
}

export function formatDate(value, withYear = true) {
    if (!value) return '—'
    // date-only strings ("2026-03-01") are treated as calendar dates, not UTC midnight
    const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) })
}

export function formatBytes(bytes) {
    if (!bytes) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let n = bytes
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
    return `${n.toFixed(n < 10 && i ? 1 : 0)} ${units[i]}`
}

/** Storage-safe file name: keeps the extension, strips odd characters */
export function safeFileName(name = 'file') {
    const dot = name.lastIndexOf('.')
    const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) : ''
    const base = (dot > 0 ? name.slice(0, dot) : name)
        .normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'file'
    const stamp = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    return `${stamp}-${base}${ext ? `.${ext}` : ''}`
}

/** Path inside the private bucket: <project id>/<folder>/<file> */
export function portalPath(projectId, folder, fileName) {
    return `${projectId}/${folder}/${safeFileName(fileName)}`
}

/** % of stages approved */
export function stageProgress(stages = []) {
    if (!stages.length) return 0
    const done = stages.filter(s => s.status === 'approved').length
    return Math.round((done / stages.length) * 100)
}

/** Turns a camera link into something embeddable when we know how (YouTube live) */
export function cameraEmbed(url) {
    if (!url) return null
    try {
        const u = new URL(url)
        const host = u.hostname.replace(/^www\./, '')
        if (host === 'youtube.com' || host === 'm.youtube.com') {
            const id = u.searchParams.get('v') || (u.pathname.startsWith('/live/') && u.pathname.split('/')[2])
            if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`
            if (u.pathname.startsWith('/embed/')) return url
        }
        if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&mute=1`
    } catch { /* not a URL */ }
    return null
}
