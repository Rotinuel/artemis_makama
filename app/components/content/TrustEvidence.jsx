import { TRUST } from '@/lib/trust'

/**
 * Shows the inspector and supporting documents from lib/trust.js.
 * Each line only appears once the fact has been filled in.
 */
export default function TrustEvidence({ title = 'Proof, not promises' }) {
    const ins = TRUST.inspector
    const docs = [
        TRUST.sampleMilestoneScheduleUrl && { label: 'Sample milestone schedule (PDF)', href: TRUST.sampleMilestoneScheduleUrl },
        TRUST.contractExcerptUrl && { label: 'Redacted contract and BOQ excerpt (PDF)', href: TRUST.contractExcerptUrl },
        TRUST.insuranceCertificateUrl && { label: 'Insurance certificate, redacted (PDF)', href: TRUST.insuranceCertificateUrl },
    ].filter(Boolean)
    const regs = TRUST.registrations || []
    if (!ins && !docs.length && !regs.length) return null

    return (
        <section className="mb-10 border border-[#e6e6e6] bg-[#fafaf8] p-6" aria-labelledby="trust-evidence">
            <h2 id="trust-evidence" className="mb-4 text-[24px] text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</h2>
            <ul className="space-y-3 text-[15px] leading-relaxed text-[#333]">
                {ins && (
                    <li>
                        <strong>Independent inspector:</strong> {ins.name}{ins.firm ? `, ${ins.firm}` : ''}{ins.registration ? ` (${ins.registration})` : ''}
                        {ins.url && <> · <a href={ins.url} target="_blank" rel="noopener noreferrer" className="underline">website</a></>}
                    </li>
                )}
                {regs.map(r => (
                    <li key={`${r.body}-${r.number}`}>
                        <strong>{r.body} registration:</strong> {r.person} — {r.number}
                        {r.verifyUrl && <> · <a href={r.verifyUrl} target="_blank" rel="noopener noreferrer" className="underline">check the register</a></>}
                    </li>
                ))}
                {docs.map(d => (
                    <li key={d.href}><a href={d.href} className="underline decoration-[#08b796] underline-offset-[3px]">{d.label}</a></li>
                ))}
            </ul>
        </section>
    )
}
