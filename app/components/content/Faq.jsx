import Inline from './Inline'
import JsonLd from '../JsonLd'
import { faqSchema } from '@/lib/seo'

/** Questions & answers (native disclosure, no JS) + FAQPage schema */
export default function Faq({ faqs = [], title = 'Questions people ask', id = 'faq', withSchema = true, dark = false }) {
    if (!faqs.length) return null
    return (
        <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
            {withSchema && <JsonLd data={faqSchema(faqs)} />}
            <h2 id={`${id}-title`} className={`mb-6 text-[26px] md:text-[32px] leading-tight ${dark ? 'text-white' : 'text-[#1a1a1a]'}`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</h2>
            <div className={`border-t ${dark ? 'border-white/15' : 'border-[#e6e6e6]'}`}>
                {faqs.map((f, i) => (
                    <details key={i} className={`group border-b ${dark ? 'border-white/15' : 'border-[#e6e6e6]'}`}>
                        <summary className={`flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[16px] font-medium ${dark ? 'text-white' : 'text-[#1a1a1a]'} [&::-webkit-details-marker]:hidden`}>
                            <span>{f.q}</span>
                            <span aria-hidden="true" className="mt-0.5 text-[20px] leading-none text-[#08b796] transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <div className={`pb-5 pr-10 text-[15px] leading-relaxed ${dark ? 'text-white/70' : 'text-[#444]'}`}><Inline text={f.a} /></div>
                    </details>
                ))}
            </div>
        </section>
    )
}
