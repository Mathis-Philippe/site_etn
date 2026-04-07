"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, Product } from "../../../context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); 
  };

  if (!product.inStock) {
    return (
      <button disabled className="w-full bg-gray-100 text-gray-400 py-4 px-8 rounded-xl font-bold cursor-not-allowed border border-gray-200">
        Rupture de stock
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
      <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white h-14 overflow-hidden">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-500 hover:bg-gray-50 hover:text-blue-900 font-bold text-xl h-full transition-colors">-</button>
        <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="px-5 text-gray-500 hover:bg-gray-50 hover:text-blue-900 font-bold text-xl h-full transition-colors">+</button>
      </div>

      <button 
        onClick={handleAdd}
        className={`relative flex-1 flex items-center justify-center gap-3 h-14 px-8 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden ${
          isAdded 
          ? "bg-green-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-500 ring-offset-2" 
          : "bg-blue-900 text-white hover:bg-blue-800 shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-6 h-6 animate-bounce" />
            <span>Ajouté au panier !</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-6 h-6" />
            <span>Ajouter au panier</span>
          </>
        )}
      </button>
    </div>
  );
}