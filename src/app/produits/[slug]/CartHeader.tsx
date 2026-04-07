"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../../../context/CartContext";

export default function CartHeader() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const placeholderProduct = "/images/placeholder.webp";

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-6">
          
          <Link href="/produits" className="text-sm font-bold text-gray-500 hover:text-blue-900 transition-colors uppercase tracking-wider">
            ← Retour au Catalogue
          </Link>

          <button 
              onClick={() => setShowCart(true)} 
              className="relative p-2 text-gray-600 hover:text-blue-900 transition-colors flex items-center space-x-2"
          >
              <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {mounted && cart.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-blue-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                          {cart.length}
                      </span>
                  )}
              </div>
              <span className="hidden sm:block text-sm font-semibold">Panier</span>
          </button>
        </div>
      </header>

      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
              
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    Mon Panier 
                    {mounted && <span className="ml-3 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">{cart.length}</span>}
                </h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  {!mounted || cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                          <p>Votre panier est vide.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                           {cart.map(item => (
                              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
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

              {mounted && cart.length > 0 && (
                  <div className="p-6 bg-white border-t border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-500">Total HT</span>
                          <span className="text-2xl font-bold text-gray-900">{cartTotal.toFixed(2)}€</span>
                      </div>
                      <button onClick={() => setShowCart(false)} className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                          Demander un devis
                      </button>
                  </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}