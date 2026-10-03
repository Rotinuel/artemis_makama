import { costHub, duplexGuide, bungalowGuide, housePriceGuide } from './guides-cost'
import { landGuide, scamsGuide, remoteGuide } from './guides-diaspora'
import { chooseContractorGuide, lagosCompaniesGuide, abujaCompaniesGuide } from './guides-contractor'

// Every guide under /guides/<slug>, grouped for the guides index
export const GUIDE_GROUPS = [
    { title: 'What it costs', guides: [costHub, duplexGuide, bungalowGuide, housePriceGuide] },
    { title: 'Building from abroad', guides: [landGuide, scamsGuide, remoteGuide] },
    { title: 'Choosing who builds', guides: [chooseContractorGuide, lagosCompaniesGuide, abujaCompaniesGuide] },
]

export const GUIDES = GUIDE_GROUPS.flatMap(g => g.guides)

// A short pointer at the end of each guide to the matching fixed-fee
// advisory service (lib/content/services-advisory.js)
const ADVISORY_POINTERS = {
    '/guides/cost-of-building-a-house-in-nigeria': 'Want these numbers worked out for your own plot? Our [feasibility and cost report](/services/feasibility-and-cost-report) gives you a written cost range, stage budget and timeline before you commit.',
    '/guides/cost-of-building-a-duplex-in-nigeria': 'Want a costed plan for your own duplex? Ask for a [feasibility and cost report](/services/feasibility-and-cost-report).',
    '/guides/cost-of-building-a-bungalow-in-nigeria': 'Want a costed plan for your own bungalow? Ask for a [feasibility and cost report](/services/feasibility-and-cost-report).',
    '/guides/how-much-is-a-house-in-nigeria': 'Deciding between buying and building? A [feasibility and cost report](/services/feasibility-and-cost-report) prices the build on your plot so you can compare.',
    '/guides/buying-land-in-nigeria-from-abroad': 'We can do these checks for you: [land title verification](/services/land-title-verification) covers the registry search, survey charting, a site visit and a written report.',
    '/guides/property-scams-in-nigeria-to-avoid': 'Already building with someone else? Our [independent construction monitoring](/services/build-monitoring) checks each stage before you pay. Buying land? Start with [land title verification](/services/land-title-verification).',
    '/guides/managing-a-build-in-nigeria-from-abroad': 'Building with another contractor? We can be your eyes on site with [independent construction monitoring](/services/build-monitoring): site visits, stage checks and weekly reports.',
    '/guides/how-to-choose-a-building-contractor-in-nigeria': 'Have drawings but want to choose your own builder? Our [design-only package](/services/design-only-package) and [construction monitoring](/services/build-monitoring) work with any contractor.',
}
for (const g of GUIDES) {
    const text = ADVISORY_POINTERS[g.path]
    if (text && !g.blocks.some(b => b.advisory)) g.blocks = [...g.blocks, { t: 'callout', text, advisory: true }]
}

export const guideSlug = g => g.path.replace('/guides/', '')
export const guideBySlug = slug => GUIDES.find(g => guideSlug(g) === slug) || null
