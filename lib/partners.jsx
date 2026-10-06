import { Building2, ShieldCheck } from "lucide-react";

/**
 * Single source of truth for partner data.
 * Used by:
 *  - app/partners/page.jsx            (the listing/grid page)
 *  - app/partners/[slug]/page.jsx     (each partner's detail page with PDFs)
 *
 * TO ADD A NEW PARTNER CATEGORY LATER:
 * Push a new object into `partnerCategories`, with its own `icon`.
 *
 * TO ADD A NEW PARTNER TO AN EXISTING CATEGORY:
 * Push a new object into that category's `partners` array. Give it a unique
 * `slug` — that's what builds the URL at /partners/[slug].
 *
 * TO ATTACH DOWNLOADABLE PDFs TO A PARTNER:
 * Add entries to that partner's `documents` array. Put the actual PDF files
 * in your `public/` folder (e.g. public/documents/insurer-policy.pdf) and
 * reference them here with a path starting at "/".
 */

export const partnerCategories = [
  {
    id: "construction-procurement",
    label: "Construction & Procurement",
    icon: Building2,
    description:
      "The firms who supply and build alongside us — vetted for quality, held to our stage-gate standards, and accountable for every line item in the open-book BOQ.",
    partners: [
      {
        slug: "high-end-all-aluminium-integrated-space",
        name: "High-End All-Aluminium Integrated Space",
        role: "Construction & Procurement Partner",
        summary:
          "Supplies and installs high-spec aluminium systems as part of our vetted construction and procurement network.",
        seoTitle: "Aluminium Windows & Doors Partner | Artemis Atelier",
        seoDescription:
          "Our aluminium partner supplies and installs windows, doors and integrated aluminium spaces on Artemis Atelier projects in Lagos. Download the catalogue.",
        protects: [
          "Windows, doors and aluminium systems are specified on the drawings and itemised in your BOQ, so you can see what you are paying for.",
          "Supply and installation come from one vetted partner, inspected at our finishing stage gate.",
          "Product information is available to you before you choose, so finishes are agreed in writing.",
        ],
        documents: [
          { name: "Simple and elegant series: product catalogue (PDF, under 1 MB)", url: "/documents/aluminium-simple-elegant-series.pdf" },
          // { name: "Product Specification Sheet", url: "/documents/haas-spec-sheet.pdf" },
        ],
      },
      // Add the next construction & procurement partner here.
    ],
  },
  {
    id: "assurance",
    label: "Assurance",
    icon: ShieldCheck,
    description:
      "Insurance cover that backs the build: the second layer of protection between a client's capital and the site.",
    partners: [
      // Insurance: no fixed partner. The client picks any insurer licensed by
      // NAICOM (National Insurance Commission) and the policy is in their name.
      {
        slug: "choose-your-insurer",
        insurance: true,
        name: "Your choice of NAICOM-licensed insurer",
        role: "Insurance: you choose the insurer",
        summary:
          "You choose the insurance company from NAICOM's list of licensed insurers. We give them the drawings, BOQ and programme they need to quote, and the policy is issued in your name.",
        seoTitle: "Choose Your Own NAICOM-Licensed Insurer | Artemis Atelier",
        seoDescription:
          "On Artemis Atelier projects you choose the insurer from NAICOM's list of licensed companies. We supply the drawings and BOQ; the policy is in your name.",
        links: [
          { name: "NAICOM: check that an insurer is licensed", url: 'https://www.naicom.gov.ng/' },
        ],
        steps: [
          "Pick any insurer on NAICOM's list of licensed companies (or ask us for a shortlist to compare).",
          "We send them the drawings, BOQ, programme and site details so they can quote.",
          "You agree the cover and premium directly with the insurer; the policy is issued in your name.",
          "We add the policy details to your contract and client portal before work starts.",
        ],
        protects: [
          "Contractors' all risks: physical loss or damage to the works during construction, where included in the policy issued.",
          "Third-party / public liability: claims for injury or property damage to others arising from the site.",
          "Plant and equipment used on your site, where included in the policy.",
          "You receive the policy number, schedule and claims procedure directly from the insurer, not from us.",
        ],
        documents: [
          // { name: "Sample policy schedule (redacted)", url: "/documents/sample-policy.pdf" },
        ],
      },
      // Add the next assurance partner here.
    ],
  },
  // Add the next partner category here, e.g. { id: "design", label: "Design & Consulting", icon: ..., partners: [...] }
];

// Flat lookup helper used by the [slug] detail page.
export function getPartnerBySlug(slug) {
  for (const category of partnerCategories) {
    const found = category.partners.find((p) => p.slug === slug);
    if (found) return { ...found, category };
  }
  return null;
}

// Partner pages that should appear in the sitemap (placeholders are left out)
export function getIndexablePartnerSlugs() {
  return partnerCategories.flatMap((c) => c.partners.filter((p) => !p.placeholder).map((p) => p.slug));
}

export function getAllPartnerSlugs() {
  return partnerCategories.flatMap((c) => c.partners.map((p) => p.slug));
}