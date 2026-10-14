import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, verifyAuthToken } from '@/lib/auth';

const PUBLIC_API = new Set(['/api/auth/login', '/api/auth/register', '/api/auth/logout']);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = token ? await verifyAuthToken(token) : null;

  if (pathname.startsWith('/api/')) {
    // CSRF defence: state-changing requests must come from this site.
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.get('origin');
      if (origin) {
        let originHost = '';
        try {
          originHost = new URL(origin).host;
        } catch {
          /* invalid origin is rejected below */
        }
        if (originHost !== request.headers.get('host')) {
          return NextResponse.json({ success: false, error: 'Cross-site request blocked.' }, { status: 403 });
        }
      }
    }

    if (!PUBLIC_API.has(pathname) && !session) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // The app itself is only for signed-in users; everyone else lands on the login page.
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/:path*'],
};
