import { TRUST } from '@/lib/trust'
import { createPublicClient } from '@/utils/supabase/public'

/**
 * Real client reviews: approved ones from the /review form (Supabase
 * view public_reviews) plus any added by hand in lib/trust.js.
 * Renders nothing until at least one exists.
 */
async function approvedReviews() {
    try {
        const { data } = await createPublicClient()
            .from('public_reviews')
            .select('display_name, location, project, year, rating, quote')
            .order('created_at', { ascending: false })
            .limit(6)
        return (data || []).map(r => ({ quote: r.quote, name: r.display_name, location: r.location, project: r.project, year: r.year, rating: r.rating }))
    } catch {
        return []
    }
}

function Stars({ n }) {
    if (!n) return null
    return (
        <p className="mb-3 text-[16px] tracking-[2px] text-[#eda100]" aria-label={`${n} out of 5 stars`}>
            {'★'.repeat(n)}<span className="text-[#d9d9d9]">{'★'.repeat(5 - n)}</span>
        </p>
    )
}

export default async function Testimonials({ title = 'What our clients say', dark = false }) {
    const list = [...(TRUST.testimonials || []), ...(await approvedReviews())].slice(0, 6)
    if (!list.length) return null
    return (
        <section aria-labelledby="testimonials-title" className={dark ? 'bg-[#111] text-white' : 'bg-[#f6f5f2]'}>
            <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10">
                <h2 id="testimonials-title" className="mb-8 text-[30px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {list.map((t, i) => (
                        <figure key={i} className={`border p-6 ${dark ? 'border-white/15' : 'border-[#e2e0db] bg-white'}`}>
                            <Stars n={t.rating} />
                            <blockquote className={`mb-4 text-[15px] leading-relaxed ${dark ? 'text-white/85' : 'text-[#333]'}`}>“{t.quote}”</blockquote>
                            <figcaption className="text-[13px]">
                                <span className="font-semibold">{t.name}</span>
                                <span className={dark ? 'text-white/55' : 'text-[#777]'}>{[t.location, t.project, t.year].filter(Boolean).map(s => ` · ${s}`).join('')}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
                {TRUST.googleBusinessProfileUrl && (
                    <p className={`mt-8 text-[14px] ${dark ? 'text-white/70' : 'text-[#555]'}`}>
                        More reviews on <a href={TRUST.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer" className="underline">our Google Business Profile</a>.
                    </p>
                )}
            </div>
        </section>
    )
}
