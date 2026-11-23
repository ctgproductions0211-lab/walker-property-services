import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase-env'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const isLoginPage = request.nextUrl.pathname === '/dashboard/login'

  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  if (!url || !key) {
    if (isLoginPage) return response
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/dashboard/login'
    return NextResponse.redirect(loginUrl)
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))


  // If not logged in and trying to access dashboard, send to login
  if (!user && !isLoginPage) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/dashboard/login'
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in and hitting login page, send to dashboard
  if (user && isLoginPage) {
    const dashUrl = request.nextUrl.clone()
    dashUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashUrl)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
