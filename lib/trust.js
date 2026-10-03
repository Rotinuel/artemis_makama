// ─────────────────────────────────────────────────────────────────────
// FACTS ONLY ARTEMIS CAN PROVIDE
//
// Fill these in as you gather them. Anything left empty ('' / null / [])
// is simply NOT shown on the website — nothing is invented or faked.
// Each item says where it appears. Ask your developer to redeploy (or
// just save the file in dev) after editing.
// ─────────────────────────────────────────────────────────────────────

export const TRUST = {
    // ── Our inspection team (How we build, Build from abroad, People, homepage) ──
    // These are Artemis staff, so the site calls them "our inspection team",
    // never "independent".
    inspectionTeam: [
        { name: 'Chief Chinedu Edward Makama', credentials: 'MBA', role: 'Lead inspector' },
        { name: 'Owoyomi Adedoja', credentials: 'BSc', role: 'Adjunct inspector' },
        { name: 'Olasunkanmi Oladiran', credentials: 'Esq.', role: 'Adjunct inspector' },
    ],

    // ── Independent third-party inspector (optional, shown alongside the team) ──
    // Only fill this with a firm that is NOT part of Artemis and has agreed to be named.
    // Once filled, it is listed as "Independent inspector" on How we build,
    // Build from abroad and People. Until then those pages say clients can
    // appoint an independent inspector of their own.
    // e.g. { name: 'Engr. A. B. Example', firm: 'Example Consulting Engineers', registration: 'COREN R.12345', url: 'https://…' }
    inspector: null,

    // ── Professional registrations (People, About, schema) ──
    // Shown with a link to the public register so visitors can check them.
    // Add the lead architect's ARCON number here too once you have it.
    registrations: [
        { person: 'Engr. Utibe Collins Nneke', body: 'COREN', number: 'R.74112', verifyUrl: 'https://www.coren.gov.ng/' },
    ],

    // ── Lead architect (People page — the page says "architects") ──
    // e.g. { name: 'Arc. Example Name', arcon: 'ARCON A1234', nia: 'MNIA' }
    leadArchitect: null,

    // ── Who checked the cost guides (byline on every guide) ──
    // Set to null to sign guides "Artemis Atelier editorial team" instead.
    guideReviewer: { name: 'Chief Chinedu Edward Makama', credentials: 'MBA, Managing Director', url: '/people' },

    // ── Client testimonials (homepage, Build from abroad) ──
    // Real clients only, with permission. Review schema is only added for these.
    // e.g. { quote: '…', name: 'Ada O.', location: 'London, UK', project: '4-bed duplex, Lekki', year: '2025', rating: 5 }
    testimonials: [],

    // ── Google Business Profile (contact page, footer, schema sameAs) ──
    googleBusinessProfileUrl: '',

    // ── Office location for schema (exact coordinates from Google Maps) ──
    // e.g. { latitude: 6.5591, longitude: 3.3721 }
    geo: null,

    // ── Documents that prove the promises (How we build, LASACO page) ──
    // Put PDFs in /public/documents/ and give the path, e.g. '/documents/sample-milestone-schedule.pdf'
    sampleMilestoneScheduleUrl: '',
    contractExcerptUrl: '',          // redacted contract / BOQ excerpt
    insuranceCertificateUrl: '',     // redacted LASACO certificate

    // ── Headline numbers (People page) ──
    // Shown only when evidenceUrl points to a list that backs them up.
    stats: {
        projectsDelivered: { value: '120+', evidenceUrl: '' },
        countriesServed: { value: '4', countries: [], evidenceUrl: '' },
    },

    // ── Team bios (People page). Key = name exactly as on the People page ──
    // Real bios with qualifications and project history.
    bios: {
        // 'Chief Chinedu Edward Makama MBA': '…',
    },

    // ── Dated office / site photos (Contact, About) ──
    // e.g. { src: '/office-2026.jpg', alt: 'Our Anthony Village studio', date: '2026-09' }
    officePhotos: [],
}

export const hasTrust = key => {
    const v = TRUST[key]
    if (Array.isArray(v)) return v.length > 0
    return !!v
}
