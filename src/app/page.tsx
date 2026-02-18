"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUpCircle, Wrench, Truck, Settings, Phone, MapPin, Clock, Users, Package, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DynamicHead from '../components/DynamicHead';
import '../lib/styles/globals.css';

export default function HomePage() {
  const [HeroisVisible, HerosetIsVisible] = useState(false);
  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  useEffect(() => {
    HerosetIsVisible(true);
  }, []);

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

  const services = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Comptoir",
      subtitle: "Atelier spécialisé",
      description: "Remplacement immédiat de vos flexibles dans notre atelier directement sur votre matériel",
      features: ["13.000 références", "Vente au comptoir", "Toutes marques"],
      Image: "/images/comptoir.webp",
      Lien: "/services/comptoir"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Réparation",
      subtitle: "Atelier spécialisé",
      description: "Remplacement immédiat de vos flexibles dans notre atelier directement sur votre matériel",
      features: ["Intervention rapide", "Atelier équipé", "Toutes marques"],
      Image: "/images/reparation.webp",
      Lien: "/services/reparation"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Service Flexpress",
      subtitle: "Dépannage mobile",
      description: "Service de dépannage avec camions à votre disposition sur plus de 1.500 communes",
      features: ["Intervention sur site", "Dépannage et remplacement de vos flexibles", "Région Nord couverte"],
      Image: "/images/flexpress.webp",
      Lien: "/services/flexpress"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Service Graissage",
      subtitle: "Lubrification centralisée",
      description: "Solutions de lubrification pour vos équipements industriels et\nmobiles.",
      features: ["Maintenance préventive", "Équipements industriels", "Solutions sur mesure"],
      Image: "/images/graissage.webp",
      Lien: "/services/graissage"
    }
  ];

  const productRanges = [
    {
      title: "Gamme Pneumatique",
      items: ["Raccords pneumatiques", "Coupleurs pneumatiques", "Composants pneumatiques", "Vannes basse pression"],
    },
    {
      title: "Gamme Haute Pression",
      items: ["Flexibles hydrauliques", "Embouts et raccords hydrauliques", "Adaptateurs", "Manomètres", "Brides et coupleurs"],
    },
    {
      title: "Gamme Industries",
      items: ["Onduleux Inox", "Tuyaux industriels", "Raccords symétriques", "Colliers de serrage"],
    }
  ];

  return (
    <>
    <DynamicHead 
      title="ETN - Accueil"
      favicon="/images/favicon.png"
    />
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="container mx-auto px-6 py-16 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 ${HeroisVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center bg-white rounded-full px-4 py-2 text-sm font-medium shadow-sm border border-gray-200">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span className="text-blue-900">Spécialiste depuis 1974</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-blue-900">
                  Bienvenue chez ETN,<br/>
                  <span className="text-yellow-400">spécialiste de la transmission des fluides</span>
                </h1>
                
                <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                  Solutions professionnelles pour l&apos;hydraulique, la pneumatique et les équipements industriels. 
                  Service de proximité dans toute la région Nord.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-blue-900">03 20 92 27 51</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-blue-900">Ouvert de 8h à 18h en semaine (vendredi 17h)</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => {
                      const section = document.getElementById("services");
                      if (section) section.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-800"
                    >
                    Nos Services
                </button>
                <button className="bg-yellow-400 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-yellow-500">
                  Devis Gratuit
                </button>
              </div>
            </div>

            {/* Right Image Placeholder */}
            <div className={`transition-all duration-1000 delay-300 ${HeroisVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Image
                  src="/images/hero-img.webp"
                  alt="Atelier ETN"
                  width={800}
                  height={800}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-blue-900" />
        </div>
      </section>

      {/* Services Section */}
      <section id='services' className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Nos Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Des solutions complètes pour tous vos besoins en transmission de fluides
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer
                  ${hoveredService === index ? 'ring-2 ring-yellow-400 scale-105' : ''}
                }`}
                onClick={() => setHoveredService(index)}
                onMouseEnter={() => setHoveredService(index)}
              >
            <div className="h-48 w-full relative rounded-t-lg overflow-hidden flex items-center justify-center">
              <Image
                src={service.Image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 text-blue-900">
                      {service.title}
                    </h3>
                    <p className="text-sm font-medium mb-3 text-yellow-400">
                      {service.subtitle}
                    </p>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">
                      {service.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={service.Lien || "/services"}>
                  <button className="mt-4 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-all">
                    Plus de détails
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Ranges */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Nos gammes de produits
            </h2>
            <p className="text-gray-600 text-lg">
              Plus de 13.000 références en stock
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {productRanges.map((range, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-900">{range.title}</h3>
                  <ul className="space-y-3">
                    {range.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-start mt-4">
                  <button className="bg-yellow-400 text-white px-6 py-2 rounded text-sm font-medium hover:bg-yellow-500 transition-all cursor-pointer">
                    Découvrir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#00183A] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Notre clientèle nous positionne comme leader dans la région
            </h2>
            <p className="text-white/80">
              Notre site de 1.500 m² avec parking client et comptoir de vente
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Award className="w-8 h-8 mx-auto mb-2" />, number: "45", label: "ANNÉES D'EXPÉRIENCE" },
              { icon: <Package className="w-8 h-8 mx-auto mb-2" />, number: "13.000", label: "RÉFÉRENCES EN STOCK" },
              { icon: <MapPin className="w-8 h-8 mx-auto mb-2" />, number: "1.500 m²", label: "DE SURFACE" },
              { icon: <Users className="w-8 h-8 mx-auto mb-2" />, number: "100%", label: "SATISFACTION CLIENT" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-yellow-400">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {stat.number}
                </div>
                <div className="text-white/80 text-xs md:text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-400 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#00183A]">
            Besoin d&apos;une solution technique ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-950/80">
            Contactez nos experts pour un devis personnalisé. Service rapide et conseil technique inclus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-800">
              Demander un devis
            </button>
            <Link href="/contact" passHref>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:bg-gray-50">
              Nous contacter
            </button>
            </Link>
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