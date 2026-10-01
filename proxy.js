import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/auth/roles'

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isAdminArea = path === '/admin' || path.startsWith('/admin/')
  const isPortal = path === '/portal' || path.startsWith('/portal/')

  const redirect = (pathname, params = {}) => {
    const url = request.nextUrl.clone()
    url.pathname = pathname
    url.search = ''
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const res = NextResponse.redirect(url)
    // keep any refreshed auth cookies
    supabaseResponse.cookies.getAll().forEach(c => res.cookies.set(c))
    return res
  }

  // Signed-out visitors: admin area and client portal need a login
  if (!user && (isAdminArea || isPortal)) {
    return redirect('/login', { redirectTo: path })
  }

  // Signed-in: admin area is for admins only — clients go to their portal
  if (user && isAdminArea && !(await isAdminUser(supabase, user.id))) {
    return redirect('/portal')
  }

  // Already signed in and visiting /login → straight to the right home
  if (user && path === '/login') {
    return redirect((await isAdminUser(supabase, user.id)) ? '/admin' : '/portal')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
