import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Admin-only Supabase client using the SERVICE ROLE key.
 * This bypasses Row Level Security entirely — only ever import this
 * inside server components / route handlers that are themselves
 * protected (see middleware.js), never in client components.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in your environment (Supabase
 * dashboard → Project Settings → API → service_role secret).
 * Do NOT prefix it with NEXT_PUBLIC_ — that would expose it to the browser.
 */
export function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
}