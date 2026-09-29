import { MATERIALS, CITIES, midpoint } from './items'

/**
 * Turn published price rows into the board shown on the site:
 * { [city]: [{ ...material, current, previous, changePct }] }
 * Rows must be sorted newest first (effective_date desc, created_at desc).
 */
export function buildPriceBoard(rows = []) {
    const history = new Map()
    for (const r of rows) {
        const k = `${r.item_key}|${r.city}`
        if (!history.has(k)) history.set(k, [])
        const list = history.get(k)
        if (list.length < 2) list.push(r)
    }

    const board = {}
    let lastUpdated = null
    for (const city of CITIES) {
        board[city] = MATERIALS.map(m => {
            const [current = null, previous = null] = history.get(`${m.key}|${city}`) || []
            let changePct = null
            if (current && previous) {
                const a = midpoint(previous), b = midpoint(current)
                changePct = a ? ((b - a) / a) * 100 : null
            }
            if (current && (!lastUpdated || current.effective_date > lastUpdated)) lastUpdated = current.effective_date
            return { ...m, current, previous, changePct }
        })
    }
    return { board, lastUpdated }
}
