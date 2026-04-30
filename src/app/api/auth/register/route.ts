import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codeClient, email, password } = body;

    if (!codeClient || !email || !password) {
      return NextResponse.json({ message: "Tous les champs (Code, Email, Mot de passe) sont requis." }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { codeClient: codeClient }
    });

    if (!client) {
      return NextResponse.json({ message: "Code client introuvable. Veuillez vérifier votre code." }, { status: 404 });
    }

    if (client.password !== null) {
      return NextResponse.json({ message: "Ce compte a déjà été activé. Veuillez vous connecter." }, { status: 400 });
    }

    const existingEmail = await prisma.client.findUnique({
      where: { email: email }
    });

    if (existingEmail) {
      return NextResponse.json({ message: "Cette adresse e-mail est déjà associée à un autre compte." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.client.update({
      where: { codeClient: codeClient },
      data: { 
        password: hashedPassword,
        email: email
      }
    });

    return NextResponse.json({ message: "Compte activé avec succès !" }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json({ message: "Une erreur est survenue." }, { status: 500 });
  }
}