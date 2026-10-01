// Builds the single News + Events feed: firm news (admin) and approved
// Industry Watch stories (AI-curated) merged and sorted newest first.

const TZ = 'Africa/Lagos'

function nigeriaDay(d) {
    // YYYY-MM-DD of a Date in Lagos time
    return d.toLocaleDateString('en-CA', { timeZone: TZ })
}

export function formatNewsDate(d) {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: TZ })
}

// Firm news stores its date as display text ("September 12, 2026").
// Use the moment it was posted (created_at) when that falls on the same
// day, so a story added this afternoon sorts above one from this morning.
function firmTimestamp(item) {
    const created = item.created_at ? new Date(item.created_at) : null
    const day = item.date ? new Date(`${item.date} 12:00 GMT+0100`) : null
    const validDay = day && !isNaN(day) ? day : null

    if (validDay && created && !isNaN(created) && nigeriaDay(created) === nigeriaDay(validDay)) return created.getTime()
    if (validDay) return validDay.getTime()
    if (created && !isNaN(created)) return created.getTime()
    return 0
}

export function buildNewsFeed(newsItems = [], industryNews = []) {
    const firm = newsItems.map(item => ({
        key: `firm-${item.id}`,
        kind: 'firm',
        label: item.type || 'Firm News',
        title: item.title,
        summary: item.summary || '',
        href: item.href && item.href !== '#' ? item.href : null,
        external: /^https?:\/\//.test(item.href || ''),
        image: item.image || null,
        source: null,
        date: item.date || '',
        ts: firmTimestamp(item),
        position: item.position ?? 0,
    }))

    const industry = industryNews.map(item => {
        const d = new Date(item.published_at)
        return {
            key: `ind-${item.id}`,
            kind: 'industry',
            label: item.category || 'Industry News',
            title: item.headline,
            summary: item.summary || '',
            href: item.url,
            external: true,
            image: null,
            source: item.source,
            date: isNaN(d) ? '' : formatNewsDate(d),
            ts: isNaN(d) ? 0 : d.getTime(),
            position: 0,
        }
    })

    return [...firm, ...industry].sort((a, b) =>
        b.ts - a.ts ||
        (a.kind === b.kind ? a.position - b.position : a.kind === 'firm' ? -1 : 1)
    )
}
