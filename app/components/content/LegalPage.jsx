import Navigation from '../Navigation'
import Footer from '../Footer'
import Breadcrumbs from './Breadcrumbs'
import Blocks from './Blocks'

export default function LegalPage({ page }) {
    return (
        <>
            <Navigation />
            <main className="pt-[72px]">
                <div className="mx-auto max-w-[800px] px-6 py-14 md:py-20">
                    <Breadcrumbs items={page.breadcrumbs} />
                    <h1 className="mb-3 text-[40px] leading-tight text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{page.h1}</h1>
                    <p className="mb-10 text-[13px] text-[#8a8a8a]">Last updated {page.updatedLabel}</p>
                    <Blocks blocks={page.blocks} />
                </div>
            </main>
            <Footer />
        </>
    )
}
