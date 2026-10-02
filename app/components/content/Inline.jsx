import Link from 'next/link'

// Tiny formatter for content strings: [label](/path), [label](https://…) and **bold**
const TOKEN = /(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*)/g

export default function Inline({ text }) {
    if (text == null) return null
    const parts = String(text).split(TOKEN)
    return parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) {
            const [, label, href] = link
            if (/^https?:\/\//.test(href)) {
                return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-[#08b796] underline-offset-[3px] hover:text-[#08b796]">{label}</a>
            }
            return <Link key={i} href={href} className="underline decoration-[#08b796] underline-offset-[3px] hover:text-[#08b796]">{label}</Link>
        }
        const bold = part.match(/^\*\*([^*]+)\*\*$/)
        if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>
        return part
    })
}

export function slugify(s = '') {
    return String(s).toLowerCase().replace(/\*\*|\[|\]|\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}
