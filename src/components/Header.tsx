"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FaFacebook, FaLinkedin, FaUserCircle, FaTimes } from "react-icons/fa";
import { MdEmail, MdAccountCircle, MdLogout, MdShoppingBasket, MdOutlinePersonOutline } from "react-icons/md";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [userData, setUserData] = useState<{ authenticated: boolean; nomEntreprise?: string } | null>(null);
  
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      setUserData(data.authenticated ? data : { authenticated: false });
    } catch {
      setUserData({ authenticated: false });
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="relative w-full">
      <div className="bg-[#00183A] text-white py-2 px-6">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="mailto:etn@equipement-technique-du-nord.fr" className="flex items-center hover:text-yellow-400 transition-colors">
              <MdEmail className="mr-2 w-4 h-4" /> etn@equipement-technique-du-nord.fr
            </a>
            <span className="font-bold hidden sm:inline">03 20 92 27 51</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-yellow-400"><FaFacebook /></a>
            <a href="#" className="hover:text-yellow-400"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-[100]">
        <div className="container mx-auto flex justify-between items-center py-4 px-6 relative">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/etn(logo).png" alt="ETN Logo" width={120} height={45} priority />
          </Link>

          <div className="flex items-center space-x-8">
            <nav className="hidden lg:flex items-center space-x-8 text-gray-700 font-semibold uppercase text-sm tracking-wide">
              <Link href="/" className="hover:text-blue-700 transition-colors">Accueil</Link>
              <Link href="/about" className="hover:text-blue-700 transition-colors">À propos</Link>
              {userData?.authenticated && (
                <Link href="/produits" className="text-blue-700 font-bold border-b-2 border-blue-700">Produits</Link>
              )}
              <Link href="/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center space-x-5 border-l pl-8 border-gray-200">
              <button 
                onClick={() => setIsAccountOpen(true)}
                className="flex items-center text-gray-700 hover:text-blue-700 transition-colors group"
              >
                <MdAccountCircle className={`w-8 h-8 ${userData?.authenticated ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className="hidden md:block ml-2 text-xs font-bold uppercase">
                  {userData?.authenticated ? 'Mon Compte' : 'Connexion'}
                </span>
              </button>
              
              <button className="lg:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="space-y-1.5">
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                </div>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-2xl z-[110]">
              <div className="flex flex-col py-4 px-6 space-y-4">
                <Link href="/" className="text-gray-700 font-medium hover:text-blue-700 uppercase text-sm" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                <Link href="/about" className="text-gray-700 font-medium hover:text-blue-700 uppercase text-sm" onClick={() => setIsMenuOpen(false)}>À propos</Link>
                {userData?.authenticated && (
                  <Link href="/produits" className="text-blue-700 font-bold uppercase text-sm border-l-4 border-blue-700 pl-2" onClick={() => setIsMenuOpen(false)}>Catalogue Produits</Link>
                )}
                <Link href="/contact" className="text-gray-700 font-medium hover:text-blue-700 uppercase text-sm" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAccountOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[120]" onClick={() => setIsAccountOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-[130] shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold uppercase tracking-wider">Mon Espace Pro</h2>
              <button onClick={() => setIsAccountOpen(false)}><FaTimes className="w-6 h-6 text-gray-400" /></button>
            </div>

            {userData?.authenticated ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Entreprise</p>
                  <p className="text-lg font-bold text-[#00183A]">{userData.nomEntreprise || "Client Pro"}</p>
                </div>
                <nav className="space-y-2">
                  <Link href="/produits" className="flex items-center p-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsAccountOpen(false)}>
                    <MdShoppingBasket className="mr-3 w-5 h-5 text-gray-400" /> Accéder au Catalogue
                  </Link>

                  <Link href="/compte" className="flex items-center p-3 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsAccountOpen(false)}>
                    <MdOutlinePersonOutline className="mr-3 w-5 h-5 text-gray-400" /> Mon Espace ETN
                  </Link>
                </nav>
                
                <button onClick={handleLogout} className="mt-auto flex items-center justify-center w-full py-3 border-2 border-red-100 text-red-600 font-bold rounded-lg hover:bg-red-50">
                  <MdLogout className="mr-2" /> Déconnexion
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-8">Connectez-vous pour accéder à vos tarifs.</p>
                <Link href="/connexion" className="block w-full py-3 bg-[#00183A] text-white font-bold rounded-lg" onClick={() => setIsAccountOpen(false)}>Se connecter</Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}