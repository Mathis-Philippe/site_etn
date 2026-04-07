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
  const filePath = path.join(process.cwd(), 'src/data/catalogue.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.error("Fichier Excel introuvable");
    return [];
  }

  const file = xlsx.readFile(filePath);
  const sheetName = file.SheetNames[0];
  const worksheet = file.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<ProduitExcel>(worksheet);
  
  return data;
}