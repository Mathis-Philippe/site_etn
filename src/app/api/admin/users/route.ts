// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('token')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

// GET : Liste des clients avec inclusion de leurs commandes
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { nomEntreprise: { contains: search } },
        { codeClient: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        email: true,
        nomEntreprise: true,
        codeClient: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        commandes: {
          select: {
            id: true,
            numero: true,
            status: true,
            totalArticles: true,
            createdAt: true,
            articles: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { nomEntreprise: 'asc' }
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Erreur GET clients admin:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}

// POST : Créer un nouveau compte client
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, password, nomEntreprise, codeClient, role } = body;

    if (!email || !password || !codeClient || !nomEntreprise) {
      return NextResponse.json({ success: false, message: 'Tous les champs sont obligatoires.' }, { status: 400 });
    }

    const clientExistant = await prisma.client.findFirst({
      where: {
        OR: [{ email: email.trim() }, { codeClient: codeClient.trim() }]
      }
    });

    if (clientExistant) {
      return NextResponse.json({ success: false, message: 'Cet email ou ce Code Client est déjà utilisé.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.client.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        nomEntreprise: nomEntreprise.trim(),
        codeClient: codeClient.trim().toUpperCase(),
        role: role || 'USER'
      }
    });

    return NextResponse.json({ success: true, message: 'Compte client créé avec succès !' });
  } catch (error) {
    console.error('Erreur POST client admin:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la création.' }, { status: 500 });
  }
}