// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
// ✅ L'import crucial est ici (on utilise le fichier du dossier lib)
import { prisma } from '../../../lib/prisma'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    
    const formattedProducts = products.map(p => ({
      ...p,
      specs: JSON.parse(p.specs)
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 });
  }
}