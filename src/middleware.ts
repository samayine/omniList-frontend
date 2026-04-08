import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/admin', '/favorites'];

// Routes only accessible by specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/dashboard': ['OWNER', 'ADMIN'],
};

// Public-only routes (redirect to dashboard if already logged in)
const AUTH_ROUTES = ['/login', '/register'];

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (set on login)
  const token = request.cookies.get('accessToken')?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const isAuthenticated = !!payload;
  const userRole = payload?.role as string | undefined;

  // If user is logged in and tries to access /login or /register → redirect to dashboard
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if route requires authentication
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
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
  // Run middleware on these paths (skip static files, API, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
