import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'default-super-secret-key-for-dev-only'
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/', '/contact', '/courses']
  
  // Check if current path is exactly a public path or starts with one (except /)
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    (path !== '/' && request.nextUrl.pathname.startsWith(`${path}/`))
  )

  // API paths and static files bypass auth middleware
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg)$/)
  ) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If token exists, verify it
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecretKey())
      
      // If verified and trying to access login/register, redirect to dashboard
      if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
        if (payload.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Role-based access control for /admin
      if (request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

    } catch (error) {
      // Invalid token, clear it and redirect to login if not on a public path
      if (!isPublicPath) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth_token')
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
