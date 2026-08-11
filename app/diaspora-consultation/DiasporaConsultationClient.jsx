"use client";

import { useState } from "react";

/**
 * /diaspora-consultation
 *
 * A campaign landing page — no site navigation, one offer, one CTA.
 * Built for cold traffic from Facebook/Instagram/Google ads targeting
 * Nigerians abroad. Every section exists to move one type of visitor
 * (someone scrolling a feed abroad, worried about sending money home)
 * toward booking the free consultation.
 *
 * Design system matches the rest of the site: #08b796 teal / #1a1a1a
 * dark / Cormorant Garamond display / DM Sans body — kept deliberately
 * quiet here so the form is the only thing competing for attention.
 */

const WORRIES = [
  "Will they disappear with my money?",
  "Will they inflate the cost of materials?",
  "Will they use inferior materials?",
  "Is the project actually progressing?",
];

const HOW_IT_WORKS = [
  {
    n: "01",
    h: "Free 20-minute consultation",
    p: "Tell us where you are, where you're building, and what stage you're at. No obligation, no pressure.",
  },
  {
    n: "02",
    h: "Site & project assessment",
    p: "We verify the land, review documentation, and give you a preliminary project brief before any money changes hands.",
  },
  {
    n: "03",
    h: "Documented proposal",
    p: "Scope, drawings, Bill of Quantities and payment milestones — in writing, before construction ever begins.",
  },
];

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "UAE",
  "South Africa",
  "Other",
];

