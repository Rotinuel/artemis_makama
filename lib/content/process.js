import { STAGES } from './costs'

// Stage gates used on /how-we-build. "Share" is the typical share of the
// build cost (from the cost model), not a contract payment term — your
// signed contract's payment schedule is what applies.
const GATES = [
    { stage: 'Mobilisation and setting out', checks: 'Plot boundaries, building position and levels match the approved drawings.', evidence: 'Setting-out photos, survey beacons, inspector’s sign-off.' },
    { stage: 'Foundation', checks: 'Excavation depth, rebar size and spacing, concrete grade (cube test samples), DPC.', evidence: 'Photos before every concrete pour, cube test results.' },
    { stage: 'Frame and blockwork', checks: 'Column and beam reinforcement, block quality, wall alignment, lintels; for a duplex the first-floor slab.', evidence: 'Pre-pour checks, block samples, slab inspection.' },
    { stage: 'Roof', checks: 'Truss sizes and fixings, covering, flashing and gutters; building watertight.', evidence: 'Roof inspection report, drone or walk-round video.' },
    { stage: 'Services', checks: 'Electrical wiring and earthing, plumbing pressure test, drainage falls, septic/soakaway.', evidence: 'Test certificates and photos before walls are closed.' },
    { stage: 'Finishing and handover', checks: 'Plaster, tiling, ceilings, joinery, fittings, snag list cleared.', evidence: 'Snag list, as-built drawings, warranties, keys.' },
]

export const howWeBuild = {
    kind: 'page',
    path: '/how-we-build',
    title: 'How We Build: Stage Payments & Inspections | Artemis Atelier',
    description: 'How to build a house in Nigeria with us: the steps, what our inspectors check before each payment, the documents you get and how long it takes.',
    breadcrumbs: [{ name: 'How we build', path: '/how-we-build' }],
    eyebrow: 'Our process',
    h1: 'How we build: every stage checked before you pay for the next',
    intro: 'We build in **six stages**. At the end of each one **our inspection team** checks the work against the drawings, you see the evidence, and only then is the **next stage payment** due. Costs are in an **open-book bill of quantities**, and you can watch the site on a **live camera** throughout.',
    updated: '2026-10-02',
    hero: '/7.jpg',
    heroAlt: 'Building frame and blockwork under construction',
    whatsappText: 'Hi Artemis, I would like your sample milestone schedule.',
    blocks: [
        { t: 'h2', text: 'The steps, from first call to keys' },
        { t: 'steps', items: [
            { h: 'Free consultation', p: 'By video call or WhatsApp at a time that suits your time zone: your plot, budget and timeline.' },
            { h: 'Site and land assessment', p: 'We check the plot, access and soil, and work with your lawyer on the title. See [buying land from abroad](/guides/buying-land-in-nigeria-from-abroad).' },
            { h: 'Design and approvals', p: 'Architectural and structural drawings, then the building permit application.' },
            { h: 'Open-book BOQ and contract', p: 'An itemised bill of quantities, a stage payment schedule and an inspection plan, all in a written contract.' },
            { h: 'Build in six inspected stages', p: 'Each stage is inspected and evidenced before the next payment is due (details below).' },
            { h: 'Handover and defects period', p: 'Keys, as-built drawings, electrical and plumbing layouts, structural certificates and a 6–12 month defects liability period.' },
        ] },
        { t: 'h2', text: 'The stage gates' },
        { t: 'p', text: 'This is what is checked at each gate and what you receive as evidence. The share column shows how a typical build budget splits across stages; your contract sets the actual payment schedule.' },
        { t: 'table', caption: 'Stage gates and what is inspected', head: ['Stage', 'What the inspector checks', 'Evidence you receive'], rows: GATES.map(g => [g.stage, g.checks, g.evidence]) },
        { t: 'table', caption: 'Typical share of the build cost by stage', head: ['Stage', 'Typical share of build cost'], rows: STAGES.map(([name, [a, b]]) => [name, `${a}–${b}%`]), note: 'From our [2026 cost guide](/guides/cost-of-building-a-house-in-nigeria).' },
        { t: 'node', key: 'trust' },
        { t: 'h2', text: 'What you see while we build' },
        { t: 'checklist', items: [
            '**Live site camera** you can open on your phone.',
            '**Weekly reports** with dated photos and the plan for next week.',
            '**Inspection reports** at each stage gate.',
            '**Drone or walk-round video** at key milestones.',
            '**Your private client portal** with stages, payments, documents, updates, the camera and a defect request form.',
        ] },
        { t: 'h2', text: 'How long it takes' },
        { t: 'table', caption: 'Typical timelines', head: ['Project', 'Typical time from approval to handover'], rows: [
            ['2- or 3-bedroom bungalow', '6–12 months'],
            ['4-bedroom bungalow', '8–12 months'],
            ['4- or 5-bedroom duplex', '12–24 months'],
            ['Renovation', 'Weeks to months, depending on scope'],
        ], note: 'Steady funding of each stage is the biggest factor in keeping to time.' },
        { t: 'h2', text: 'Building contract essentials' },
        { t: 'p', text: 'Every project has a written contract that attaches the drawings and BOQ and sets out: the stage payment schedule, the inspection at each gate, the programme, how changes (variations) are priced and approved, insurance, the defects liability period, and how disputes are resolved.' },
    ],
    faqs: [
        { q: 'What are the steps to building a house in Nigeria?', a: 'Verify the land, survey and soil test, design and permit, BOQ and contract, then build in stages (foundation, frame, roof, services, finishing) with an inspection before each payment, and hand over with documents and a defects period.' },
        { q: 'How long does it take to build a house in Nigeria?', a: 'Typically 6–12 months for a bungalow and 12–24 months for a duplex from approval to handover.' },
        { q: 'Who inspects the work?', a: 'Our inspection team, led by Chief Chinedu Makama (MBA) with adjunct inspectors Owoyomi Adedoja (BSc) and Olasunkanmi Oladiran, checks each stage against the drawings before the next payment is released, and you receive the report. You are welcome to appoint an independent inspector as well.' },
        { q: 'What should a building contract in Nigeria include?', a: 'Scope with drawings and BOQ, stage payment schedule, inspections, programme, variation procedure, insurance, defects liability period and dispute resolution.' },
    ],
    related: [
        { label: 'Build from abroad', href: '/build-from-abroad', text: 'How we run projects for clients overseas.' },
        { label: 'Cost of building a house in Nigeria', href: '/guides/cost-of-building-a-house-in-nigeria', text: 'What each stage costs in 2026.' },
        { label: 'How to choose a building contractor', href: '/guides/how-to-choose-a-building-contractor-in-nigeria', text: 'Checks and questions for any builder.' },
        { label: 'Our projects', href: '/portfolio', text: 'Homes, estates and churches we have designed and built.' },
    ],
    cta: { title: 'Request a sample milestone schedule', text: 'See exactly how a project like yours would be staged, inspected and paid.', label: 'Request a sample schedule', href: '/build-from-abroad#book' },
    consult: { title: 'Request a sample milestone schedule', text: 'Ask on a free call and we’ll walk you through one for a project like yours.', primary: { label: 'Book a call', href: '/build-from-abroad#book' } },
}

