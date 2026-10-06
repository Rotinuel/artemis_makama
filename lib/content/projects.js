// ─────────────────────────────────────────────────────────────────────
// Named project pages: /portfolio/<slug>
// The homepage "Project Stories" cards link here.
//
// Fill in the empty facts (year, size, duration, client type, scope) as
// you confirm them — empty fields are not shown. Add stage photos to
// `images` (files in /public) with a caption and date.
//
// CASE STUDY (optional, shown only when filled — real facts only):
//   budgetBand: 'Between ₦60m and ₦90m'   (a band is fine; no exact figure needed)
//   completed:  '2025-11'                  (month the keys were handed over)
//   brief:      'What the client wanted and any constraints (plot, budget, time).'
//   approach:   'What we did: design choices, how it was staged and reported.'
//   result:     'What was delivered: on time? on budget? anything notable.'
//   review:     { quote: '…', name: 'Ada O.', location: 'London, UK' }   (with permission)
// A project with `completed` set is labelled "Completed" on its page.
// ─────────────────────────────────────────────────────────────────────

export const PROJECTS = [
    {
        slug: 'atican-beach-view-estate-residential',
        name: 'Residential Development at Atican Beach View Estate',
        type: 'Residential',
        location: 'Atican Beach View Estate, Lagos',
        status: 'Design and construction',
        year: '', size: '', duration: '', clientType: '', scope: 'Architecture and construction',
        summary: 'A residential development inside Atican Beach View Estate, Lagos, taken from design visuals through construction.',
        images: [
            { src: '/26.jpg', alt: 'Design visual of the residential development at Atican Beach View Estate', caption: 'Design visual' },
            { src: '/32-atican.jpg', alt: 'Residential development at Atican Beach View Estate during construction', caption: 'On site' },
        ],
        keywords: ['residential development Lagos', 'house design in Nigeria'],
    },
    {
        slug: 'arepo-residential-development',
        name: 'Proposed Residential Development at Arepo',
        type: 'Residential',
        location: 'Arepo, Ogun State',
        status: 'Design (proposed)',
        year: '', size: '', duration: '', clientType: '', scope: 'Architectural design',
        summary: 'A proposed residential development at Arepo, on the Lagos–Ibadan corridor, designed by Artemis Atelier.',
        images: [{ src: '/31.jpg', alt: 'Design visual of the proposed residential development at Arepo', caption: 'Design visual' }],
        keywords: ['duplex house design in Nigeria'],
    },
    {
        slug: 'opic-residential-development',
        name: 'Proposed Residential Development at OPIC',
        type: 'Residential',
        location: 'OPIC, Ogun State',
        status: 'Design (proposed)',
        year: '', size: '', duration: '', clientType: '', scope: 'Architectural design',
        summary: 'Proposed homes at OPIC, designed by Artemis Atelier, shown here in design visuals.',
        images: [
            { src: '/33.jpg', alt: 'Design visual of the proposed residential development at OPIC', caption: 'Design visual' },
            { src: '/34.jpg', alt: 'Second design visual of the proposed residential development at OPIC', caption: 'Design visual' },
        ],
        keywords: ['house design in Nigeria'],
    },
    {
        slug: 'epe-catholic-church-complex',
        name: 'Proposed Catholic Church Complex at Epe',
        type: 'Religious',
        location: 'Epe, Lagos State',
        status: 'Design (proposed)',
        year: '', size: '', duration: '', clientType: 'Church', scope: 'Architectural design',
        summary: 'A proposed Catholic church complex at Epe, Lagos State, designed by Artemis Atelier.',
        images: [
            { src: '/36.jpg', alt: 'Design visual of the proposed Catholic church complex at Epe', caption: 'Design visual' },
            { src: '/44.jpg', alt: 'Second design visual of the proposed Catholic church complex at Epe', caption: 'Design visual' },
        ],
        keywords: ['church design Nigeria'],
    },
    {
        slug: 'ikoyi-residential-development',
        name: 'Residential Development at Ikoyi',
        type: 'Residential',
        location: 'Ikoyi, Lagos',
        status: '',
        year: '', size: '', duration: '', clientType: '', scope: '',
        summary: 'A residential development in Ikoyi, Lagos.',
        images: [{ src: '/38.jpg', alt: 'Residential development at Ikoyi, Lagos', caption: '' }],
        keywords: ['residential development ikoyi'],
    },
]

export const projectBySlug = slug => PROJECTS.find(p => p.slug === slug) || null

export const PROJECT_FACTS = [
    ['type', 'Type'], ['location', 'Location'], ['status', 'Stage'], ['year', 'Year'],
    ['size', 'Size'], ['duration', 'Duration'], ['clientType', 'Client'], ['scope', 'Our scope'],
    ['completed', 'Handed over'], ['budgetBand', 'Budget'],
]
