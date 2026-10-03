// Portfolio categories whose database slug is misspelt. The site always
// links to the corrected slug and looks up either spelling, so the page
// works before and after supabase/fix_during_construction_slug.sql is run.
export const SLUG_FIXES = {
    'during-contrustion': 'during-construction',
}

export const canonicalSlug = slug => SLUG_FIXES[slug] || slug
