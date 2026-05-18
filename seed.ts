import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('🚀 Début de la migration via API...');

    // 1. Chemin vers ton fichier JSON
    const dataPath = path.join(process.cwd(), 'data', 'catalogue_site_web.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const catalogue = JSON.parse(fileContent);

    // 2. Migration des données
    for (const [nomCategorie, sousCategories] of Object.entries(catalogue)) {
      const categorie = await prisma.categorie.upsert({
        where: { nom: nomCategorie },
        update: {},
        create: { nom: nomCategorie },
      });

      for (const [nomSousCategorie, familles] of Object.entries(sousCategories as any)) {
        const sousCategorie = await prisma.sousCategorie.upsert({
          where: { nom_categorieId: { nom: nomSousCategorie, categorieId: categorie.id } },
          update: {},
          create: { nom: nomSousCategorie, categorieId: categorie.id },
        });

        for (const [nomFamille, articles] of Object.entries(familles as any)) {
          const famille = await prisma.famille.upsert({
            where: { nom_sousCategorieId: { nom: nomFamille, sousCategorieId: sousCategorie.id } },
            update: {},
            create: { nom: nomFamille, sousCategorieId: sousCategorie.id },
          });

          for (const item of (articles as any[])) {
            await prisma.article.upsert({
              where: { refDicsa: item.ref_dicsa },
              update: {
                refEtn: item.ref_etn || null,
                designation: item.designation,
                familleId: famille.id,
                imageUrl: `/images/produits/${item.ref_dicsa}.png`
              },
              create: {
                refDicsa: item.ref_dicsa,
                refEtn: item.ref_etn || null,
                designation: item.designation,
                familleId: famille.id,
                imageUrl: `/images/produits/${item.ref_dicsa}.png`
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ message: '✅ Migration réussie !' });
  } catch (error: any) {
    console.error('❌ Erreur migration :', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}