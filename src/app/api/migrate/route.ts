import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log("🚀 Début de la migration via API...");

    const filePath = path.join(process.cwd(), 'data', 'catalogue_site_web.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "Fichier JSON introuvable" }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const catalogue = JSON.parse(fileData);

    let countCategories = 0;
    let countSubCategories = 0;
    let countFamilies = 0;
    let countArticles = 0;

    for (const [catName, subCategories] of Object.entries(catalogue)) {
      if (!subCategories || typeof subCategories !== 'object') continue;

      const categorieDb = await prisma.categorie.upsert({
        where: { nom: catName },
        update: {},
        create: { nom: catName },
      });
      countCategories++;

      for (const [subCatName, families] of Object.entries(subCategories as object)) {
        if (!families || typeof families !== 'object') continue;

        const sousCategorieDb = await prisma.sousCategorie.upsert({
          where: {
            nom_categorieId: { nom: subCatName, categorieId: categorieDb.id },
          },
          update: {},
          create: { nom: subCatName, categorieId: categorieDb.id },
        });
        countSubCategories++;

        // 🔥 CAS PARTICULIER : Si 'families' est déjà un tableau, le JSON a sauté le niveau "Famille"
        if (Array.isArray(families)) {
          // On crée une famille par défaut (ex: "Générique Système de sécurité anti-fouet")
          const defaultFamilyName = subCatName === '_produits' ? `Générique ${catName}` : subCatName;

          const familleDb = await prisma.famille.upsert({
            where: {
              nom_sousCategorieId: { nom: defaultFamilyName, sousCategorieId: sousCategorieDb.id },
            },
            update: {},
            create: { nom: defaultFamilyName, sousCategorieId: sousCategorieDb.id },
          });
          countFamilies++;

          // On insère directement les articles
          for (const item of families) {
            if (!item || !item.ref_dicsa) continue;
            await prisma.article.upsert({
              where: { refDicsa: item.ref_dicsa },
              update: {
                designation: item.designation || '',
                refEtn: item.ref_etn || '',
                familleId: familleDb.id,
              },
              create: {
                refDicsa: item.ref_dicsa,
                designation: item.designation || '',
                refEtn: item.ref_etn || '',
                familleId: familleDb.id,
              },
            });
            countArticles++;
          }
          
          // On a fini pour cette sous-catégorie, on passe à la suivante
          continue; 
        }

        // Structure normale à 4 niveaux
        for (const [familyName, articles] of Object.entries(families as object)) {
          if (!Array.isArray(articles)) {
            console.warn(`❌ Structure toujours invalide pour la famille "${familyName}"`, typeof articles);
            continue;
          }

          const familleDb = await prisma.famille.upsert({
            where: {
              nom_sousCategorieId: { nom: familyName, sousCategorieId: sousCategorieDb.id },
            },
            update: {},
            create: { nom: familyName, sousCategorieId: sousCategorieDb.id },
          });
          countFamilies++;

          for (const item of articles) {
            if (!item || !item.ref_dicsa) continue;

            await prisma.article.upsert({
              where: { refDicsa: item.ref_dicsa },
              update: {
                designation: item.designation || '',
                refEtn: item.ref_etn || '',
                imageUrl: item.image || null,
                familleOriginale: item.famille || null,
                familleId: familleDb.id,
              },
              create: {
                refDicsa: item.ref_dicsa,
                designation: item.designation || '',
                refEtn: item.ref_etn || '',
                imageUrl: item.image || null,
                familleOriginale: item.famille || null,
                familleId: familleDb.id,
              },
            });
            countArticles++;
          }
        }
      }
    }

    console.log("✅ Migration terminée avec succès !");
    return NextResponse.json({
      success: true,
      message: "Migration réussie !",
      stats: { categories: countCategories, sousCategories: countSubCategories, familles: countFamilies, articles: countArticles }
    });

  } catch (error: any) {
    console.error("❌ Erreur critique lors de la migration :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}