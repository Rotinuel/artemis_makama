import Link from 'next/link'
import { TRUST } from '@/lib/trust'
import { STAGES, RATES, AREAS, estimate } from '@/lib/content/costs'
import { Money } from '../content/Currency'

/*
 * Infographics used across the site (homepage, Build from abroad, How we
 * build, guides, services). Pure server components: no client JavaScript.
 *
 * Colour: one fixed categorical order (validated for colour-blind
 * separation). Text always stays in ink colours; colour only marks identity,
 * and every coloured mark has a visible label next to it.
 */

const C = {
    blue: '#2a78d6',
    orange: '#eb6834',
    teal: '#08b796',
    yellow: '#eda100',
    pink: '#e87ba4',
    violet: '#4a3aa7',
}
const ORDER = [C.blue, C.orange, C.teal, C.yellow, C.pink, C.violet]
const tint = (hex, a = 0.1) => `color-mix(in srgb, ${hex} ${Math.round(a * 100)}%, white)`
const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }

/* ── Small line icons (24×24, currentColor) ── */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const ICONS = {
    coins: <><ellipse cx="9" cy="7" rx="6" ry="2.5" {...P} /><path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7" {...P} /><path d="M9 16.5c-3.3 0-6-1.1-6-2.5" {...P} /><path d="M15 11.5c3.3 0 6 1.1 6 2.5v3c0 1.4-2.7 2.5-6 2.5-1.6 0-3-.3-4.1-.7" {...P} /></>,
    search: <><circle cx="10.5" cy="10.5" r="6" {...P} /><path d="M15 15l5 5" {...P} /><path d="M8 10.5l2 2 3.5-3.5" {...P} /></>,
    list: <><rect x="4" y="3" width="16" height="18" rx="2" {...P} /><path d="M8 8h8M8 12h8M8 16h5" {...P} /></>,
    shield: <><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" {...P} /><path d="M9 12l2 2 4-4" {...P} /></>,
    pen: <><path d="M14.5 4.5l5 5L9 20H4v-5L14.5 4.5z" {...P} /><path d="M12.5 6.5l5 5" {...P} /></>,
    camera: <><rect x="3" y="7" width="13" height="10" rx="2" {...P} /><path d="M16 11l5-3v8l-5-3" {...P} /></>,
    team: <><circle cx="9" cy="8" r="3" {...P} /><path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" {...P} /><circle cx="17" cy="9" r="2.5" {...P} /><path d="M16 14.2c2.2.3 3.9 2 4.4 4.8" {...P} /></>,
    building: <><path d="M4 21V5l8-2v18M12 8l8 2v11M3 21h18" {...P} /><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" {...P} /></>,
    user: <><circle cx="12" cy="8" r="3.5" {...P} /><path d="M5 20c.8-3.6 3.6-6 7-6s6.2 2.4 7 6" {...P} /><path d="M17 4.5l1.5 1.5L21 3.5" {...P} /></>,
    phone: <><rect x="7" y="2.5" width="10" height="19" rx="2" {...P} /><path d="M11 18.5h2" {...P} /></>,
    map: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" {...P} /><path d="M9 4v14M15 6v14" {...P} /></>,
    ruler: <><path d="M3 17L17 3l4 4L7 21l-4-4z" {...P} /><path d="M7 13l2 2M10 10l2 2M13 7l2 2" {...P} /></>,
    key: <><circle cx="8" cy="15" r="4" {...P} /><path d="M11 12l9-9M17 6l2 2M15 8l2 2" {...P} /></>,
    report: <><path d="M6 3h9l4 4v14H6z" {...P} /><path d="M15 3v4h4M9 13l2 2 4-4" {...P} /></>,
    video: <><path d="M12 4l2.2 4.5 4.8.7-3.5 3.4.8 4.9L12 15.2l-4.3 2.3.8-4.9L5 9.2l4.8-.7L12 4z" {...P} /></>,
    portal: <><rect x="3" y="4" width="18" height="14" rx="2" {...P} /><path d="M3 9h18M8 21h8" {...P} /></>,
    wallet: <><rect x="3" y="6" width="18" height="13" rx="2" {...P} /><path d="M16 12.5h2M3 9h18" {...P} /></>,
}
function Icon({ name, size = 22 }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>
}

