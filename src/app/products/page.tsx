"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUpCircle } from 'lucide-react';
import DynamicHead from '../../components/DynamicHead';
import { CartItem, Product, useCart } from '../../context/CartContext';
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Gauge,
  Wrench,
  Settings,
  Star,
  Truck,
  CheckCircle,
  X
} from 'lucide-react';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice, getCartCount } = useCart();

  const categories = [
    { id: 'all', name: 'Tous les produits', icon: <Package className="w-5 h-5" /> },
    { id: 'hydraulique', name: 'Hydraulique', icon: <Gauge className="w-5 h-5" /> },
    { id: 'pneumatique', name: 'Pneumatique', icon: <Wrench className="w-5 h-5" /> },
    { id: 'raccords', name: 'Raccords', icon: <Settings className="w-5 h-5" /> },
    { id: 'flexibles', name: 'Flexibles', icon: <Package className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);


    const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        ChevronsetIsVisible(true);
      } else {
        ChevronsetIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <DynamicHead 
        title="ETN - Produits"
        favicon="/images/favicon.png"
      />
      <main className="min-h-screen bg-white">
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Nos Produits</h1>
              <p className="text-lg text-white/80">
                Découvrez notre catalogue complet de produits hydrauliques, pneumatiques et raccords industriels.
                Plus de 13.000 références en stock pour répondre à tous vos besoins.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-6 sticky top-0 z-40 shadow-md">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 w-full lg:w-auto"
              >
                <option value="popular">Plus populaires</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 w-full justify-center"
              >
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </button>

              <button
                onClick={() => setShowCart(!showCart)}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-800 transition-all relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Catégories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          selectedCategory === category.id
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.icon}
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900 text-white rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-2">Besoin d&apos;aide ?</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Nos experts vous conseillent
                  </p>
                  <button className="bg-yellow-400 text-blue-900 w-full py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all">
                    Contactez-nous
                  </button>
                </div>
              </aside>

              <div className="flex-1">
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    <span className="font-semibold text-blue-900">{sortedProducts.length}</span> produits trouvés
                  </p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    </div>
                  ) : sortedProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      Aucun produit ne correspond à votre recherche.
                    </div>
                  ) : (
                    sortedProducts.map(product => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102 flex flex-col"
                      >
                        <Link href={`/products/${product.id}`} className="flex-1 block cursor-pointer">
                          <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                            <Package className="w-16 h-16 text-gray-400" />
                            {product.badge && (
                              <div className="absolute top-3 left-3 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
                                {product.badge}
                              </div>
                            )}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                                  Rupture de stock
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-6 pb-2">
                            <h3 className="text-lg font-bold text-blue-900 mb-2 hover:underline">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                            <div className="mb-4 space-y-1">
                              {product.specs && product.specs.slice(0, 2).map((spec, index) => (
                                <p key={index} className="text-xs text-gray-500 flex items-center">
                                  <CheckCircle className="w-3 h-3 text-yellow-400 mr-1" />
                                  {spec}
                                </p>
                              ))}
                            </div>

                            <div className="flex items-center mb-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating || 0)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                ({product.reviews})
                              </span>
                            </div>
                          </div>
                        </Link>

                        <div className="p-6 pt-4 mt-auto border-t border-gray-100 bg-gray-50/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-blue-900">
                                  {product.price.toFixed(2)}€
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {product.originalPrice.toFixed(2)}€
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">HT</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault(); 
                                addToCart(product);
                              }}
                              disabled={!product.inStock}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                product.inStock
                                  ? 'bg-yellow-400 text-white hover:bg-yellow-500 shadow-sm'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {product.inStock ? 'Ajouter' : 'Indisponible'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {showCart && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">Votre Panier</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Votre panier est vide</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 text-sm">{item.name}</h3>
                            <p className="text-yellow-400 font-bold">{item.price.toFixed(2)}€</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Sous-total (HT)</span>
                        <span className="font-semibold text-blue-900">{getTotalPrice().toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">TVA (20%)</span>
                        <span className="font-semibold text-blue-900">{(getTotalPrice() * 0.2).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span className="text-blue-900">Total (TTC)</span>
                        <span className="text-yellow-400">{(getTotalPrice() * 1.2).toFixed(2)}€</span>
                      </div>
                    </div>

                    <button className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all mb-3">
                      Demander un devis
                    </button>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="w-full bg-yellow-400 text-white py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-all"
                    >
                      Continuer mes achats
                    </button>

                    <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-blue-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Livraison rapide</p>
                        <p className="text-xs text-gray-600">Livraison sous 48-72h en région Nord</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {ChevronisVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition-all"
        >
          <ChevronUpCircle className="w-6 h-6" />
        </button>
      )}
    </>
  );
}