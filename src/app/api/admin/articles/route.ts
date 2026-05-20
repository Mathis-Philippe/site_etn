// app/api/admin/articles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { writeFile, mkdir, readdir } from 'fs/promises'; // 🌟 Utilisation de readdir pour checker sans casser les majuscules
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

// 🛑 Sauvegarde 100% brute : Garde les accents, majuscules et symboles, bloque si déjà présent
async function saveFileUnique(file: File, folder: 'images/produits' | 'pdfs'): Promise<string> {
  // 🌟 ON GARDE LE NOM BRUT STRICT (Majuscules, accents, espaces, +, etc.)
  const filename = file.name; 
  
  const dir = path.join(process.cwd(), 'public', folder);
  const filepath = path.join(dir, filename);
  
  await mkdir(dir, { recursive: true });

  // Pour éviter les doublons invisibles (ex: COFFRE.pdf et coffre.pdf), on regarde dans le dossier
  let fichierExiste = false;
  try {
    const fichiersExistants = await readdir(dir);
    // On compare en minuscules juste pour la sécurité anti-doublon, peu importe l'OS
    fichierExiste = fichiersExistants.some(f => f.toLowerCase() === filename.toLowerCase());
  } catch {
    fichierExiste = false;
  }

  if (fichierExiste) {
    console.log(`🛑 [STOP] Le fichier "${filename}" existe déjà dans public/${folder}. Aucun doublon ajouté.`);
  } else {
    // S'il n'existe pas, on l'écrit avec son VRAI NOM d'origine (accents + majuscules)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    console.log(`💾 [NOUVEAU] Fichier enregistré avec son nom d'origine : public/${folder}/${filename}`);
  }

  return `/${folder}/${filename}`;
}

// GET /api/admin/articles
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

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { designation: { contains: search } },
        { refEtn: { contains: search } },
      ];
    }
    if (familleId) {
      where.familleId = familleId;
    }

    const orderBy: any = {};
    const validSortFields = ['designation', 'refEtn', 'familleOriginale', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'designation';
    orderBy[field] = sortOrder === 'desc' ? 'desc' : 'asc';

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

// POST /api/admin/articles
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const refEtn = formData.get('refEtn') as string;
    const designation = formData.get('designation') as string;
    const familleOriginale = formData.get('familleOriginale') as string;
    const familleId = formData.get('familleId') as string;
    const imageFile = formData.get('image') as File | null;
    const pdfFile = formData.get('pdf') as File | null;

    if (!designation || !refEtn) {
      return NextResponse.json({ success: false, message: 'Désignation et référence ETN obligatoires.' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let pdfUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFileUnique(imageFile, 'images/produits');
    }
    if (pdfFile && pdfFile.size > 0) {
      pdfUrl = await saveFileUnique(pdfFile, 'pdfs');
    }

    const article = await prisma.article.create({
      data: {
        refEtn: refEtn.trim(),
        designation: designation.trim(),
        familleOriginale: familleOriginale || null,
        familleId: familleId || null,
        imageUrl,
        pdfUrl,
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