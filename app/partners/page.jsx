import { ArrowUpRight, Handshake } from "lucide-react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import { partnerCategories } from "../../lib/partners";

export const metadata = {
  title: "Our Partners",
  description:
    "The suppliers and insurance partner behind every Artemis Atelier project in Lagos, vetted and held to our stage-gate standards.",
  alternates: { canonical: "/partners" },
};

/**
 * Partners listing page — Artemis Atelier Ltd
 *
 * Partner data lives in lib/partners.js — edit that file to add/change
 * partners or categories. This page just renders it.
 *
 * "Learn more" on each card links to /partners/[slug], where each partner
 * gets its own page listing downloadable PDFs (see app/partners/[slug]/page.jsx).
 */

function PartnerCard({ partner }) {
  const initials = partner.name
    .split(" ")
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group relative flex flex-col justify-between rounded-sm border border-zinc-200 bg-white p-8 transition-colors duration-300 hover:border-zinc-400"
    >
      <div>
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 text-sm tracking-wide text-zinc-500">
          {initials || "AA"}
        </div>
        <h3 className="aal-serif mb-2 text-xl leading-snug text-zinc-900">
          {partner.name}
        </h3>
        <p className="aal-accent mb-4 text-xs uppercase tracking-[0.15em]">
          {partner.role}
        </p>
        <p className="text-sm leading-relaxed text-zinc-600">
          {partner.summary}
        </p>
      </div>

      <div className="aal-accent mt-8 flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] transition-transform duration-300">
        Learn more
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500&display=swap');
        .aal-serif { font-family: 'Fraunces', serif; font-weight: 500; }
        .aal-sans { font-family: 'Inter', sans-serif; }
        .aal-accent { color: #08b796; }
        .aal-accent-border-icon { border-color: #08b796; }
        .aal-cta { background-color: #08b796; }
        .aal-cta:hover { background-color: #069c80; }
      `}</style>

      <Navigation />

      <section className="aal-sans mx-auto max-w-5xl px-6 pb-16 pt-28 md:pt-36">
        <p className="aal-accent mb-6 text-xs uppercase tracking-[0.2em]">
          Partners
        </p>
        <h1 className="aal-serif max-w-3xl text-4xl leading-tight text-zinc-900 md:text-5xl">
          The names behind every layer of protection.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
          We don't build alone, and we don't ask you to trust us alone
          either. Every partner listed here has been vetted and folded into
          our process — from the materials that go into your walls to the
          policy that backs the build. This list grows as our network does.
        </p>
      </section>

      <section className="aal-sans mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
          {partnerCategories.map((category, i) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={`${
                  i !== 0
                    ? "border-t border-zinc-200 pt-12 md:border-t-0 md:border-l md:pt-0 md:pl-10"
                    : ""
                }`}
              >
                <div className="mb-8 flex items-start gap-4">
                  <div className="aal-accent-border-icon mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-[#08b796]">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="aal-serif mb-2 text-2xl text-zinc-900">
                      {category.label} Partners
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2">
                  {category.partners.map((partner) => (
                    <PartnerCard key={partner.slug} partner={partner} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="aal-sans mx-auto max-w-5xl border-t border-zinc-200 px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-sm border border-zinc-200 bg-zinc-50 p-10 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <Handshake
              className="aal-accent mt-1 h-6 w-6 shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="aal-serif mb-2 text-xl text-zinc-900 md:text-2xl">
                Become a partner
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-zinc-600">
                We're building this network deliberately, one vetted
                relationship at a time. If your firm belongs here, we'd like
                to hear from you.
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="aal-cta shrink-0 whitespace-nowrap px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition-colors duration-300"
          >
            Get in touch
          </a>
        </div>
      </section>
    </main>
  );
}



// import { Building2, ShieldCheck, ArrowUpRight, Handshake } from "lucide-react";
// import Navigation from "../components/Navigation";

// /**
//  * Partners page — Artemis Atelier Ltd
//  *
//  * Drop into e.g. app/partners/page.jsx (App Router) or pages/partners.jsx (Pages Router).
//  * If using the App Router, this can stay a server component as-is — no client state is used.
//  *
//  * TO ADD A NEW PARTNER CATEGORY LATER:
//  * Just push a new object into `partnerCategories` below, with its own `icon`.
//  * TO ADD A NEW PARTNER TO AN EXISTING CATEGORY:
//  * Push a new object into that category's `partners` array.
//  */

// const partnerCategories = [
//     {
//         id: "construction-procurement",
//         label: "Construction & Procurement",
//         icon: Building2,
//         description:
//             "The firms who supply and build alongside us — vetted for quality, held to our stage-gate standards, and accountable for every line item in the open-book BOQ.",
//         partners: [
//             {
//                 name: "High-End All-Aluminium Integrated Space",
//                 role: "Construction & Procurement Partner",
//                 summary:
//                     "Placeholder description — supplies and installs high-spec aluminium systems as part of our vetted construction and procurement network.",
//                 href: "#",
//             },
//             // Add the next construction & procurement partner here.
//         ],
//     },
//     {
//         id: "assurance",
//         label: "Assurance",
//         icon: ShieldCheck,
//         description:
//             "Independent coverage that backs the build — the second layer of protection between a client's capital and the site.",
//         partners: [
//             {
//                 name: "",
//                 role: "Assurance Partner",
//                 summary:
//                     "Placeholder description — provides applicable insurance coverage for projects under an issued policy, subject to its terms.",
//                 href: "#",
//             },
//             // Add the next assurance partner here.
//         ],
//     },
//     // Add the next partner category here, e.g. { id: "design", label: "Design & Consulting", icon: ..., partners: [...] }
// ];

// function PartnerCard({ partner }) {
//     const initials = partner.name
//         .split(" ")
//         .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
//         .slice(0, 2)
//         .map((w) => w[0])
//         .join("")
//         .toUpperCase();

//     return (
//         <a
//             href={partner.href || "#"}
//             className="group relative flex flex-col justify-between rounded-sm border border-zinc-200 bg-white p-8 transition-colors duration-300 hover:border-zinc-400"
//         >
//             <div>
//                 <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 text-sm tracking-wide text-zinc-500">
//                     {initials || "AA"}
//                 </div>
//                 <h3 className="aal-serif mb-2 text-xl leading-snug text-zinc-900">
//                     {partner.name}
//                 </h3>
//                 <p className="aal-accent mb-4 text-xs uppercase tracking-[0.15em]">
//                     {partner.role}
//                 </p>
//                 <p className="text-sm leading-relaxed text-zinc-600">
//                     {partner.summary}
//                 </p>
//             </div>

//             <div className="aal-accent mt-8 flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] transition-transform duration-300">
//                 Learn more
//                 <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//             </div>
//         </a>
//     );
// }

// export default function PartnersPage() {
//     return (
//         <main className="min-h-screen bg-white text-zinc-900">

//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500&display=swap');
//         .aal-serif { font-family: 'Fraunces', serif; font-weight: 500; }
//         .aal-sans { font-family: 'Inter', sans-serif; }
//         .aal-accent { color: #08b796; }
//         .aal-accent-border-icon { border-color: #08b796; }
//         .aal-cta { background-color: #08b796; }
//         .aal-cta:hover { background-color: #069c80; }
//       `}</style>

//             <Navigation />
//             <section className="aal-sans mx-auto max-w-5xl px-6 pb-16 pt-28 md:pt-36">
//                 <p className="aal-accent mb-6 text-xs uppercase tracking-[0.2em]">
//                     Partners
//                 </p>
//                 <h1 className="aal-serif max-w-3xl text-4xl leading-tight text-zinc-900 md:text-5xl">
//                     The names behind every layer of protection.
//                 </h1>
//                 <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
//                     We don't build alone, and we don't ask you to trust us alone
//                     either. Every partner listed here has been vetted and folded into
//                     our process — from the materials that go into your walls to the
//                     policy that backs the build. This list grows as our network does.
//                 </p>
//             </section>

//             <section className="aal-sans mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16">
//                 <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
//                     {partnerCategories.map((category, i) => {
//                         const Icon = category.icon;
//                         return (
//                             <div
//                                 key={category.id}
//                                 className={`${i !== 0 ? "border-t border-zinc-200 pt-12 md:border-t-0 md:border-l md:pt-0 md:pl-10" : ""
//                                     }`}
//                             >
//                                 <div className="mb-8 flex items-start gap-4">
//                                     <div className="aal-accent-border-icon mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-[#08b796]">
//                                         <Icon className="h-4 w-4" strokeWidth={1.5} />
//                                     </div>
//                                     <div>
//                                         <h2 className="aal-serif mb-2 text-2xl text-zinc-900">
//                                             {category.label} Partners
//                                         </h2>
//                                         <p className="text-sm leading-relaxed text-zinc-600">
//                                             {category.description}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2">
//                                     {category.partners.map((partner) => (
//                                         <PartnerCard key={partner.name} partner={partner} />
//                                     ))}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </section>

//             <section className="aal-sans mx-auto max-w-5xl border-t border-zinc-200 px-6 py-20">
//                 <div className="flex flex-col items-start justify-between gap-6 rounded-sm border border-zinc-200 bg-zinc-50 p-10 md:flex-row md:items-center">
//                     <div className="flex items-start gap-4">
//                         <Handshake
//                             className="aal-accent mt-1 h-6 w-6 shrink-0"
//                             strokeWidth={1.5}
//                         />
//                         <div>
//                             <h3 className="aal-serif mb-2 text-xl text-zinc-900 md:text-2xl">
//                                 Become a partner
//                             </h3>
//                             <p className="max-w-md text-sm leading-relaxed text-zinc-600">
//                                 We're building this network deliberately, one vetted
//                                 relationship at a time. If your firm belongs here, we'd like
//                                 to hear from you.
//                             </p>
//                         </div>
//                     </div>
//                     <a
//                         href="/contact"
//                         className="aal-cta shrink-0 whitespace-nowrap px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition-colors duration-300"
//                     >
//                         Get in touch
//                     </a>
//                 </div>
//             </section>
//         </main>
//     );
// }
