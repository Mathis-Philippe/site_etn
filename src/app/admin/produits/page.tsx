'use client';

import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdUpload, MdClose, MdSave, MdPictureAsPdf, MdImage, MdFilterList } from 'react-icons/md';

type Article = {
  id: string;
  refDicsa: string;
  refEtn: string;
  designation: string;
  imageUrl?: string;
  familleOriginale?: string;
  famille?: { nom: string };
  sousCategorie?: { nom: string; categorie?: { nom: string } };
};

type ModalMode = 'add' | 'edit' | null;

export default function AdminProduitsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedSousCatId, setSelectedSousCatId] = useState('');
  const [selectedFamilleId, setSelectedFamilleId] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [form, setForm] = useState({
    refDicsa: '',
    refEtn: '',
    designation: '',
    familleOriginale: '',
    familleId: '',
  });

  const notify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch {
      notify('error', 'Erreur lors du chargement des articles.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/produits');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch {}
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const openAdd = () => {
    setForm({ refDicsa: '', refEtn: '', designation: '', familleOriginale: '', familleId: '' });
    setImageFile(null);
    setPdfFile(null);
    setImagePreview('');
    setSelectedCatId('');
    setSelectedSousCatId('');
    setSelectedFamilleId('');
    setModalMode('add');
  };

  const openEdit = (article: Article) => {
    setSelectedArticle(article);
    setForm({
      refDicsa: article.refDicsa || '',
      refEtn: article.refEtn || '',
      designation: article.designation || '',
      familleOriginale: article.familleOriginale || '',
      familleId: article.famille?.nom || '',
    });
    setImagePreview(article.imageUrl || '');
    setImageFile(null);
    setPdfFile(null);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedArticle(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };

  const handleSave = async () => {
    if (!form.designation || !form.refEtn) {
      notify('error', 'La désignation et la référence ETN sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('refDicsa', form.refDicsa);
      formData.append('refEtn', form.refEtn);
      formData.append('designation', form.designation);
      formData.append('familleOriginale', form.familleOriginale);
      formData.append('familleId', selectedFamilleId || form.familleId);
      if (imageFile) formData.append('image', imageFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      const url = modalMode === 'edit' && selectedArticle
        ? `/api/admin/articles/${selectedArticle.id}`
        : '/api/admin/articles';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (data.success) {
        notify('success', modalMode === 'edit' ? 'Article modifié avec succès.' : 'Article ajouté avec succès.');
        closeModal();
        fetchArticles();
      } else {
        notify('error', data.message || 'Erreur lors de la sauvegarde.');
      }
    } catch {
      notify('error', 'Erreur réseau.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Article supprimé.');
        fetchArticles();
      } else {
        notify('error', 'Erreur lors de la suppression.');
      }
    } catch {
      notify('error', 'Erreur réseau.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const filtered = articles.filter(a =>
    a.designation?.toLowerCase().includes(search.toLowerCase()) ||
    a.refEtn?.toLowerCase().includes(search.toLowerCase()) ||
    a.refDicsa?.toLowerCase().includes(search.toLowerCase())
  );

  // Hiérarchie catégorie -> sous-catégorie -> famille
  const sousCats = categories.find(c => c.id === selectedCatId)?.sousCategories || [];
  const familles = sousCats.find((s: any) => s.id === selectedSousCatId)?.familles || [];

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm flex items-center gap-3 transition-all ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.msg}
          <button onClick={() => setNotification(null)}><MdClose /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00183A]">Gestion des Produits</h1>
          <p className="text-gray-400 text-sm mt-1">{articles.length} article(s) au total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#00183A] hover:bg-blue-900 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-md"
        >
          <MdAdd className="w-5 h-5" /> Ajouter un article
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher par désignation, ref ETN, ref DICSA..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#00183A] text-white text-xs uppercase tracking-wider">
                <th className="py-4 px-4">Image</th>
                <th className="py-4 px-4">Réf ETN</th>
                <th className="py-4 px-4">Réf DICSA</th>
                <th className="py-4 px-4">Désignation</th>
                <th className="py-4 px-4">Famille</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">Aucun article trouvé.</td></tr>
              ) : filtered.map(article => (
                <tr key={article.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-3 px-4">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt="" className="w-12 h-12 object-contain rounded-md bg-slate-50 mix-blend-multiply" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-slate-300">
                        <MdImage className="w-6 h-6" />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm font-bold text-blue-700">{article.refEtn || '-'}</td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-500">{article.refDicsa || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 max-w-xs truncate">{article.designation}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{article.familleOriginale || article.famille?.nom || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(article)}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-700 transition-colors"
                        title="Modifier"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(article.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout / Modification */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-[#00183A]">
                {modalMode === 'add' ? 'Ajouter un article' : 'Modifier l\'article'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MdClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Références */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Référence ETN *</label>
                  <input
                    type="text"
                    value={form.refEtn}
                    onChange={e => setForm(f => ({ ...f, refEtn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="ex: ETN-1234"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Référence DICSA</label>
                  <input
                    type="text"
                    value={form.refDicsa}
                    onChange={e => setForm(f => ({ ...f, refDicsa: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="ex: MPR12CJ"
                  />
                </div>
              </div>

              {/* Désignation */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Désignation *</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Description complète du produit"
                />
              </div>

              {/* Famille originale */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Famille / Gamme</label>
                <input
                  type="text"
                  value={form.familleOriginale}
                  onChange={e => setForm(f => ({ ...f, familleOriginale: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="ex: Moteurs hydrauliques à pistons"
                />
              </div>

              {/* Hiérarchie catalogue */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-3 border border-blue-100">
                <p className="text-xs font-bold text-blue-700 uppercase">Rattacher au catalogue</p>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
                  <select
                    value={selectedCatId}
                    onChange={e => { setSelectedCatId(e.target.value); setSelectedSousCatId(''); setSelectedFamilleId(''); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Sélectionner --</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                {sousCats.length > 0 && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Sous-catégorie</label>
                    <select
                      value={selectedSousCatId}
                      onChange={e => { setSelectedSousCatId(e.target.value); setSelectedFamilleId(''); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Sélectionner --</option>
                      {sousCats.map((s: any) => <option key={s.id} value={s.id}>{s.nom}</option>)}
                    </select>
                  </div>
                )}
                {familles.length > 0 && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Famille Prisma</label>
                    <select
                      value={selectedFamilleId}
                      onChange={e => setSelectedFamilleId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Sélectionner --</option>
                      {familles.map((f: any) => <option key={f.id} value={f.id}>{f.nom}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Image produit (.png)</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="h-24 object-contain mx-auto" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <MdImage className="w-8 h-8" />
                      <span className="text-sm">Cliquer pour choisir une image</span>
                    </div>
                  )}
                </div>
                <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageChange} />
                {imageFile && <p className="text-xs text-green-600 mt-1">✓ {imageFile.name}</p>}
              </div>

              {/* Upload PDF */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Documentation PDF</label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-all"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <MdPictureAsPdf className="w-8 h-8" />
                    <span className="text-sm">{pdfFile ? pdfFile.name : 'Cliquer pour choisir un PDF'}</span>
                  </div>
                </div>
                <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                {pdfFile && <p className="text-xs text-green-600 mt-1">✓ {pdfFile.name}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button onClick={closeModal} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00183A] hover:bg-blue-900 text-white font-bold rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <MdSave className="w-4 h-4" />}
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Supprimer cet article ?</h3>
            <p className="text-gray-500 text-sm mb-6">Cette action est irréversible. L'article sera supprimé de la base de données.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}