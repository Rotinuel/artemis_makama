import DiasporaConsultationClient from './DiasporaConsultationClient'

const SITE_URL = 'https://artemisatelier.com' // update to your real domain
const PAGE_PATH = '/diaspora-consultation'

export const metadata = {
    title: 'Build Your Home in Nigeria From Abroad | Free Consultation — Artemis Atelier',
    description:
        'Nigerians in the diaspora: build your dream home in Nigeria with documented milestones, independent inspection, insured payments and weekly progress reports. Book a free 20-minute consultation.',
    alternates: {
        canonical: `${SITE_URL}${PAGE_PATH}`,
    },
    openGraph: {
        title: 'Build Your Home in Nigeria — Without Living in Nigeria',
        description:
            'Documented milestones, independent inspection and insured payments — monitor your Nigerian construction project from anywhere. Book a free consultation.',
        url: `${SITE_URL}${PAGE_PATH}`,
        siteName: 'Artemis Atelier Ltd',
        images: [
            {
                url: `${SITE_URL}/51.jpg`,
                width: 1200,
                height: 630,
                alt: 'Artemis Atelier construction project',
            },
        ],
        locale: 'en_NG',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Build Your Home in Nigeria — Without Living in Nigeria',
        description:
            'Documented milestones, independent inspection and insured payments. Book a free diaspora consultation with Artemis Atelier.',
        images: [`${SITE_URL}/51.jpg`],
    },
    robots: {
        index: true,
        follow: true,
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Diaspora Construction Project Management',
    provider: {
        '@type': 'GeneralContractor',
        name: 'Artemis Atelier Ltd',
        url: SITE_URL,
    },
    areaServed: {
        '@type': 'Country',
        name: 'Nigeria',
    },
    audience: {
        '@type': 'Audience',
        audienceType: 'Nigerians living abroad planning to build property in Nigeria',
    },
    description:
        'Milestone-based construction management, independent inspection, insured payments and digital project monitoring for Nigerians building from abroad.',
    offers: {
        '@type': 'Offer',
        name: 'Free Diaspora Project Consultation',
        price: '0',
        priceCurrency: 'NGN',
    },
}

export default function DiasporaConsultationPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DiasporaConsultationClient />
        </>
    )
}



// import DiasporaConsultationClient from './DiasporaConsultationClient'

// const SITE_URL = 'https://artemisatelier.com' // update to your real domain
// const PAGE_PATH = '/diaspora-consultation'

// export const metadata = {
//     title: 'Build Your Home in Nigeria From Abroad | Free Consultation — Artemis Atelier',
//     description:
//         'Nigerians in the diaspora: build your dream home in Nigeria with documented milestones, independent inspection, insured payments and weekly progress reports. Book a free 20-minute consultation.',
//     alternates: {
//         canonical: `${SITE_URL}${PAGE_PATH}`,
//     },
//     openGraph: {
//         title: 'Build Your Home in Nigeria — Without Living in Nigeria',
//         description:
//             'Documented milestones, independent inspection and insured payments — monitor your Nigerian construction project from anywhere. Book a free consultation.',
//         url: `${SITE_URL}${PAGE_PATH}`,
//         siteName: 'Artemis Atelier Ltd',
//         images: [
//             {
//                 url: `${SITE_URL}/51.jpg`,
//                 width: 1200,
//                 height: 630,
//                 alt: 'Artemis Atelier construction project',
//             },
//         ],
//         locale: 'en_NG',
//         type: 'website',
//     },
//     twitter: {
//         card: 'summary_large_image',
//         title: 'Build Your Home in Nigeria — Without Living in Nigeria',
//         description:
//             'Documented milestones, independent inspection and insured payments. Book a free diaspora consultation with Artemis Atelier.',
//         images: [`${SITE_URL}/51.jpg`],
//     },
//     robots: {
//         index: true,
//         follow: true,
//     },
// }

