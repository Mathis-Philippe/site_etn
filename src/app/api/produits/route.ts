import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data/catalogue.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error("Le fichier n'existe pas au chemin :", filePath);
      return NextResponse.json([]); 
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    const file = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = file.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
    
const formattedProducts = rawData.map((item: any) => {
      const rawSlug = String(item.slug || item.ref || Math.random());
      const safeSlug = rawSlug.replace(/[\/\\\s]/g, '-').toLowerCase();

      return {
        id: String(item.ref || item.id || "sans-ref"),
        name: item.des || item.name || "Produit",
        slug: safeSlug,
        description: item.description || "",
        price: parseFloat(item.prix || item.price) || 0,
        inStock: item.inStock === 'VRAI' || item.inStock === true || item.stock === 'VRAI',
        badge: item.badge || null,
        image: item.image || "/images/placeholder.webp",
        mainCategory: item.mainCategory || "",
        category: item.category || item.subCategory || ""
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Erreur API Excel:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}