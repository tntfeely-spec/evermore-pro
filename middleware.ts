import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // If on login/signup and already authenticated, redirect to dashboard
  const pathname = request.nextUrl.pathname;
  if (pathname === '/login' || pathname === '/signup') {
    // Check if the response has a user session by looking for auth cookies
    const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
