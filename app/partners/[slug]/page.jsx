import { FileText, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/content/Breadcrumbs";
import { getPartnerBySlug, getAllPartnerSlugs } from "../../../lib/partners";
import { pageMetadata } from "@/lib/seo";
import { TRUST } from "@/lib/trust";
import { whatsappLink } from "@/lib/site";

/**
 * Individual partner page — e.g. /partners/insurance-partner
 *
 * Shows the partner's info plus a list of downloadable PDFs.
 * Add documents for a partner in lib/partners.js (each partner's
 * `documents` array). Put the actual PDF files in /public/documents/
 * and reference them here starting with a leading slash, e.g.
 * "/documents/insurer-policy.pdf".
 */

// Pre-render a static page for every known partner at build time.
export function generateStaticParams() {
    return getAllPartnerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const partner = getPartnerBySlug(slug);
    if (!partner) return {};
    return pageMetadata({
        title: partner.seoTitle || `${partner.name}: ${partner.role} | Artemis Atelier`,
        description: partner.seoDescription || `${partner.name} — ${partner.summary}`.slice(0, 155),
        path: `/partners/${slug}`,
        // Placeholder partners (no signed agreement yet) stay out of search results
        noindex: !!partner.placeholder,
    });
}

export default async function PartnerDetailPage({ params }) {
    const { slug } = await params;
    const partner = getPartnerBySlug(slug);

    if (!partner) {
        notFound();
    }

    // Partner PDFs, plus the redacted insurance certificate once it's added in lib/trust.js
    const documents = [
        ...(partner.documents || []),
        ...(partner.insurance && TRUST.insuranceCertificateUrl
            ? [{ name: "Insurance certificate (redacted)", url: TRUST.insuranceCertificateUrl }]
            : []),
    ];

    const initials = partner.name
        .split(" ")
        .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500&display=swap');
        .aal-serif { font-family: 'Fraunces', serif; font-weight: 500; }
        .aal-sans { font-family: 'Inter', sans-serif; }
        .aal-accent { color: #08b796; }
        .aal-accent-border { border-color: #08b796; }
      `}</style>

            <Navigation />

            <section className="aal-sans mx-auto max-w-3xl px-6 pb-20 pt-28 md:pt-36">
                <Breadcrumbs items={[{ name: "Partners", path: "/partners" }, { name: partner.name, path: `/partners/${slug}` }]} schemaOnly />
                <Link
                    href="/partners"
                    className="aal-accent mb-10 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Partners
                </Link>

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 text-base tracking-wide text-zinc-500">
                    {initials || "AA"}
                </div>

                <p className="aal-accent mb-3 text-xs uppercase tracking-[0.15em]">
                    {partner.role}
                </p>
                <h1 className="aal-serif mb-6 text-3xl leading-tight text-zinc-900 md:text-4xl">
                    {partner.name}
                </h1>
                <p className="mb-12 max-w-2xl text-base leading-relaxed text-zinc-600">
                    {partner.summary}
                </p>

                {partner.protects?.length > 0 && (
                    <div className="mb-12 border-t border-zinc-200 pt-10">
                        <h2 className="aal-serif mb-5 text-xl text-zinc-900">
                            What this partnership means for your project
                        </h2>
                        <ul className="flex flex-col gap-3">
                            {partner.protects.map((p) => (
                                <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-zinc-700">
                                    <span className="aal-accent">✓</span>
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm text-zinc-500">
                            See how this fits into <Link href="/how-we-build" className="underline">how we build</Link> and{" "}
                            <Link href="/build-from-abroad" className="underline">building from abroad</Link>.
                        </p>
                    </div>
                )}

                {partner.steps?.length > 0 && (
                    <div className="mb-10 border-t border-zinc-200 pt-10">
                        <h2 className="aal-serif mb-6 text-xl text-zinc-900">How it works</h2>
                        <ol className="space-y-3">
                            {partner.steps.map((step, i) => (
                                <li key={step} className="flex gap-4 text-sm leading-relaxed text-zinc-700">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#08b796] text-xs font-semibold text-white">{i + 1}</span>
                                    <span className="pt-1">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {partner.links?.length > 0 && (
                    <div className="mb-10 border-t border-zinc-200 pt-10">
                        <h2 className="aal-serif mb-6 text-xl text-zinc-900">Useful links</h2>
                        <ul className="flex flex-col gap-3">
                            {partner.links.map((l) => (
                                <li key={l.url}>
                                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-sm border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-900 transition-colors duration-300 hover:border-zinc-400">
                                        {l.name}<span aria-hidden="true" className="text-zinc-400">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="border-t border-zinc-200 pt-10">
                    <h2 className="aal-serif mb-6 text-xl text-zinc-900">
                        Documents
                    </h2>

                    {documents.length > 0 ? (
                        <ul className="flex flex-col gap-3">
                            {documents.map((doc) => (
                                <li key={doc.url}>
                                    <a
                                        href={doc.url}
                                        download
                                        className="group flex items-center justify-between gap-4 rounded-sm border border-zinc-200 bg-white px-5 py-4 transition-colors duration-300 hover:border-zinc-400"
                                    >
                                        <span className="flex items-center gap-3">
                                            <FileText
                                                className="aal-accent h-4 w-4 shrink-0"
                                                strokeWidth={1.5}
                                            />
                                            <span className="text-sm text-zinc-900">{doc.name}</span>
                                        </span>
                                        <Download
                                            className="h-4 w-4 shrink-0 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-900"
                                            strokeWidth={1.5}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm leading-relaxed text-zinc-500">
                            Documents for this partner (such as a redacted policy certificate or product sheets) are available on request. <a href={whatsappLink(`Hi Artemis, please send me the documents for ${partner.name}.`)} target="_blank" rel="noopener noreferrer" className="underline">Ask us on WhatsApp</a>.
                        </p>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
}