import { notFound } from 'next/navigation';
import { Package, CheckCircle } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import CartHeader from './CartHeader';
import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

function getProductFromExcel(targetSlug: string) {
  const filePath = path.join(process.cwd(), 'data/catalogue.xlsx');
  if (!fs.existsSync(filePath)) return null;

  const fileBuffer = fs.readFileSync(filePath);
  const file = xlsx.read(fileBuffer, { type: 'buffer' });
  const rawData = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  
  const products = rawData.map((item: any) => {
    const rawSlug = String(item.slug || item.ref || Math.random());
    const safeSlug = rawSlug.replace(/[\/\\\s]/g, '-').toLowerCase();

    let productSpecs = [`Référence : ${item.ref || item.id || "N/A"}`];
    if (item.specs) productSpecs = String(item.specs).split(',').map(s => s.trim());

    return {
      id: String(item.ref || item.id || "sans-ref"),
      name: item.des || item.name || "Produit",
      slug: safeSlug,
      description: item.description || "Aucune description détaillée n'est disponible pour ce produit.",
      price: parseFloat(item.prix || item.price) || 0,
      inStock: item.inStock === 'VRAI' || item.inStock === true || item.stock === 'VRAI',
      badge: item.badge || undefined,
      image: item.image || "/images/placeholder.webp",
      category: item.category || item.subCategory || "Catalogue",
      specs: productSpecs
    };
  });

  return products.find(p => p.slug === targetSlug) || null;
}

// --- COMPOSANT DE LA PAGE ---
export default async function SingleProductPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const product = getProductFromExcel(resolvedParams.slug);

  if (!product) notFound();

  return (
    <>
      {/* On ajoute l'en-tête avec le panier en haut de la page */}
      <CartHeader />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="flex flex-col lg:flex-row">
              
              {/* IMAGE DU PRODUIT */}
              <div className="lg:w-1/2 bg-gray-50 min-h-[400px] flex items-center justify-center relative p-12 border-r border-gray-100">
                {product.image && product.image !== "/images/placeholder.webp" ? (
                  <img src={product.image} alt={product.name} className="max-h-[350px] object-contain" />
                ) : (
                  <Package className="w-32 h-32 text-gray-300" />
                )}
                
                {product.badge && (
                  <div className="absolute top-6 left-6 bg-blue-100 border border-blue-200 text-blue-800 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* DÉTAILS DU PRODUIT */}
              <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                <div className="uppercase tracking-wider text-xs text-blue-500 font-bold mb-3">
                  {product.category}
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    Spécifications techniques
                  </h3>
                  <ul className="space-y-2.5">
                    {product.specs.map((spec: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Prix unitaire</span>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">{product.price.toFixed(2)}€</span>
                      <span className="text-gray-500 ml-2 font-medium">HT</span>
                    </div>
                  </div>
                  
                  <div className="sm:min-w-[200px]">
                     <AddToCartButton product={product} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}