export default function DiasporaConsultationClient() {
  const [form, setForm] = useState({
    name: "",
    country: "",
    location: "",
    hasLand: "",
    budget: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Formats budget input with comma thousand-separators as the user types,
  // e.g. "50000000" -> "50,000,000". Keeps only digits internally.
  function updateBudget(rawValue) {
    const digitsOnly = rawValue.replace(/[^\d]/g, "");
    const formatted = digitsOnly ? Number(digitsOnly).toLocaleString("en-US") : "";
    setForm((prev) => ({ ...prev, budget: formatted }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/consultation-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="bg-white text-[#1a1a1a]"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* Minimal top bar — logo only, no nav links, no exits */}
      <div className="px-6 md:px-10 py-6 max-w-[1200px] mx-auto flex items-center justify-between">
        <span className="text-[13px] tracking-[0.2em] uppercase font-medium">
          Artemis Atelier
        </span>
        <a
          href="#book"
          className="hidden sm:inline-block text-[12px] px-5 py-2.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          Book Free Consultation
        </a>
      </div>

      {/* HERO — single offer, single job */}
      <section className="px-6 md:px-10 pt-10 pb-20 md:pt-16 md:pb-28 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-5">
              For Nigerians Building From Abroad
            </p>
            <h1 className="serif text-[40px] md:text-[58px] leading-[1.05] mb-6">
              Build your dream home in Nigeria — without living in Nigeria.
            </h1>
            <p className="text-[15px] md:text-[16px] text-[#5a5a5a] leading-relaxed mb-8 max-w-md">
              Documented milestones, independent inspection, and weekly
              progress reports — so you can watch your project rise from
              London, Houston, Toronto or Dubai, with confidence.
            </p>
            <a
              href="#book"
              className="inline-block text-[13px] tracking-wide px-8 py-4 bg-[#08b796] text-white font-medium hover:bg-[#08a086] transition-colors"
            >
              Book Your Free 20-Minute Consultation
            </a>
            <p className="text-[12px] text-[#8a8a8a] mt-4">
              No obligation. No payment required to speak with us.
            </p>
          </div>

          <div className="relative aspect-[4/3] bg-[#f4f2ee] overflow-hidden">
            <img
              src="/51.jpg"
              alt="Artemis Atelier construction project"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* THE WORRY — names the fear directly, builds relevance fast */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="px-6 md:px-10 py-16 md:py-20 max-w-[1200px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-6 text-center">
            The Question Every Diaspora Client Asks
          </p>
          <h2 className="serif text-[28px] md:text-[38px] text-center leading-snug mb-12 max-w-2xl mx-auto">
            "If I send money to Nigeria, how do I know the work is actually
            being done?"
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-2xl mx-auto">
            {WORRIES.map((w) => (
              <div key={w} className="flex items-start gap-3">
                <span className="text-[#08b796] text-[13px] mt-0.5">—</span>
                <span className="text-[14px] text-white/70">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — real sequence, so numbering is justified */}
      <section className="px-6 md:px-10 py-20 md:py-28 max-w-[1200px] mx-auto">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4 text-center">
          What Happens Next
        </p>
        <h2 className="serif text-[30px] md:text-[42px] text-center mb-16">
          Three steps before you spend a naira
        </h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="border-t border-[#1a1a1a] pt-5">
              <span className="serif text-[32px] text-[#08b796]/50 block mb-3">
                {s.n}
              </span>
              <h3 className="text-[15px] font-medium mb-2">{s.h}</h3>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed">
                {s.p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INSURANCE — payments protected under a licensed partner's policy */}
      <section className="bg-white border-t border-[#e0e0e0]">
        <div className="px-6 md:px-10 py-20 md:py-28 max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4">
                An Extra Layer of Protection
              </p>
              <h2 className="serif text-[30px] md:text-[42px] leading-tight mb-6">
                Your milestone payments, backed by insurance.
              </h2>
              <p className="text-[14px] md:text-[15px] text-[#5a5a5a] leading-relaxed mb-6 max-w-md">
                Alongside our own reporting and independent inspection, we
                coordinate with a licensed Nigerian insurance partner so that
                eligible project risks — not just our word — stand behind
                every payment you make.
              </p>
              <p className="text-[13px] text-[#8a8a8a] leading-relaxed max-w-md">
                Coverage is subject to the terms, conditions, exclusions and
                deductibles of the applicable policy. We'll walk you through
                exactly what's covered before your first payment milestone.
              </p>
            </div>

            <div className="bg-[#f4f2ee] p-8 md:p-10">
              <p className="text-[12px] tracking-[0.15em] uppercase text-[#5a5a5a] font-medium mb-6">
                Depending on your project, coverage may include
              </p>
              <ul className="space-y-4">
                {[
                  ["Contractors' All Risks", "Physical loss or damage during construction."],
                  ["Third-party / public liability", "Claims involving injury or property damage to others."],
                  ["Construction plant & equipment", "Damage or loss of equipment used on your site."],
                  ["Fire & theft-related risks", "Depending on the specific policy issued."],
                ].map(([h, p]) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="text-[#08b796] mt-1 text-[13px]">✓</span>
                    <div>
                      <p className="text-[13px] font-medium">{h}</p>
                      <p className="text-[12px] text-[#8a8a8a] mt-0.5">{p}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-[#8a8a8a] mt-6 pt-6 border-t border-[#e0e0e0]">
                Policy issued by an independent, NAICOM-licensed insurer — not
                by Artemis Atelier Ltd. You receive the policy number,
                coverage schedule and claims procedure directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM — the single conversion point */}
      <section id="book" className="bg-[#f4f2ee]">
        <div className="px-6 md:px-10 py-20 md:py-28 max-w-[640px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4 text-center">
            Free Diaspora Project Consultation
          </p>
          <h2 className="serif text-[30px] md:text-[38px] text-center mb-3">
            Tell us about your project
          </h2>
          <p className="text-[14px] text-[#6b6b6b] text-center mb-10">
            Takes two minutes. We'll respond within 24 hours by WhatsApp or
            email.
          </p>

          {submitted ? (
            <div className="bg-white border border-[#e0e0e0] p-10 text-center">
              <p className="serif text-[24px] mb-2">Thank you, {form.name || "there"}.</p>
              <p className="text-[14px] text-[#6b6b6b]">
                We've received your details and will reach out within 24
                hours to schedule your free consultation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#e0e0e0] p-8 md:p-10 space-y-5">
              <Field label="Full name">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="field-input"
                  placeholder="e.g. Chidinma Okafor"
                />
              </Field>

              <Field label="Where are you currently based?">
                <select
                  required
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className="field-input"
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Where in Nigeria are you planning to build?">
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="field-input"
                  placeholder="e.g. Lekki, Lagos"
                />
              </Field>

              <Field label="Have you already acquired the land?">
                <div className="flex gap-3">
                  {["Yes", "No", "In progress"].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => update("hasLand", opt)}
                      className={`flex-1 text-[13px] py-2.5 border transition-colors ${
                        form.hasLand === opt
                          ? "border-[#08b796] bg-[#08b796]/10 text-[#08b796]"
                          : "border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Estimated budget (₦)">
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.budget}
                  onChange={(e) => updateBudget(e.target.value)}
                  className="field-input"
                  placeholder="e.g. 50,000,000"
                />
              </Field>

              <Field label="WhatsApp number or email">
                <input
                  type="text"
                  required
                  value={form.contact}
                  onChange={(e) => update("contact", e.target.value)}
                  className="field-input"
                  placeholder="e.g. +44 7911 123456 or you@email.com"
                />
              </Field>

              {error && (
                <p className="text-[12px] text-[#c0392b] text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-[13px] tracking-wide py-4 bg-[#08b796] text-white font-medium hover:bg-[#08a086] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting…" : "Book My Free Consultation"}
              </button>
              <p className="text-[11px] text-[#8a8a8a] text-center">
                No payment required. We'll never ask you to send money before
                you've spoken with us.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Minimal footer — contact only, still no nav */}
      <footer className="px-6 md:px-10 py-10 max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8a8a8a]">
        <span>Artemis Atelier Ltd — Architecture · Construction · Project Management</span>
        <span> Email: info@artemisatelierltd.com</span>
      </footer>

      {/* Floating WhatsApp button — stays visible over every section */}
      <a
        href="https://wa.me/2348033502393?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20product%20%26%20services.&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-float"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4C7.36 4 3.55 7.8 3.55 12.5c0 1.48.39 2.92 1.12 4.19L3.5 21l4.42-1.16a8.9 8.9 0 0 0 4.13 1.03h.01c4.68 0 8.5-3.8 8.5-8.5a8.5 8.5 0 0 0-2.96-6.05Z"
            fill="#fff"
          />
          <path
            d="M12.05 4C7.36 4 3.55 7.8 3.55 12.5c0 1.48.39 2.92 1.12 4.19L3.5 21l4.42-1.16a8.9 8.9 0 0 0 4.13 1.03h.01c4.68 0 8.5-3.8 8.5-8.5S16.73 4 12.05 4Zm0 15.53h-.01a7.4 7.4 0 0 1-3.78-1.04l-.27-.16-2.62.69.7-2.56-.18-.27a7.44 7.44 0 0 1-1.14-3.99c0-4.1 3.34-7.44 7.4-7.44a7.35 7.35 0 0 1 5.24 2.18 7.35 7.35 0 0 1 2.17 5.26c0 4.1-3.34 7.33-7.51 7.33Zm4.06-5.5c-.22-.11-1.32-.65-1.53-.73-.2-.07-.35-.11-.5.11-.15.22-.58.73-.71.88-.13.15-.26.16-.48.05-.22-.11-.94-.35-1.79-1.11-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.05-.11-.5-1.21-.69-1.65-.18-.44-.36-.38-.5-.38h-.42c-.15 0-.39.05-.59.28-.2.22-.77.75-.77 1.83s.79 2.13.9 2.28c.11.15 1.55 2.36 3.75 3.31.52.23.93.36 1.25.46.53.17 1 .14 1.38.09.42-.06 1.32-.54 1.5-1.06.19-.52.19-.96.13-1.06-.06-.09-.2-.15-.42-.26Z"
            fill="#25D366"
          />
        </svg>
      </a>

      <style>{`
        .field-input {
          width: 100%;
          font-size: 14px;
          padding: 11px 14px;
          border: 1px solid #e0e0e0;
          background: #fff;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input:focus {
          border-color: #08b796;
        }

        .whatsapp-float {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease;
        }
        .whatsapp-float:hover {
          transform: scale(1.08);
        }
        .whatsapp-float::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #25D366;
          opacity: 0.5;
          animation: whatsapp-pulse 2.2s ease-out infinite;
        }
        @keyframes whatsapp-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @media (max-width: 480px) {
          .whatsapp-float {
            bottom: 16px;
            right: 16px;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-[#5a5a5a] mb-2">{label}</span>
      {children}
    </label>
  );
}


// "use client";

// import { useState } from "react";

// /**
//  * /diaspora-consultation
//  *
//  * A campaign landing page — no site navigation, one offer, one CTA.
//  * Built for cold traffic from Facebook/Instagram/Google ads targeting
//  * Nigerians abroad. Every section exists to move one type of visitor
//  * (someone scrolling a feed abroad, worried about sending money home)
//  * toward booking the free consultation.
//  *
//  * Design system matches the rest of the site: #08b796 teal / #1a1a1a
//  * dark / Cormorant Garamond display / DM Sans body — kept deliberately
//  * quiet here so the form is the only thing competing for attention.
//  */

// const WORRIES = [
//   "Will they disappear with my money?",
//   "Will they inflate the cost of materials?",
//   "Will they use inferior materials?",
//   "Is the project actually progressing?",
// ];

// const HOW_IT_WORKS = [
//   {
//     n: "01",
//     h: "Free 20-minute consultation",
//     p: "Tell us where you are, where you're building, and what stage you're at. No obligation, no pressure.",
//   },
//   {
//     n: "02",
//     h: "Site & project assessment",
//     p: "We verify the land, review documentation, and give you a preliminary project brief before any money changes hands.",
//   },
//   {
//     n: "03",
//     h: "Documented proposal",
//     p: "Scope, drawings, Bill of Quantities and payment milestones — in writing, before construction ever begins.",
//   },
// ];

// const COUNTRIES = [
//   "United Kingdom",
//   "United States",
//   "Canada",
//   "Germany",
//   "UAE",
//   "South Africa",
//   "Other",
// ];

// export default function DiasporaConsultationClient() {
//   const [form, setForm] = useState({
//     name: "",
//     country: "",
//     location: "",
//     hasLand: "",
//     budget: "",
//     contact: "",
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   function update(field, value) {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   }

//   // Formats budget input with comma thousand-separators as the user types,
//   // e.g. "50000000" -> "50,000,000". Keeps only digits internally.
//   function updateBudget(rawValue) {
//     const digitsOnly = rawValue.replace(/[^\d]/g, "");
//     const formatted = digitsOnly ? Number(digitsOnly).toLocaleString("en-US") : "";
//     setForm((prev) => ({ ...prev, budget: formatted }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await fetch("/api/consultation-lead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.error || "Something went wrong.");
//       }
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.message || "Could not submit. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main
//       className="bg-white text-[#1a1a1a]"
//       style={{ fontFamily: "DM Sans, sans-serif" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
//         .serif { font-family: 'Cormorant Garamond', serif; }
//       `}</style>

//       {/* Minimal top bar — logo only, no nav links, no exits */}
//       <div className="px-6 md:px-10 py-6 max-w-[1200px] mx-auto flex items-center justify-between">
//         <span className="text-[13px] tracking-[0.2em] uppercase font-medium">
//           Artemis Atelier
//         </span>
//         <a
//           href="#book"
//           className="hidden sm:inline-block text-[12px] px-5 py-2.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
//         >
//           Book Free Consultation
//         </a>
//       </div>

//       {/* HERO — single offer, single job */}
//       <section className="px-6 md:px-10 pt-10 pb-20 md:pt-16 md:pb-28 max-w-[1200px] mx-auto">
//         <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
//           <div>
//             <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-5">
//               For Nigerians Building From Abroad
//             </p>
//             <h1 className="serif text-[40px] md:text-[58px] leading-[1.05] mb-6">
//               Build your dream home in Nigeria — without living in Nigeria.
//             </h1>
//             <p className="text-[15px] md:text-[16px] text-[#5a5a5a] leading-relaxed mb-8 max-w-md">
//               Documented milestones, independent inspection, and weekly
//               progress reports — so you can watch your project rise from
//               London, Houston, Toronto or Dubai, with confidence.
//             </p>
//             <a
//               href="#book"
//               className="inline-block text-[13px] tracking-wide px-8 py-4 bg-[#08b796] text-white font-medium hover:bg-[#08a086] transition-colors"
//             >
//               Book Your Free 20-Minute Consultation
//             </a>
//             <p className="text-[12px] text-[#8a8a8a] mt-4">
//               No obligation. No payment required to speak with us.
//             </p>
//           </div>

//           <div className="relative aspect-[4/3] bg-[#f4f2ee] overflow-hidden">
//             <img
//               src="/51.jpg"
//               alt="Artemis Atelier construction project"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>
//       </section>

//       {/* THE WORRY — names the fear directly, builds relevance fast */}
//       <section className="bg-[#1a1a1a] text-white">
//         <div className="px-6 md:px-10 py-16 md:py-20 max-w-[1200px] mx-auto">
//           <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-6 text-center">
//             The Question Every Diaspora Client Asks
//           </p>
//           <h2 className="serif text-[28px] md:text-[38px] text-center leading-snug mb-12 max-w-2xl mx-auto">
//             "If I send money to Nigeria, how do I know the work is actually
//             being done?"
//           </h2>
//           <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-2xl mx-auto">
//             {WORRIES.map((w) => (
//               <div key={w} className="flex items-start gap-3">
//                 <span className="text-[#08b796] text-[13px] mt-0.5">—</span>
//                 <span className="text-[14px] text-white/70">{w}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS — real sequence, so numbering is justified */}
//       <section className="px-6 md:px-10 py-20 md:py-28 max-w-[1200px] mx-auto">
//         <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4 text-center">
//           What Happens Next
//         </p>
//         <h2 className="serif text-[30px] md:text-[42px] text-center mb-16">
//           Three steps before you spend a naira
//         </h2>
//         <div className="grid md:grid-cols-3 gap-10 md:gap-8">
//           {HOW_IT_WORKS.map((s) => (
//             <div key={s.n} className="border-t border-[#1a1a1a] pt-5">
//               <span className="serif text-[32px] text-[#08b796]/50 block mb-3">
//                 {s.n}
//               </span>
//               <h3 className="text-[15px] font-medium mb-2">{s.h}</h3>
//               <p className="text-[13px] text-[#6b6b6b] leading-relaxed">
//                 {s.p}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* INSURANCE — payments protected under a licensed partner's policy */}
//       <section className="bg-white border-t border-[#e0e0e0]">
//         <div className="px-6 md:px-10 py-20 md:py-28 max-w-[1200px] mx-auto">
//           <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
//             <div>
//               <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4">
//                 An Extra Layer of Protection
//               </p>
//               <h2 className="serif text-[30px] md:text-[42px] leading-tight mb-6">
//                 Your milestone payments, backed by insurance.
//               </h2>
//               <p className="text-[14px] md:text-[15px] text-[#5a5a5a] leading-relaxed mb-6 max-w-md">
//                 Alongside our own reporting and independent inspection, we
//                 coordinate with a licensed Nigerian insurance partner so that
//                 eligible project risks — not just our word — stand behind
//                 every payment you make.
//               </p>
//               <p className="text-[13px] text-[#8a8a8a] leading-relaxed max-w-md">
//                 Coverage is subject to the terms, conditions, exclusions and
//                 deductibles of the applicable policy. We'll walk you through
//                 exactly what's covered before your first payment milestone.
//               </p>
//             </div>

//             <div className="bg-[#f4f2ee] p-8 md:p-10">
//               <p className="text-[12px] tracking-[0.15em] uppercase text-[#5a5a5a] font-medium mb-6">
//                 Depending on your project, coverage may include
//               </p>
//               <ul className="space-y-4">
//                 {[
//                   ["Contractors' All Risks", "Physical loss or damage during construction."],
//                   ["Third-party / public liability", "Claims involving injury or property damage to others."],
//                   ["Construction plant & equipment", "Damage or loss of equipment used on your site."],
//                   ["Fire & theft-related risks", "Depending on the specific policy issued."],
//                 ].map(([h, p]) => (
//                   <li key={h} className="flex items-start gap-3">
//                     <span className="text-[#08b796] mt-1 text-[13px]">✓</span>
//                     <div>
//                       <p className="text-[13px] font-medium">{h}</p>
//                       <p className="text-[12px] text-[#8a8a8a] mt-0.5">{p}</p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//               <p className="text-[11px] text-[#8a8a8a] mt-6 pt-6 border-t border-[#e0e0e0]">
//                 Policy issued by an independent, NAICOM-licensed insurer — not
//                 by Artemis Atelier Ltd. You receive the policy number,
//                 coverage schedule and claims procedure directly.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FORM — the single conversion point */}
//       <section id="book" className="bg-[#f4f2ee]">
//         <div className="px-6 md:px-10 py-20 md:py-28 max-w-[640px] mx-auto">
//           <p className="text-[11px] tracking-[0.2em] uppercase text-[#08b796] font-medium mb-4 text-center">
//             Free Diaspora Project Consultation
//           </p>
//           <h2 className="serif text-[30px] md:text-[38px] text-center mb-3">
//             Tell us about your project
//           </h2>
//           <p className="text-[14px] text-[#6b6b6b] text-center mb-10">
//             Takes two minutes. We'll respond within 24 hours by WhatsApp or
//             email.
//           </p>

//           {submitted ? (
//             <div className="bg-white border border-[#e0e0e0] p-10 text-center">
//               <p className="serif text-[24px] mb-2">Thank you, {form.name || "there"}.</p>
//               <p className="text-[14px] text-[#6b6b6b]">
//                 We've received your details and will reach out within 24
//                 hours to schedule your free consultation.
//               </p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="bg-white border border-[#e0e0e0] p-8 md:p-10 space-y-5">
//               <Field label="Full name">
//                 <input
//                   type="text"
//                   required
//                   value={form.name}
//                   onChange={(e) => update("name", e.target.value)}
//                   className="field-input"
//                   placeholder="e.g. Chidinma Okafor"
//                 />
//               </Field>

//               <Field label="Where are you currently based?">
//                 <select
//                   required
//                   value={form.country}
//                   onChange={(e) => update("country", e.target.value)}
//                   className="field-input"
//                 >
//                   <option value="" disabled>
//                     Select a country
//                   </option>
//                   {COUNTRIES.map((c) => (
//                     <option key={c} value={c}>
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </Field>

//               <Field label="Where in Nigeria are you planning to build?">
//                 <input
//                   type="text"
//                   required
//                   value={form.location}
//                   onChange={(e) => update("location", e.target.value)}
//                   className="field-input"
//                   placeholder="e.g. Lekki, Lagos"
//                 />
//               </Field>

//               <Field label="Have you already acquired the land?">
//                 <div className="flex gap-3">
//                   {["Yes", "No", "In progress"].map((opt) => (
//                     <button
//                       type="button"
//                       key={opt}
//                       onClick={() => update("hasLand", opt)}
//                       className={`flex-1 text-[13px] py-2.5 border transition-colors ${
//                         form.hasLand === opt
//                           ? "border-[#08b796] bg-[#08b796]/10 text-[#08b796]"
//                           : "border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a1a]"
//                       }`}
//                     >
//                       {opt}
//                     </button>
//                   ))}
//                 </div>
//               </Field>

//               <Field label="Estimated budget (₦)">
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   value={form.budget}
//                   onChange={(e) => updateBudget(e.target.value)}
//                   className="field-input"
//                   placeholder="e.g. 50,000,000"
//                 />
//               </Field>

//               <Field label="WhatsApp number or email">
//                 <input
//                   type="text"
//                   required
//                   value={form.contact}
//                   onChange={(e) => update("contact", e.target.value)}
//                   className="field-input"
//                   placeholder="e.g. +44 7911 123456 or you@email.com"
//                 />
//               </Field>

//               {error && (
//                 <p className="text-[12px] text-[#c0392b] text-center">{error}</p>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full text-[13px] tracking-wide py-4 bg-[#08b796] text-white font-medium hover:bg-[#08a086] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Submitting…" : "Book My Free Consultation"}
//               </button>
//               <p className="text-[11px] text-[#8a8a8a] text-center">
//                 No payment required. We'll never ask you to send money before
//                 you've spoken with us.
//               </p>
//             </form>
//           )}
//         </div>
//       </section>

//       {/* Minimal footer — contact only, still no nav */}
//       <footer className="px-6 md:px-10 py-10 max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8a8a8a]">
//         <span>Artemis Atelier Ltd — Architecture · Construction · Project Management</span>
//         <span>WhatsApp: [Insert Number] · Email: [Insert Email]</span>
//       </footer>

//       <style>{`
//         .field-input {
//           width: 100%;
//           font-size: 14px;
//           padding: 11px 14px;
//           border: 1px solid #e0e0e0;
//           background: #fff;
//           color: #1a1a1a;
//           outline: none;
//           transition: border-color 0.2s;
//         }
//         .field-input:focus {
//           border-color: #08b796;
//         }
//       `}</style>
//     </main>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <label className="block">
//       <span className="block text-[12px] text-[#5a5a5a] mb-2">{label}</span>
//       {children}
//     </label>
//   );
// }