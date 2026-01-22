import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for root path to allow src/app/page.tsx to handle the initial loading animation
  if (pathname === '/') {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
