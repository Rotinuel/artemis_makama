import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/content/Breadcrumbs'
import { pageMetadata } from '@/lib/seo'
import { SITE, absoluteUrl } from '@/lib/site'
import { TRUST } from '@/lib/trust'

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }

export const metadata = pageMetadata({
    title: 'Press & Media Kit | Artemis Atelier',
    description: 'Facts, a company description, logo and contacts for journalists, partners and directories writing about or linking to Artemis Atelier Ltd, Lagos.',
    path: '/press',
})

const BOILERPLATE = `Artemis Atelier Ltd (${SITE.rc}) is a Lagos design and construction firm founded in ${SITE.founded}. It designs, builds and renovates homes, estates, churches and commercial buildings in Lagos and Ogun State, for clients in Nigeria and abroad. Every project is priced in an open-book bill of quantities and built in six inspected stages, with payment for each stage released only after inspection, and clients can follow their site on a live camera from anywhere in the world.`

export default function PressPage() {
    const facts = [
        ['Legal name', SITE.name],
        ['Registration', `CAC ${SITE.rc}`],
        ['Founded', SITE.founded],
        ['Studio', SITE.address.full],
        ['Managing Director', 'Chief Chinedu Edward Makama, MBA'],
        ...(TRUST.registrations || []).map(r => [`${r.body} registration`, `${r.person}, ${r.number}`]),
        ['Areas served', 'Lagos, Ogun State and clients building from abroad (UK, US, Canada and beyond)'],
        ['Website', SITE.url],
    ]
    const linkHtml = `<a href="${SITE.url}">Artemis Atelier, building contractor in Lagos</a>`
    return (
        <>
            <Navigation />
            <main className="pt-[72px]">
                <div className="mx-auto max-w-[900px] px-6 py-14 md:px-10 md:py-20">
                    <Breadcrumbs items={[{ name: 'About', path: '/about' }, { name: 'Press & media kit', path: '/press' }]} />
                    <h1 className="mb-4 text-[38px] leading-tight md:text-[50px]" style={serif}>Press and media kit</h1>
                    <p className="mb-12 max-w-2xl text-[16px] leading-relaxed text-[#555]">
                        For journalists, partners, professional bodies and directories. Use anything on this page; for interviews, photos or project details, contact us below.
                    </p>

                    <h2 className="mb-4 text-[26px]" style={serif}>About Artemis Atelier</h2>
                    <p className="mb-12 border-l-2 border-[#08b796] pl-5 text-[16px] leading-relaxed text-[#333]">{BOILERPLATE}</p>

                    <h2 className="mb-4 text-[26px]" style={serif}>Company facts</h2>
                    <dl className="mb-12 divide-y divide-[#e6e6e6] border-y border-[#e6e6e6]">
                        {facts.map(([k, v]) => (
                            <div key={k} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr]">
                                <dt className="text-[12px] uppercase tracking-[0.1em] text-[#8a8a8a]">{k}</dt>
                                <dd className="text-[15px] text-[#1a1a1a]">{v}</dd>
                            </div>
                        ))}
                    </dl>

                    <h2 className="mb-4 text-[26px]" style={serif}>Logo</h2>
                    <p className="mb-12 text-[15px] leading-relaxed text-[#333]">
                        <a href={SITE.logo} download className="underline decoration-[#08b796] underline-offset-[3px]">Download the logo (PNG)</a>. Please don’t stretch, recolour or crop it.
                    </p>

                    <h2 className="mb-4 text-[26px]" style={serif}>Linking to us</h2>
                    <p className="mb-3 text-[15px] leading-relaxed text-[#333]">If you list or mention us, this link and wording help readers find the right page:</p>
                    <pre className="mb-4 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#f6f5f2] p-4 text-[13px] text-[#333]">{linkHtml}</pre>
                    <p className="mb-12 text-[15px] leading-relaxed text-[#333]">
                        Writing for people building from abroad? Link to <Link href="/build-from-abroad" className="underline">{absoluteUrl('/build-from-abroad')}</Link> or our <Link href="/guides/cost-of-building-a-house-in-nigeria" className="underline">2026 cost guide</Link>.
                    </p>

                    <h2 className="mb-4 text-[26px]" style={serif}>Press contact</h2>
                    <p className="text-[15px] leading-relaxed text-[#333]">
                        <a href={`mailto:${SITE.email}?subject=Press%20enquiry`} className="underline">{SITE.email}</a> · {SITE.phone} (Monday to Saturday, 09:00–17:00 Lagos time)
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}
