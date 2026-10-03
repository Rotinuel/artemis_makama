// ─────────────────────────────────────────────────────────────────────
// PRICES FOR THE ADVISORY SERVICES (/services/feasibility-and-cost-report etc.)
//
// While `show` is false the pages say "price on request" and no price is
// published anywhere (page, schema or llms.txt).
//
// The figures below are the ASSUMED prices from the 2026–2028 monetization
// plan. CONFIRM EACH ONE BEFORE SWITCHING `show` TO true. Prices are in
// naira; visitors can switch the display to £, $, € or C$ at the live rate.
// ─────────────────────────────────────────────────────────────────────

export const PRICING = {
    show: false,

    // Last date you checked these prices (shown next to them once live)
    reviewed: '',

    services: {
        'feasibility-and-cost-report': {
            ngn: 350_000,
            unit: 'fixed fee',
            note: 'Credited against a build contract with us if you go ahead.',
        },
        'land-title-verification': {
            ngn: 500_000,
            unit: 'fixed fee, plus registry and survey disbursements at cost',
            note: 'Disbursements are quoted before we start.',
        },
        'design-only-package': {
            ngn: [3_000_000, 8_000_000],
            unit: 'depending on size; paid 50% at brief, 50% at approval drawings',
            note: 'Quoted from your brief before any work starts.',
        },
        'build-monitoring': {
            ngn: 550_000,
            unit: 'per month (two site visits and a weekly report)',
            note: 'Billed monthly for as long as the build runs.',
            addOn: { label: 'Remote progress reporting for Artemis builds (live camera + weekly compiled report)', ngn: 150_000, unit: 'per month' },
        },
    },
}

export const priceFor = slug => (PRICING.show ? PRICING.services[slug] || null : null)
