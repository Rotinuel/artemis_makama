// ─────────────────────────────────────────────────────────────
// News sources for the daily Industry Watch feed.
//
// Each source is a public RSS feed. Add, remove or reorder freely —
// the job reads them all, then Claude picks the best few stories.
// `region` is a hint passed to Claude so it can favour local news.
// ─────────────────────────────────────────────────────────────

export const SOURCES = [
    // Nigeria / Africa
    { name: 'BusinessDay', url: 'https://businessday.ng/category/real-estate/feed/', region: 'Nigeria' },
    { name: 'Construction Review Online', url: 'https://constructionreviewonline.com/feed/', region: 'Africa / Global' },

    // Architecture
    { name: 'ArchDaily', url: 'https://feeds.feedburner.com/Archdaily', region: 'Global' },
    { name: 'Dezeen', url: 'https://www.dezeen.com/feed/', region: 'Global' },

    // Construction & engineering
    { name: 'Global Construction Review', url: 'https://www.globalconstructionreview.com/feed/', region: 'Global' },
    { name: 'ENR', url: 'https://www.enr.com/rss/articles', region: 'Global / US' },
    { name: 'Construction Dive', url: 'https://www.constructiondive.com/feeds/news/', region: 'US' },
]

// Categories Claude may assign (also used as filter chips in the admin page)
export const CATEGORIES = [
    'Architecture',
    'Construction',
    'Engineering',
    'Infrastructure',
    'Real Estate',
    'Sustainability',
    'Policy',
]

export const SETTINGS = {
    maxAgeHours: 72,        // ignore articles older than this
    maxPerSource: 12,       // newest N articles considered from each feed
    maxCandidates: 60,      // cap on articles sent to Claude per run
    picksPerRun: 5,         // how many stories Claude should suggest each day
    feedTimeoutMs: 12000,
}
