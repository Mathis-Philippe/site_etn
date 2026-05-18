// middleware.ts (à la racine du projet, à côté de next.config.ts)

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger toutes les routes /admin et /api/admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Pas de token → redirection vers connexion
      return NextResponse.redirect(new URL('/connexion', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);

      if (payload.role !== 'ADMIN') {
        // Connecté mais pas admin → redirection vers accueil
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Admin confirmé → on laisse passer
      return NextResponse.next();
    } catch {
      // Token invalide ou expiré
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};