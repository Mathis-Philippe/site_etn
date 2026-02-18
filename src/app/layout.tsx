// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../lib/styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ✅ On importe notre nouveau fournisseur de panier
import { CartProvider } from "../context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETN",
  description: "Equipements Techniques Nord - Hydraulique et Pneumatique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <div>
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
