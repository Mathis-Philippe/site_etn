"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, User, Building, ChevronUpCircle } from 'lucide-react';
import DynamicHead from '../../components/DynamicHead';

export default function ContactPage() {
  const [ChevronisVisible, ChevronsetIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      content: "1 Chemin de Messines II",
      subContent: "59872 SAINT-ANDRÉ, France"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      content: "03 20 92 27 51",
      subContent: "Service commercial"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "etn@equipement-technique-du-nord.fr",
      subContent: "Réponse sous 24h"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horaires",
      content: "Lun - Jeu: 8h - 18h",
      subContent: "Vendredi: 8h - 17h"
    }
  ];

  const schedules = [
    { day: 'Lundi', hours: '8h00 - 18h00', closed: false },
    { day: 'Mardi', hours: '8h00 - 18h00', closed: false },
    { day: 'Mercredi', hours: '8h00 - 18h00', closed: false },
    { day: 'Jeudi', hours: '8h00 - 18h00', closed: false },
    { day: 'Vendredi', hours: '8h00 - 17h00', closed: false },
    { day: 'Samedi', hours: 'Fermé', closed: true },
    { day: 'Dimanche', hours: 'Fermé', closed: true }
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
          title="ETN - Contact"
          favicon="/images/favicon.png"
        />
    <main className="min-h-screen bg-white">
      <section className="bg-blue-900 text-white py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-white/80">
              Notre équipe d&apos;experts est à votre disposition pour répondre à toutes vos questions 
              et vous accompagner dans vos projets.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-blue-900 p-3 rounded-lg flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">{info.title}</h3>
                    <p className="text-gray-700 font-medium text-sm">{info.content}</p>
                    <p className="text-gray-500 text-xs mt-1">{info.subContent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Société
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="Votre entreprise"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="jean@exemple.fr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="devis">Demande de devis</option>
                    <option value="reparation">Réparation</option>
                    <option value="flexpress">Service Flexpress</option>
                    <option value="graissage">Service Graissage</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez votre besoin..."
                    ></textarea>
                  </div>
                </div>
                <div>
                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-700 font-medium">
                        Message envoyé avec succès ! Nous vous répondrons rapidement.
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-blue-900 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-5 h-5" />
                      <span>Envoyer le message</span>
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center">
                  * Champs obligatoires
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-6">
                  Notre localisation
                </h2>
                <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg h-96 flex items-center justify-center border-2 border-gray-300">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20229.332942487064!2d3.0384588!3d50.67045015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c32ae9fa941ea3%3A0x6187aa52eb0657f2!2sETN%20-%20Equipement%20Technique%20du%20Nord!5e0!3m2!1sfr!2sfr!4v1759219842341!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation ETN"
                  ></iframe>
                </div>
              </div>         

              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  Besoin d&apos;une intervention rapide ?
                </h3>
                <p className="text-gray-700 mb-4">
                  Notre service Flexpress est disponible pour vos urgences dans toute la région Nord.
                </p>
                <button className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 w-full">
                  Service d&apos;urgence
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 text-yellow-400 mr-2" />
                  Horaires détaillés
                </h3>
                <div className="space-y-3">
                  {schedules.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className={`font-medium ${schedule.closed ? 'text-gray-400' : 'text-blue-900'}`}>
                        {schedule.day}
                      </span>
                      <span className={`text-sm ${schedule.closed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous préférez nous appeler ?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions
          </p>
          <a 
            href="tel:0XXXXXXXXX"
            className="inline-flex items-center bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover: transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            03 20 92 27 51
          </a>
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