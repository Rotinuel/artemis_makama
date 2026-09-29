import { MATERIALS, CITIES } from './items'

const API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-5-5'

function buildPrompt(today) {
    const items = MATERIALS.map(m => `- ${m.key}: ${m.name} — ${m.spec} (price per ${m.unit})`).join('\n')
    return `Today is ${today}. Find current market prices in Nigerian naira for these building materials in ${CITIES.join(', ')}:

${items}

Search the web (supplier price lists, recent Nigerian news, marketplace listings, building-cost blogs). Rules:
- Only use evidence published or updated in the last 60 days. Skip anything older.
- Convert to the stated unit when the source clearly gives mass (e.g. "30 tonnes of granite for ₦X" → X ÷ 30 per tonne). Never guess a conversion if the quantity is unclear.
- Give a range (min–max) when sources differ; min = max if there is one clear price.
- If you cannot find reliable, recent evidence for an item in a city, leave it out. Do not estimate or reuse another city's price.
- Each entry needs the URL of the source you relied on most, and its publication/update date if shown.

When you are done searching, reply with ONLY a JSON object, no other text:
{"prices":[{"item":"cement","city":"Lagos","min":10500,"max":11200,"source_name":"Example News","source_url":"https://…","source_date":"2026-09-20","note":"Dangote, retail"}]}
Use the item keys exactly as listed and the city names exactly: ${CITIES.join(', ')}.`
}

function extractJson(text) {
    const cleaned = text.replace(/```(?:json)?/g, '')
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end <= start) throw new Error('No JSON found in Claude reply')
    return JSON.parse(cleaned.slice(start, end + 1))
}

async function callClaude(body) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Claude API error ${res.status}: ${text.slice(0, 400)}`)
    }
    return res.json()
}

/**
 * Ask Claude (with web search) for current prices.
 * @returns {Promise<Array<{item, city, min, max, source_name, source_url, source_date, note}>>}
 */
export async function researchPrices() {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set')

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })
    const messages = [{ role: 'user', content: buildPrompt(today) }]
    const base = {
        model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
        max_tokens: 8000,
        tools: [{
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 12,
            // No user_location: the API doesn't accept Nigeria (NG) as a
            // location. The prompt already asks for Nigerian sources/cities.
        }],
    }

    let data
    // Long searches can pause mid-turn; continue up to 3 times
    for (let i = 0; i < 4; i++) {
        data = await callClaude({ ...base, messages })
        if (data.stop_reason !== 'pause_turn') break
        messages.push({ role: 'assistant', content: data.content })
    }

    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n')
    let parsed
    try {
        parsed = extractJson(text)
    } catch {
        throw new Error(`Couldn't read prices from Claude's reply (stop_reason: ${data.stop_reason})`)
    }

    const validItems = new Set(MATERIALS.map(m => m.key))
    const validCities = new Set(CITIES)
    return (parsed.prices || [])
        .map(p => ({
            item: String(p.item || '').trim(),
            city: String(p.city || '').trim(),
            min: Number(p.min),
            max: Number(p.max ?? p.min),
            source_name: String(p.source_name || '').slice(0, 120),
            source_url: String(p.source_url || ''),
            source_date: /^\d{4}-\d{2}-\d{2}$/.test(p.source_date || '') ? p.source_date : null,
            note: String(p.note || '').slice(0, 200),
        }))
        .filter(p =>
            validItems.has(p.item) && validCities.has(p.city) &&
            isFinite(p.min) && p.min > 0 && isFinite(p.max) && p.max >= p.min &&
            /^https?:\/\//.test(p.source_url)
        )
}
