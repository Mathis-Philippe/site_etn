import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaBetterSqlite3({ url: "./dev.db" } as any);
const prisma = new PrismaClient({ adapter });

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-") 
    .replace(/(^-|-$)+/g, "");
};

const products = [
  {
    name: "Raccord JIC Mâle 1/4",
    category: "raccords",
    price: 8.50,
    image: "placeholder",
    rating: 4.8,
    reviews: 45,
    inStock: true,
    badge: "Populaire",
    description: "Raccord hydraulique JIC mâle filetage 1/4",
    specs: ["Matériau: Acier", "Revêtement: Zinc", "Norme: ISO 8434-2"]
  },
  {
    name: "Coupleur Pneumatique Rapide",
    category: "pneumatique",
    price: 12.90,
    image: "placeholder",
    rating: 4.6,
    reviews: 34,
    inStock: true,
    description: "Coupleur rapide pour air comprimé",
    specs: ["Débit max: 2800 l/min", "Pression: 0-15 bar", "Connexion: Rapide"]
  },
  {
    name: "Flexible Pneumatique PU Ø8",
    category: "pneumatique",
    price: 18.50,
    originalPrice: 22.00,
    image: "placeholder",
    rating: 4.4,
    reviews: 18,
    inStock: true,
    badge: "Promo",
    description: "Tuyau pneumatique en polyuréthane",
    specs: ["Diamètre: 8mm", "Longueur: 10m", "Couleur: Bleu"]
  },
  {
    name: "Flexible Hydraulique DN10",
    category: "hydraulique",
    price: 65.00,
    image: "placeholder",
    rating: 4.7,
    reviews: 29,
    inStock: true,
    description: "Flexible haute pression DN10, 4 tresses",
    specs: ["Pression max: 420 bar", "Température: -40°C à +120°C", "Qualité supérieure"]
  },
  {
    name: "Kit Raccords Assortis",
    category: "raccords",
    price: 89.90,
    image: "placeholder",
    rating: 4.9,
    reviews: 56,
    inStock: true,
    badge: "Kit Complet",
    description: "Assortiment de 50 raccords hydrauliques",
    specs: ["50 pièces", "Mallette incluse", "Formats variés"]
  },
  {
    name: "Embout Sertissage DN06",
    category: "raccords",
    price: 15.50,
    image: "placeholder",
    rating: 4.5,
    reviews: 21,
    inStock: false,
    description: "Embout à sertir pour flexible DN06",
    specs: ["Acier haute résistance", "Sertissage 4 griffes", "Filetage JIC"]
  },
  {
    name: "Flexible Industriel Caoutchouc",
    category: "flexibles",
    price: 35.00,
    image: "placeholder",
    rating: 4.3,
    reviews: 12,
    inStock: true,
    description: "Flexible caoutchouc usage industriel",
    specs: ["Diamètre: 25mm", "Pression: 10 bar", "Usage: Eau/Air"]
  },
  {
    name: "Vanne Hydraulique 1/2",
    category: "hydraulique",
    price: 42.00,
    originalPrice: 48.00,
    image: "placeholder",
    rating: 4.6,
    reviews: 27,
    inStock: true,
    badge: "Nouveau",
    description: "Vanne à boisseau sphérique haute pression",
    specs: ["Filetage: 1/2 BSP", "Pression max: 350 bar", "Levier manuel"]
  }
];

async function main() {
  console.log("Nettoyage de l'ancienne base de données...");
  await prisma.product.deleteMany(); 

  console.log("Injection des nouveaux produits...");
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        slug: generateSlug(product.name), 
        specs: JSON.stringify(product.specs) 
      }
    });
  }
  
  console.log("✅ Base de données remplie avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });