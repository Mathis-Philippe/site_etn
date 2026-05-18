import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    
    if (!token) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }

    try {
      const verified = await jwtVerify(token, SECRET_KEY);

      if (verified.payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url)); 
      }
      
      
    } catch (err) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};