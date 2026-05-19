// app/api/admin/articles/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { writeFile, mkdir, stat } from 'fs/promises';
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

// 🛑 Nouvelle fonction : Bloque l'écriture si le nom du fichier existe déjà
async function saveFileUnique(file: File, folder: 'images/produits' | 'pdfs'): Promise<string> {
  // 1. On garde le NOM D'ORIGINE en nettoyant les caractères dangereux ou espaces bizarres
  const nomNettoye = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filename = nomNettoye.toLowerCase(); // Tout en minuscules pour ne pas dupliquer Image.PNG et image.png
  
  const dir = path.join(process.cwd(), 'public', folder);
  const filepath = path.join(dir, filename);
  
  // S'assurer que le dossier public/images/produits existe
  await mkdir(dir, { recursive: true });

  // 2. On vérifie physiquement si ce nom de fichier exact est déjà présent
  let fichierExiste = false;
  try {
    const stats = await stat(filepath);
    if (stats.isFile()) {
      fichierExiste = true;
    }
  } catch {
    // Si 'stat' lève une erreur, c'est que le fichier n'est pas là
    fichierExiste = false;
  }

  // 3. LA SÉCURITÉ : Si le nom existe déjà, on n'écrit rien sur le disque dur !
  if (fichierExiste) {
    console.log(`🛑 [STOP] Le fichier "${filename}" existe déjà dans public/${folder}. On ne rajoute rien sur le disque.`);
  } else {
    // Sinon, c'est un fichier inconnu, on l'enregistre pour de bon
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    console.log(`💾 [NOUVEAU] Fichier enregistré pour la première fois : public/${folder}/${filename}`);
  }

  // On renvoie l'adresse d'accès pour Prisma (que l'image vienne d'être créée ou qu'elle existait déjà)
  return `/${folder}/${filename}`;
}

// PUT /api/admin/articles/[id] — Modifier un article
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Correction Next.js 15
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const refEtn = formData.get('refEtn') as string;
    const designation = formData.get('designation') as string;
    const familleOriginale = formData.get('familleOriginale') as string;
    const familleId = formData.get('familleId') as string;
    const imageFile = formData.get('image') as File | null;
    const pdfFile = formData.get('pdf') as File | null;
    const existingImageUrl = formData.get('existingImageUrl') as string | null;

    const updateData: any = {
      refEtn,
      designation,
      familleOriginale: familleOriginale || null,
      ...(familleId ? { familleId } : {}),
    };

    // Gestion de l'image basée sur le nom d'origine
    if (imageFile && imageFile.size > 0) {
      updateData.imageUrl = await saveFileUnique(imageFile, 'images/produits');
    } else if (existingImageUrl) {
      updateData.imageUrl = existingImageUrl; 
    }
    
    // Même comportement appliqué pour les PDFs
    if (pdfFile && pdfFile.size > 0) {
      updateData.pdfUrl = await saveFileUnique(pdfFile, 'pdfs');
    }

    const article = await prisma.article.update({
    where: { id },
    data: updateData,
    include: {
      famille: {
        include: {
          sousCategorie: {
            include: { 
              categorie: true 
            }
          }
        }
      }
    }
  });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Erreur PUT article:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la modification.' }, { status: 500 });
  }
}

// DELETE /api/admin/articles/[id] — Supprimer un article
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Correction Next.js 15
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE article:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}