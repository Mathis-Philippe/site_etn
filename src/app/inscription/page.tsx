"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InscriptionPage() {
  const [codeClient, setCodeClient] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeClient, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage("✅ Compte activé ! Redirection...");
        setTimeout(() => router.push("/connexion"), 2000);
      } else {
        setIsSuccess(false);
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("❌ Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#00183A] opacity-10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden z-10 border border-gray-100">
        <div className="pt-10 pb-6 px-8 flex flex-col items-center border-b border-gray-50">
          <Image src="/images/etn.webp" alt="ETN Logo" width={140} height={50} priority className="mb-6" />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Activation</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Créer votre compte client ETN</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Code Client ETN</label>
              <input
                type="text"
                required
                value={codeClient}
                onChange={(e) => setCodeClient(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00183A] focus:bg-white transition-all duration-200"
                placeholder="code client"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">E-mail professionnel</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00183A] focus:bg-white transition-all duration-200"
                placeholder="contact@entreprise.fr"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00183A] focus:bg-white transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 px-4 rounded-lg text-sm font-bold uppercase tracking-wide text-white bg-[#00183A] hover:bg-blue-900 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-md disabled:opacity-70"
            >
              {isLoading ? "Activation en cours..." : "Activer mon compte"}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm font-medium border ${isSuccess ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
              {message}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link href="/connexion" className="text-sm font-bold text-gray-500 hover:text-[#00183A] transition-colors">
              &larr; Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}