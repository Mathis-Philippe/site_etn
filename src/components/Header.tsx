"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <div className="bg-[#00183A] shadow-sm sticky top-0 z-50 pb-4 pt-4 flex justify-around space-x-6 py-2">
        <div className="flex space-x-4">
          <a href="mailto:etn@equipement-technique-du-nord.fr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
            <MdEmail className="w-6 h-6" />
          </a>
          <a href="https://www.facebook.com/EquipementTechniqueDuNord/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
            <FaFacebook className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/company/equipement-technique-du-nord/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
        <div>
          <p className="text-white font-bold">03 20 92 27 51</p>
        </div>
      </div>
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-6 px-6">
          <Link href="/">
            <Image 
              src="/images/etn.webp" 
              alt="ETN Logo" 
              width={130} 
              height={50} 
              priority
            />
          </Link>

          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-blue-700 transition-colors">
              Accueil
            </Link>
            <Link
              href="/boutique"
              className="hover:text-blue-700 transition-colors"
            >
              Produits
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-700 transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-700 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <button
            className="md:hidden flex flex-col space-y-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span className="w-6 h-0.5 bg-gray-700"></span>
            <span className="w-6 h-0.5 bg-gray-700"></span>
            <span className="w-6 h-0.5 bg-gray-700"></span>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-sm py-4 px-6 space-y-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/boutique"
              className="block text-gray-700 hover:text-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Produits
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-blue-700"
              onClick={() => setIsOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
