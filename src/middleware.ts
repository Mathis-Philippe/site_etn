import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('etn_session');

  if (request.nextUrl.pathname.startsWith('/produits') && !session) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/produits/:path*'], 
};