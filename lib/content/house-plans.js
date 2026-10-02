import { AREAS, estimate } from './costs'

const fmtM = n => `₦${Math.round(n / 1e5) / 10}m`
const est = k => { const [a, b] = estimate(k, 'standard'); return `${fmtM(a)}–${fmtM(b)}` }

export const PLAN_TYPES = [
    { key: 'bungalow-2', h: '2-bedroom bungalow plan', fits: 'Half plot (≈300 m²) or more', rooms: '2 bedrooms (1 en-suite), living/dining, kitchen, guest WC' },
    { key: 'bungalow-3', h: '3-bedroom bungalow plan', fits: 'Full plot (≈600 m²)', rooms: '3 bedrooms (2 en-suite), living, dining, kitchen, store, guest WC' },
    { key: 'bungalow-4', h: '4-bedroom bungalow plan', fits: 'Full plot (≈600 m²)', rooms: '4 bedrooms en-suite, living, dining, family lounge, kitchen, store' },
    { key: 'duplex-4', h: '4-bedroom duplex plan', fits: 'Half plot upwards', rooms: 'Living, dining, kitchen, guest room downstairs; 3 bedrooms and family lounge upstairs' },
    { key: 'duplex-5', h: '5-bedroom duplex plan', fits: 'Full plot, often with BQ', rooms: '2 bedrooms down, 3 up, two living areas, kitchen, laundry; optional BQ' },
].map(p => ({ ...p, m2: AREAS[p.key].m2, cost: est(p.key) }))

export const GALLERY = [
    { src: '/31.jpg', alt: 'Residential design visual, Arepo', caption: 'Residential development, Arepo', href: '/portfolio/arepo-residential-development' },
    { src: '/33.jpg', alt: 'Residential design visual, OPIC', caption: 'Residential development, OPIC', href: '/portfolio/opic-residential-development' },
    { src: '/34.jpg', alt: 'Second residential design visual, OPIC', caption: 'Residential development, OPIC', href: '/portfolio/opic-residential-development' },
    { src: '/26.jpg', alt: 'Residential design visual, Atican Beach View Estate', caption: 'Atican Beach View Estate, Lagos', href: '/portfolio/atican-beach-view-estate-residential' },
    { src: '/30.jpg', alt: 'Completed duplex with gate and fence', caption: 'Completed duplex', href: '/portfolio' },
    { src: '/100.jpeg', alt: 'Completed home with paved courtyard', caption: 'Completed private residence', href: '/portfolio' },
]

export const PLAN_FAQS = [
    { q: 'What is included in a building plan in Nigeria?', a: 'A full set has architectural drawings (floor plans, elevations, sections, site plan), structural drawings (foundation, columns, beams, slabs, roof), and mechanical and electrical layouts. Lagos building permits need these plus the survey plan and title documents.' },
    { q: 'Can I use a ready-made house plan?', a: 'You can start from one, but a plan must be adapted to your plot’s size, orientation, setbacks and soil before it can be approved and built safely. We design every plan for the plot it will sit on.' },
    { q: 'How much does a 4-bedroom duplex plan cost to build?', a: `About ${est('duplex-4')} with standard finishes in Lagos in 2026, excluding land. See the [duplex cost guide](/guides/cost-of-building-a-duplex-in-nigeria).` },
    { q: 'Do you design modern house plans for Nigerian climates?', a: 'Yes: cross-ventilation, shaded openings, roof overhangs and rainwater drainage are part of every design, along with backup power and water storage.' },
    { q: 'Do I need approval for my building plan in Lagos?', a: 'Yes. Plans are approved by the Lagos State Physical Planning Permit Authority (LASPPPA). We prepare and submit the drawings.' },
]
