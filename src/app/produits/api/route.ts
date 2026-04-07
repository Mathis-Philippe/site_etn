import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. On cherche ton fichier Excel (assure-toi qu'il est bien dans src/data/catalogue.xlsx)
    const filePath = path.join(process.cwd(), 'src/data/catalogue.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error("Fichier introuvable à :", filePath);
      return NextResponse.json([]); 
    }

    // 2. On lit le fichier Excel
    const file = xlsx.readFile(filePath);
    const sheetName = file.SheetNames[0]; // On prend le premier onglet
    const rawData = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
    
    // 3. On "traduit" tes colonnes (ref, des...) pour le site
    const formattedProducts = rawData.map((item: any) => ({
      id: String(item.ref || item.id || "sans-ref"),     // Ton excel utilise 'ref'
      name: item.des || item.name || "Produit",          // Ton excel utilise 'des'
      slug: item.slug || String(item.ref || Math.random()), 
      description: item.description || "",
      price: parseFloat(item.prix || item.price) || 0,
      inStock: item.inStock === 'VRAI' || item.inStock === true || item.stock === 'VRAI',
      badge: item.badge || null,
      image: item.image || "/images/placeholder.webp",
      mainCategory: item.mainCategory || "",
      category: item.category || item.subCategory || ""  // Ton excel utilise 'category'
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Erreur API Excel:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 });
  }
}