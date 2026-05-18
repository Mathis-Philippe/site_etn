export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#00183A]">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Clients / Utilisateurs</h3>
          <p className="text-4xl font-black text-blue-600 mt-2">--</p>
          <p className="text-sm text-gray-400 mt-2">Inscrits sur la plateforme</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Produits Catalogue</h3>
          <p className="text-4xl font-black text-blue-600 mt-2">--</p>
          <p className="text-sm text-gray-400 mt-2">Références actives</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Mises à jour</h3>
          <p className="text-4xl font-black text-blue-600 mt-2">--</p>
          <p className="text-sm text-gray-400 mt-2">Synchronisations récentes</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8 min-h-[300px]">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Activité récente</h2>
        <p className="text-gray-500 text-sm">En attente de connexion avec la base de données...</p>
      </div>
    </div>
  );
}