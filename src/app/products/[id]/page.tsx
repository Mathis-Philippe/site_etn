import { notFound } from 'next/navigation';
import { Package, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product } from '../../../context/CartContext';
import { prisma } from '../../../lib/prisma';
import AddToCartButton from './AddToCartButton';

async function getProduct(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  
  if (!product) return null;
  
  return { 
    ...product, 
    originalPrice: product.originalPrice ?? undefined,
    badge: product.badge ?? undefined,
    specs: JSON.parse(product.specs) 
  };
}

export default async function SingleProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <Link href="/products" className="inline-flex items-center text-blue-900 hover:text-blue-700 font-semibold mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux produits
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            <div className="lg:w-1/2 bg-gray-100 min-h-[400px] flex items-center justify-center relative p-12">
              <Package className="w-32 h-32 text-gray-300" />
              {product.badge && (
                <div className="absolute top-6 left-6 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow">
                  {product.badge}
                </div>
              )}
            </div>

            <div className="lg:w-1/2 p-10 flex flex-col justify-center">
              <div className="uppercase tracking-wide text-sm text-yellow-500 font-bold mb-2">
                {product.category}
              </div>
              <h1 className="text-4xl font-extrabold text-blue-900 mb-4">{product.name}</h1>
              
              <p className="text-gray-600 text-lg mb-8">{product.description}</p>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Spécifications :</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t pt-8 flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold text-blue-900">{product.price.toFixed(2)}€</span>
                  <span className="text-gray-500 ml-2">HT</span>
                </div>
                
                <AddToCartButton product={product} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}