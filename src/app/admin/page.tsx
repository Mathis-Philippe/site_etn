export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Articles</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">1 245</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Clients Inscrits</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">48</p>
        </div>
      </div>
    </div>
  );
}