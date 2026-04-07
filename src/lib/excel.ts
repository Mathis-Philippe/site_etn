// src/lib/excel.ts
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export interface ProduitExcel {
  reference: string;
  nom: string;
  categorie: string;
  description: string;
  prix?: number;
}

export function getProduitsFromExcel(): ProduitExcel[] {
  // 1. Trouver le chemin du fichier
  const filePath = path.join(process.cwd(), 'src/data/catalogue.xlsx');
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.error("Fichier Excel introuvable");
    return [];
  }

  // 2. Lire le fichier
  const file = xlsx.readFile(filePath);
  
  // 3. Prendre le premier onglet (feuille) du fichier Excel
  const sheetName = file.SheetNames[0];
  const worksheet = file.Sheets[sheetName];
  
  // 4. Convertir le tableau Excel en tableau d'objets Javascript
  const data = xlsx.utils.sheet_to_json<ProduitExcel>(worksheet);
  
  return data;
}