function Badge({ color, icon, n, size = 48 }) {
    return (
        <span className="relative inline-flex shrink-0 items-center justify-center rounded-full text-white" style={{ background: color, width: size, height: size }}>
            <Icon name={icon} size={Math.round(size * 0.46)} />
            {n != null && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1a1a1a] shadow" aria-hidden="true">{n}</span>
            )}
        </span>
    )
}

function Frame({ eyebrow, title, intro, children, footnote, id, dark = false }) {
    return (
        <figure id={id} className={`not-prose my-10 overflow-hidden rounded-2xl border p-5 sm:p-8 ${dark ? 'border-white/10 bg-[#111] text-white' : 'border-[#ebe8e2] bg-[#fcfbf9] text-[#1a1a1a]'}`}>
            {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#067a64]" style={dark ? { color: '#5fd9bf' } : undefined}>{eyebrow}</p>}
            {title && <h3 className="text-[26px] leading-tight sm:text-[32px]" style={serif}>{title}</h3>}
            {intro && <p className={`mt-2 max-w-2xl text-[15px] leading-relaxed ${dark ? 'text-white/70' : 'text-[#555]'}`}>{intro}</p>}
            <div className="mt-7">{children}</div>
            {footnote && <figcaption className={`mt-6 text-[12px] leading-relaxed ${dark ? 'text-white/50' : 'text-[#8a8a8a]'}`}>{footnote}</figcaption>}
        </figure>
    )
}

/* ─────────────────────────────────────────────────────────────────────
 * 1. Five layers between your money and the site
 * ───────────────────────────────────────────────────────────────────── */
const LAYERS = [
    { icon: 'coins', h: 'Stage payments', p: 'You pay for one stage at a time, never ahead of the work.' },
    { icon: 'search', h: 'Inspection', p: 'Every stage is checked before you pay: by our team, an independent firm, or your own inspector.' },
    { icon: 'list', h: 'Open-book BOQ', p: 'Every bag of cement and tonne of rebar itemised, so you can compare with market prices.' },
    { icon: 'shield', h: 'Insurance', p: 'Contractor’s all-risk cover with a licensed insurer, where agreed in your contract.' },
    { icon: 'pen', h: 'Written contract', p: 'Scope, payments, changes and disputes agreed in writing before work starts.' },
]

export function MoneyProtection({ title = 'Five layers between your money and the site', eyebrow = 'How your money is protected', compact = false }) {
    return (
        <Frame eyebrow={eyebrow} title={title} intro="Each layer catches what the one before might miss. Together they mean you never pay for work you haven’t seen." footnote="Insurance cover depends on the policy issued. Your signed contract sets the payment schedule and inspection plan.">
            <div className={compact ? 'flex flex-col items-stretch gap-3' : 'flex flex-col items-stretch gap-3 lg:flex-row lg:items-center'}>
                <div className={`flex items-center gap-3 rounded-xl bg-[#1a1a1a] px-4 py-3 text-white ${compact ? '' : 'lg:w-[120px] lg:flex-col lg:py-5 lg:text-center'}`}>
                    <Icon name="wallet" size={26} />
                    <span className="text-[13px] font-semibold">Your money</span>
                </div>
                <ol className={compact ? 'grid flex-1 gap-3 sm:grid-cols-2' : 'grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5'}>
                    {LAYERS.map((l, i) => (
                        <li key={l.h} className={`relative flex gap-3 rounded-xl border bg-white p-4 ${compact ? '' : 'lg:flex-col'}`} style={{ borderColor: tint(ORDER[i], 0.35), boxShadow: `inset 0 4px 0 ${ORDER[i]}` }}>
                            <Badge color={ORDER[i]} icon={l.icon} n={i + 1} size={44} />
                            <div>
                                <p className="text-[15px] font-semibold text-[#1a1a1a]">{l.h}</p>
                                <p className="mt-1 text-[13px] leading-relaxed text-[#555]">{l.p}</p>
                            </div>
                        </li>
                    ))}
                </ol>
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-white ${compact ? '' : 'lg:w-[120px] lg:flex-col lg:py-5 lg:text-center'}`} style={{ background: C.teal }}>
                    <Icon name="building" size={26} />
                    <span className="text-[13px] font-semibold text-[#04120f]">Your site</span>
                </div>
            </div>
        </Frame>
    )
}

/* ─────────────────────────────────────────────────────────────────────
 * 2. Six stages: share of the budget + the check before each payment
 * ───────────────────────────────────────────────────────────────────── */
const STAGE_SHORT = ['Design & site prep', 'Foundation', 'Frame & blocks', 'Roof', 'Services', 'Finishing']

export function StageFlow({ title = 'Six stages, six checks, six payments', eyebrow = 'Where the money goes', type = null, compact = false }) {
    const mids = STAGES.map(([, [a, b]]) => (a + b) / 2)
    const total = mids.reduce((s, v) => s + v, 0)
    const est = type ? estimate(type, 'standard') : null
    return (
        <Frame
            eyebrow={eyebrow}
            title={title}
            intro="Each bar is a stage’s typical share of the build budget. At the end of every stage the work is inspected and you see the evidence before the next payment is due."
            footnote={<>Typical shares from our 2026 cost model{est ? <>, applied to a {AREAS[type].label} with standard finishes ({<Money ngn={est} />} in total)</> : ''}. Your contract sets the actual payment schedule.</>}
        >
            {/* Proportional bar (data): widths follow each stage's mid-range share */}
            <div className="flex h-10 w-full gap-[2px] overflow-hidden rounded-[6px]" role="img" aria-label={STAGES.map(([n, [a, b]]) => `${n} ${a}–${b}%`).join(', ')}>
                {STAGES.map(([name, [a, b]], i) => (
                    <div key={name} title={`${name}: ${a}–${b}% of the build cost`} className="group relative flex items-center justify-center" style={{ width: `${(mids[i] / total) * 100}%`, background: ORDER[i] }}>
                        <span className="hidden text-[11px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] sm:inline">{a}–{b}%</span>
                    </div>
                ))}
            </div>

            <ol className={compact ? 'mt-6 grid gap-3 sm:grid-cols-2' : 'mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
                {STAGES.map(([name, [a, b], what], i) => (
                    <li key={name} className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-[#ebe8e2]">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ background: ORDER[i] }}>{i + 1}</span>
                        <div className="min-w-0">
                            <p className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-semibold text-[#1a1a1a]">
                                {STAGE_SHORT[i]}
                                <span className="text-[12px] font-medium tabular-nums text-[#6b6b6b]">{a}–{b}%{est ? <> · <Money ngn={[Math.round(est[0] * a / 100 / 1e5) * 1e5, Math.round(est[1] * b / 100 / 1e5) * 1e5]} /></> : null}</span>
                            </p>
                            <p className="mt-1 text-[13px] leading-relaxed text-[#555]">{what}</p>
                            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#1a1a1a]" style={{ background: tint(ORDER[i], 0.16) }}>
                                <Icon name="search" size={13} /> Inspected, then paid
                            </p>
                        </div>
                    </li>
                ))}
            </ol>

            {/* The loop that repeats at every stage */}
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[['building', 'Stage built'], ['search', 'Inspected'], ['report', 'Report & photos to you'], ['coins', 'You release payment']].map(([ic, t], i) => (
                    <div key={t} className="relative flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-2.5 text-[12px] font-medium text-white">
                        <span style={{ color: [C.blue, C.orange, C.yellow, C.teal][i] }}><Icon name={ic} size={18} /></span>{t}
                        {i < 3 && <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-[16px] text-[#1a1a1a] sm:block">▶</span>}
                    </div>
                ))}
            </div>
        </Frame>
    )
}

/* ─────────────────────────────────────────────────────────────────────
 * 3. Who checks your build? Three options
 * ───────────────────────────────────────────────────────────────────── */
export function InspectionOptions({ title = 'Who checks your build? You choose.', eyebrow = 'Inspection before every payment', compact = false }) {
    const team = TRUST.inspectionTeam || []
    const panel = TRUST.independentPanel || []
    const own = TRUST.clientInspector
    const signed = panel.filter(f => f.name)
    const options = [
        {
            color: C.teal, icon: 'team', tag: 'Included in every build', h: 'Our inspection team',
            p: 'Checks each stage against the drawings and sends you the report before the next payment is due.',
            items: team.map(m => `${m.name}${m.credentials ? `, ${m.credentials}` : ''} · ${m.role}`),
        },
        {
            color: C.blue, icon: 'building', tag: 'Independent of Artemis', h: 'An independent firm from our panel',
            p: `Choose one of ${panel.length > 3 ? 'three to four' : 'our'} outside COREN-registered firms to check the stages you want, for a second opinion that doesn’t work for us.`,
            items: panel.map(f => f.name ? `${f.name}${f.registration ? ` (${f.registration})` : ''} · ${f.speciality}` : `Panel firm · being appointed · ${f.speciality}`),
            note: signed.length ? null : 'Firms are named here as each agreement is signed.',
        },
        own?.offered && {
            color: C.orange, icon: 'user', tag: 'Your choice', h: 'Bring your own inspector',
            p: own.terms,
            items: ['Your engineer, surveyor or architect', 'Site access at every stage gate', 'Drawings and BOQ shared with them'],
        },
    ].filter(Boolean)

    return (
        <Frame eyebrow={eyebrow} title={title} intro="Every stage is inspected before you pay for the next one. Use our team, add an independent firm, bring your own inspector, or combine them." footnote="Independent and client-appointed inspection fees are agreed separately. Inspection plans are written into your contract.">
            <div className={compact ? 'grid gap-4' : 'grid gap-4 md:grid-cols-3'}>
                {options.map((o, i) => (
                    <div key={o.h} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-[#ebe8e2]" style={{ boxShadow: `inset 0 5px 0 ${o.color}` }}>
                        <div className="flex items-center gap-3">
                            <Badge color={o.color} icon={o.icon} size={46} />
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b6b6b]">Option {String.fromCharCode(65 + i)} · {o.tag}</p>
                                <p className="text-[17px] font-semibold leading-snug text-[#1a1a1a]">{o.h}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-[14px] leading-relaxed text-[#555]">{o.p}</p>
                        <ul className="mt-4 space-y-2">
                            {o.items.map(t => (
                                <li key={t} className="flex gap-2 rounded-lg px-3 py-2 text-[13px] leading-snug text-[#333]" style={{ background: tint(o.color, 0.1) }}>
                                    <span aria-hidden="true" className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: o.color }} />{t}
                                </li>
                            ))}
                        </ul>
                        {o.note && <p className="mt-3 text-[12px] italic text-[#8a8a8a]">{o.note}</p>}
                    </div>
                ))}
            </div>
            <p className="mt-6 text-center text-[14px] text-[#555]">
                Whoever inspects, the rule is the same: <strong className="text-[#1a1a1a]">no report, no payment.</strong>{' '}
                <Link href="/how-we-build" className="underline decoration-[#08b796] underline-offset-[3px]">See the stage gates</Link>
            </p>
        </Frame>
    )
}

/* ─────────────────────────────────────────────────────────────────────
 * 4. Building from abroad in six steps
 * ───────────────────────────────────────────────────────────────────── */
const JOURNEY = [
    { icon: 'phone', h: 'Free call', you: 'Tell us your plot, budget and timeline, on video or WhatsApp at a time that suits your time zone.' },
    { icon: 'map', h: 'Land and site check', you: 'Send the documents. We check the plot, access and soil, and work with your lawyer on the title.' },
    { icon: 'ruler', h: 'Design and approvals', you: 'Approve the design and 3D visuals on video calls. We prepare the drawings and permit application.' },
    { icon: 'list', h: 'BOQ and contract', you: 'Review every line of the open-book BOQ, then sign a contract with stages and inspections built in.' },
    { icon: 'camera', h: 'Build, watched live', you: 'Follow the live camera and weekly reports. Pay each stage only after it has been inspected.' },
    { icon: 'key', h: 'Handover', you: 'Receive the keys, as-built drawings, certificates and a 6–12 month defects period.' },
]
const ZONES = [['London', 'UK'], ['New York', 'US East'], ['Toronto', 'Canada'], ['Lagos', 'WAT · UTC+1']]

export function RemoteJourney({ title = 'Build in Nigeria from anywhere, in six steps', eyebrow = 'Building from abroad', compact = false }) {
    return (
        <Frame dark eyebrow={eyebrow} title={title} intro="You make the decisions from where you live. We do the work on the ground and show you the proof at every step." footnote="Calls are booked Monday to Saturday, 09:00–17:00 Lagos time. Lagos has no daylight saving, so the gap to London and North America changes by an hour twice a year.">
            <div className="mb-7 flex flex-wrap gap-2">
                {ZONES.map(([city, zone], i) => (
                    <span key={city} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px]">
                        <span className="h-2 w-2 rounded-full" style={{ background: [C.blue, C.pink, C.yellow, C.teal][i] }} />
                        <strong className="font-semibold">{city}</strong><span className="text-white/60">{zone}</span>
                    </span>
                ))}
            </div>
            <ol className={compact ? 'relative grid gap-4 sm:grid-cols-2' : 'relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
                {JOURNEY.map((s, i) => (
                    <li key={s.h} className="relative rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                        <div className="flex items-center gap-3">
                            <Badge color={ORDER[i]} icon={s.icon} size={44} />
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Step {i + 1}</p>
                                <p className="text-[17px] font-semibold">{s.h}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-[14px] leading-relaxed text-white/75">{s.you}</p>
                    </li>
                ))}
            </ol>
        </Frame>
    )
}

/* ─────────────────────────────────────────────────────────────────────
 * 5. Cost per m² by finish (range bars on one axis)
 * ───────────────────────────────────────────────────────────────────── */
export function CostPerM2({ title = 'What a square metre costs in Lagos (2026)', eyebrow = 'Build cost per m²', example = 'duplex-4' }) {
    const max = 500_000
    const ticks = [0, 100_000, 200_000, 300_000, 400_000, 500_000]
    const shades = ['#9ad9c8', '#2fae8f', '#0b6b58'] // one hue, light → dark = basic → premium
    const rows = Object.entries(RATES)
    return (
        <Frame eyebrow={eyebrow} title={title} intro="Building only: no land, external works or furniture. Finish level is the biggest choice you make." footnote="Ranges from our 2026 cost model, built from published market data and current material prices. Switch currency at the top of the page where available.">
            <div className="space-y-5">
                {rows.map(([key, r], i) => (
                    <div key={key}>
                        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[14px]">
                            <span className="font-semibold text-[#1a1a1a]">{r.label}</span>
                            <span className="tabular-nums text-[#333]"><Money ngn={r.range} suffix=" per m²" /></span>
                        </div>
                        <div className="relative h-4 rounded-full bg-[#efece6]">
                            <div
                                className="absolute inset-y-0 rounded-full"
                                style={{ left: `${(r.range[0] / max) * 100}%`, width: `${((r.range[1] - r.range[0]) / max) * 100}%`, background: shades[i] }}
                                title={`${r.label}: ₦${r.range[0].toLocaleString('en-GB')}–₦${r.range[1].toLocaleString('en-GB')} per m²`}
                            />
                        </div>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-[#6b6b6b]">{r.note}</p>
                    </div>
                ))}
                <div className="relative h-5 text-[10px] text-[#8a8a8a]" aria-hidden="true">
                    {ticks.map(t => (
                        <span key={t} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${(t / max) * 100}%` }}>{t ? `₦${t / 1000}k` : '₦0'}</span>
                    ))}
                </div>
            </div>
            {example && AREAS[example] && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {rows.map(([key, r], i) => (
                        <div key={key} className="rounded-xl bg-white p-4 ring-1 ring-[#ebe8e2]" style={{ boxShadow: `inset 4px 0 0 ${shades[i]}` }}>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b6b6b]">{AREAS[example].label} · {r.label.replace(' finish', '')}</p>
                            <p className="mt-1 text-[18px] font-semibold tabular-nums text-[#1a1a1a]"><Money ngn={estimate(example, key)} /></p>
                            <p className="text-[12px] text-[#8a8a8a]">about {AREAS[example].m2} m²</p>
                        </div>
                    ))}
                </div>
            )}
        </Frame>
    )
}

