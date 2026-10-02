// ─────────────────────────────────────────────────────────────
// Optional project details for the Portfolio pages.
//
// Each gallery category is shown as one project. The database only
// stores a name for it, so any extra details (location, year, sector…)
// live here, keyed by the category's slug (shown in
// Admin → Gallery Categories, e.g. "/marina-lodge" → 'marina-lodge').
//
// Every field is optional — anything left out is simply not shown.
// Projects with no entry still display fine.
// ─────────────────────────────────────────────────────────────

export const projectMeta = {
    // Search descriptions for the portfolio category pages (140–155 characters)
    residential: { seoDescription: 'Residential projects by Artemis Atelier in Lagos: family homes, duplexes and estates designed and built for clients in Nigeria and abroad, with photos.' },
    commercial: { seoDescription: 'Commercial buildings by Artemis Atelier in Lagos: offices, retail and mixed-use projects designed and built with open-book costs and inspected stages.' },
    public: { seoDescription: 'Public and institutional projects by Artemis Atelier, including churches and community buildings in Lagos State, from design visuals to construction.' },
    'residential-interior': { seoDescription: 'Residential interiors by Artemis Atelier in Lagos: kitchens, wardrobes, ceilings, tiling and finishes for family homes, shown in project photos.' },
    'during-construction': { seoDescription: 'Artemis Atelier building sites in Lagos during construction: foundations, frames, blockwork and roofing, photographed stage by stage for clients.' },

    // 'example-slug': {
    //     sector: 'Hospitality',
    //     location: 'Lagos, Nigeria',
    //     year: '2026',
    //     status: 'Completed',            // e.g. Completed · Under construction · Concept
    //     client: 'Private client',
    //     area: '1,250 m²',
    //     scope: 'Architecture, Interiors, Construction',
    //     summary: 'A short paragraph describing the brief, the idea and the outcome.',
    // },
}
