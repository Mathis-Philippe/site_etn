import Link from "next/link";
import { ReactNode } from "react";
import { MdDashboard, MdPeople, MdInventory, MdHome } from "react-icons/md";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-[#00183A] text-white shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold uppercase tracking-wider text-center">
            ETN Admin
          </h2>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <MdDashboard className="w-5 h-5 text-blue-400" /> Tableau de bord
          </Link>
          <Link href="/admin/utilisateurs" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <MdPeople className="w-5 h-5 text-blue-400" /> Utilisateurs
          </Link>
          <Link href="/admin/produits" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors">
            <MdInventory className="w-5 h-5 text-blue-400" /> Produits
          </Link>
          
          <div className="my-4 border-t border-white/10"></div>
          
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <MdHome className="w-5 h-5" /> Retour au site
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}