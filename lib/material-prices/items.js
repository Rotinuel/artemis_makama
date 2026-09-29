// Materials and cities shown in the price board.
// Edit names/specs/units here — `key` values are stored in the database,
// so don't rename a key once prices exist for it.

export const MATERIALS = [
    { key: 'cement', name: 'Cement', spec: '50kg bag, 42.5 grade (Dangote/BUA/Lafarge)', unit: 'bag' },
    { key: 'rebar', name: 'Rebar (iron rods)', spec: '12mm high-yield, per tonne', unit: 'tonne' },
    { key: 'granite', name: 'Granite', spec: '¾-inch crushed granite, per tonne', unit: 'tonne' },
    { key: 'sharp_sand', name: 'Sharp sand', spec: 'Sharp/river sand, per tonne', unit: 'tonne' },
    { key: 'aggregate', name: 'Aggregate (gravel)', spec: 'Coarse aggregate / gravel, per tonne', unit: 'tonne' },
    { key: 'rmc', name: 'Ready-mix concrete', spec: 'Grade C25, delivered, per cubic metre', unit: 'm³' },
]

export const CITIES = ['Lagos', 'Abuja', 'Port Harcourt']

// Ignore suggested changes smaller than this (as a fraction)
export const CHANGE_THRESHOLD = 0.01

export const materialByKey = Object.fromEntries(MATERIALS.map(m => [m.key, m]))

export function formatNaira(n) {
    if (n == null || !isFinite(n)) return '—'
    return '₦' + Math.round(n).toLocaleString('en-NG')
}

export function formatRange(min, max) {
    if (min == null) return '—'
    if (max == null || Math.round(max) === Math.round(min)) return formatNaira(min)
    return `${formatNaira(min)} – ${formatNaira(max).replace('₦', '')}`
}

export const midpoint = r => (r.price_max != null ? (Number(r.price_min) + Number(r.price_max)) / 2 : Number(r.price_min))
