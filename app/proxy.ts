import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session jika sudah expired
  const { data: { session } } = await supabase.auth.getSession()

  // Jika belum login dan mencoba akses dashboard, redirect ke login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login dan mencoba akses login page, redirect ke dashboard
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard/stockbarang', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}