import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codeClient, password } = body;

    if (!codeClient || !password) {
      return NextResponse.json({ message: "Veuillez remplir tous les champs." }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { codeClient: codeClient }
    });

    if (!client || !client.password) {
      return NextResponse.json({ message: "Identifiants incorrects ou compte non activé." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Identifiants incorrects." }, { status: 401 });
    }

    await prisma.client.update({
      where: { id: client.id },
      data: {
        codeClient: client.codeClient
      }
    });

    const token = await new SignJWT({ 
        sub: client.id, 
        codeClient: client.codeClient,
        nomEntreprise: client.nomEntreprise,
        role: client.role
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET_KEY);

    const response = NextResponse.json({ 
      success: true, 
      client: { id: client.id, codeClient: client.codeClient, role: client.role, nom: client.nomEntreprise }
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production', // false en local (http), true en ligne (https)
      maxAge: 60 * 60 * 24
    });

    return response;

  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json({ message: "Une erreur est survenue." }, { status: 500 });
  }
}