"use client";

import { useEffect, useRef } from "react";

/**
 * /why-build-with-us
 *
 * Framework: "The Four R's" — a mnemonic device that gives the four pillars
 * a memorable, ordered logic (each R feeds the next, and Retention loops
 * back into Relationships via referrals). Built on the existing AAL design
 * system: #08b796 teal / #1a1a1a dark / Cormorant Garamond + DM Sans.
 *
 * Drop this file at app/why-build-with-us/page.jsx
 * No extra dependencies — scroll reveals run on a plain IntersectionObserver.
 */

const PILLARS = [
  {
    tag: "R1",
    word: "De-risk",
    title: "De-Risk the Diaspora Market",
    subtitle: "The Trust Framework",
    lede:
      "Building from abroad shouldn't cost you sleep. We replaced blind trust with verifiable proof — you see the site, control the funds, and approve every material line item.",
    features: [
      {
        h: "24/7 live site streaming",
        p: "HD camera access plus bi-weekly drone coverage, so you watch progress in real time instead of waiting on secondhand updates.",
      },
      {
        h: "Stage-gate payments",
        p: "Capital releases in milestone-based phases — substructure, superstructure, roofing, finishing — only after each stage is independently verified.",
      },
      {
        h: "Open-book BOQs",
        p: "Itemized material pricing with zero hidden markups. Every bag of cement and ton of rebar is accounted for.",
      },
    ],
    accent: "from-[#08b796] to-[#0a8f79]",
  },
  {
    tag: "R2",
    word: "Reach",
    title: "High-Impact Visual Marketing & Digital Authority",
    subtitle: "The Proof Engine",
    lede:
      "The same drone footage and CAD precision that reassure our clients also become our best sales material. Every build compounds our authority in the market.",
    features: [
      {
        h: "Cinematic progress content",
        p: "Weekly drone and site footage repurposed into case-study reels that show real builds, not stock renders.",
      },
      {
        h: "Revit-grade visualization",
        p: "Photoreal walkthroughs and structural renders that let prospects experience a project before ground is broken.",
      },
      {
        h: "Documented track record",
        p: "A growing public library of completed projects, before/after transformations, and client testimonials that outsell any brochure.",
      },
    ],
    accent: "from-[#0a8f79] to-[#08b796]",
  },
  {
    tag: "R3",
    word: "Relationships",
    title: "B2B Partnerships & Referral Networks",
    subtitle: "The Growth Multiplier",
    lede:
      "Our best clients arrive through people who already trust us — estate agents, mortgage partners, and diaspora associations who stake their own reputation on the referral.",
    features: [
      {
        h: "Realtor & developer alliances",
        p: "Structured partnerships with land agents and property developers who need a construction partner they can vouch for.",
      },
      {
        h: "Diaspora association channels",
        p: "Direct relationships with community and alumni groups abroad, where trust travels faster than advertising.",
      },
      {
        h: "Formal referral incentives",
        p: "A transparent commission structure that rewards every partner who brings us a client we deliver for.",
      },
    ],
    accent: "from-[#08b796] to-[#0a8f79]",
  },
  {
    tag: "R4",
    word: "Retention",
    title: "Structured Client Experience",
    subtitle: "The Retention Engine",
    lede:
      "The relationship doesn't end at handover. A structured post-completion experience turns finished clients into repeat clients — and into the referral network above.",
    features: [
      {
        h: "6–12 month defect liability warranty",
        p: "Guaranteed post-completion support, so issues are fixed as a matter of course, not a fight.",
      },
      {
        h: "Complete as-built dossier",
        p: "Full CAD drawings, electrical schematics, plumbing layouts, and structural certifications, handed over with the keys.",
      },
      {
        h: "Dedicated client portal",
        p: "One place to revisit project history, documents, and warranty claims long after the ribbon is cut.",
      },
    ],
    accent: "from-[#0a8f79] to-[#08b796]",
  },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-6");
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

function LoopDiagram() {
  const nodes = [
    { label: "De-risk", x: 90, y: 30 },
    { label: "Reach", x: 270, y: 30 },
    { label: "Retention", x: 90, y: 190 },
    { label: "Relationships", x: 270, y: 190 },
  ];
  return (
    <svg
      viewBox="0 0 360 220"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="The Four R's flow into one another: De-risk leads to Reach, which leads to Relationships, which leads to Retention, which loops back into Relationships through referrals."
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#08b796" />
        </marker>
      </defs>

      {/* connectors */}
      <line x1="130" y1="30" x2="230" y2="30" stroke="#08b796" strokeWidth="1.5" markerEnd="url(#arrow)" opacity="0.6" />
      <line x1="270" y1="55" x2="270" y2="165" stroke="#08b796" strokeWidth="1.5" markerEnd="url(#arrow)" opacity="0.6" />
      <line x1="230" y1="190" x2="130" y2="190" stroke="#08b796" strokeWidth="1.5" markerEnd="url(#arrow)" opacity="0.6" />
      <line x1="90" y1="165" x2="90" y2="55" stroke="#08b796" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" opacity="0.35" />

      {nodes.map((n) => (
        <g key={n.label} transform={`translate(${n.x},${n.y})`}>
          <circle r="26" fill="#1a1a1a" stroke="#08b796" strokeWidth="1.5" />
          <text
            textAnchor="middle"
            dy="5"
            className="fill-white"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px", fontWeight: 600 }}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function WhyBuildWithUs() {
  return (
    <main className="bg-[#fbfaf8] text-[#1a1a1a]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#1a1a1a] text-white">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:linear-gradient(#08b796_1px,transparent_1px),linear-gradient(90deg,#08b796_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 md:pt-36 md:pb-32">
          <Reveal>
            <p
              className="uppercase tracking-[0.25em] text-xs md:text-sm text-[#08b796] mb-6"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Why Build With Us
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1
              className="text-4xl md:text-6xl leading-[1.08] mb-8 max-w-3xl"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Four disciplines. One firm you never have to worry about.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p
              className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              We didn't set out to be another contractor. We built a firm around
              the four things that actually determine whether a diaspora build
              succeeds — starting with trust, and ending with a client who
              refers us to the next one.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FRAMEWORK OVERVIEW */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <div>
              <p
                className="uppercase tracking-[0.2em] text-xs text-[#08b796] mb-4"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                The Framework
              </p>
              <h2
                className="text-3xl md:text-4xl mb-6"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                The Four R's
              </h2>
              <p
                className="text-[#1a1a1a]/70 leading-relaxed"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                De-risking the build earns trust. Trust, documented well, becomes
                proof that <span className="text-[#08b796] font-medium">reaches</span> new
                clients. New clients arrive through the{" "}
                <span className="text-[#08b796] font-medium">relationships</span> we
                keep with partners on the ground. And a client we{" "}
                <span className="text-[#08b796] font-medium">retain</span> through a
                structured experience becomes the next referral — closing the
                loop.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <LoopDiagram />
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      {PILLARS.map((p, i) => (
        <section
          key={p.tag}
          className={`border-t border-[#1a1a1a]/10 ${i % 2 === 1 ? "bg-white" : "bg-[#f4f2ee]"}`}
        >
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
            <Reveal>
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  className={`text-xs font-semibold tracking-widest text-white px-2.5 py-1 rounded-full bg-gradient-to-r ${p.accent}`}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  {p.tag}
                </span>
                <span
                  className="uppercase tracking-[0.2em] text-xs text-[#1a1a1a]/50"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  {p.subtitle}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h3
                className="text-3xl md:text-5xl mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {p.title}
              </h3>
            </Reveal>

            <Reveal delay={140}>
              <p
                className="text-[#1a1a1a]/70 leading-relaxed max-w-2xl mt-6 mb-12"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {p.lede}
              </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {p.features.map((f, idx) => (
                <Reveal key={f.h} delay={200 + idx * 80}>
                  <div className="border-l-2 border-[#08b796] pl-5">
                    <h4
                      className="text-lg mb-2"
                      style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}
                    >
                      {f.h}
                    </h4>
                    <p
                      className="text-sm text-[#1a1a1a]/65 leading-relaxed"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      {f.p}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <Reveal>
            <h2
              className="text-3xl md:text-5xl mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to turn your blueprint into reality?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              className="text-white/70 max-w-xl mx-auto mb-10"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Whether it's a commercial development, a residential estate, or
              your private dream home — partner with a firm that treats your
              investment like its own.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-3.5 rounded-full bg-[#08b796] text-[#1a1a1a] font-medium hover:bg-[#0a8f79] hover:text-white transition-colors"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Schedule a Project Consultation
              </a>
              <a
                href="/boq-audit"
                className="px-8 py-3.5 rounded-full border border-white/30 text-white font-medium hover:border-[#08b796] hover:text-[#08b796] transition-colors"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Request a Free BOQ Audit
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
