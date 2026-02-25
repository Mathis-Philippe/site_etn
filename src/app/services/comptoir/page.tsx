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
      <DynamicHead title="ETN - Service Comptoir" favicon="/images/favicon.png" />

      <main className="min-h-screen bg-white">
        <section className="relative bg-gray-50 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Service Comptoir
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe expérimentée est à votre service pour toutes vos
              problématiques en hydraulique, pneumatique et transmission de
              fluides.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Comptoir</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Notre site de <strong>1.500 m² avec parking client</strong>,
              situé à Saint-André, permet à notre équipe expérimentée de
              répondre à chaque problématique dans de nombreux domaines.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Notre comptoir de vente vous permet de venir retirer les produits
              souhaités rapidement et efficacement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Un <strong>comptoir outillage</strong> est également à votre
              disposition pour répondre à vos besoins techniques.
            </p>
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
                Magasin
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Plus de <strong>13.000 références</strong> stockées pour couvrir
                tous vos besoins :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gamme pneumatique</li>
                <li>Gamme haute pression</li>
                <li>Gamme industries</li>
                <li>Gamme lavage</li>
                <li>Gamme freinage durite type aviation</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Expédition</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>ETN</strong>, c’est un service logistique qui vous garantit la possibilité
              de commandes express.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Votre commande vous est transmise par notre{" "}
              <strong>service d’expédition</strong>, afin de vous assurer une
              réception rapide et fiable.
            </p>
          </div>
          <div className="relative w-full h-72 md:h-96">
            <Image
              src="/images/livraison.webp"
              alt="Expédition ETN"
              fill
              className="object-cover rounded-lg shadow-md"
            />
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
