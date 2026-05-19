'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const ImageProduit = ({ produit, alt, className }: { produit: any, alt: string, className: string }) => {
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [produit]);

  const sources: string[] = [];
  if (produit?.imageUrl) sources.push(produit.imageUrl);
  if (produit?.ref_dicsa) {
    sources.push(`/images/produits/${produit.ref_dicsa}.png`);
    sources.push(`/images/produits/${produit.ref_dicsa.replace(/[\/\\º]/g, '')}.png`);
    sources.push(`/images/produits/${produit.ref_dicsa.replace(/[\s\/\\\.\º\-]/g, '')}.png`);
  }
  const uniqueSources = Array.from(new Set(sources));

  if (!produit || uniqueSources.length === 0 || srcIndex >= uniqueSources.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[120px] bg-slate-50/50">
        <span className="text-slate-400 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <img
      src={uniqueSources[srcIndex]}
      alt={alt}
      className={className}
      onError={() => setSrcIndex(prev => prev + 1)}
    />
  );
};

// 2. Trouver le premier produit pour l'aperçu
const trouverPremierProduit = (noeud: any): any | null => {
  // Sécurité : Si ce n'est pas un objet ou si c'est null, on s'arrête
  if (!noeud || typeof noeud !== 'object') return null;

  // Si c'est directement un tableau d'articles
  if (Array.isArray(noeud)) {
    return noeud.find((p: any) => p && (p.imageUrl || p.ref_dicsa)) || null;
  }

  // Si l'objet contient une clé _produits
  if (noeud._produits && Array.isArray(noeud._produits)) {
    return noeud._produits.find((p: any) => p && (p.imageUrl || p.ref_dicsa)) || null;
  }

  // Parcours récursif des sous-clés
  for (const cle of Object.keys(noeud)) {
    if (cle === '_produits') continue;
    
    // Sécurité supplémentaire : on ne plonge que si la sous-clé est elle-même un objet/tableau
    if (noeud[cle] && typeof noeud[cle] === 'object') {
      const produitTrouve = trouverPremierProduit(noeud[cle]);
      if (produitTrouve) return produitTrouve;
    }
  }
  
  return null;
};

// 3. Adaptateur Prisma (ajoute les clés parentes aux articles pour pouvoir les retrouver)
const adapterDonneesPrisma = (categoriesDb: any[]) => {
  const catalogueStructure: any = {};

  categoriesDb.forEach((cat) => {
    catalogueStructure[cat.nom] = {};

    cat.sousCategories?.forEach((subCat: any) => {
      if (subCat.nom === '_produits') {
        const allArticles: any[] = [];
        subCat.familles?.forEach((fam: any) => {
          fam.articles?.forEach((art: any) => {
            allArticles.push({
              ref_dicsa: art.refDicsa,
              ref_etn: art.refEtn,
              designation: art.designation,
              imageUrl: art.imageUrl,
              famille: art.familleOriginale || null,
              // Métadonnées indispensables pour la redirection
              c1: cat.nom,
              c2: subCat.nom,
              c3: null
            });
          });
        });
        catalogueStructure[cat.nom]['_produits'] = allArticles;
      } else {
        catalogueStructure[cat.nom][subCat.nom] = {};

        subCat.familles?.forEach((fam: any) => {
          if (fam.nom === '_produits') {
            const allArticles: any[] = [];
            fam.articles?.forEach((art: any) => {
              allArticles.push({
                ref_dicsa: art.refDicsa,
                ref_etn: art.refEtn,
                designation: art.designation,
                imageUrl: art.imageUrl,
                famille: art.familleOriginale || null,
                c1: cat.nom,
                c2: subCat.nom,
                c3: null
              });
            });
            catalogueStructure[cat.nom][subCat.nom]['_produits'] = allArticles;
          } else {
            const articlesArr: any[] = [];
            fam.articles?.forEach((art: any) => {
              articlesArr.push({
                ref_dicsa: art.refDicsa,
                ref_etn: art.refEtn,
                designation: art.designation,
                imageUrl: art.imageUrl,
                famille: art.familleOriginale || null,
                c1: cat.nom,
                c2: subCat.nom,
                c3: fam.nom
              });
            });
            catalogueStructure[cat.nom][subCat.nom][fam.nom] = articlesArr;
          }
        });
      }
    });
  });

  return catalogueStructure;
};

