import * as xlsx from 'xlsx';
import path from 'path';

// 1. On importe TON instance Prisma déjà configurée avec better-sqlite3 !
import { prisma } from '../src/lib/prisma';

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'client_etn.xlsx'); 

  console.log("Lecture du fichier...");
  
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; 
  const worksheet = workbook.Sheets[sheetName];

  const clientsData = xlsx.utils.sheet_to_json(worksheet);

  console.log(`Trouvé ${clientsData.length} lignes dans le fichier. Début de l'importation...`);

  let count = 0;
  for (const row of clientsData as any[]) {
    const codeClient = row['code_client']; 
    const nomEntreprise = row['nom'];

    if (!codeClient) continue; 

    try {
      await prisma.client.upsert({
        where: { codeClient: String(codeClient) },
        update: { 
          nomEntreprise: nomEntreprise ? String(nomEntreprise) : null 
        },
        create: {
          codeClient: String(codeClient),
          nomEntreprise: nomEntreprise ? String(nomEntreprise) : null,
        },
      });
      count++;
    } catch (error) {
      console.error(`❌ Erreur lors de l'import du client ${codeClient} :`, error);
    }
  }

  console.log(`✅ Importation terminée avec succès ! ${count} clients ont été ajoutés/mis à jour.`);
}

main()
  .catch((e) => {
    console.error("Erreur fatale :", e);
    process.exit(1);
  });