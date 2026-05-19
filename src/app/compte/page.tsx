"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  FaChartLine, 
  FaBoxOpen, 
  FaFileInvoiceDollar, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaEye, 
  FaFilePdf,
  FaCheckCircle,
  FaShoppingCart,
  FaTrashAlt
} from "react-icons/fa";
import { useCart } from "@/context/CartContext"; // 🌟 Import du panier

const mockCommandes = [
  { id: "1978087", ref: "EXPRESS 70752", date: "09/04/2026", montant: "465,75 €", statut: "En préparation" },
  { id: "1977196", ref: "70733", date: "07/04/2026", montant: "690,03 €", statut: "Expédiée" },
  { id: "1975002", ref: "CHANTIER LILLE", date: "02/04/2026", montant: "1250,00 €", statut: "Livrée" },
];

const mockFactures = [
  { id: "F-2026-1042", commandeId: "1977196", date: "08/04/2026", montant: "690,03 €", statut: "Payée" },
  { id: "F-2026-0985", commandeId: "1975002", date: "03/04/2026", montant: "1250,00 €", statut: "En attente" },
];

function MonCompteContent() {
  const { cart, modifierQuantite, supprimerDuPanier, viderLePanier } = useCart(); // 🌟 Hooks du Panier
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState<{ nomEntreprise?: string, email?: string, codeClient?: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Écouter si un onglet spécifique est demandé dans l'URL (ex: ?tab=panier)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) throw new Error("Non autorisé");
        const data = await res.json();
        setUserData({
          nomEntreprise: data.nomEntreprise || "Client Pro",
          email: data.email || "Non renseigné",
          codeClient: data.codeClient || "Non renseigné"
        });
      } catch {
        router.push("/connexion");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Chargement de votre espace pro...</div>;
  }

  const SidebarIcon = ({ icon: Icon, tabName, tooltip }: { icon: any, tabName: string, tooltip: string }) => (
    <button
      onClick={() => {
        // Nettoyer l'URL brute quand on clique manuellement sur la sidebar
        router.push("/compte");
        setActiveTab(tabName);
      }}
      className={`relative group w-full py-4 flex justify-center border-l-4 transition-colors ${
        activeTab === tabName 
          ? "border-yellow-400 bg-blue-900 text-white" 
          : "border-transparent text-gray-300 hover:bg-blue-800 hover:text-white"
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
        {tooltip}
      </span>
    </button>
  );

  return (
    <div className="flex min-h-[calc(100vh-100px)] bg-gray-100">
      
      <div className="w-16 bg-[#00183A] flex flex-col items-center pb-1 shadow-xl z-20 flex-shrink-0">
        <div className="flex-1 w-full flex flex-col space-y-2 mt-4">
          <SidebarIcon icon={FaChartLine} tabName="dashboard" tooltip="Tableau de bord" />
          <SidebarIcon icon={FaShoppingCart} tabName="panier" tooltip="Mon Panier" /> {/* 🌟 Onglet Panier */}
          <SidebarIcon icon={FaBoxOpen} tabName="commandes" tooltip="Mes Commandes" />
          <SidebarIcon icon={FaFileInvoiceDollar} tabName="factures" tooltip="Mes Factures" />
          <SidebarIcon icon={FaUserCircle} tabName="infos" tooltip="Mes Informations" />
        </div>
        
        <button 
          onClick={handleLogout}
          className="relative group w-full py-4 flex justify-center text-gray-300 hover:text-red-400 hover:bg-blue-800 transition-colors mt-auto border-l-4 border-transparent"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
            Déconnexion
          </span>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[#9ca3af] px-8 py-4 shadow-sm z-10">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
            {activeTab === 'dashboard' && 'Espace Client'}
            {activeTab === 'panier' && 'Votre Panier Actuel'}
            {activeTab === 'commandes' && 'Historique des Commandes'}
            {activeTab === 'factures' && 'Historique des Factures'}
            {activeTab === 'infos' && 'Fiche Client'}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-6xl mx-auto">
              
              <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">Client</h2>
                  <FaUserCircle className="text-red-700 w-6 h-6" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-white uppercase bg-gray-400">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Identificateur</th>
                        <th className="px-6 py-3 font-semibold">Nom</th>
                        <th className="px-6 py-3 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b text-gray-700">
                        <td className="px-6 py-4 font-medium">{userData.codeClient}</td>
                        <td className="px-6 py-4 font-bold">{userData.nomEntreprise}</td>
                        <td className="px-6 py-4">{userData.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">Dernières commandes</h2>
                  <button onClick={() => setActiveTab('commandes')} className="text-red-700 hover:text-red-800 transition-colors">
                    <FaEye className="w-6 h-6" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-white uppercase bg-gray-400">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Num.</th>
                        <th className="px-6 py-3 font-semibold">État</th>
                        <th className="px-6 py-3 font-semibold">Votre Commande</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold text-right">Montant</th>
                        <th className="px-6 py-3 font-semibold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCommandes.slice(0, 2).map((cmd) => (
                        <tr key={cmd.id} className="bg-white border-b hover:bg-gray-50 transition-colors text-gray-700">
                          <td className="px-6 py-4 font-bold text-red-700">{cmd.id}</td>
                          <td className="px-6 py-4">{cmd.statut}</td>
                          <td className="px-6 py-4">{cmd.ref}</td>
                          <td className="px-6 py-4">{cmd.date}</td>
                          <td className="px-6 py-4 text-right font-medium">{cmd.montant}</td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                              <FaFilePdf className="w-5 h-5 mx-auto" />
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

          {activeTab === "panier" && (
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto p-6">
              {cart && cart.length > 0 ? (
                <div>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="text-xs text-white uppercase bg-[#00183A]">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Visuel</th>
                          <th className="px-6 py-4 font-semibold">Référence ETN</th>
                          <th className="px-6 py-4 font-semibold">Désignation</th>
                          <th className="px-6 py-4 font-semibold text-center w-32">Quantité</th>
                          <th className="px-6 py-4 font-semibold text-center w-24">Supprimer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cart.map((item) => (
                          <tr key={item.ref_etn} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 w-20">
                              <div className="w-12 h-12 bg-gray-50 rounded p-1 flex items-center justify-center border">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.designation} className="object-contain max-h-full max-w-full" />
                                ) : (
                                  <span className="text-[10px] text-gray-400 text-center">No Img</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono font-semibold text-blue-900">{item.ref_etn}</td>
                            <td className="px-6 py-4 text-gray-800 font-medium">{item.designation}</td>
                            <td className="px-6 py-4 text-center">
                              <input 
                                type="number" 
                                min="1" 
                                value={item.quantite || 1} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  modifierQuantite(item.ref_etn, val);
                                }}
                                className="w-20 text-center border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-800 outline-none"
                              />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => supprimerDuPanier(item.ref_etn)}
                                className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-all inline-block"
                                title="Supprimer l'article"
                              >
                                <FaTrashAlt className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t pt-6">
                    <button 
                      onClick={() => viderLePanier()}
                      className="px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors text-sm"
                    >
                      Vider entièrement le panier
                    </button>
                    
                    <button 
                      onClick={() => alert("Fonctionnalité d'envoi de commande en cours de liaison...")}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-colors uppercase text-sm tracking-wider"
                    >
                      Valider et Envoyer la Demande Pro →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Votre panier est actuellement vide.</p>
                  
                  <Link 
                    href="/produits" 
                    onClick={() => {
                      window.dispatchEvent(new Event('reset-produits-page'));
                    }}
                    className="inline-block px-6 py-2.5 bg-[#00183A] text-white font-bold rounded-lg hover:bg-blue-900 transition-colors text-sm"
                  >
                    Parcourir le catalogue produits
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "commandes" && (
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-white uppercase bg-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Numéro</th>
                      <th className="px-6 py-4 font-semibold">Référence</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">État</th>
                      <th className="px-6 py-4 font-semibold text-right">Montant</th>
                      <th className="px-6 py-4 font-semibold text-center">Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCommandes.map((cmd) => (
                      <tr key={cmd.id} className="bg-white border-b hover:bg-gray-50 text-gray-700">
                        <td className="px-6 py-4 font-bold text-[#00183A]">{cmd.id}</td>
                        <td className="px-6 py-4 uppercase text-xs">{cmd.ref}</td>
                        <td className="px-6 py-4">{cmd.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${cmd.statut === 'Livrée' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {cmd.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">{cmd.montant}</td>
                        <td className="px-6 py-4 text-center">
                           <button className="text-gray-400 hover:text-red-600"><FaFilePdf className="w-5 h-5 mx-auto" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "factures" && (
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-white uppercase bg-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Numéro Facture</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Liée à la commande</th>
                      <th className="px-6 py-4 font-semibold text-right">Montant</th>
                      <th className="px-6 py-4 font-semibold text-center">Statut</th>
                      <th className="px-6 py-4 font-semibold text-center">PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFactures.map((facture) => (
                      <tr key={facture.id} className="bg-white border-b hover:bg-gray-50 text-gray-700">
                        <td className="px-6 py-4 font-bold text-[#00183A]">{facture.id}</td>
                        <td className="px-6 py-4">{facture.date}</td>
                        <td className="px-6 py-4 text-gray-500">#{facture.commandeId}</td>
                        <td className="px-6 py-4 text-right font-medium">{facture.montant}</td>
                        <td className="px-6 py-4 text-center">
                          {facture.statut === "Payée" ? <FaCheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-yellow-600 text-xs font-bold uppercase">{facture.statut}</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button className="text-gray-400 hover:text-red-600"><FaFilePdf className="w-5 h-5 mx-auto" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "infos" && (
            <div className="bg-white rounded-md shadow-sm border border-gray-200 max-w-2xl mx-auto p-8">
              <h2 className="text-xl font-bold text-[#00183A] border-b pb-4 mb-6">Informations de l'entreprise</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Code Client (Lecture seule)</label>
                    <input type="text" disabled value={userData.codeClient} className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom de l'entreprise</label>
                    <input type="text" defaultValue={userData.nomEntreprise} className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-[#00183A] outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adresse E-mail de contact</label>
                  <input type="email" defaultValue={userData.email} className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-[#00183A] outline-none transition-all" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="button" className="px-6 py-3 bg-[#00183A] text-white font-bold rounded hover:bg-blue-900 transition-colors">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Next.js exige d'envelopper useSearchParams dans un Suspense pour le build statique/SSR
export default function MonComptePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Chargement de votre espace pro...</div>}>
      <MonCompteContent />
    </Suspense>
  );
}