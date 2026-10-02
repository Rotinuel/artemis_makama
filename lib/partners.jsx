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
 * in your `public/` folder (e.g. public/documents/lasaco-policy.pdf) and
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
          "Our aluminium systems partner supplies and installs aluminium windows, doors and integrated spaces on Artemis Atelier projects in Lagos. Download the product catalogue.",
        protects: [
          "Windows, doors and aluminium systems are specified on the drawings and itemised in your BOQ, so you can see what you are paying for.",
          "Supply and installation come from one vetted partner, inspected at our finishing stage gate.",
          "Product information is available to you before you choose, so finishes are agreed in writing.",
        ],
        documents: [
          { name: "Simple and elegant series: product catalogue (PDF, 3 MB)", url: "/documents/aluminium-simple-elegant-series.pdf" },
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
      "Independent coverage that backs the build — the second layer of protection between a client's capital and the site.",
    partners: [
      {
        slug: "lasaco",
        name: "LASACO Assurance Plc",
        role: "Assurance Partner",
        summary:
          "Provides applicable insurance coverage for our projects under an issued policy, subject to its terms.",
        seoTitle: "LASACO Assurance: Our Insurance Partner | Artemis Atelier",
        seoDescription:
          "LASACO Assurance Plc, a NAICOM-licensed insurer, provides cover for eligible risks on Artemis Atelier construction projects, subject to the policy issued.",
        protects: [
          "Contractors' all risks: physical loss or damage to the works during construction, depending on the policy issued.",
          "Third-party / public liability: claims for injury or property damage to others arising from the site.",
          "Plant and equipment used on your site, where included in the policy.",
          "You receive the policy number, schedule and claims procedure directly from the insurer, not from us.",
        ],
        documents: [
          // { name: "Sample Policy Document", url: "/documents/lasaco-policy.pdf" },
          // { name: "Certificate of Coverage", url: "/documents/lasaco-certificate.pdf" },
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

export function getAllPartnerSlugs() {
  return partnerCategories.flatMap((c) => c.partners.map((p) => p.slug));
}