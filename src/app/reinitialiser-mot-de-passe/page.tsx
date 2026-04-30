"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("❌ Lien invalide.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage("✅ " + data.message + " Redirection...");
        setTimeout(() => router.push("/connexion"), 2500);
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

  if (!token) {
    return (
      <div className="text-center p-4">
        <h2 className="text-lg font-bold text-red-600 mb-2">Lien expiré ou invalide</h2>
        <Link href="/mot-de-passe-oublie" className="text-sm font-bold text-[#00183A] hover:underline">
          Refaire une demande de réinitialisation
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirmer le mot de passe</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00183A] focus:bg-white transition-all duration-200"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isSuccess}
        className="w-full py-3.5 px-4 rounded-lg text-sm font-bold uppercase tracking-wide text-white bg-[#00183A] hover:bg-blue-900 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-md disabled:opacity-70"
      >
        {isLoading ? "Enregistrement..." : "Sauvegarder"}
      </button>

      {message && (
        <div className={`mt-6 p-4 rounded-lg text-sm font-medium border ${isSuccess ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
          {message}
        </div>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#00183A] opacity-10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden z-10 border border-gray-100">
        <div className="pt-10 pb-6 px-8 flex flex-col items-center border-b border-gray-50">
          <Image src="/images/etn.webp" alt="ETN Logo" width={140} height={50} priority className="mb-6" />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sécurité</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Création de votre nouveau mot de passe</p>
        </div>
        <div className="p-8">
          <Suspense fallback={<div className="text-center text-gray-500 font-medium">Chargement sécurisé...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}