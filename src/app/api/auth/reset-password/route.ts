import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Informations manquantes." }, { status: 400 });
    }

    const resetToken = await prisma.resetToken.findUnique({
      where: { token }
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json({ message: "Ce lien est invalide ou a expiré. Veuillez refaire une demande." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.client.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword }
    });

    await prisma.resetToken.delete({
      where: { id: resetToken.id }
    });

    return NextResponse.json({ message: "Mot de passe modifié avec succès !" }, { status: 200 });

  } catch (error) {
    console.error("Erreur de réinitialisation:", error);
    return NextResponse.json({ message: "Une erreur est survenue." }, { status: 500 });
  }
}