// const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Service',
//     serviceType: 'Diaspora Construction Project Management',
//     provider: {
//         '@type': 'GeneralContractor',
//         name: 'Artemis Atelier Ltd',
//         url: SITE_URL,
//     },
//     areaServed: {
//         '@type': 'Country',
//         name: 'Nigeria',
//     },
//     audience: {
//         '@type': 'Audience',
//         audienceType: 'Nigerians living abroad planning to build property in Nigeria',
//     },
//     description:
//         'Milestone-based construction management, independent inspection, insured payments and digital project monitoring for Nigerians building from abroad.',
//     offers: {
//         '@type': 'Offer',
//         name: 'Free Diaspora Project Consultation',
//         price: '0',
//         priceCurrency: 'NGN',
//     },
// }

// export default function DiasporaConsultationPage() {
//     return (
//         <>
//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//             />
//             <DiasporaConsultationClient />
//         </>
//     )
// }



// // "use client";

// // import { useState } from "react";

// // /**
// //  * /diaspora-consultation
// //  *
// //  * A campaign landing page — no site navigation, one offer, one CTA.
// //  * Built for cold traffic from Facebook/Instagram/Google ads targeting
// //  * Nigerians abroad. Every section exists to move one type of visitor
// //  * (someone scrolling a feed abroad, worried about sending money home)
// //  * toward booking the free consultation.
// //  *
// //  * Design system matches the rest of the site: #08b796 teal / #1a1a1a
// //  * dark / Cormorant Garamond display / DM Sans body — kept deliberately
// //  * quiet here so the form is the only thing competing for attention.
// //  */

// // const WORRIES = [
// //   "Will they disappear with my money?",
// //   "Will they inflate the cost of materials?",
// //   "Will they use inferior materials?",
// //   "Is the project actually progressing?",
// // ];

// // const HOW_IT_WORKS = [
// //   {
// //     n: "01",
// //     h: "Free 20-minute consultation",
// //     p: "Tell us where you are, where you're building, and what stage you're at. No obligation, no pressure.",
// //   },
// //   {
// //     n: "02",
// //     h: "Site & project assessment",
// //     p: "We verify the land, review documentation, and give you a preliminary project brief before any money changes hands.",
// //   },
// //   {
// //     n: "03",
// //     h: "Documented proposal",
// //     p: "Scope, drawings, Bill of Quantities and payment milestones — in writing, before construction ever begins.",
// //   },
// // ];

// // const COUNTRIES = [
// //   "United Kingdom",
// //   "United States",
// //   "Canada",
// //   "Germany",
// //   "UAE",
// //   "South Africa",
// //   "Other",
// // ];

// // export default function DiasporaConsultationPage() {
// //   const [form, setForm] = useState({
// //     name: "",
// //     country: "",
// //     location: "",
// //     hasLand: "",
// //     budget: "",
// //     timeline: "",
// //   });
// //   const [submitted, setSubmitted] = useState(false);

// //   function update(field, value) {
// //     setForm((prev) => ({ ...prev, [field]: value }));
// //   }

// //   function handleSubmit(e) {
// //     e.preventDefault();
// //     // Wire this up to your lead endpoint / WhatsApp API / email service.
// //     setSubmitted(true);
// //   }

// //   return (
// //     <main
// //       className="bg-white text-[#1a1a1a]"
// //       style={{ fontFamily: "DM Sans, sans-serif" }}
// //     >
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
// //         .serif { font-family: 'Cormorant Garamond', serif; }
// //       `}</style>

// //       {/* Minimal top bar — logo only, no nav links, no exits */}
// //       <div className="px-6 md:px-10 py-6 max-w-[1200px] mx-auto flex items-center justify-between">
// //         <span className="text-[13px] tracking-[0.2em] uppercase font-medium">
// //           Artemis Atelier
// //         </span>
// //         <a
// //           href="#book"
// //           className="hidden sm:inline-block text-[12px] px-5 py-2.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
// //         >
// //           Book Free Consultation
// //         </a>
// //       </div>

