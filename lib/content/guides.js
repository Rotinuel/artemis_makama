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

export const guideSlug = g => g.path.replace('/guides/', '')
export const guideBySlug = slug => GUIDES.find(g => guideSlug(g) === slug) || null
