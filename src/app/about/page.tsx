"use client";

import React, { useState, useEffect } from 'react';
import { Award, Users, Target, TrendingUp, CheckCircle, Factory, Wrench, Clock, MapPin, Phone, ChevronUpCircle } from 'lucide-react';
import Link from 'next/link';
import DynamicHead from '../../components/DynamicHead';

export default function AboutPage() {
  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);
  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque projet et chaque service fourni à nos clients"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Proximité",
      description: "Une équipe à l'écoute, disponible et réactive pour vous accompagner au quotidien"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Expertise",
      description: "45 ans d'expérience dans la transmission des fluides et l'hydraulique industrielle"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Innovation",
      description: "Des solutions modernes et performantes adaptées aux besoins de votre industrie"
    }
  ];

  const timeline = [
    {
      year: "1985",
      title: "Création d'ETN",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      year: "1995",
      title: "Expansion des services",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
    },
    {
      year: "2005",
      title: "Nouveau site",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
    },
    {
      year: "2015",
      title: "Certification qualité",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
    },
    {
      year: "2025",
      title: "Leader régional",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
    }
  ];

  const services = [
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Atelier équipé",
      description: "Un atelier moderne avec tous les équipements nécessaires pour répondre à vos besoins"
    },
    {
      icon: <Factory className="w-12 h-12" />,
      title: "Stock important",
      description: "Plus de 13.000 références disponibles immédiatement dans notre entrepôt"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Réactivité",
      description: "Service Flexpress disponible pour vos interventions urgentes"
    }
  ];

  const stats = [
    { number: "45+", label: "Années d'expérience", color: "text-yellow-400" },
    { number: "500+", label: "Clients fidèles", color: "text-yellow-400" },
    { number: "13.000", label: "Références en stock", color: "text-yellow-400" },
    { number: "1.500 m²", label: "Surface totale", color: "text-yellow-400" }
  ];

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
     <DynamicHead 
       title="ETN - À Propos"
       favicon="/images/favicon.png"
     />
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              À propos d&apos;ETN
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-4">
              Depuis 1985, ETN (Équipement Technique du Nord) est votre partenaire de confiance 
              pour toutes vos solutions de transmission des fluides dans la région Nord.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Spécialisés dans l&apos;hydraulique, la pneumatique et le graissage centralisé, 
              nous accompagnons les professionnels et les industriels avec expertise et réactivité.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
              Notre Histoire
            </h2>
            <p className="text-lg text-gray-600">
              Plus de quatre décennies d&apos;engagement au service de l&apos;industrie régionale
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {timeline.map((event, index) => (
                <div 
                  key={index}
                  className="relative pl-8 pb-8 border-l-4 border-yellow-400 last:border-0 last:pb-0"
                >
                  <div className="absolute left-0 top-0 w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-2.5"></div>
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl font-bold text-yellow-400 mr-4">{event.year}</span>
                      <h3 className="text-xl font-bold text-blue-900">{event.title}</h3>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
              Nos Valeurs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="bg-yellow-400 text-blue-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Expertise */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
                Notre Expertise
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Fort de 45 années d&apos;expérience, ETN s&apos;est imposé comme le leader régional 
                dans le domaine de la transmission des fluides.
              </p>
              <div className="space-y-4">
                {[
                  "Conseil technique personnalisé",
                  "Installation et maintenance",
                  "Formation de vos équipes",
                  "Solutions sur mesure"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-blue-900 text-white rounded-lg p-6 hover:bg-blue-800 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-yellow-400">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-white/80">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl lg:text-5xl font-bold mb-2 ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Engagement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
                Notre Engagement Qualité
              </h2>
              <p className="text-lg text-gray-600">
                La satisfaction de nos clients est au cœur de nos préoccupations
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl p-8 lg:p-12 border-2 border-yellow-400">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Qualité garantie</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Produits certifiés et conformes aux normes</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Contrôle qualité systématique</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Traçabilité complète</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Service client</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Équipe technique qualifiée</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Disponibilité et réactivité</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Suivi personnalisé</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-400">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
              Prêt à travailler avec nous ?
            </h2>
            <p className="text-lg text-blue-900/80 mb-8">
              Découvrez comment ETN peut vous accompagner dans vos projets de transmission des fluides
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 hover:scale-105 shadow-lg">
                Nos Services
              </button>
              <Link href="/contact" passHref>
              <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg">
                Contactez-nous
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Footer */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              Nos Coordonnées
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-900 mb-2">Adresse</h4>
                <p className="text-gray-600 text-sm">1 chemin de Messines II<br />59872 Saint-André, France</p>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-900 mb-2">Téléphone</h4>
                <p className="text-gray-600 text-sm">03 20 92 27 51</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-900 mb-2">Horaires</h4>
                <p className="text-gray-600 text-sm">Lun-Jeu: 8h-18h<br />Ven: 8h-17h</p>
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