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
    const verified = await jwtVerify(token, SECRET_KEY);
    const payload = verified.payload;

    return NextResponse.json({
      success: true,
      authenticated: true,
      nomEntreprise: payload.nomEntreprise,
      role: payload.role,                 
      client: {
        id: payload.id,
        codeClient: payload.codeClient,
        role: payload.role,
        nomEntreprise: payload.nomEntreprise,
      }
    });

  } catch (err) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
}