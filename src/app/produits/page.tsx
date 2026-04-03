"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUpCircle } from 'lucide-react';
import DynamicHead from '../../components/DynamicHead';
import { Product, useCart } from '../../context/CartContext';
import {
  Search, ShoppingCart, Package, Star, X,
  ChevronRight, ArrowLeft, SlidersHorizontal
} from 'lucide-react';

// PLACEHOLDERS IMAGES (À remplacer par tes vraies images)
const placeholderMainCat = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'; // Image industrielle générique
const placeholderSubCat = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400';
const placeholderProduct = 'https://images.unsplash.com/photo-1530825894095-9c1851214068?auto=format&fit=crop&q=80&w=400';

// HIÉRARCHIE DES CATÉGORIES
const categoryTree = [
  {
    id: 'fluides', name: 'Gestion des Fluides', image: placeholderMainCat,
    subCategories: [
      { id: 'Graisseurs', name: 'Graisseurs', image: placeholderSubCat },
      { id: 'Vannes', name: 'Vannes', image: placeholderSubCat },
      { id: 'Robinets', name: 'Robinets', image: placeholderSubCat },
      { id: 'Manomètres', name: 'Manomètres', image: placeholderSubCat },
    ]
  },
  {
    id: 'pneumatique', name: 'Pneumatique & Air', image: placeholderMainCat,
    subCategories: [
      { id: 'Pneumatique', name: 'Pneumatique', image: placeholderSubCat },
      { id: 'Coupleurs Air', name: 'Coupleurs Air', image: placeholderSubCat },
      { id: 'Tuyaux Basse Pression', name: 'Tuyaux Basse Pression', image: placeholderSubCat },
    ]
  },
  {
    id: 'raccords', name: 'Raccords & Connectique', image: placeholderMainCat,
    subCategories: [
      { id: 'Raccords Résine', name: 'Raccords Résine', image: placeholderSubCat },
      { id: 'Raccords BP', name: 'Raccords BP', image: placeholderSubCat },
      { id: 'Laiton', name: 'Laiton', image: placeholderSubCat },
      { id: 'Raccords à bagues N', name: 'Raccords à bagues N', image: placeholderSubCat },
      { id: 'Raccords à bagues S', name: 'Raccords à bagues S', image: placeholderSubCat },
      { id: 'Raccords à bagues Inox', name: 'Raccords à bagues Inox', image: placeholderSubCat },
      { id: 'Adaptateurs', name: 'Adaptateurs', image: placeholderSubCat },
    ]
  },
  {
    id: 'sertissage', name: 'Sertissage & Flexibles', image: placeholderMainCat,
    subCategories: [
      { id: 'Jupes à Sertir', name: 'Jupes à Sertir', image: placeholderSubCat },
      { id: 'Jupes', name: 'Jupes', image: placeholderSubCat },
      { id: 'Embouts', name: 'Embouts', image: placeholderSubCat },
      { id: 'Inox à Sertir', name: 'Inox à Sertir', image: placeholderSubCat },
      { id: 'Tuyaux', name: 'Tuyaux', image: placeholderSubCat },
    ]
  },
  {
    id: 'accessoires', name: 'Accessoires & Fixations', image: placeholderMainCat,
    subCategories: [
      { id: 'Colliers', name: 'Colliers', image: placeholderSubCat },
      { id: 'Collier Stauff', name: 'Collier Stauff', image: placeholderSubCat },
      { id: 'Joints', name: 'Joints', image: placeholderSubCat },
      { id: 'Bouchons', name: 'Bouchons', image: placeholderSubCat },
      { id: 'Brides', name: 'Brides', image: placeholderSubCat },
      { id: 'Câble Sécurité', name: 'Câble Sécurité', image: placeholderSubCat },
      { id: 'Gaines de Protections', name: 'Gaines de Protections', image: placeholderSubCat },
    ]
  }
];

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // ÉTAPES
  const [step, setStep] = useState<number>(1);
  const [activeMainCat, setActiveMainCat] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // RECHERCHE & TRI
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  
  // UI ET PANIER
  const [showCart, setShowCart] = useState<boolean>(false);
  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/produits');
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
    // Si on est à l'étape 3, on filtre par catégorie sélectionnée
    const matchCategory = step === 3 ? product.category === selectedCategory : true;
    const matchSearch = product.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
                        product.description.toLowerCase().includes(globalSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // popular
  });

  useEffect(() => {
    const toggleVisibility = () => window.scrollY > 300 ? ChevronsetIsVisible(true) : ChevronsetIsVisible(false);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleMainCategoryClick = (cat: any) => {
    setActiveMainCat(cat);
    setStep(2);
    setGlobalSearch('');
  };

  const handleSubCategoryClick = (subCatId: string) => {
    setSelectedCategory(subCatId);
    setStep(3);
    setGlobalSearch('');
  };

  // Rendu de l'en-tête de la boutique (Espace Pro)
  return (
    <>
      <DynamicHead title="ETN - Catalogue Professionnel" favicon="/images/favicon.png" />
      
      <main className="min-h-screen bg-[#F8FAFC]">
        
        {/* NOUVELLE NAVBAR SPÉCIFIQUE BOUTIQUE (Très pro, type B2B) */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-6">
            
            <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-block text-sm font-medium text-gray-400 border-l border-gray-300 pl-2 ml-2">Catalogue</span>
            </div>

            {/* BARRE DE RECHERCHE CENTRALE */}
            <div className="flex-1 max-w-2xl hidden md:block relative">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une référence, un produit..." 
                        value={globalSearch}
                        onChange={(e) => {
                            setGlobalSearch(e.target.value);
                            if (e.target.value.length > 0 && step < 3) setStep(3); // Passe direct aux produits si on cherche
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                </div>
            </div>

            {/* BOUTON PANIER ÉPURÉ */}
            <button 
                onClick={() => setShowCart(true)} 
                className="relative p-2 text-gray-600 hover:text-blue-900 transition-colors flex items-center space-x-2"
            >
                <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-blue-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                            {cart.length}
                        </span>
                    )}
                </div>
                <span className="hidden sm:block text-sm font-semibold">Panier</span>
            </button>
          </div>
          
          {/* Barre de recherche mobile */}
          <div className="md:hidden border-t border-gray-100 p-4 bg-gray-50">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={globalSearch}
                    onChange={(e) => {
                        setGlobalSearch(e.target.value);
                        if (e.target.value.length > 0 && step < 3) setStep(3);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
            
            {/* FIL D'ARIANE (Breadcrumb) - Très discret et lisible */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                <button 
                    onClick={() => { setStep(1); setGlobalSearch(''); }}
                    className={`hover:text-blue-900 transition-colors ${step === 1 && !globalSearch ? 'text-blue-900 font-semibold' : ''}`}
                >
                    Accueil Catalogue
                </button>
                
                {step >= 2 && !globalSearch && (
                    <>
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <button 
                            onClick={() => setStep(2)}
                            className={`hover:text-blue-900 transition-colors ${step === 2 ? 'text-blue-900 font-semibold' : ''}`}
                        >
                            {activeMainCat?.name}
                        </button>
                    </>
                )}

                {step >= 3 && !globalSearch && (
                    <>
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span className="text-blue-900 font-semibold">{selectedCategory}</span>
                    </>
                )}

                {globalSearch && (
                    <>
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span className="text-blue-900 font-semibold">Résultats pour "{globalSearch}"</span>
                    </>
                )}
            </nav>

            {/* ÉTAPE 1 : GRANDES FAMILLES */}
            {step === 1 && !globalSearch && (
              <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Nos Familles de Produits</h1>
                    <p className="text-gray-500 mt-2">Sélectionnez une catégorie pour affiner votre recherche.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryTree.map((cat) => (
                    <div 
                      key={cat.id}
                      onClick={() => handleMainCategoryClick(cat)}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-900 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
                    >
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{cat.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{cat.subCategories.length} sous-catégories</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

{/* ÉTAPE 2 : SOUS-CATÉGORIES */}
            {step === 2 && !globalSearch && activeMainCat && (
              <div className="animate-fade-in">
                <div className="mb-8 flex gap-4"> {/* J'ai ajouté un flex pour aligner le bouton retour et le texte */}
                    <button onClick={() => setStep(1)} className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors h-fit mt-1">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{activeMainCat.name}</h1>
                        <p className="text-gray-500 mt-1">Précisez votre besoin.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeMainCat.subCategories.map((subCat: any) => (
                    <div 
                      key={subCat.id}
                      onClick={() => handleSubCategoryClick(subCat.id)}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-900 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
                    >
                      {/* Conteneur de l'image (identique à l'étape 1) */}
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={subCat.image} 
                          alt={subCat.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      {/* Conteneur du texte (identique à l'étape 1) */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{subCat.name}</h3>
                        {/* Texte de remplacement pour garder la même hauteur de carte */}
                        <p className="text-gray-500 text-sm mt-1">Voir les articles</p> 
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ÉTAPE 3 : PRODUITS (OU RÉSULTATS DE RECHERCHE) */}
            {(step === 3 || globalSearch) && (
              <div className="animate-fade-in">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
                  <div>
                    {globalSearch ? (
                        <h1 className="text-2xl font-bold text-gray-900">Recherche : "{globalSearch}"</h1>
                    ) : (
                        <h1 className="text-2xl font-bold text-gray-900">{selectedCategory}</h1>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{sortedProducts.length} référence(s) trouvée(s)</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 outline-none focus:border-blue-500"
                    >
                      <option value="popular">Trier par : Pertinence</option>
                      <option value="price-asc">Prix : Croissant</option>
                      <option value="price-desc">Prix : Décroissant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading ? (
                     <div className="col-span-full flex justify-center py-20">
                       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
                     </div>
                  ) : sortedProducts.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg text-gray-600 font-medium">Aucun produit ne correspond à vos critères.</p>
                      <button onClick={() => { setGlobalSearch(''); setStep(1); }} className="mt-4 text-blue-600 hover:underline font-medium text-sm">
                          Retourner au catalogue
                      </button>
                    </div>
                  ) : (
                    sortedProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
                        
                        <Link href={`/produits/${product.slug}`} className="block relative h-48 bg-white p-4 border-b border-gray-100 flex items-center justify-center">
                            <img 
                                src={product.image || placeholderProduct} 
                                alt={product.name} 
                                className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                            />
                            {product.badge && (
                                <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border border-blue-200">
                                    {product.badge}
                                </span>
                            )}
                        </Link>

                        <div className="p-5 flex flex-col flex-1">
                          <Link href={`/produits/${product.slug}`} className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-blue-600">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                          </Link>
                          
                          <div className="mt-auto flex items-end justify-between pt-4">
                            <div>
                                <span className="text-xs text-gray-400 block mb-0.5">Prix pro HT</span>
                                <span className="text-xl font-bold text-gray-900">{product.price.toFixed(2)}€</span>
                            </div>
                            
                            <button
                              onClick={(e) => { e.preventDefault(); addToCart(product); }}
                              disabled={!product.inStock}
                              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
                                product.inStock 
                                ? 'bg-gray-900 text-white hover:bg-blue-600' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              title={product.inStock ? "Ajouter au panier" : "Rupture de stock"}
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
        </div>

        {/* PANIER SLIDE-OVER MODERNE */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
                
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      Mon Panier 
                      <span className="ml-3 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">{cart.length}</span>
                  </h2>
                  <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                            <p>Votre panier est vide.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             {/* ... Ici tu gardes ton mapping du panier existant (item.name, updateQuantity, etc.) ... */}
                             {cart.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 p-1 flex-shrink-0">
                                        <img src={item.image || placeholderProduct} alt={item.name} className="max-h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                                        <div className="text-sm font-bold text-gray-900 mt-1">{item.price.toFixed(2)}€</div>
                                        <div className="flex items-center space-x-3 mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-md">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">-</button>
                                                <span className="px-2 text-xs font-medium min-w-[20px] text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                             ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500">Total HT</span>
                            <span className="text-2xl font-bold text-gray-900">{getTotalPrice().toFixed(2)}€</span>
                        </div>
                        <button onClick={() => setShowCart(false)} className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                            Demander un devis
                        </button>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
      
      {ChevronisVisible && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 p-3 rounded-full bg-white text-gray-600 shadow-lg border border-gray-200 hover:text-blue-600 hover:border-blue-600 transition-all z-50">
          <ChevronUpCircle className="w-6 h-6" />
        </button>
      )}
    </>
  );
}