// //       {/* HERO — single offer, single job */}
// //       <section className="px-6 md:px-10 pt-10 pb-20 md:pt-16 md:pb-28 max-w-[1200px] mx-auto">
// //         <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
// //           <div>
// //             <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-5">
// //               For Nigerians Building From Abroad
// //             </p>
// //             <h1 className="serif text-[40px] md:text-[58px] leading-[1.05] mb-6">
// //               Build your dream home in Nigeria — without living in Nigeria.
// //             </h1>
// //             <p className="text-[15px] md:text-[16px] text-[#5a5a5a] leading-relaxed mb-8 max-w-md">
// //               Documented milestones, independent inspection, and weekly
// //               progress reports — so you can watch your project rise from
// //               London, Houston, Toronto or Dubai, with confidence.
// //             </p>
// //             <a
// //               href="#book"
// //               className="inline-block text-[13px] tracking-wide px-8 py-4 bg-[#08b796] text-white font-medium hover:bg-[#08a086] transition-colors"
// //             >
// //               Book Your Free 20-Minute Consultation
// //             </a>
// //             <p className="text-[12px] text-[#8a8a8a] mt-4">
// //               No obligation. No payment required to speak with us.
// //             </p>
// //           </div>

// //           <div className="relative aspect-[4/3] bg-[#f4f2ee] overflow-hidden">
// //             <img
// //               src="/51.jpg"
// //               alt="Artemis Atelier construction project"
// //               className="w-full h-full object-cover"
// //             />
// //           </div>
// //         </div>
// //       </section>

// //       {/* THE WORRY — names the fear directly, builds relevance fast */}
// //       <section className="bg-[#1a1a1a] text-white">
// //         <div className="px-6 md:px-10 py-16 md:py-20 max-w-[1200px] mx-auto">
// //           <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-6 text-center">
// //             The Question Every Diaspora Client Asks
// //           </p>
// //           <h2 className="serif text-[28px] md:text-[38px] text-center leading-snug mb-12 max-w-2xl mx-auto">
// //             "If I send money to Nigeria, how do I know the work is actually
// //             being done?"
// //           </h2>
// //           <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-2xl mx-auto">
// //             {WORRIES.map((w) => (
// //               <div key={w} className="flex items-start gap-3">
// //                 <span className="text-[#08b796] text-[13px] mt-0.5">—</span>
// //                 <span className="text-[14px] text-white/70">{w}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* HOW IT WORKS — real sequence, so numbering is justified */}
// //       <section className="px-6 md:px-10 py-20 md:py-28 max-w-[1200px] mx-auto">
// //         <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4 text-center">
// //           What Happens Next
// //         </p>
// //         <h2 className="serif text-[30px] md:text-[42px] text-center mb-16">
// //           Three steps before you spend a naira
// //         </h2>
// //         <div className="grid md:grid-cols-3 gap-10 md:gap-8">
// //           {HOW_IT_WORKS.map((s) => (
// //             <div key={s.n} className="border-t border-[#1a1a1a] pt-5">
// //               <span className="serif text-[32px] text-[#08b796]/50 block mb-3">
// //                 {s.n}
// //               </span>
// //               <h3 className="text-[15px] font-medium mb-2">{s.h}</h3>
// //               <p className="text-[13px] text-[#6b6b6b] leading-relaxed">
// //                 {s.p}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* FORM — the single conversion point */}
// //       <section id="book" className="bg-[#f4f2ee]">
// //         <div className="px-6 md:px-10 py-20 md:py-28 max-w-[640px] mx-auto">
// //           <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4 text-center">
// //             Free Diaspora Project Consultation
// //           </p>
// //           <h2 className="serif text-[30px] md:text-[38px] text-center mb-3">
// //             Tell us about your project
// //           </h2>
// //           <p className="text-[14px] text-[#6b6b6b] text-center mb-10">
// //             Takes two minutes. We'll respond within 24 hours by WhatsApp or
// //             email.
// //           </p>

