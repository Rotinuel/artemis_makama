import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/content/Breadcrumbs'
import ReviewForm from './ReviewForm'
import { pageMetadata } from '@/lib/seo'
import { TRUST } from '@/lib/trust'

// The link you send clients after handover. Kept out of search results.
export const metadata = pageMetadata({
    title: 'Review Your Project | Artemis Atelier',
    description: 'Built or designed with Artemis Atelier? Tell other clients what it was like. Reviews are checked before they appear on our website.',
    path: '/review',
    noindex: true,
})

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }

export default function ReviewPage() {
    return (
        <>
            <Navigation />
            <main className="bg-[#f4f2ee] pt-[72px]">
                <div className="mx-auto max-w-[760px] px-6 py-14 md:py-20">
                    <Breadcrumbs items={[{ name: 'Review your project', path: '/review' }]} />
                    <h1 className="mb-3 text-[36px] leading-tight md:text-[46px]" style={serif}>How was your project with us?</h1>
                    <p className="mb-10 max-w-xl text-[15px] leading-relaxed text-[#555]">
                        Your review helps other families, many of them building from abroad, decide who to trust. It takes two minutes. We check every review before it is published, and your email is never shown.
                    </p>
                    <ReviewForm googleReviewUrl={TRUST.googleReviewUrl || ''} />
                </div>
            </main>
            <Footer />
        </>
    )
}
