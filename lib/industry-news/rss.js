// Minimal, dependency-free RSS 2.0 / Atom parser — enough for news feeds.

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”' }

export function decodeEntities(str = '') {
    return str.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code) => {
        if (code[0] === '#') {
            const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
            return Number.isFinite(n) ? String.fromCodePoint(n) : m
        }
        return ENTITIES[code.toLowerCase()] ?? m
    })
}

function unwrapCdata(str = '') {
    return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

export function stripHtml(html = '') {
    const strip = s => s
        .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<br\s*\/?>|<\/p>/gi, ' ')
        .replace(/<\/?[a-z][^>]*>/gi, ' ')
    // Strip, decode, then strip again: some feeds escape their HTML (&lt;p&gt;)
    return strip(decodeEntities(strip(unwrapCdata(html))))
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
}

function tag(block, name) {
    const esc = name.replace(':', '\\:')
    const m = block.match(new RegExp(`<${esc}(?:\\s[^>]*)?>([\\s\\S]*?)</${esc}>`, 'i'))
    return m ? unwrapCdata(m[1]).trim() : ''
}

function attr(block, name, attribute) {
    const esc = name.replace(':', '\\:')
    const m = block.match(new RegExp(`<${esc}\\b([^>]*)/?>`, 'i'))
    if (!m) return ''
    const a = m[1].match(new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, 'i'))
    return a ? decodeEntities(a[1]) : ''
}

function atomLink(block) {
    // Prefer rel="alternate" (or no rel) links
    const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)].map(m => m[1])
    for (const l of links) {
        const rel = (l.match(/rel\s*=\s*["']([^"']+)["']/i) || [])[1]
        const href = (l.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1]
        if (href && (!rel || rel === 'alternate')) return decodeEntities(href)
    }
    return ''
}

function toDate(str) {
    if (!str) return null
    const d = new Date(str.trim())
    return isNaN(d) ? null : d
}

/** Parse an RSS/Atom XML string into [{ title, url, summary, publishedAt }] */
export function parseFeed(xml) {
    if (!xml || typeof xml !== 'string') return []
    const isAtom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml)
    const blocks = isAtom
        ? [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m => m[0])
        : [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(m => m[0])

    return blocks.map(b => {
        const title = stripHtml(tag(b, 'title'))
        let url = isAtom ? atomLink(b) : decodeEntities(stripHtml(tag(b, 'link')))
        if (!url) {
            const guid = stripHtml(tag(b, 'guid'))
            if (/^https?:\/\//.test(guid)) url = guid
        }
        const rawSummary =
            tag(b, 'description') || tag(b, 'summary') || tag(b, 'content:encoded') || tag(b, 'content')
        const publishedAt = toDate(
            tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date')
        )
        return {
            title,
            url: url.trim(),
            summary: stripHtml(rawSummary).slice(0, 600),
            publishedAt,
        }
    }).filter(i => i.title && /^https?:\/\//.test(i.url))
}

/** Normalise a URL for de-duplication (drop tracking params, hash, trailing slash) */
export function normaliseUrl(u) {
    try {
        const url = new URL(u)
        url.hash = ''
        for (const k of [...url.searchParams.keys()]) {
            if (/^(utm_|fbclid|gclid|mc_|ref$|source$)/i.test(k)) url.searchParams.delete(k)
        }
        url.hostname = url.hostname.replace(/^www\./, '')
        let s = url.toString()
        if (s.endsWith('/')) s = s.slice(0, -1)
        return s
    } catch {
        return u
    }
}
