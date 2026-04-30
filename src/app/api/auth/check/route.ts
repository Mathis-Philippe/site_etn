import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('etn_session');

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(session.value, SECRET_KEY);

    const client = await prisma.client.findUnique({
      where: { codeClient: payload.codeClient as string }
    });

    if (!client) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ 
      authenticated: true, 
      nomEntreprise: client.nomEntreprise,
      codeClient: client.codeClient,
      email: client.email
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}