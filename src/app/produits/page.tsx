'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import catalogueData from '../../../data/catalogue_site_web.json';

// --- FONCTION POUR TROUVER LA PREMIÈRE IMAGE D'UNE CATÉGORIE ---
const trouverPremiereImage = (noeud: any): string | null => {
  if (!noeud) return null;
  if (Array.isArray(noeud)) {
    const produitAvecImage = noeud.find((p: any) => p && p.image);
    return produitAvecImage ? produitAvecImage.image : null;
  }
  if (noeud._produits && Array.isArray(noeud._produits)) {
    const produitAvecImage = noeud._produits.find((p: any) => p && p.image);
    if (produitAvecImage) return produitAvecImage.image;
  }
  for (const cle of Object.keys(noeud)) {
    if (cle === '_produits') continue;
    const imageTrouvee = trouverPremiereImage(noeud[cle]);
    if (imageTrouvee) return imageTrouvee;
  }
  return null;
};

export default function ProduitsPage() {
  const [selectedCat1, setSelectedCat1] = useState<string | null>(null);
  const [selectedCat2, setSelectedCat2] = useState<string | null>(null);
  const [selectedCat3, setSelectedCat3] = useState<string | null>(null);
  const [selectedFamille, setSelectedFamille] = useState<string | null>(null);

  // --- ANALYSE DES DONNÉES ---
  const categories1 = Object.keys(catalogueData);
  const dataCat1 = selectedCat1 ? (catalogueData as any)[selectedCat1] : null;
  const categories2 = dataCat1 ? Object.keys(dataCat1).filter(k => k !== '_produits') : [];
  const dataCat2 = selectedCat2 && dataCat1 ? dataCat1[selectedCat2] : null;
  const categories3 = dataCat2 ? Object.keys(dataCat2).filter(k => k !== '_produits') : [];

  let produitsAafficher: any[] = [];
  let showCat1 = false;
  let showCat2 = false;
  let showCat3 = false;
  let showFamilles = false;

  if (!selectedCat1) {
    showCat1 = true;
  } else if (!selectedCat2) {
    showCat2 = categories2.length > 0;
    if (dataCat1 && dataCat1._produits) produitsAafficher = dataCat1._produits;
  } else if (!selectedCat3) {
    showCat3 = categories3.length > 0;
    if (dataCat2 && dataCat2._produits) produitsAafficher = dataCat2._produits;
  } else {
    if (dataCat2 && dataCat2[selectedCat3]) produitsAafficher = dataCat2[selectedCat3];
  }

  if (produitsAafficher.length > 0) {
    showFamilles = true;
  }

  // --- REGROUPEMENT PAR FAMILLE ---
  const produitsGroupesParFamille = produitsAafficher.reduce((acc: any, p: any) => {
    const famille = p.famille || p.designation;
    if (!acc[famille]) acc[famille] = [];
    acc[famille].push(p);
    return acc;
  }, {});

  const imageFamilleSelectionnee = selectedFamille && produitsGroupesParFamille[selectedFamille]?.length > 0 
    ? produitsGroupesParFamille[selectedFamille][0].image 
    : null;

  // --- FONCTIONS DE NAVIGATION ---
  const handleBackToCat1 = () => { setSelectedCat1(null); setSelectedCat2(null); setSelectedCat3(null); setSelectedFamille(null); };
  const handleBackToCat2 = () => { setSelectedCat2(null); setSelectedCat3(null); setSelectedFamille(null); };
  const handleBackToCat3 = () => { setSelectedCat3(null); setSelectedFamille(null); };

const genererLienPDF = (famille: string) => {
    let nomFichier = famille.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        nomFichier = nomFichier.replace(/[\s\/"']/g, '_');
        return `/pdfs/${nomFichier}.pdf`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Nos Produits</h1>

      {/* --- FIL D'ARIANE --- */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <button onClick={handleBackToCat1} className="hover:text-blue-600 transition-colors">Accueil</button>
        {selectedCat1 && <><span className="text-slate-300">/</span><button onClick={handleBackToCat2} className={`hover:text-blue-600 ${!selectedCat2 ? 'font-semibold text-slate-800' : ''}`}>{selectedCat1}</button></>}
        {selectedCat2 && <><span className="text-slate-300">/</span><button onClick={handleBackToCat3} className={`hover:text-blue-600 ${!selectedCat3 ? 'font-semibold text-slate-800' : ''}`}>{selectedCat2}</button></>}
        {selectedCat3 && <><span className="text-slate-300">/</span><button onClick={() => setSelectedFamille(null)} className={`hover:text-blue-600 ${!selectedFamille ? 'font-semibold text-slate-800' : ''}`}>{selectedCat3}</button></>}
        {selectedFamille && <><span className="text-slate-300">/</span><span className="text-blue-800 font-semibold">{selectedFamille}</span></>}
      </nav>

      {/* --- TUILES DES CATÉGORIES 1 --- */}
      {showCat1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories1.map((cat1) => {
            const imageApercu = trouverPremiereImage((catalogueData as any)[cat1]);
            return (
              <button key={cat1} onClick={() => setSelectedCat1(cat1)} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all text-left flex flex-col group overflow-hidden">
                <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4 relative w-full overflow-hidden">
                  {imageApercu ? <img src={imageApercu} alt={cat1} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" /> : <span className="text-slate-400 text-sm">Image non disponible</span>}
                </div>
                <div className="p-5 flex flex-col flex-grow w-full">
                  <span className="text-lg font-bold text-slate-800 group-hover:text-blue-700 mb-1">{cat1}</span>
                  <span className="text-sm text-slate-500 mt-auto pt-2">Explorer la gamme →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* --- TUILES DES CATÉGORIES 2 --- */}
      {showCat2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories2.map((cat2) => {
            const imageApercu = trouverPremiereImage(dataCat1[cat2]);
            return (
              <button key={cat2} onClick={() => setSelectedCat2(cat2)} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all text-left flex flex-col group overflow-hidden">
                <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4 relative w-full overflow-hidden">
                  {imageApercu ? <img src={imageApercu} alt={cat2} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" /> : <span className="text-slate-400 text-sm">Image non disponible</span>}
                </div>
                <div className="p-5 flex flex-col flex-grow w-full">
                  <span className="text-md font-bold text-slate-800 group-hover:text-blue-700 mb-1">{cat2}</span>
                  <span className="text-sm text-slate-500 mt-auto pt-2">Voir les sous-catégories →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* --- TUILES DES CATÉGORIES 3 --- */}
      {showCat3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories3.map((cat3) => {
            const imageApercu = trouverPremiereImage(dataCat2[cat3]);
            return (
              <button key={cat3} onClick={() => setSelectedCat3(cat3)} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all text-left flex flex-col group overflow-hidden">
                <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4 relative w-full overflow-hidden">
                  {imageApercu ? <img src={imageApercu} alt={cat3} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" /> : <span className="text-slate-400 text-sm">Image non disponible</span>}
                </div>
                <div className="p-5 flex flex-col flex-grow w-full">
                  <span className="text-md font-bold text-slate-800 group-hover:text-blue-700 mb-1">{cat3}</span>
                  <span className="text-sm text-slate-500 mt-auto pt-2">Voir les modèles →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* --- ÉTAPE 4 : CARTES FAMILLES --- */}
      {showFamilles && !selectedFamille && (
        <div className="mt-8">
          <p className="mb-6 text-slate-600 font-medium border-b pb-2">
            {Object.keys(produitsGroupesParFamille).length} famille(s) de modèles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(produitsGroupesParFamille).map(([nomFamille, articles]: [string, any]) => {
              const premierArticle = articles[0];
              return (
                <div key={nomFamille} onClick={() => setSelectedFamille(nomFamille)} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group flex flex-col">
                  <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-200 relative overflow-hidden">
                    {premierArticle.image ? <img src={premierArticle.image} alt={nomFamille} className="object-contain w-full h-full p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" /> : <span className="text-slate-400 text-sm">Image non disponible</span>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-800 mb-2 leading-tight line-clamp-3 group-hover:text-blue-700 transition-colors" title={nomFamille}>{nomFamille}</h3>
                    <div className="mt-auto pt-4">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">{articles.length} déclinaison(s)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ÉTAPE 5 : FICHE PRODUIT GLOBALE + TABLEAU --- */}
      {selectedFamille && (
        <div className="mt-8 animate-fade-in-up">
          
          <div className="flex flex-col md:flex-row gap-8 mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-full md:w-1/3 flex items-center justify-center bg-white rounded-lg p-4">
               {imageFamilleSelectionnee ? (
                  <img src={imageFamilleSelectionnee} alt={selectedFamille} className="object-contain w-full max-h-[300px]" />
                ) : (
                  <div className="w-full h-48 bg-slate-100 flex items-center justify-center rounded border border-slate-200">
                    <span className="text-slate-400">Image non disponible</span>
                  </div>
                )}
            </div>
            
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <h2 className="text-3xl md:text-3xl font-bold text-blue-900 mb-6 leading-tight">{selectedFamille}</h2>
              
              <div className="flex flex-wrap gap-4 items-center mt-4">
                
                {/* --- LE BOUTON AVEC LE LIEN CORRIGÉ --- */}
                <a 
                  href={genererLienPDF(selectedFamille)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-full transition-colors uppercase text-sm shadow-md inline-block text-center"
                >
                  Documentation Technique
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-blue-800 text-white text-xs uppercase tracking-wider font-bold border-b-2 border-yellow-500">
                    <th className="py-4 px-6 border-r border-blue-700/50">Références</th>
                    <th className="py-4 px-6 border-r border-blue-700/50">Désignation</th>
                    <th className="py-4 px-6 border-r border-blue-700/50 text-center">Quantité</th>
                    <th className="py-4 px-6 text-center">Ajout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {produitsGroupesParFamille[selectedFamille]?.map((produit: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="py-4 px-6 font-semibold text-blue-700 underline hover:text-blue-900 cursor-pointer">
                        {produit.ref_etn || '-'}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-700">
                        {produit.designation}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <input type="number" min="0" defaultValue="0" className="w-20 border border-slate-300 rounded p-2 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="text-slate-500 hover:text-blue-800 transition-colors p-2 hover:bg-white rounded-full shadow-sm opacity-75 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 inline-block">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}