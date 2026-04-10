import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/favorites'];

// Routes only accessible by specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard': ['USER', 'OWNER', 'ADMIN'],
};

// Public-only routes (redirect if already logged in)
const AUTH_ROUTES = ['/login', '/register'];

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('accessToken')?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const isAuthenticated = !!payload;
  const userRole = payload?.role as string | undefined;

  // Already logged in → skip auth pages, redirect to role-appropriate place
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const dest = userRole === 'USER' ? '/' : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Protected routes → redirect to login if unauthenticated
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
