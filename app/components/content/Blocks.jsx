import Link from 'next/link'
import Image from 'next/image'
import Inline, { slugify } from './Inline'
import { Money } from './Currency'
import PriceBoardTable from './PriceBoardTable'
import { INFOGRAPHICS } from '../infographics/Infographics'

function Cell({ value }) {
    if (value && typeof value === 'object' && 'ngn' in value) return <Money ngn={value.ngn} suffix={value.suffix || ''} plus={value.plus} />
    return <Inline text={value} />
}

/** Renders the content blocks used by guides, service and hub pages */
export default function Blocks({ blocks = [], ctx = {} }) {
    return blocks.map((b, i) => {
        switch (b.t) {
            case 'h2':
                return <h2 key={i} id={b.id || slugify(b.text)} className="scroll-mt-28 text-[26px] md:text-[32px] leading-tight text-[#1a1a1a] mt-14 mb-5 font-normal" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}><Inline text={b.text} /></h2>
            case 'h3':
                return <h3 key={i} className="text-[18px] font-semibold text-[#1a1a1a] mt-8 mb-3"><Inline text={b.text} /></h3>
            case 'p':
                return <p key={i} className="text-[16px] leading-[1.75] text-[#333] mb-5"><Inline text={b.text} /></p>
            case 'ul':
            case 'ol': {
                const Tag = b.t
                return (
                    <Tag key={i} className={`mb-6 space-y-2.5 text-[16px] leading-[1.7] text-[#333] ${b.t === 'ol' ? 'list-decimal' : 'list-disc'} pl-6 marker:text-[#08b796]`}>
                        {b.items.map((it, j) => <li key={j} className="pl-1"><Inline text={it} /></li>)}
                    </Tag>
                )
            }
            case 'checklist':
                return (
                    <ul key={i} className="mb-6 space-y-3">
                        {b.items.map((it, j) => (
                            <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-[#333]">
                                <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08b796]/15 text-[11px] text-[#067a64]">✓</span>
                                <span><Inline text={it} /></span>
                            </li>
                        ))}
                    </ul>
                )
            case 'table':
                return (
                    <figure key={i} className="mb-8">
                        <div className="overflow-x-auto border border-[#e6e6e6]">
                            <table className="w-full border-collapse text-[14px]">
                                {b.caption && <caption className="sr-only">{b.caption}</caption>}
                                <thead>
                                    <tr className="bg-[#f6f5f2]">
                                        {b.head.map((h, j) => <th key={j} scope="col" className={`px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[#6b6b6b] font-semibold ${j ? 'whitespace-nowrap' : ''}`}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {b.rows.map((row, r) => (
                                        <tr key={r} className="border-t border-[#efefef] align-top">
                                            {row.map((c, j) => j === 0
                                                ? <th key={j} scope="row" className="px-4 py-3 text-left font-medium text-[#1a1a1a]"><Cell value={c} /></th>
                                                : <td key={j} className={`px-4 py-3 text-[#333] ${typeof c === 'string' && c.length <= 14 ? 'whitespace-nowrap' : ''}`}><Cell value={c} /></td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {b.note && <figcaption className="mt-2 text-[12px] leading-relaxed text-[#8a8a8a]"><Inline text={b.note} /></figcaption>}
                    </figure>
                )
            case 'callout':
                return (
                    <aside key={i} className={`mb-8 border-l-[3px] px-5 py-4 ${b.tone === 'warn' ? 'border-[#d4a017] bg-[#fdf8ea]' : 'border-[#08b796] bg-[#f2faf8]'}`}>
                        {b.title && <p className="mb-1 text-[14px] font-semibold text-[#1a1a1a]"><Inline text={b.title} /></p>}
                        <p className="text-[15px] leading-relaxed text-[#333]"><Inline text={b.text} /></p>
                    </aside>
                )
            case 'steps':
                return (
                    <ol key={i} className="mb-8 space-y-0">
                        {b.items.map((s, j) => (
                            <li key={j} className="relative grid grid-cols-[44px_1fr] gap-4 pb-7 last:pb-0">
                                {j < b.items.length - 1 && <span aria-hidden="true" className="absolute left-[21px] top-11 bottom-0 w-px bg-[#dcdcdc]" />}
                                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a1a] text-[14px] font-semibold text-white">{j + 1}</span>
                                <div className="pt-2">
                                    <p className="mb-1 text-[16px] font-semibold text-[#1a1a1a]"><Inline text={s.h} /></p>
                                    <p className="text-[15px] leading-relaxed text-[#444]"><Inline text={s.p} /></p>
                                </div>
                            </li>
                        ))}
                    </ol>
                )
            case 'cards':
                return (
                    <div key={i} className={`mb-8 grid gap-4 ${b.items.length > 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
                        {b.items.map((c, j) => {
                            const inner = (
                                <>
                                    <p className="mb-1.5 text-[16px] font-semibold text-[#1a1a1a]">{c.h}</p>
                                    <p className="text-[14px] leading-relaxed text-[#555]"><Inline text={c.p} /></p>
                                    {c.href && <span className="mt-3 inline-block text-[12px] uppercase tracking-[0.1em] text-[#067a64]">{c.cta || 'Read more'} →</span>}
                                </>
                            )
                            return c.href
                                ? <Link key={j} href={c.href} className="block border border-[#e6e6e6] p-5 transition-colors hover:border-[#1a1a1a]">{inner}</Link>
                                : <div key={j} className="border border-[#e6e6e6] p-5">{inner}</div>
                        })}
                    </div>
                )
            case 'image':
                return (
                    <figure key={i} className="mb-8">
                        <div className="relative w-full overflow-hidden bg-[#f2f2f2]" style={{ aspectRatio: b.ratio || '16/10' }}>
                            <Image src={b.src} alt={b.alt} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
                        </div>
                        {b.caption && <figcaption className="mt-2 text-[12px] text-[#8a8a8a]"><Inline text={b.caption} /></figcaption>}
                    </figure>
                )
            case 'prices':
                return <PriceBoardTable key={i} board={ctx.priceBoard} compact={b.compact} />
            case 'cta':
                return (
                    <div key={i} className="mb-8 flex flex-col gap-4 bg-[#111] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[18px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24 }}>{b.title}</p>
                            {b.text && <p className="mt-1 text-[14px] text-white/70">{b.text}</p>}
                        </div>
                        <Link href={b.href} className="shrink-0 rounded-full bg-[#08b796] px-6 py-3 text-center text-[13px] font-medium text-[#04120f] hover:bg-white">{b.label}</Link>
                    </div>
                )
            case 'infographic': {
                // { t: 'infographic', name: 'stages', ...props } (see components/infographics)
                const Graphic = INFOGRAPHICS[b.name]
                const { t, name, ...props } = b
                return Graphic ? <Graphic key={i} compact {...props} /> : null
            }
            case 'node':
                return <div key={i}>{ctx.nodes?.[b.key] || null}</div>
            default:
                return null
        }
    })
}
