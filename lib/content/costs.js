// ─────────────────────────────────────────────────────────────────────
// BUILD-COST MODEL used by the cost guides and the downloadable PDF.
//
// Figures: Lagos, 2026, building only (no land), compiled from published
// 2026 market data (see SOURCES) and current material prices. When your
// QS/engineer has checked them against Artemis BOQs, update RATES /
// AREAS here and set TRUST.guideReviewer in lib/trust.js — every guide
// and table updates from this one file.
// ─────────────────────────────────────────────────────────────────────

export const COSTS_VERIFIED = '2026-10-02'

// Naira per m² of gross floor area, shell to handover, excluding land,
// external works and furniture. [low, high]
export const RATES = {
    basic: { label: 'Basic finish', range: [150_000, 220_000], note: 'Local tiles, standard doors and fittings, PVC ceilings, emulsion paint.' },
    standard: { label: 'Standard finish', range: [220_000, 330_000], note: 'Good porcelain tiles, POP ceilings, quality sanitary ware, aluminium windows.' },
    premium: { label: 'Premium finish', range: [330_000, 450_000], note: 'Imported finishes, feature lighting, fitted kitchen and wardrobes, smart wiring. High-end Ikoyi/Banana Island builds can exceed ₦450,000/m².' },
}

// Typical gross floor areas (m²) for common Lagos house types
export const AREAS = {
    'bungalow-2': { label: '2-bedroom bungalow', m2: 90 },
    'bungalow-3': { label: '3-bedroom bungalow', m2: 130 },
    'bungalow-4': { label: '4-bedroom bungalow', m2: 170 },
    'duplex-4': { label: '4-bedroom duplex', m2: 280 },
    'duplex-5': { label: '5-bedroom duplex', m2: 350 },
}

const roundM = n => Math.round(n / 500_000) * 500_000 // nearest ₦0.5m

/** [low, high] naira for a house type and finish level */
export function estimate(typeKey, finish = 'standard') {
    const a = AREAS[typeKey].m2
    const [lo, hi] = RATES[finish].range
    return [roundM(a * lo), roundM(a * hi)]
}

/** Table rows: type label, area, basic, standard, premium (money cells) */
export function typeRows(keys) {
    return keys.map(k => [
        `${AREAS[k].label} (~${AREAS[k].m2} m²)`,
        { ngn: estimate(k, 'basic') },
        { ngn: estimate(k, 'standard') },
        { ngn: estimate(k, 'premium') },
    ])
}

// Share of the building cost by stage (percent, low–high)
export const STAGES = [
    ['Design, approvals and site preparation', [5, 10], 'Drawings, structural design, soil test, building permit, clearing and setting out.'],
    ['Foundation', [10, 15], 'Excavation, blinding, footings or raft, foundation walls, DPC. More on waterlogged or reclaimed land.'],
    ['Frame and blockwork', [20, 30], 'Columns, beams, blockwork, lintels; for a duplex also the first-floor slab and stairs.'],
    ['Roofing', [8, 12], 'Timber or steel trusses, covering (stone-coated or aluminium), fascia and gutters.'],
    ['Services', [10, 15], 'Electrical wiring and fittings, plumbing, septic or soakaway, water storage.'],
    ['Finishing', [30, 40], 'Plaster, screed, tiles, ceilings, paint, doors, windows, sanitary ware, kitchen.'],
]

export function stageRows(typeKey, finish = 'standard') {
    const [lo, hi] = estimate(typeKey, finish)
    return STAGES.map(([name, [pLo, pHi], what]) => [
        name,
        `${pLo}–${pHi}%`,
        { ngn: [roundM(lo * pLo / 100), roundM(hi * pHi / 100)] },
        what,
    ])
}

export const PER_M2_ROWS = Object.values(RATES).map(r => [r.label, { ngn: r.range, suffix: ' per m²' }, r.note])

export const COST_DRIVERS = [
    '**Finish level.** Finishing is 30–40% of the build. The same shell can cost 50% more with premium tiles, doors and fittings.',
    '**Soil and foundation.** Reclaimed or waterlogged land (much of Lekki, Ajah and Ikoyi) may need a raft or piled foundation. A soil test before design tells you.',
    '**Location and access.** Premium Island estates add 25–40% through logistics, estate levies, working-hour limits and sand filling.',
    '**Design complexity.** Cantilevers, double-height spaces, large spans and basements need more concrete and steel.',
    '**Material prices.** Cement, rebar and roofing move with the exchange rate. We track them weekly on our [material price tracker](/news/material-prices).',
    '**Supervision and payment control.** Projects paid in inspected stages rarely suffer the waste and rework that inflate unsupervised builds.',
]

export const SOURCES = [
    { name: 'Build With Ease — Cost to build a bungalow vs duplex in Nigeria (2026)', url: 'https://buildwithease.com.ng/2026/04/25/cost-to-build-bungalow-vs-duplex-in-nigeria-2026/', date: 'updated May 2026' },
    { name: 'Prioni — Cost of building a house in Nigeria (2026)', url: 'https://www.prioni.com.ng/cost-of-building-a-house-in-nigeria/', date: 'June 2026' },
    { name: 'Nigeria Building Cost 2026 estimator', url: 'https://nigeriabuildingcost.ng/', date: '2026' },
    { name: 'Artemis Atelier material price tracker', url: '/news/material-prices', note: 'current cement, rebar, granite, sand and concrete prices' },
]
