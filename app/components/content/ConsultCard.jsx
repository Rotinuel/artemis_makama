import Link from 'next/link'
import { SITE, whatsappLink } from '@/lib/site'

/** Sidebar / inline call to action used on every content page */
export default function ConsultCard({ title = 'Free 20-minute consultation', text = 'Talk to an engineer about your plot, budget and timeline. Video call or WhatsApp, at a time that suits your time zone.', primary = { label: 'Book a call', href: '/build-from-abroad#book' }, whatsappText }) {
    return (
        <div className="border border-[#e6e6e6] bg-white p-6">
            <p className="mb-2 text-[22px] leading-tight text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</p>
            <p className="mb-5 text-[14px] leading-relaxed text-[#555]">{text}</p>
            <Link href={primary.href} className="mb-3 block rounded-full bg-[#08b796] px-5 py-3 text-center text-[13px] font-medium text-[#04120f] transition-colors hover:bg-[#1a1a1a] hover:text-white">
                {primary.label}
            </Link>
            <a href={whatsappLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="block rounded-full border border-[#1a1a1a] px-5 py-3 text-center text-[13px] font-medium text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white">
                WhatsApp {SITE.phone}
            </a>
            <p className="mt-4 text-[12px] leading-relaxed text-[#8a8a8a]">
                <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a><br />
                {SITE.hours.days}, {SITE.hours.opens}–{SITE.hours.closes} Lagos time (WAT)
            </p>
        </div>
    )
}
