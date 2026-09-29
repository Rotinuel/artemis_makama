import { CATEGORIES } from './sources'

const API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-5-5'

const SYSTEM = `You are the news editor for Artemis Atelier Ltd, an architecture, engineering and construction firm based in Lagos, Nigeria. Each day you pick the most useful industry stories for the "Industry Watch" section of the firm's website.

Choose stories that matter to clients and professionals in architecture, construction, engineering, infrastructure and real estate. Priorities, in order:
1. Nigeria and West Africa: major projects, housing, building regulations, materials costs, infrastructure, government policy.
2. The rest of Africa.
3. Globally significant projects, design ideas, engineering feats, sustainability and construction technology.

Avoid: pure product promotions, furniture/lighting/fashion design, stock-market or company earnings notes with no project angle, obituaries, listicles, job adverts, opinion pieces without news, and stories that duplicate another candidate (pick the better source).

For each story you pick, write:
- headline: clear and factual, max 90 characters, in your own words (do not copy the original headline word for word).
- summary: 1–2 sentences, max 45 words, in your own words, saying what happened and why it matters. Use ONLY facts present in the candidate text. Never invent figures, names or dates.
- category: one of ${CATEGORIES.join(', ')}.`

// JSON shape Claude must return (enforced with structured outputs)
const OUTPUT_SCHEMA = {
    type: 'object',
    properties: {
        picks: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    headline: { type: 'string' },
                    summary: { type: 'string' },
                    category: { type: 'string', enum: CATEGORIES },
                },
                required: ['id', 'headline', 'summary', 'category'],
                additionalProperties: false,
            },
        },
    },
    required: ['picks'],
    additionalProperties: false,
}

/**
 * Ask Claude to choose and summarise the best stories.
 * @param {Array<{title,url,summary,source,region,publishedAt}>} candidates
 * @param {number} count how many to pick
 * @returns {Promise<Array<{candidate, headline, summary, category}>>}
 */
export async function curateWithClaude(candidates, count) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
    if (candidates.length === 0) return []

    const list = candidates.map((c, i) => ({
        id: i,
        source: c.source,
        region: c.region,
        published: c.publishedAt ? c.publishedAt.toISOString().slice(0, 10) : 'unknown',
        title: c.title,
        text: c.summary.slice(0, 400),
    }))

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
            max_tokens: 4000,
            system: SYSTEM,
            output_config: {
                format: { type: 'json_schema', schema: OUTPUT_SCHEMA },
            },
            messages: [{
                role: 'user',
                content: `Here are today's candidate stories as JSON. Pick up to ${count} (fewer if there aren't that many good ones). Reply with JSON only: {\"picks\": [{\"id\", \"headline\", \"summary\", \"category\"}]}.\n\n${JSON.stringify(list)}`,
            }],
        }),
    })

    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Claude API error ${res.status}: ${text.slice(0, 300)}`)
    }

    const data = await res.json()
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim()
    let picks
    try {
        picks = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '')).picks
    } catch {
        throw new Error(`Claude returned an unexpected reply (stop_reason: ${data.stop_reason || 'unknown'})`)
    }
    if (!Array.isArray(picks)) return []

    const seen = new Set()
    return picks
        .filter(p => Number.isInteger(p.id) && candidates[p.id] && !seen.has(p.id) && seen.add(p.id))
        .slice(0, count)
        .map(p => ({
            candidate: candidates[p.id],
            headline: String(p.headline || candidates[p.id].title).trim().slice(0, 140),
            summary: String(p.summary || '').trim().slice(0, 400),
            category: CATEGORIES.includes(p.category) ? p.category : 'Construction',
        }))
}
