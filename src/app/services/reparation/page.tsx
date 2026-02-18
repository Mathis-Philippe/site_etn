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
      <DynamicHead title="ETN - Service Réparation" favicon="/images/favicon.png" />

      <main className="min-h-screen bg-white">
        <section className="relative bg-gray-50 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Service Réparation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe spécialisée est à votre service pour la réparation et le remplacement rapide 
              de vos flexibles hydrauliques et composants, directement dans notre atelier équipé.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Entretien & Réparation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Etn c&apos;est aussi <strong>un atelier de réparation</strong>,
            </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Entretien et réparation de vos flexibles et raccord sur vos engins mobiles</li>
                <li>Préventif : diagnostic des pièces endommagées</li>
              </ul>
          </div>
          <div className="relative w-full h-72 md:h-96">
            <Image
              src="/images/reparation.webp"
              alt="Service Comptoir"
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-72 md:h-96 order-2 md:order-1">
              <Image
                src="/images/flexibles.jpg"
                alt="Magasin ETN"
                fill
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Remplacement de vos flexibles
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Remplacement immédiat de vos flexibles dans notre atelier directement sur votre matériel : 
                Tous flexibles hydrauliques, pneumatiques, onduleux inox et freinage &quot;durite aviation&quot;.
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
