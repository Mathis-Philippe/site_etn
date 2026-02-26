"use client";

import React from 'react';
import { useCart, Product } from '../../../context/CartContext';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      disabled={!product.inStock}
      className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${
        product.inStock 
        ? 'bg-yellow-400 hover:bg-yellow-500 text-blue-900 shadow-md hover:shadow-lg' 
        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
    >
      {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
    </button>
  );
}