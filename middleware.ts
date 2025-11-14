import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Redirect /bmw-x5-2022 to /en/bmw-x5-2022
  if (request.nextUrl.pathname === '/bmw-x5-2022') {
    return NextResponse.redirect(new URL('/en/bmw-x5-2022', request.url));
  }
  
  // Let next-intl handle other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/bmw-x5-2022',
    '/(zh|ru|ar|en)/:path*',
    '/((?!api|admin|_next|_vercel|.*\\..*).*)'
  ]
};

