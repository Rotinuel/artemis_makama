import Link from 'next/link'
import JsonLd from '../JsonLd'
import { breadcrumbSchema } from '@/lib/seo'

/** Visible breadcrumb trail + BreadcrumbList schema. items: [{ name, path }] (Home added) */
export default function Breadcrumbs({ items = [], light = false, schemaOnly = false }) {
    const all = [{ name: 'Home', path: '/' }, ...items]
    return (
        <>
            <JsonLd data={breadcrumbSchema(items)} />
            {!schemaOnly && (
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] ${light ? 'text-white/60' : 'text-[#8a8a8a]'}`}>
                        {all.map((it, i) => (
                            <li key={it.path} className="flex items-center gap-2">
                                {i > 0 && <span aria-hidden="true">/</span>}
                                {i === all.length - 1
                                    ? <span aria-current="page" className={light ? 'text-white/90' : 'text-[#1a1a1a]'}>{it.name}</span>
                                    : <Link href={it.path} className="hover:underline">{it.name}</Link>}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
        </>
    )
}
