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
        documents: [
          { name: "compressed collection of simple and elegant series", url: "/documents/compressed collection of simple and elegant series.pdf" },
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