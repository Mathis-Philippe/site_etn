// src/app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

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

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, message: 'Accès refusé.' }, { status: 403 });
  }

  try {
    // 🌟 1. Comptage dynamique des articles (calqué sur ton modèle d'articles)
    const totalArticles = await prisma.article.count();

    // 🌟 2. Comptage des clients avec détection automatique du nom du modèle Prisma
    let totalClients = 0;
    try {
      // On teste d'abord si ton modèle s'appelle 'user' (minuscule)
      if ('user' in prisma) {
        totalClients = await (prisma as any).user.count();
      } 
      // Sinon on teste s'il s'appelle 'client'
      else if ('client' in prisma) {
        totalClients = await (prisma as any).client.count();
      }
      // Sinon on teste avec une majuscule 'User'
      else if ('User' in prisma) {
        totalClients = await (prisma as any).User.count();
      }
    } catch (err) {
      console.error("Impossible de compter les utilisateurs, vérifie le nom dans ton schema.prisma :", err);
      totalClients = 0; // Sécurité pour éviter le crash
    }

    // 🌟 3. Récupération des 5 derniers articles modifiés
    const derniersArticles = await prisma.article.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc' // Trié par date de création du produit
      }
    });

    const derniereSynchro = derniersArticles.length > 0 
      ? new Date(derniersArticles[0].createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      : 'Aucune donnée';

    return NextResponse.json({
      success: true,
      stats: {
        totalClients,
        totalArticles,
        derniereSynchro
      },
      activiteRecente: derniersArticles.map(art => ({
        id: art.id,
        texte: `Article disponible : ${art.designation}`,
        refEtn: art.refEtn,
        date: new Date(art.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        })
      }))
    });

  } catch (error) {
    console.error('Erreur stats dashboard:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}