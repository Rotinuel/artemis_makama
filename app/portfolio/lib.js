import { projectMeta } from '../data/portfolio-meta'

export const FACT_FIELDS = [
    ['sector', 'Sector'],
    ['location', 'Location'],
    ['year', 'Year'],
    ['status', 'Status'],
    ['client', 'Client'],
    ['area', 'Area'],
    ['scope', 'Scope'],
]

export const pad = n => String(n).padStart(2, '0')

// Upload titles default to the file name ("IMG_2034", "DSC-0112",
// "WhatsApp Image 2025-…"). Those aren't real captions, so hide them.
export function cleanCaption(title) {
    if (!title) return ''
    const t = String(title).trim()
    if (!t) return ''
    if (/^(img|dsc|dscn|dji|pxl|photo|image|screenshot|whatsapp|mvimg|p)[\s_-]*\d/i.test(t)) return ''
    if (/^whatsapp image/i.test(t)) return ''
    if (/^[\d\s_\-.()]+$/.test(t)) return ''
    if (!/\s/.test(t) && /\d{3,}/.test(t)) return ''
    return t
}

// Turn a category + its images into a "project"
export function toProject(category, images, number) {
    const meta = projectMeta[category.slug] || {}
    const summary =
        meta.summary ||
        images.find(img => img.description && img.description.trim())?.description ||
        ''
    return {
        id: category.id,
        slug: category.slug,
        name: category.name,
        number,
        cover: images[0]?.url || null,
        imageCount: images.length,
        images,
        meta,
        summary,
    }
}

// Group a flat image list into ordered projects (categories with images only)
export function buildProjects(categories, images) {
    const byCat = new Map()
    for (const img of images) {
        const key = img.category_id
        if (!byCat.has(key)) byCat.set(key, [])
        byCat.get(key).push(img)
    }
    return categories
        .filter(cat => (byCat.get(cat.id) || []).length > 0)
        .map((cat, i) => toProject(cat, byCat.get(cat.id), i + 1))
}

export function metaLine(meta) {
    return [meta.sector, meta.location, meta.year].filter(Boolean).join(' · ')
}
