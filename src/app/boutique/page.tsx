"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUpCircle } from 'lucide-react';
import DynamicHead from '../../components/DynamicHead';
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

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  description: string;
  specs: string[];
}

interface CartItem extends Product {
  quantity: number;
}

export default function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);

  const categories = [
    { id: 'all', name: 'Tous les produits', icon: <Package className="w-5 h-5" /> },
    { id: 'hydraulique', name: 'Hydraulique', icon: <Gauge className="w-5 h-5" /> },
    { id: 'pneumatique', name: 'Pneumatique', icon: <Wrench className="w-5 h-5" /> },
    { id: 'raccords', name: 'Raccords', icon: <Settings className="w-5 h-5" /> },
    { id: 'flexibles', name: 'Flexibles', icon: <Package className="w-5 h-5" /> }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Flexible Hydraulique DN06",
      category: "hydraulique",
      price: 45.90,
      originalPrice: 52.00,
      image: "placeholder",
      rating: 4.5,
      reviews: 23,
      inStock: true,
      badge: "Bestseller",
      description: "Flexible haute pression DN06, 2 tresses acier",
      specs: ["Pression max: 400 bar", "Température: -40°C à +100°C", "Longueur: Sur mesure"]
    },
    {
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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
                {sortedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102"
                  >
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

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                      <div className="mb-4 space-y-1">
                        {product.specs.slice(0, 2).map((spec, index) => (
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
                                i < Math.floor(product.rating)
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
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            product.inStock
                              ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.inStock ? 'Ajouter' : 'Indisponible'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                      <span className="font-semibold text-blue-900">{getTotalPrice()}€</span>
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
                  <button className="w-full bg-yellow-400 text-white py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-all">
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