// //           {submitted ? (
// //             <div className="bg-white border border-[#e0e0e0] p-10 text-center">
// //               <p className="serif text-[24px] mb-2">Thank you, {form.name || "there"}.</p>
// //               <p className="text-[14px] text-[#6b6b6b]">
// //                 We've received your details and will reach out within 24
// //                 hours to schedule your free consultation.
// //               </p>
// //             </div>
// //           ) : (
// //             <form onSubmit={handleSubmit} className="bg-white border border-[#e0e0e0] p-8 md:p-10 space-y-5">
// //               <Field label="Full name">
// //                 <input
// //                   type="text"
// //                   required
// //                   value={form.name}
// //                   onChange={(e) => update("name", e.target.value)}
// //                   className="field-input"
// //                   placeholder="e.g. Chidinma Okafor"
// //                 />
// //               </Field>

// //               <Field label="Where are you currently based?">
// //                 <select
// //                   required
// //                   value={form.country}
// //                   onChange={(e) => update("country", e.target.value)}
// //                   className="field-input"
// //                 >
// //                   <option value="" disabled>
// //                     Select a country
// //                   </option>
// //                   {COUNTRIES.map((c) => (
// //                     <option key={c} value={c}>
// //                       {c}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </Field>

// //               <Field label="Where in Nigeria are you planning to build?">
// //                 <input
// //                   type="text"
// //                   required
// //                   value={form.location}
// //                   onChange={(e) => update("location", e.target.value)}
// //                   className="field-input"
// //                   placeholder="e.g. Lekki, Lagos"
// //                 />
// //               </Field>

// //               <Field label="Have you already acquired the land?">
// //                 <div className="flex gap-3">
// //                   {["Yes", "No", "In progress"].map((opt) => (
// //                     <button
// //                       type="button"
// //                       key={opt}
// //                       onClick={() => update("hasLand", opt)}
// //                       className={`flex-1 text-[13px] py-2.5 border transition-colors ${
// //                         form.hasLand === opt
// //                           ? "border-[#08b796] bg-[#08b796]/10 text-[#08b796]"
// //                           : "border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a]"
// //                       }`}
// //                     >
// //                       {opt}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </Field>

// //               <Field label="Estimated budget range (₦)">
// //                 <input
// //                   type="text"
// //                   value={form.budget}
// //                   onChange={(e) => update("budget", e.target.value)}
// //                   className="field-input"
// //                   placeholder="e.g. ₦50m – ₦80m"
// //                 />
// //               </Field>

// //               <Field label="Expected timeline">
// //                 <input
// //                   type="text"
// //                   value={form.timeline}
// //                   onChange={(e) => update("timeline", e.target.value)}
// //                   className="field-input"
// //                   placeholder="e.g. Ready to start in 3 months"
// //                 />
// //               </Field>

// //               <button
// //                 type="submit"
// //                 className="w-full text-[13px] tracking-wide py-4 bg-[#08b796] text-white font-medium hover:bg-[#08a086] transition-colors mt-2"
// //               >
// //                 Book My Free Consultation
// //               </button>
// //               <p className="text-[11px] text-[#8a8a8a] text-center">
// //                 No payment required. We'll never ask you to send money before
// //                 you've spoken with us.
// //               </p>
// //             </form>
// //           )}
// //         </div>
// //       </section>

// //       {/* Minimal footer — contact only, still no nav */}
// //       <footer className="px-6 md:px-10 py-10 max-w-300 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8a8a8a]">
// //         <span>Artemis Atelier Ltd — Architecture · Construction · Project Management</span>
// //         {/* <span>WhatsApp: [Insert Number] · Email: [Insert Email]</span> */}
// //       </footer>

// //       <style>{`
// //         .field-input {
// //           width: 100%;
// //           font-size: 14px;
// //           padding: 11px 14px;
// //           border: 1px solid #e0e0e0;
// //           background: #fff;
// //           color: #1a1a1a;
// //           outline: none;
// //           transition: border-color 0.2s;
// //         }
// //         .field-input:focus {
// //           border-color: #08b796;
// //         }
// //       `}</style>
// //     </main>
// //   );
// // }

// // function Field({ label, children }) {
// //   return (
// //     <label className="block">
// //       <span className="block text-[12px] text-[#5a5a5a] mb-2">{label}</span>
// //       {children}
// //     </label>
// //   );
// // }
