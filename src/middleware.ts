import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * ======================================
   * 1. SPECIAL HANDLING FOR ADMIN API ROUTES (NEW!)
   * ======================================
   * Forward cookies properly untuk Vercel
   */
  if (pathname.startsWith('/api/admin')) {
    const response = NextResponse.next()
    
    // Ensure cookies are forwarded (CRITICAL for Vercel)
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      response.headers.set('x-forwarded-cookie', cookieHeader)
    }
    
    // CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
    
    return response
  }

  /**
   * ======================================
   * 2. SKIP NON-GET REQUESTS (Public API)
   * ======================================
   */
  if (request.method !== 'GET') {
    return NextResponse.next()
  }

  /**
   * ======================================
   * 3. SKIP OTHER API ROUTES
   * ======================================
   */
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  /**
   * ======================================
   * 4. PROTECT ADMIN PAGE SAHAJA
   * ======================================
   */
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    /**
     * ❌ TAK LOGIN → REDIRECT
     */
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    /**
     * ✅ LOGIN → ALLOW PAGE RENDER
     */
    return response
  }

  /**
   * ======================================
   * 5. PUBLIC ROUTES
   * ======================================
   */
  return NextResponse.next()
}

/**
 * ======================================
 * 6. MATCHER (PAGE + ADMIN API)
 * ======================================
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*', // ← TAMBAH NI!
  ],
}