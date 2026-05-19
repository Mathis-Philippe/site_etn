// app/api/admin/articles/[id]/route.ts

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

// PUT /api/admin/articles/[id] — Modifier un article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const refDicsa = formData.get('refDicsa') as string;
    const refEtn = formData.get('refEtn') as string;
    const designation = formData.get('designation') as string;
    const familleOriginale = formData.get('familleOriginale') as string;
    const familleId = formData.get('familleId') as string;
    const imageFile = formData.get('image') as File | null;
    const pdfFile = formData.get('pdf') as File | null;

    const updateData: any = {
      refDicsa: refDicsa || '',
      refEtn,
      designation,
      familleOriginale: familleOriginale || null,
      ...(familleId ? { familleId } : {}),
    };

    if (imageFile && imageFile.size > 0) {
      updateData.imageUrl = await saveFile(imageFile, 'images/produits');
    }
    if (pdfFile && pdfFile.size > 0) {
      updateData.pdfUrl = await saveFile(pdfFile, 'pdfs');
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
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
    console.error('Erreur PUT article:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la modification.' }, { status: 500 });
  }
}

// DELETE /api/admin/articles/[id] — Supprimer un article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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