/* ─────────────────────────────────────────────────────────────────────
 * 6. What you see, and how often (12-week illustration)
 * ───────────────────────────────────────────────────────────────────── */
export function ReportingCadence({ title = 'What you see while we build', eyebrow = 'Reporting you can check yourself' }) {
    const weeks = 12
    const rows = [
        { color: C.teal, icon: 'camera', h: 'Live site camera', when: 'Any time, on your phone', kind: 'bar' },
        { color: C.blue, icon: 'report', h: 'Weekly photo report', when: 'Every week', kind: 'weekly' },
        { color: C.orange, icon: 'search', h: 'Stage inspection report', when: 'At every stage gate', kind: 'stages', at: [3, 8] },
        { color: C.violet, icon: 'video', h: 'Drone or walk-round video', when: 'At key milestones', kind: 'stages', at: [5, 11] },
        { color: C.pink, icon: 'portal', h: 'Your client portal', when: 'Stages, payments, documents', kind: 'bar' },
    ]
    return (
        <Frame eyebrow={eyebrow} title={title} intro="Not a relative’s phone photos: dated, regular evidence you can check from anywhere." footnote="Illustration of a typical 12-week stretch of a build. Inspection dates follow the stages in your programme.">
            <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                    <div className="mb-2 grid grid-cols-[200px_1fr] items-end gap-4">
                        <span />
                        <div className="grid text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a8a8a]" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
                            {Array.from({ length: weeks }, (_, w) => <span key={w}>W{w + 1}</span>)}
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        {rows.map(r => (
                            <div key={r.h} className="grid grid-cols-[200px_1fr] items-center gap-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: r.color }}><Icon name={r.icon} size={17} /></span>
                                    <span className="leading-tight">
                                        <span className="block text-[13px] font-semibold text-[#1a1a1a]">{r.h}</span>
                                        <span className="block text-[11px] text-[#6b6b6b]">{r.when}</span>
                                    </span>
                                </div>
                                <div className="relative grid h-8 items-center rounded-lg bg-[#f2efe9]" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
                                    {r.kind === 'bar' && <span className="absolute inset-x-1 top-1/2 h-2.5 -translate-y-1/2 rounded-full" style={{ background: r.color }} />}
                                    {r.kind === 'weekly' && Array.from({ length: weeks }, (_, w) => (
                                        <span key={w} className="mx-auto h-3 w-3 rounded-full ring-2 ring-[#f2efe9]" style={{ background: r.color }} />
                                    ))}
                                    {r.kind === 'stages' && Array.from({ length: weeks }, (_, w) => (
                                        <span key={w} className="flex justify-center">
                                            {r.at.includes(w) && <span className="h-4 w-4 rotate-45 rounded-[3px] ring-2 ring-[#f2efe9]" style={{ background: r.color }} />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Frame>
    )
}

/* Name → component, for content blocks: { t: 'infographic', name: 'stages' } */
export const INFOGRAPHICS = {
    protection: MoneyProtection,
    stages: StageFlow,
    inspection: InspectionOptions,
    journey: RemoteJourney,
    costm2: CostPerM2,
    reporting: ReportingCadence,
}
