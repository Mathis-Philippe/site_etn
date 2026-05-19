// app/api/admin/articles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

async function saveFile(file: File, folder: 'images/produits' | 'pdfs'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dir = path.join(process.cwd(), 'public', folder);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buffer);
  return `/${folder}/${filename}`;
}

// GET /api/admin/articles — Liste avec pagination, recherche et tri
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '50');
    const search = url.searchParams.get('search') || '';
    const familleId = url.searchParams.get('familleId') || '';
    const sortBy = url.searchParams.get('sortBy') || 'designation';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    // Construire le filtre de recherche
    const where: any = {};
    if (search.trim()) {
      // Compatible avec Prisma 5.x et 6.x
      // Pas de 'mode' : insensitive, on utilise contains simple
      where.OR = [
        { designation: { contains: search } },
        { refEtn: { contains: search } },
        { refDicsa: { contains: search } },
      ];
    }
    if (familleId) {
      where.familleId = familleId;
    }

    // Construire l'ordre de tri valide
    const orderBy: any = {};
    const validSortFields = ['designation', 'refEtn', 'refDicsa', 'familleOriginale', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'designation';
    orderBy[field] = sortOrder === 'desc' ? 'desc' : 'asc';

    // Requête optimisée
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          famille: {
            include: {
              sousCategorie: {
                include: { categorie: true }
              }
            }
          }
        },
        orderBy,
        skip,
        take,
      }),
      prisma.article.count({ where })
    ]);

    const hasMore = skip + take < total;

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: { skip, take, total, hasMore }
    });
  } catch (error) {
    console.error('Erreur GET articles admin:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}

// POST /api/admin/articles — Créer un article
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const refDicsa = formData.get('refDicsa') as string;
    const refEtn = formData.get('refEtn') as string;
    const designation = formData.get('designation') as string;
    const familleOriginale = formData.get('familleOriginale') as string;
    const familleId = formData.get('familleId') as string;
    const imageFile = formData.get('image') as File | null;
    const pdfFile = formData.get('pdf') as File | null;

    if (!designation || !refEtn) {
      return NextResponse.json(
        { success: false, message: 'Désignation et référence ETN obligatoires.' },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;
    let pdfUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, 'images/produits');
    }
    if (pdfFile && pdfFile.size > 0) {
      pdfUrl = await saveFile(pdfFile, 'pdfs');
    }

    const article = await prisma.article.create({
      data: {
        refDicsa: refDicsa || '',
        refEtn,
        designation,
        familleOriginale: familleOriginale || null,
        imageUrl: imageUrl || null,
        pdfUrl: pdfUrl || null,
        ...(familleId ? { familleId } : {}),
      },
      include: {
        famille: {
          include: {
            sousCategorie: {
              include: { categorie: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Erreur POST article:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la création.' }, { status: 500 });
  }
}