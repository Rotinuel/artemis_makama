import Link from 'next/link'
import { Money } from './Currency'
import { PRICING } from '@/lib/pricing'
import { whatsappLink } from '@/lib/site'

/**
 * Price panel for the advisory services. Shows the price from
 * lib/pricing.js once PRICING.show is true; until then "price on request".
 */
export default function PriceBox({ slug, title = 'Price', whatsappText }) {
    const p = PRICING.show ? PRICING.services[slug] : null
    return (
        <section className="mb-10 border border-[#e6e6e6] bg-[#fafaf8] p-6" aria-labelledby={`price-${slug}`}>
            <h2 id={`price-${slug}`} className="mb-3 text-[24px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</h2>
            {p ? (
                <>
                    <p className="text-[26px] font-semibold text-[#1a1a1a]"><Money ngn={p.ngn} /></p>
                    {p.unit && <p className="mt-1 text-[14px] text-[#555]">{p.unit}</p>}
                    {p.note && <p className="mt-3 text-[14px] leading-relaxed text-[#555]">{p.note}</p>}
                    {p.addOn && (
                        <p className="mt-4 border-t border-[#e6e6e6] pt-4 text-[14px] leading-relaxed text-[#333]">
                            <strong>{p.addOn.label}:</strong> <Money ngn={p.addOn.ngn} /> {p.addOn.unit}
                        </p>
                    )}
                    {PRICING.reviewed && <p className="mt-3 text-[12px] text-[#8a8a8a]">Prices checked {PRICING.reviewed}.</p>}
                </>
            ) : (
                <p className="text-[15px] leading-relaxed text-[#333]">
                    <strong>Fixed fee, quoted before you commit.</strong> Tell us a little about your project and we’ll send you the price in writing, in naira, pounds or dollars.
                </p>
            )}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#08b796] px-6 py-3 text-center text-[13px] font-medium text-white hover:bg-[#079e82]">
                    {p ? 'Order on WhatsApp' : 'Ask for the price on WhatsApp'}
                </a>
                <Link href="/contact#enquiry" className="rounded-full border border-[#1a1a1a] px-6 py-3 text-center text-[13px] font-medium text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white">
                    Send an enquiry
                </Link>
            </div>
        </section>
    )
}
