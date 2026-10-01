"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { whatsappLink, SITE } from "@/lib/site";

/**
 * Homepage body: why clients choose Artemis, what we do, the five layers of
 * protection, how it works, our commitment, and a closing call to action.
 * Copy follows the SEO & conversion plan: written for the client (what they
 * get), not about our internal strategy.
 */

const REASONS = [
  {
    n: "01",
    h: "You see everything.",
    p: "Live camera access to your site, plus drone footage of progress. You watch your building rise from London, Houston or Toronto, not through a relative's phone.",
  },
  {
    n: "02",
    h: "You control the money.",
    p: "Your funds are released in stages: foundation, frame, roof and finishing. An independent inspector checks each stage before the next payment.",
  },
  {
    n: "03",
    h: "You know every cost.",
    p: "Our bill of quantities is open-book. Every bag of cement and every tonne of steel is itemised, with no hidden mark-ups.",
  },
  {
    n: "04",
    h: "You are covered after handover.",
    p: "A 6 to 12 month defect liability period, and a complete handover pack: architectural drawings, electrical and plumbing layouts, and structural certificates.",
  },
];

const SERVICES = [
  { h: "Architecture & design", p: "Plans, 3D visuals and approvals-ready drawings." },
  { h: "Construction", p: "New homes, duplexes, estates, churches and commercial buildings." },
  { h: "Renovation & interiors", p: "Remodelling, fit-outs, kitchens, wardrobes and wall finishes." },
  { h: "Project management", p: "We manage your project, your budget and your contractors, and we report to you every week." },
];

const PROTECTION_LAYERS = [
  { n: "01", label: "Artemis Atelier Ltd", desc: "Responsible for the agreed architectural, construction and project-management obligations." },
  { n: "02", label: "Independent Inspector", desc: "Verifies agreed construction milestones before any payment is released." },
  { n: "03", label: "Insurance Partner", desc: "Provides applicable coverage under an issued policy, subject to its terms." },
  { n: "04", label: "Digital Records", desc: "Evidence of project activity — photographs, videos, reports and documentation." },
  { n: "05", label: "Contractual Controls", desc: "Defined scope, payments, variations, responsibilities and dispute procedures." },
];

const STEPS = [
  { h: "Free consultation", p: "By video call or WhatsApp, at a time that suits your time zone." },
  { h: "Design and estimate", p: "Drawings and an open-book cost estimate you can check line by line." },
  { h: "Contract", p: "Agreed stages, payments and an inspection schedule, in writing." },
  { h: "Build", p: "Live site access and weekly updates from start to finish." },
  { h: "Handover", p: "Keys, a full document pack and a defect liability period." },
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

const serif = { fontFamily: "Cormorant Garamond, serif" };
const sans = { fontFamily: "DM Sans, sans-serif" };

function Eyebrow({ children, className = "" }) {
  return (
    <p className={`uppercase tracking-[0.2em] text-xs text-[#08b796] mb-4 ${className}`} style={sans}>
      {children}
    </p>
  );
}

export default function WhyBuildWithUs() {
  return (
    <main className="bg-[#fbfaf8] text-aal-black">
      {/* WHY CLIENTS CHOOSE US */}
      <section className="relative overflow-hidden bg-aal-black text-white">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(#08b796_1px,transparent_1px),linear-gradient(90deg,#08b796_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <Reveal>
            <Eyebrow className="md:text-sm mb-6">Why clients choose us</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-6xl leading-[1.08] mb-8 max-w-3xl" style={serif}>
              Building from abroad should not cost you sleep.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed mb-16" style={sans}>
              Most diaspora building stories end the same way: money sent home, photos that never come,
              and a site that has barely moved. We built Artemis Atelier to make that impossible.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12">
            {REASONS.map((r, idx) => (
              <Reveal key={r.n} delay={120 + idx * 80}>
                <div className="border-l-2 border-[#08b796] pl-6">
                  <span className="block text-3xl text-[#08b796]/50 mb-2" style={serif}>{r.n}</span>
                  <h3 className="text-xl mb-2" style={{ ...sans, fontWeight: 600 }}>{r.h}</h3>
                  <p className="text-sm text-white/65 leading-relaxed" style={sans}>{r.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <Reveal>
          <Eyebrow>What we do</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-3xl md:text-5xl mb-12" style={serif}>One team from drawing to keys.</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-aal-black/10">
          {SERVICES.map((s, idx) => (
            <Reveal key={s.h} delay={120 + idx * 70} className="bg-[#fbfaf8]">
              <div className="p-7 h-full">
                <div className="w-2 h-2 rounded-full bg-[#08b796] mb-5" />
                <h3 className="text-lg mb-2" style={{ ...sans, fontWeight: 600 }}>{s.h}</h3>
                <p className="text-sm text-aal-black/65 leading-relaxed" style={sans}>{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROTECTION STRUCTURE */}
      <section className="bg-aal-black text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <Reveal>
            <Eyebrow className="text-center">You don&apos;t have to trust us blindly</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl mb-16 text-center" style={serif}>
              Five layers between your money and the risk.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-6">
            {PROTECTION_LAYERS.map((layer, idx) => (
              <Reveal key={layer.n} delay={100 + idx * 80}>
                <div className="text-center md:text-left">
                  <span className="text-3xl text-[#08b796]/40 block mb-3" style={serif}>{layer.n}</span>
                  <h3 className="text-sm mb-2" style={{ ...sans, fontWeight: 600 }}>{layer.label}</h3>
                  <p className="text-xs text-white/60 leading-relaxed" style={sans}>{layer.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-t border-aal-black/10">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl mb-12" style={serif}>From first call to keys in five steps.</h2>
          </Reveal>
          <ol className="grid md:grid-cols-5 gap-8">
            {STEPS.map((s, idx) => (
              <li key={s.h} className="list-none">
                <Reveal delay={120 + idx * 70}>
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-aal-black text-white text-sm mb-4" style={sans}>
                    {idx + 1}
                  </span>
                  <h3 className="text-base mb-1" style={{ ...sans, fontWeight: 600 }}>{s.h}</h3>
                  <p className="text-sm text-aal-black/60 leading-relaxed" style={sans}>{s.p}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* OUR COMMITMENT */}
      <section className="bg-[#f4f2ee] border-t border-aal-black/10">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24">
          <Reveal>
            <Eyebrow>Honesty over hype</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <div className="border-l-2 border-[#08b796] pl-6">
              <p className="text-sm uppercase tracking-[0.15em] text-aal-black/50 mb-3" style={sans}>
                Our commitment is to
              </p>
              <p className="text-lg md:text-xl leading-relaxed" style={serif}>
                Identify risks early. Communicate them promptly. Document decisions. Control changes.
                Report progress honestly. Manage the project professionally.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="bg-aal-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl mb-6" style={serif}>Ready to build without the worry?</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-white/70 max-w-xl mx-auto mb-10 leading-relaxed" style={sans}>
              Tell us about your land, your budget and your timeline. We will reply within one working day
              with honest advice, even if it is to wait.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-full bg-[#08b796] text-aal-black font-medium hover:bg-white transition-colors"
                style={sans}
              >
                Book a free consultation
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full border border-white/30 text-white font-medium hover:border-[#08b796] hover:text-[#08b796] transition-colors"
                style={sans}
              >
                WhatsApp {SITE.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
