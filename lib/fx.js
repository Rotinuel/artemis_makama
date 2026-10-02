// Exchange rates for showing naira amounts in pounds / dollars.
// The site tries a free daily rate feed first and falls back to the
// rates below (CBN official rates on the date shown). Update FALLBACK
// now and then so the fallback never drifts far.

export const FALLBACK = {
    date: '2026-10-02',
    source: 'CBN official rate',
    // naira per 1 unit of currency
    perUnit: { USD: 1329.16, GBP: 1766.59, CAD: 990, EUR: 1510.06 },
}

export const CURRENCIES = {
    NGN: { symbol: '₦', label: 'Naira' },
    GBP: { symbol: '£', label: 'Pounds' },
    USD: { symbol: '$', label: 'Dollars' },
    CAD: { symbol: 'C$', label: 'Canadian dollars' },
}

/** Server-side: { date, source, perUnit } — cached for a day */
export async function getFxRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/NGN', { next: { revalidate: 86400 } })
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        const r = data?.rates
        if (data?.result !== 'success' || !r?.USD || !r?.GBP) throw new Error('bad payload')
        const perUnit = {}
        for (const code of ['USD', 'GBP', 'CAD', 'EUR']) if (r[code]) perUnit[code] = Math.round((1 / r[code]) * 100) / 100
        const date = data.time_last_update_utc ? new Date(data.time_last_update_utc).toISOString().slice(0, 10) : FALLBACK.date
        return { date, source: 'ExchangeRate-API daily reference rate', perUnit }
    } catch {
        return FALLBACK
    }
}

/** Convert a naira amount to another currency */
export function fromNaira(ngn, code, rates) {
    if (code === 'NGN' || ngn == null) return ngn
    const per = rates?.perUnit?.[code]
    return per ? ngn / per : null
}

/** Compact money: ₦45m, £25k, $1.2m */
export function formatMoney(amount, code = 'NGN') {
    if (amount == null || !isFinite(amount)) return '—'
    const sym = CURRENCIES[code]?.symbol || ''
    const abs = Math.abs(amount)
    let s
    if (abs >= 1e9) s = `${trim(amount / 1e9)}bn`
    else if (abs >= 1e6) s = `${trim(amount / 1e6)}m`
    else if (abs >= 1e3) s = `${trim(amount / 1e3, 0)}k`
    else s = String(Math.round(amount))
    return `${sym}${s}`
}

function trim(n, maxDecimals = 1) {
    const r = Number(n.toFixed(maxDecimals))
    return r % 1 === 0 ? String(r) : String(r)
}
