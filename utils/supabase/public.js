import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Read-only Supabase client for PUBLIC pages (portfolio, news, guides,
 * sitemap). It uses no cookies, so those pages can be statically
 * generated and cached at the edge (ISR) instead of rendered on every
 * request. Row-level security still applies (anon role).
 */
export function createPublicClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
    )
}
