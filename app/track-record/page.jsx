import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/content/Breadcrumbs'
import { TRACK_RECORD } from '@/lib/content/track-record'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }

export const metadata = pageMetadata({
    title: 'Our Track Record: Projects Delivered | Artemis Atelier',
    description: `Projects designed and built by Artemis Atelier (${SITE.rc}) in Lagos and Ogun State since ${SITE.founded}: year, type, location and our scope for each.`,
    path: '/track-record',
})

export default function TrackRecordPage() {
    // Only published once lib/content/track-record.js has real entries
    if (!TRACK_RECORD.length) notFound()
    const rows = [...TRACK_RECORD].sort((a, b) => String(b.year).localeCompare(String(a.year)))
    const completed = rows.filter(r => /complete/i.test(r.status || '')).length
    return (
        <>
            <Navigation />
            <main className="pt-[72px]">
                <div className="mx-auto max-w-[1000px] px-6 py-14 md:px-10 md:py-20">
                    <Breadcrumbs items={[{ name: 'About', path: '/about' }, { name: 'Track record', path: '/track-record' }]} />
                    <h1 className="mb-4 text-[38px] leading-tight md:text-[50px]" style={serif}>Our track record</h1>
                    <p className="mb-10 max-w-2xl text-[16px] leading-relaxed text-[#555]">
                        {rows.length} project{rows.length === 1 ? '' : 's'} since {SITE.founded}{completed ? `, ${completed} completed` : ''}. Ask us for references or a site visit to any project marked completed.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
                            <thead>
                                <tr className="border-b-2 border-[#1a1a1a] text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b]">
                                    <th className="py-3 pr-4">Year</th><th className="py-3 pr-4">Project</th><th className="py-3 pr-4">Location</th><th className="py-3 pr-4">Our scope</th><th className="py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, i) => (
                                    <tr key={i} className="border-b border-[#e6e6e6]">
                                        <td className="py-3 pr-4 tabular-nums">{r.year}</td>
                                        <td className="py-3 pr-4 font-medium text-[#1a1a1a]">{r.link ? <Link href={r.link} className="underline decoration-[#08b796] underline-offset-[3px]">{r.type}</Link> : r.type}</td>
                                        <td className="py-3 pr-4">{r.location}</td>
                                        <td className="py-3 pr-4">{r.scope}</td>
                                        <td className="py-3">{r.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
