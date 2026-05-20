// src/app/admin/utilisateurs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MdSearch, MdPersonAdd, MdEdit, MdDelete, MdClose, MdSave, MdReceipt, MdShoppingBag, MdSort } from 'react-icons/md';

type Commande = {
  id: string;
  numero: string;
  status: string;
  totalArticles: number;
  createdAt: string;
  articles: Array<{ id: string; refEtn: string; designation: string; quantite: number }>;
};

type User = {
  id: string;
  email: string;
  nomEntreprise: string;
  codeClient: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string; // Optionnel au cas où l'API l'omet
  commandes: Commande[];
};

type SortOption = 'activity-desc' | 'orders-desc' | 'alpha-asc' | 'alpha-desc';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('activity-desc'); // Activité récente par défaut
  
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewOrdersUser, setViewOrdersUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Champs formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [codeClient, setCodeClient] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
      const result = await res.json();
      if (result.success) setUsers(result.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // 🌟 Fonction de formatage sécurisée pour éviter le "Invalid Date"
  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return 'Récemment';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Récemment'; // Fallback propre si la date est invalide
    }
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 🌟 Fonction de tri dynamique corrigée pour blinder les dates
  const getSortedUsers = () => {
    const clonedUsers = [...users];
    
    switch (sortBy) {
      case 'activity-desc': // Activité récente
        return clonedUsers.sort((a, b) => {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return timeB - timeA; // Plus récent en premier
        });
      case 'orders-desc': // Volume de commandes
        return clonedUsers.sort((a, b) => (b.commandes?.length ?? 0) - (a.commandes?.length ?? 0));
      case 'alpha-asc': // A -> Z
        return clonedUsers.sort((a, b) => a.nomEntreprise.localeCompare(b.nomEntreprise));
      case 'alpha-desc': // Z -> A
        return clonedUsers.sort((a, b) => b.nomEntreprise.localeCompare(a.nomEntreprise));
      default:
        return clonedUsers;
    }
  };

  const sortedUsers = getSortedUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalMode === 'add' ? '/api/admin/users' : `/api/admin/users/${selectedUser?.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nomEntreprise, codeClient, role }),
      });
      const result = await res.json();

      if (result.success) {
        setNotification({ type: 'success', msg: modalMode === 'add' ? 'Utilisateur créé !' : 'Utilisateur modifié !' });
        setModalMode(null);
        fetchUsers();
      } else {
        setNotification({ type: 'error', msg: result.message || 'Une erreur est survenue.' });
      }
    } catch {
      setNotification({ type: 'error', msg: 'Erreur de connexion serveur.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setNotification({ type: 'success', msg: 'Compte supprimé définitivement.' });
        setDeleteConfirm(null);
        fetchUsers();
      }
    } catch {
      setNotification({ type: 'error', msg: 'Erreur lors de la suppression.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00183A]">Gestion des Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Consultez l'historique des demandes d'achats, l'activité et gérez les comptes.</p>
        </div>
        <button
          onClick={() => { setSelectedUser(null); setEmail(''); setPassword(''); setNomEntreprise(''); setCodeClient(''); setRole('USER'); setModalMode('add'); }}
          className="flex items-center gap-2 bg-[#00183A] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
        >
          <MdPersonAdd className="w-5 h-5" /> Ajouter un compte client
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex justify-between items-center ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <span>{notification.msg}</span>
          <button onClick={() => setNotification(null)} className="text-xs font-bold hover:underline">Fermer</button>
        </div>
      )}

      {/* Barre de Recherche et de Tri */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center px-4 gap-3">
          <MdSearch className="w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par entreprise, code client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center px-4 gap-3 min-w-[280px]">
          <MdSort className="w-5 h-5 text-gray-500" />
          <span className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full bg-transparent outline-none text-sm font-semibold text-[#00183A] cursor-pointer"
          >
            <option value="activity-desc">Activité : Connectés récemment</option>
            <option value="orders-desc">Commandes : Plus actifs</option>
            <option value="alpha-asc">Nom : Alphabétique (A-Z)</option>
            <option value="alpha-desc">Nom : Alphabétique (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Chargement de la liste...</div>
        ) : sortedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Code Client</th>
                  <th className="py-4 px-6">Entreprise / Activité</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6 text-center">Commandes</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-gray-900">{user.codeClient}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#00183A] block">{user.nomEntreprise}</span>
                      <span className="block text-[11px] text-gray-400 font-normal mt-0.5">
                        Dernière activité : {formatLastActivity(user.updatedAt)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{user.email}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setViewOrdersUser(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-bold rounded-full text-xs transition-colors"
                      >
                        <MdShoppingBag className="w-3.5 h-3.5" />
                        {user.commandes?.length ?? 0} cmd(s)
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setSelectedUser(user); setEmail(user.email); setNomEntreprise(user.nomEntreprise); setCodeClient(user.codeClient); setRole(user.role); setPassword(''); setModalMode('edit'); }}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(user.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg transition-colors">
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm">Aucun compte trouvé.</div>
        )}
      </div>

      {/* PANNEAU LATÉRAL : HISTORIQUE DES COMMANDES (z-[9999]) */}
      {viewOrdersUser && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex justify-end backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#00183A]">Historique d'achat</h2>
                  <p className="text-xs text-gray-500 mt-1">{viewOrdersUser.nomEntreprise} ({viewOrdersUser.codeClient})</p>
                </div>
                <button onClick={() => setViewOrdersUser(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <MdClose className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {viewOrdersUser.commandes && viewOrdersUser.commandes.length > 0 ? (
                <div className="space-y-4">
                  {viewOrdersUser.commandes.map((cmd) => (
                    <div key={cmd.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{cmd.numero}</p>
                          <p className="text-xs text-gray-400">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cmd.status === 'Livrée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {cmd.status}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 divide-y divide-gray-200 bg-white rounded-lg p-2 border border-gray-100">
                        {cmd.articles?.map((art) => (
                          <div key={art.id} className="py-1.5 flex justify-between">
                            <span className="font-medium pr-4">{art.designation} <span className="text-gray-400 font-mono">({art.refEtn})</span></span>
                            <span className="font-bold text-gray-900 whitespace-nowrap">x{art.quantite}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center gap-2">
                  <MdReceipt className="w-12 h-12 text-gray-300" />
                  Aucune commande enregistrée pour ce client.
                </div>
              )}
            </div>
            <button onClick={() => setViewOrdersUser(null)} className="w-full mt-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">
              Fermer le panneau
            </button>
          </div>
        </div>
      )}

      {/* MODAL : AJOUTER / MODIFIER (z-[9999]) */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#00183A] p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{modalMode === 'add' ? 'Créer un nouveau compte' : 'Modifier le compte'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><MdClose className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code Client *</label>
                  <input type="text" required placeholder="Ex: ETN452" value={codeClient} onChange={(e) => setCodeClient(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase text-sm outline-none focus:border-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rôle Système</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer focus:border-blue-500 bg-white">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom de l'Entreprise *</label><input type="text" required placeholder="Nom commercial" value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse E-mail *</label><input type="email" required placeholder="contact@entreprise.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{modalMode === 'add' ? 'Mot de passe *' : 'Changer le mot de passe (Laisser vide pour inchangé)'}</label><input type="password" required={modalMode === 'add'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white" /></div>
              
              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#00183A] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors"><MdSave className="w-5 h-5" /> Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUPPRESSION (z-[9999]) */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><MdDelete className="w-7 h-7 text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Supprimer ce client ?</h3>
            <p className="text-gray-500 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}