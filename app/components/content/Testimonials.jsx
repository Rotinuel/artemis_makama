import { TRUST } from '@/lib/trust'

/** Real client testimonials from lib/trust.js (renders nothing until added) */
export default function Testimonials({ title = 'What our clients say', dark = false }) {
    const list = TRUST.testimonials || []
    if (!list.length) return null
    return (
        <section aria-labelledby="testimonials-title" className={dark ? 'bg-[#111] text-white' : 'bg-[#f6f5f2]'}>
            <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10">
                <h2 id="testimonials-title" className="mb-8 text-[30px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {list.map((t, i) => (
                        <figure key={i} className={`border p-6 ${dark ? 'border-white/15' : 'border-[#e2e0db] bg-white'}`}>
                            <blockquote className={`mb-4 text-[15px] leading-relaxed ${dark ? 'text-white/85' : 'text-[#333]'}`}>“{t.quote}”</blockquote>
                            <figcaption className="text-[13px]">
                                <span className="font-semibold">{t.name}</span>
                                <span className={dark ? 'text-white/55' : 'text-[#777]'}>{[t.location, t.project, t.year].filter(Boolean).map(s => ` · ${s}`).join('')}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
