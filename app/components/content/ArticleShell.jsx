import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../Navigation'
import Footer from '../Footer'
import JsonLd from '../JsonLd'
import Breadcrumbs from './Breadcrumbs'
import Blocks from './Blocks'
import Faq from './Faq'
import ConsultCard from './ConsultCard'
import Inline, { slugify } from './Inline'
import { CurrencyProvider, CurrencyToggle } from './Currency'
import { articleSchema, serviceSchema } from '@/lib/seo'
import { TRUST } from '@/lib/trust'

function fmtDate(ymd) {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/**
 * Shared layout for guides, service pages and hubs.
 * `page` is a plain object from lib/content/* (see any guide for the shape).
 */
export default function ArticleShell({ page, rates = null, priceBoard = null, nodes = {}, children }) {
    const toc = (page.blocks || []).filter(b => b.t === 'h2').map(b => ({ id: b.id || slugify(b.text), text: b.text.replace(/\*\*/g, '') }))
    const reviewer = TRUST.guideReviewer
    const isGuide = page.kind === 'guide'

    const schema = page.kind === 'service'
        ? serviceSchema({ name: page.serviceName || page.h1, description: page.description, path: page.path, serviceType: page.serviceType })
        : articleSchema({
            title: page.h1, description: page.description, path: page.path, image: page.hero,
            published: page.published || page.updated, modified: page.updated,
            author: isGuide && reviewer ? reviewer : null,
        })

    const body = (
        <>
            <JsonLd data={schema} />
            <Navigation />

            {/* ── Header ── */}
            <header className="relative overflow-hidden bg-[#111] pt-[72px] text-white">
                {page.hero && (
                    <>
                        <Image src={page.hero} alt={page.heroAlt || ''} fill priority sizes="100vw" className="object-cover opacity-35" />
                        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111 0%, rgba(17,17,17,0.7) 50%, rgba(17,17,17,0.3) 100%)' }} />
                    </>
                )}
                <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-16">
                    <Breadcrumbs items={page.breadcrumbs} light />
                    {page.eyebrow && <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">{page.eyebrow}</p>}
                    <h1 className="max-w-3xl text-[36px] leading-[1.08] md:text-[52px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>{page.h1}</h1>
                    {page.intro && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80"><Inline text={page.intro} /></p>}
                    {(page.updated || isGuide) && (
                        <p className="mt-6 text-[12px] text-white/55">
                            {isGuide && (reviewer
                                ? <>Reviewed by <span className="text-white/85">{reviewer.name}</span>{reviewer.credentials ? `, ${reviewer.credentials}` : ''} · </>
                                : <>By the Artemis Atelier editorial team · </>)}
                            {page.updated && <>Last verified <time dateTime={page.updated}>{fmtDate(page.updated)}</time></>}
                        </p>
                    )}
                </div>
            </header>

            {/* ── Body ── */}
            <main className="mx-auto grid max-w-[1200px] gap-12 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
                <article className="min-w-0">
                    {page.currency && rates && (
                        <div className="mb-8 border-b border-[#eee] pb-5"><CurrencyToggle /></div>
                    )}
                    {page.summary && (
                        <div className="mb-10 bg-[#f6f5f2] p-6">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#067a64]">The short answer</p>
                            {Array.isArray(page.summary)
                                ? <ul className="space-y-2 text-[15px] leading-relaxed text-[#333]">{page.summary.map((s, i) => <li key={i} className="flex gap-2"><span className="text-[#08b796]">—</span><span><Inline text={s} /></span></li>)}</ul>
                                : <p className="text-[15px] leading-relaxed text-[#333]"><Inline text={page.summary} /></p>}
                        </div>
                    )}

                    <Blocks blocks={page.blocks} ctx={{ priceBoard, nodes }} />

                    {children}

                    {page.faqs?.length > 0 && <div className="mt-14"><Faq faqs={page.faqs} /></div>}

                    {page.sources?.length > 0 && (
                        <section className="mt-14 border-t border-[#eee] pt-6" aria-labelledby="sources-title">
                            <h2 id="sources-title" className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b6b6b]">Sources and how we checked</h2>
                            <ul className="space-y-1.5 text-[13px] leading-relaxed text-[#6b6b6b]">
                                {page.sources.map((s, i) => (
                                    <li key={i}>
                                        {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1a1a1a]">{s.name}</a> : s.name}
                                        {s.date && <> ({s.date})</>}{s.note && <> — {s.note}</>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </article>

                <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                    {toc.length > 2 && (
                        <nav aria-label="On this page" className="hidden lg:block">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6b6b]">On this page</p>
                            <ul className="space-y-2 border-l border-[#e6e6e6] pl-4 text-[13px]">
                                {toc.map(t => <li key={t.id}><a href={`#${t.id}`} className="text-[#555] hover:text-[#1a1a1a]">{t.text}</a></li>)}
                            </ul>
                        </nav>
                    )}
                    <ConsultCard {...(page.consult || {})} whatsappText={page.whatsappText} />
                </aside>
            </main>

            {/* ── Related ── */}
            {page.related?.length > 0 && (
                <section className="border-t border-[#eee] bg-[#f6f5f2]" aria-labelledby="related-title">
                    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10">
                        <h2 id="related-title" className="mb-6 text-[26px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Keep reading</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {page.related.map(r => (
                                <Link key={r.href} href={r.href} className="block border border-[#e2e0db] bg-white p-5 transition-colors hover:border-[#1a1a1a]">
                                    <p className="mb-1 text-[15px] font-semibold text-[#1a1a1a]">{r.label}</p>
                                    {r.text && <p className="text-[13px] leading-relaxed text-[#666]">{r.text}</p>}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Closing CTA ── */}
            {page.cta && (
                <section className="bg-[#111] text-white">
                    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10">
                        <div>
                            <p className="text-[28px] leading-tight md:text-[34px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{page.cta.title}</p>
                            {page.cta.text && <p className="mt-2 max-w-xl text-[15px] text-white/70">{page.cta.text}</p>}
                        </div>
                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                            <Link href={page.cta.href} className="rounded-full bg-[#08b796] px-7 py-3.5 text-center text-[13px] font-medium text-[#04120f] hover:bg-white">{page.cta.label}</Link>
                            {page.cta.secondary && <Link href={page.cta.secondary.href} className="rounded-full border border-white/40 px-7 py-3.5 text-center text-[13px] font-medium text-white hover:border-[#08b796] hover:text-[#08b796]">{page.cta.secondary.label}</Link>}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </>
    )

    return page.currency && rates ? <CurrencyProvider rates={rates}>{body}</CurrencyProvider> : body
}