export const buildFromAbroadFaqs = [
    { q: 'Can I build a house in Nigeria while living in the UK, US or Canada?', a: 'Yes. Most of our diaspora clients never need to be on site. You approve the design and BOQ on video calls, pay per inspected stage, and follow the build through a live camera, weekly reports and your client portal.' },
    { q: 'Will you disappear with my money?', a: 'You never pay ahead of the work. Each payment covers one stage and is only due after our inspection team has checked the previous stage, and you can appoint an independent inspector too. We are a registered company (RC 1484495) with an office you can visit at 70B Olorunlogbon Street, Anthony Village, Lagos.' },
    { q: 'Will you inflate the cost of materials?', a: 'Our BOQ is open-book: every bag of cement and tonne of rebar is itemised so you can compare it with market prices on our [material price tracker](/news/material-prices).' },
    { q: 'How do I know the project is really progressing?', a: 'A live site camera you can open any time, dated weekly photo reports, inspection reports at each stage and video walk-rounds.' },
    { q: 'How much does it cost to build a house in Nigeria?', a: 'Roughly ₦150,000–₦450,000 per m² in Lagos in 2026, excluding land. See our [cost guide](/guides/cost-of-building-a-house-in-nigeria) in naira, pounds and dollars.' },
    { q: 'Can you help me check land before I buy?', a: 'Yes. We assess the plot, soil and access and work alongside your lawyer on the title. See [buying land from abroad](/guides/buying-land-in-nigeria-from-abroad).' },
    { q: 'Which time zones do you work with?', a: 'All of them. We book calls Monday to Saturday, 09:00–17:00 Lagos time: mornings and early afternoons in London, early mornings in New York and Toronto, and evenings in Sydney.' },
]

export const homeFaqs = [
    { q: 'What does Artemis Atelier do?', a: 'We are a Lagos design and construction firm (RC 1484495, since 2010). We design, build and renovate homes, estates, churches and commercial buildings, many for clients living abroad.' },
    { q: 'How much does it cost to build a house in Lagos?', a: 'About ₦150,000–₦450,000 per m² in 2026, excluding land, depending on finishes. See our [2026 cost guide](/guides/cost-of-building-a-house-in-nigeria).' },
    { q: 'Can I build in Nigeria from abroad?', a: 'Yes. Payments are released per inspected stage, costs are open-book, and you follow progress through a live camera and weekly reports. See [build from abroad](/build-from-abroad).' },
    { q: 'How do you protect my money?', a: 'Stage payments released after each stage is inspected, an itemised BOQ, insurance cover arranged with a licensed insurer where agreed (subject to policy terms), and a written contract. See [how we build](/how-we-build).' },
    { q: 'Where do you work?', a: 'Across Lagos and nearby Ogun State, from our studio in Anthony Village, Lagos.' },
    { q: 'How do I start?', a: 'Book a free 20-minute consultation by video call or WhatsApp at a time that suits your time zone.' },
]
