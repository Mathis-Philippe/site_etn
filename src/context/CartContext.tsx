// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export type CartItem = {
  ref_etn: string;
  ref_dicsa: string;
  designation: string;
  imageUrl?: string;
  quantite: number;
};

type CartContextType = {
  cart: CartItem[];
  ajouterAuPanier: (produit: Omit<CartItem, 'quantite'>, quantite: number) => void;
  modifierQuantite: (ref_etn: string, quantite: number) => void;
  supprimerDuPanier: (ref_etn: string) => void;
  viderLePanier: () => void;
  nombreArticlesTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientCode, setClientCode] = useState<string | null>(null);
  const pathname = usePathname();

  // 1. Synchronisation avec ton API route.ts au changement de page
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        
        // On s'adapte à la structure exacte de ton route.ts : data.client.codeClient
        if (data.authenticated && data.client?.codeClient) {
          if (clientCode !== data.client.codeClient) {
            setClientCode(data.client.codeClient);
          }
        } else {
          setClientCode(null);
          setCart([]);
        }
      } catch {
        setClientCode(null);
        setCart([]);
      }
    }
    checkUser();
  }, [pathname, clientCode]);

  // 2. Chargement du panier unique de l'utilisateur basé sur le codeClient
  useEffect(() => {
    if (!clientCode) return;

    const uniqueStorageKey = `etn_cart_${clientCode}`;
    const savedCart = localStorage.getItem(uniqueStorageKey);
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur de lecture du panier local", e);
      }
    } else {
      setCart([]); 
    }
  }, [clientCode]);

  // 3. Sauvegarde dans le localStorage sous la clé du code client unique
  useEffect(() => {
    if (!clientCode) return;

    const uniqueStorageKey = `etn_cart_${clientCode}`;
    localStorage.setItem(uniqueStorageKey, JSON.stringify(cart));
  }, [cart, clientCode]);

  // Action : Ajouter un produit
  const ajouterAuPanier = (produit: Omit<CartItem, 'quantite'>, quantite: number) => {
    if (quantite <= 0) return;

    setCart((prevCart) => {
      const itemExistant = prevCart.find((item) => item.ref_etn === produit.ref_etn);

      if (itemExistant) {
        return prevCart.map((item) =>
          item.ref_etn === produit.ref_etn
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }

      return [...prevCart, { ...produit, quantite }];
    });
  };

  // Action : Modifier la quantité
  const modifierQuantite = (ref_etn: string, quantite: number) => {
    if (quantite <= 0) {
      supprimerDuPanier(ref_etn);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.ref_etn === ref_etn ? { ...item, quantite } : item))
    );
  };

  // Action : Supprimer une ligne
  const supprimerDuPanier = (ref_etn: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.ref_etn !== ref_etn));
  };

  // Action : Vider le panier
  const viderLePanier = () => {
    setCart([]);
  };

  // Calcul du nombre total de marchandises
  const nombreArticlesTotal = cart.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        ajouterAuPanier,
        modifierQuantite,
        supprimerDuPanier,
        viderLePanier,
        nombreArticlesTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}