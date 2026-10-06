import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import JsonLd from '../../components/JsonLd'
import Breadcrumbs from '../../components/content/Breadcrumbs'
import ConsultCard from '../../components/content/ConsultCard'
import { PROJECT_FACTS } from '@/lib/content/projects'
import { ORG_ID } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

/** A named project page, e.g. /portfolio/epe-catholic-church-complex */
export default function NamedProject({ project: p, others = [] }) {
    const path = `/portfolio/${p.slug}`
    const facts = PROJECT_FACTS.filter(([k]) => p[k])
    const isDesign = !p.completed && (/proposed/i.test(p.status || '') || /^Proposed/i.test(p.name))
    const badge = p.completed ? { t: 'Completed', c: '#08b796' } : isDesign ? { t: 'Design · not yet built', c: '#4a3aa7' } : p.status ? { t: p.status, c: '#2a78d6' } : null
    const story = [['The brief', p.brief], ['What we did', p.approach], ['The result', p.result]].filter(([, v]) => v)

    return (
        <>
            <JsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: p.name,
                description: p.summary,
                url: absoluteUrl(path),
                creator: { '@id': ORG_ID },
                image: p.images.map(i => absoluteUrl(i.src)),
                ...(p.year ? { dateCreated: p.year } : {}),
                ...(p.completed ? { dateModified: p.completed } : {}),
                locationCreated: { '@type': 'Place', name: p.location, address: { '@type': 'PostalAddress', addressLocality: p.location, addressCountry: 'NG' } },
                genre: p.type,
            }} />
            <Navigation />
            <main className="pt-[72px]">
                <header className="mx-auto max-w-[1200px] px-6 pb-8 pt-10 md:px-10 md:pt-14">
                    <Breadcrumbs items={[{ name: 'Projects', path: '/portfolio' }, { name: p.name, path }]} />
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#08b796]">{[p.type, p.location].filter(Boolean).join(' · ')}</p>
                    <h1 className="max-w-4xl text-[36px] leading-[1.08] text-[#1a1a1a] md:text-[52px]" style={serif}>{p.name}</h1>
                    {badge && (
                        <p className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold text-white" style={{ background: badge.c }}>{badge.t}</p>
                    )}
                </header>

                <div className="mx-auto max-w-[1200px] px-6 md:px-10">
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#f2f2f2]">
                        <Image src={p.images[0].src} alt={p.images[0].alt} fill priority sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover" />
                    </div>
                </div>

                <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0">
                        <p className="mb-8 text-[18px] leading-relaxed text-[#333]">{p.summary}</p>

                        {facts.length > 0 && (
                            <dl className="mb-10 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-[#e6e6e6] py-6 sm:grid-cols-3">
                                {facts.map(([k, label]) => (
                                    <div key={k}>
                                        <dt className="mb-1 text-[11px] uppercase tracking-[0.12em] text-[#8a8a8a]">{label}</dt>
                                        <dd className="text-[15px] text-[#1a1a1a]">{p[k]}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {story.length > 0 && (
                            <div className="mb-10 space-y-6">
                                {story.map(([h, t]) => (
                                    <section key={h}>
                                        <h2 className="mb-2 text-[24px] text-[#1a1a1a]" style={serif}>{h}</h2>
                                        <p className="text-[16px] leading-relaxed text-[#333]">{t}</p>
                                    </section>
                                ))}
                            </div>
                        )}

                        {p.review?.quote && (
                            <figure className="mb-10 border-l-4 border-[#08b796] bg-[#f6f5f2] p-6">
                                <blockquote className="text-[18px] leading-relaxed text-[#1a1a1a]" style={serif}>“{p.review.quote}”</blockquote>
                                <figcaption className="mt-3 text-[13px] text-[#555]"><span className="font-semibold">{p.review.name}</span>{p.review.location ? ` · ${p.review.location}` : ''}</figcaption>
                            </figure>
                        )}

                        {p.images.length > 1 && (
                            <div className="mb-10 grid gap-4 sm:grid-cols-2">
                                {p.images.slice(1).map(img => (
                                    <figure key={img.src}>
                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#f2f2f2]">
                                            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                                        </div>
                                        {(img.caption || img.date) && <figcaption className="mt-2 text-[13px] text-[#777]">{[img.caption, img.date].filter(Boolean).join(' · ')}</figcaption>}
                                    </figure>
                                ))}
                            </div>
                        )}

                        <h2 className="mb-4 text-[28px] text-[#1a1a1a]" style={serif}>Planning something similar?</h2>
                        <p className="mb-4 text-[16px] leading-relaxed text-[#333]">
                            {isDesign
                                ? 'We design every project for its plot, budget and approvals, then price it in an open-book bill of quantities so you know what it costs to build before you start.'
                                : 'We build in inspected stages with an open-book bill of quantities, a live site camera and weekly reports, so you can follow every step from home or abroad.'}
                        </p>
                        <ul className="mb-8 space-y-2 text-[15px] text-[#333]">
                            <li>→ <Link href="/services/design-and-build" className="underline">Design and build</Link></li>
                            <li>→ <Link href="/how-we-build" className="underline">How we build, stage by stage</Link></li>
                            <li>→ <Link href="/guides/cost-of-building-a-house-in-nigeria" className="underline">What a project like this costs in 2026</Link></li>
                        </ul>
                    </div>
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <ConsultCard
                            title="Book a consultation about a similar build"
                            text="Free 20-minute call about your plot, budget and timeline, by video or WhatsApp."
                            primary={{ label: 'Book a consultation', href: '/build-from-abroad#book' }}
                            whatsappText={`Hi Artemis, I saw "${p.name}" on your website and would like to discuss a similar project.`}
                        />
                    </aside>
                </div>

                {others.length > 0 && (
                    <section className="border-t border-[#eee] bg-[#f6f5f2]">
                        <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10">
                            <h2 className="mb-6 text-[26px] text-[#1a1a1a]" style={serif}>More projects</h2>
                            <div className="grid gap-6 sm:grid-cols-3">
                                {others.map(o => (
                                    <Link key={o.slug} href={`/portfolio/${o.slug}`} className="group block">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e7e2]">
                                            <Image src={o.images[0].src} alt={o.images[0].alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                        <p className="mt-3 text-[15px] font-medium text-[#1a1a1a]">{o.name}</p>
                                        <p className="text-[13px] text-[#777]">{o.location}</p>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/portfolio" className="mt-8 inline-block text-[12px] uppercase tracking-[0.1em] text-[#1a1a1a] underline">All projects</Link>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    )
}
