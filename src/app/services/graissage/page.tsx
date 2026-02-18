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
      <DynamicHead title="ETN - Service Graissage" favicon="/images/favicon.png" />

      <main className="min-h-screen bg-white">
        <section className="relative bg-gray-50 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Service Graissage
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe technique est à votre service pour la mise en place et l&apos;entretien 
              de solutions de lubrification centralisée adaptées à vos équipements industriels et mobiles.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Solutions de Lubrification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dans une étude réalisée par un grand fabricant de composants, 
              il a été déterminé que plus de 50% de l&apos;incidence au niveau des roulements 
              était dû à une mauvaise lubrification.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              ETN vous propose des solutions de lubrification pour vos équipements
              industriels et la maintenance de vos camions.
            </p>
            <p className="text-gray-900 font-bold leading-relaxed">
              Équipements industriels
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Nos solutions de lubrification fiable et efficace vous permettent d&apos;optimiser vos équipements.
            </p>
            <p className="text-gray-900 font-bold leading-relaxed">
              Équipements complets pour la maintenance des camions
            </p>
            <p className="text-gray-700 leading-relaxed">
              Qu&apos;il s&apos;agisse du pompage, de la distribution ou du suivi de l&apos;utilisation des fluides, 
              huiles et graisses, ETN vous propose des solutions fiables pour les applications de maintenance des véhicules en atelier. 
            </p>
          </div>
          <div className="relative w-full h-72 md:h-96">
            <Image
              src="/images/graissage.webp"
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
                src="/images/graissage2.webp"
                alt="Magasin ETN"
                fill
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Applications courantes
              </h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="text-gray-900 leading-relaxed">
                  <ul>
                    <li>Wagonnets</li>
                    <li>Niveleuses</li>
                    <li>Décapeuses</li>
                    <li>Bulldozers</li>
                    <li>Porte-Outils</li>
                    <li>Perçeuses</li>
                    <li>Chargeurs à direction</li>
                    <li>Niveleurs, profileurs</li>
                    <li>Recycleurs à froid</li>
                    <li>Stabilisateur de sols</li>
                  </ul>
                </div>
                <div className="text-gray-900 leading-relaxed">
                  <ul>
                    <li>Telebets</li>
                    <li>Compacteurs</li>
                    <li>Bétonnières</li>
                    <li>Pompes à flèches</li>
                    <li>Paveurs</li>
                    <li>Marteaux</li>
                    <li>Pulvérsateurs</li>
                    <li>Cisailles</li>
                    <li>Grappins</li>
                    <li>...</li>
                  </ul>
                </div>
              </div>
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
