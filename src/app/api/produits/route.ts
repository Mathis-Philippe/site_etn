import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalogue = await prisma.categorie.findMany({
      include: {
        sousCategories: {
          include: {
            familles: {
              include: {
                articles: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: catalogue });
  } catch (error: any) {
    console.error("❌ Erreur récupération catalogue Prisma:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}