"use client";

import DynamicHead from "@/components/DynamicHead";
import Image from "next/image";
import { ChevronUpCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function ComptoirPage() {

  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);


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
      {/* SEO */}
      <DynamicHead title="ETN - Service Flexpress" favicon="/images/favicon.png" />

      <main className="min-h-screen bg-white">
        {/* Hero section */}
        <section className="relative bg-gray-50 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Service Flexpress
            </h1>
            <p>
              Notre équipe mobile est à votre service pour intervenir rapidement
              sur site et assurer le dépannage et le remplacement de vos flexibles hydrauliques dans plus de 1.500 communes.
            </p>
          </div>
        </section>

        {/* Comptoir */}
        <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Service Flexpress</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                ETN, c&apos;est aussi un service de dépannage flexible sur votre site :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Préventif : Diagnostic des flexibles endommagés</li>
                  <li>Démontage et remplacement de flexibles défectueux sur matériel roulant</li>
              </ul>
          </div>
          <div className="relative w-full h-72 md:h-96">
            <Image
              src="/images/comptoir.webp"
              alt="Service Comptoir"
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
        </section>

        {/* Magasin */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-72 md:h-96 order-2 md:order-1">
              <Image
                src="/images/magasin.webp"
                alt="Magasin ETN"
                fill
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Dépannage Camions
              </h2>
              <p className="text-gray-900 leading-relaxed mb-4">
                Notre service de dépannage camions est à votre disposition sur plus de 1.500 communes réparties sur la région Nord : 
                Nord, Pas-de-Calais, Picardie, Somme. 
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous consulter pour les tarifs.
              </p>
            </div>
          </div>
        </section>
         {ChevronisVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition-all"
        >
          <ChevronUpCircle className="w-6 h-6" />
        </button>
      )}
      </main>
    </>
  );
}
