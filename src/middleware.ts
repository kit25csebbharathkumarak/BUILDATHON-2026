import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  if (sessionCookie && isAuthPage) {
    // If we had the decoded role we could route to the correct dashboard,
    // but for simplicity we'll just send to student dashboard. In a real app we decode JWT here.
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }
  
  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*', '/teacher/:path*', '/login', '/register'],
};
