import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "L'adresse e-mail est requise." }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ message: "Si cette adresse existe, un e-mail a été envoyé." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await prisma.resetToken.create({
      data: { email, token, expires }
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reinitialiser-mot-de-passe?token=${token}`;

    // 4. Envoyer l'e-mail
    const mailOptions = {
      from: `"Espace Pro ETN" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #00183A;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé à réinitialiser le mot de passe de votre espace pro ETN.</p>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Ce lien est valable pendant 1 heure.</p>
          <p style="color: #6b7280; font-size: 14px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Si cette adresse existe, un e-mail a été envoyé." }, { status: 200 });

  } catch (error) {
    console.error("Erreur forgot-password:", error);
    return NextResponse.json({ message: "Une erreur est survenue lors de la demande." }, { status: 500 });
  }
}