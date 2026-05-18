import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">ETN Admin</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="hover:text-blue-400 transition-colors">Tableau de bord</Link>
          <Link href="/admin/articles" className="hover:text-blue-400 transition-colors">Gestion Articles</Link>
          <Link href="/admin/clients" className="hover:text-blue-400 transition-colors">Gestion Clients</Link>
          <Link href="/" className="mt-8 text-sm text-gray-400 hover:text-white transition-colors">← Retour au site</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}