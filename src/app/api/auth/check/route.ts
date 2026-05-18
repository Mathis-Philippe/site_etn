import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function GET(request: NextRequest) {
  // 1. On récupère le token depuis les cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  try {
    // 2. On vérifie le token
    const verified = await jwtVerify(token, SECRET_KEY);
    const payload = verified.payload;

    // 3. On renvoie les infos de l'utilisateur au frontend
    return NextResponse.json({
      success: true,
      authenticated: true,
      client: {
        id: payload.id,
        codeClient: payload.codeClient,
        role: payload.role,
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
}