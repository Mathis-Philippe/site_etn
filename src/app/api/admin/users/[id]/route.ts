// src/app/api/admin/users/[id]/route.ts
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

// PUT : Modifier un compte client
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { email, password, nomEntreprise, codeClient, role } = body;

    const updateData: any = {
      email: email?.trim().toLowerCase(),
      nomEntreprise: nomEntreprise?.trim(),
      codeClient: codeClient?.trim().toUpperCase(),
      role: role
    };

    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 🌟 Cible directement 'prisma.client'
    const updatedClient = await prisma.client.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updatedClient });
  } catch (error) {
    console.error('Erreur PUT client:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la modification.' }, { status: 500 });
  }
}

// DELETE : Supprimer un compte client
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    // 🌟 Cible directement 'prisma.client'
    await prisma.client.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE client:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}