export default function ProduitsPage() {
  const [catalogueData, setCatalogueData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedCat1, setSelectedCat1] = useState<string | null>(null);
  const [selectedCat2, setSelectedCat2] = useState<string | null>(null);
  const [selectedCat3, setSelectedCat3] = useState<string | null>(null);
  const [selectedFamille, setSelectedFamille] = useState<string | null>(null);


  useEffect(() => {
    async function fetchCatalogue() {
      try {
        const res = await fetch('/api/produits');
        const result = await res.json();
        if (result.success) {
          const structureFormatee = adapterDonneesPrisma(result.data);
          setCatalogueData(structureFormatee);
        }
      } catch (error) {
        console.error("❌ Erreur chargement catalogue :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogue();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCat1, selectedCat2, selectedCat3, selectedFamille]);

  useEffect(() => {
  const resetPage = () => {
    setInputValue('');
    setSearchQuery('');
    setSelectedCat1(null);
    setSelectedCat2(null);
    setSelectedCat3(null);
    setSelectedFamille(null);
  };

  window.addEventListener('reset-produits-page', resetPage);
  return () => window.removeEventListener('reset-produits-page', resetPage);
  }, 
  []);

  useEffect(() => {
    const minuterie = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 1000); 

    return () => clearTimeout(minuterie);
  }, [inputValue]);

  const tousLesArticles = useMemo(() => {
    if (!catalogueData) return [];
    const articles: any[] = [];
    
    const extraireMotscles = (noeud: any) => {
      if (Array.isArray(noeud)) {
        noeud.forEach(art => articles.push(art));
        return;
      }
      if (noeud._produits && Array.isArray(noeud._produits)) {
        noeud._produits.forEach((art: any) => articles.push(art));
      }
      for (const cle of Object.keys(noeud)) {
        if (cle === '_produits') continue;
        extraireMotscles(noeud[cle]);
      }
    };
    
    extraireMotscles(catalogueData);

    const deDuplicated = Array.from(
      new Map(articles.map(item => [item.ref_dicsa + item.ref_etn, item])).values()
    );

    return deDuplicated;
  }, [catalogueData]);

  // Filtrage intelligent
  const articlesFiltrés = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    
    return tousLesArticles.filter((art) => {
      return (
        art.designation?.toLowerCase().includes(query) ||
        art.ref_dicsa?.toLowerCase().includes(query) ||
        art.ref_etn?.toLowerCase().includes(query) ||
        art.famille?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, tousLesArticles]);

  const allerAFamilleArticle = (article: any) => {
    setSelectedCat1(article.c1 === '_produits' ? null : article.c1);

    if (article.c2 === '_produits') {
      setSelectedCat2(null);
      setSelectedCat3(null);
    } else {
      setSelectedCat2(article.c2);
      setSelectedCat3(article.c3 === '_produits' ? null : article.c3);
    }

    setSelectedFamille(article.famille || article.designation);
    
    setInputValue('');
    setSearchQuery(''); 
  };

  if (loading || !catalogueData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mb-4"></div>
        <p className="text-slate-600 font-medium">Chargement du catalogue...</p>
      </div>
    );
  }

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

  const isSearching = searchQuery.trim() !== '';

  // La navigation classique fonctionne à nouveau normalement, non cassée par la saisie
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

  const produitsGroupesParFamille = produitsAafficher.reduce((acc: any, p: any) => {
    const famille = p.famille || p.designation;
    if (!acc[famille]) acc[famille] = [];
    acc[famille].push(p);
    return acc;
  }, {});

  const handleBackToCat1 = () => { setSearchQuery(''); setSelectedCat1(null); setSelectedCat2(null); setSelectedCat3(null); setSelectedFamille(null); };
  const handleBackToCat2 = () => { setSelectedCat2(null); setSelectedCat3(null); setSelectedFamille(null); };
  const handleBackToCat3 = () => { setSelectedCat3(null); setSelectedFamille(null); };

  const genererLienPDF = (famille: string) => {
    let nomFichier = famille.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    nomFichier = nomFichier.replace(/[\s\/"']/g, '_');
    return `/pdfs/${nomFichier}.pdf`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-slate-800">Nos Produits</h1>

      <div className="mb-8 max-w-2xl relative">
        <input
          type="text"
          placeholder="Rechercher un produit, une désignation, une référence..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 placeholder:text-slate-400"
        />
        {inputValue.trim() !== '' && (
          <button 
            onClick={() => { setInputValue(''); setSearchQuery(''); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <span className="text-sm font-medium">Effacer</span>
          </button>
        )}
      </div>

      {isSearching ? (
        <div className="mt-4 animate-fade-in">
          <p className="mb-6 text-slate-600 font-medium border-b pb-2">
            {articlesFiltrés.length} résultat(s) trouvé(s) :
          </p>
          
          {articlesFiltrés.length > 0 ? (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-blue-800 text-white text-xs uppercase tracking-wider font-bold border-b-2 border-yellow-500">
                      <th className="py-4 px-6 border-r border-blue-700/50">Visuel</th>
                      <th className="py-4 px-6 border-r border-blue-700/50">Référence ETN</th>
                      <th className="py-4 px-6 border-r border-blue-700/50">Référence DICSA</th>
                      <th className="py-4 px-6">Désignation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {articlesFiltrés.map((produit: any, idx: number) => (
                      <tr 
                        key={idx} 
                        onClick={() => allerAFamilleArticle(produit)}
                        className="hover:bg-blue-50 cursor-pointer transition-colors group"
                      >
                        <td className="py-2 px-4 border-r border-slate-100 w-20 h-16">
                          <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center p-1">
                            <ImageProduit produit={produit} alt={produit.designation} className="object-contain w-full h-full mix-blend-multiply" />
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-blue-700 group-hover:underline">
                          {produit.ref_etn || '-'}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {produit.ref_dicsa || '-'}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-700">
                          <div className="font-medium text-slate-900">{produit.designation}</div>
                          {produit.famille && <span className="text-xs text-slate-400">Famille : {produit.famille}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">Aucun produit ne correspond.</p>
            </div>
          )}
        </div>
      ) : (
        /* Affichage de la Navigation standard (uniquement si pas de recherche active) */
        <>
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <button onClick={handleBackToCat1} className="hover:text-blue-600 transition-colors">Accueil</button>
            {selectedCat1 && <><span className="text-slate-300">/</span><button onClick={handleBackToCat2} className={`hover:text-blue-600 ${!selectedCat2 ? 'font-semibold text-slate-800' : ''}`}>{selectedCat1}</button></>}
            {selectedCat2 && <><span className="text-slate-300">/</span><button onClick={handleBackToCat3} className={`hover:text-blue-600 ${!selectedCat3 ? 'font-semibold text-slate-800' : ''}`}>{selectedCat2}</button></>}
            {selectedCat3 && <><span className="text-slate-300">/</span><button onClick={() => setSelectedFamille(null)} className={`hover:text-blue-600 ${!selectedFamille ? 'font-semibold text-slate-800' : ''}`}>{selectedCat3}</button></>}
            {selectedFamille && <><span className="text-slate-300">/</span><span className="text-blue-800 font-semibold">{selectedFamille}</span></>}
          </nav>

          {showCat1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories1.map((cat1) => {
                const produitApercu = trouverPremierProduit((catalogueData as any)[cat1]);
                return (
                  <button key={cat1} onClick={() => setSelectedCat1(cat1)} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all text-left flex flex-col group overflow-hidden">
                    <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4 relative w-full overflow-hidden">
                      <ImageProduit produit={produitApercu} alt={cat1} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
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

          {showCat2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories2.map((cat2) => {
                const produitApercu = trouverPremierProduit(dataCat1[cat2]);
                return (
                  <button key={cat2} onClick={() => setSelectedCat2(cat2)} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all text-left flex flex-col group overflow-hidden">
                    <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4 relative w-full overflow-hidden">
                      <ImageProduit produit={produitApercu} alt={cat2} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
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

          {showCat3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories3.map((cat3) => {
                const produitApercu = trouverPremierProduit(dataCat2[cat3]);
                return (
                  <button key={cat3} onClick={() => setSelectedCat3(cat3)} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500 transition-all text-left flex flex-col group overflow-hidden">
                    <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 p-4 relative w-full overflow-hidden">
                      <ImageProduit produit={produitApercu} alt={cat3} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
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

          {showFamilles && !selectedFamille && (
            <div className="mt-8">
              <p className="mb-6 text-slate-600 font-medium border-b pb-2">
                {Object.keys(produitsGroupesParFamille).length} famille(s) de modèles
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(produitsGroupesParFamille).map(([nomFamille, articles]: [string, any]) => {
                  return (
                    <div key={nomFamille} onClick={() => setSelectedFamille(nomFamille)} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group flex flex-col">
                      <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-200 relative overflow-hidden p-4">
                        <ImageProduit produit={articles[0]} alt={nomFamille} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
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

          {selectedFamille && (
            <div className="mt-8 animate-fade-in-up">
              <div className="flex flex-col md:flex-row gap-8 mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-full md:w-1/3 flex items-center justify-center bg-white rounded-lg p-4">
                   <ImageProduit 
                      produit={produitsGroupesParFamille[selectedFamille]?.[0]} 
                      alt={selectedFamille} 
                      className="object-contain w-full max-h-[300px]" 
                   />
                </div>
                
                <div className="w-full md:w-2/3 flex flex-col justify-center">
                  <h2 
                    className="font-bold text-blue-900 mb-6 leading-tight max-w-full"
                    style={{
                      fontSize: selectedFamille && selectedFamille.length > 30 
                        ? 'clamp(0.9rem, 3vw - 0.2rem, 1.3rem)' 
                        : 'clamp(1.3rem, 4.5vw, 1.6rem)'
                    }}
                  >
                    {selectedFamille}
                  </h2>
                  <div className="flex flex-wrap gap-4 items-center mt-4">
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
        </>
      )}
    </div>
  );
}