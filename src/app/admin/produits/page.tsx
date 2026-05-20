'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdUpload, MdClose, MdSave,
  MdPictureAsPdf, MdImage, MdFilterList, MdArrowUpward, MdUnfoldMore
} from 'react-icons/md';

type Article = {
  id: string;
  refDicsa: string;
  refEtn: string;
  designation: string;
  imageUrl?: string;
  pdfUrl?: string;
  familleOriginale?: string;
  famille?: { id: string; nom: string; sousCategorie?: { id: string; nom: string; categorie?: { id: string; nom: string } } };
};

type ModalMode = 'add' | 'edit' | null;

export default function AdminProduitsPage() {
  // ===== STATE =====
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Formulaire
  const [form, setForm] = useState({
    refDicsa: '',
    refEtn: '',
    designation: '',
    familleOriginale: '',
    familleId: '',
  });

  // Fichiers & États Drag and Drop
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // 🌟 NOUVEAU : États pour l'effet de survol du Glisser-Déposer
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  // Catégories
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedSousCatId, setSelectedSousCatId] = useState('');
  const [selectedFamilleId, setSelectedFamilleId] = useState('');

  // Recherche et filtres
  const [search, setSearch] = useState('');
  const [filterFamilleId, setFilterFamilleId] = useState('');
  const [sortBy, setSortBy] = useState('designation');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const TAKE = 50;
  const hasMore = skip + TAKE < total;

  // Scroll to top ref
  const pageTopRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Détecter le scroll pour afficher le bouton
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Récalculer les sous-catégories et familles
  const sousCats = useMemo(
    () => categories.find(c => c.id === selectedCatId)?.sousCategories || [],
    [selectedCatId, categories]
  );

  const familles = useMemo(
    () => sousCats.find(s => s.id === selectedSousCatId)?.familles || [],
    [selectedSousCatId, sousCats]
  );

  // ===== NOTIFICATIONS =====
  const notify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  // ===== FETCH DONNÉES =====
  const fetchArticles = useCallback(async (currentSkip = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        skip: currentSkip.toString(),
        take: TAKE.toString(),
        search: debouncedSearch,
        sortBy,
        sortOrder,
        ...(filterFamilleId && { familleId: filterFamilleId }),
      });

      const res = await fetch(`/api/admin/articles?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur réseau');

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (currentSkip === 0) {
        setArticles(data.data || []);
      } else {
        setArticles(prev => [...prev, ...data.data]);
      }

      setTotal(data.pagination?.total || 0);
      setSkip(currentSkip);
    } catch (error) {
      console.error('Fetch articles error:', error);
      notify('error', 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, sortOrder, filterFamilleId, TAKE]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/produits');
      const data = await res.json();
      if (data.success) setCategories(data.data || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reload articles when search/filters change
  useEffect(() => {
    fetchArticles(0);
  }, [debouncedSearch, sortBy, sortOrder, filterFamilleId, fetchArticles]);

  // ===== MODAL & FORM ACTIONS =====
  const openAdd = () => {
    setSelectedArticle(null);
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
      familleId: article.famille?.id || '',
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
      notify('error', 'Désignation et référence ETN obligatoires.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('refDicsa', form.refDicsa);
      formData.append('refEtn', form.refEtn);
      formData.append('designation', form.designation);
      formData.append('familleOriginale', form.familleOriginale);
      formData.append('familleId', form.familleId);
      if (imageFile) formData.append('image', imageFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      const url = modalMode === 'edit' && selectedArticle 
        ? `/api/admin/articles/${selectedArticle.id}`
        : '/api/admin/articles';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      notify('success', modalMode === 'edit' ? 'Article modifié.' : 'Article créé.');
      closeModal();
      fetchArticles(0);
    } catch (error) {
      console.error('Save error:', error);
      notify('error', 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      notify('success', 'Article supprimé.');
      setDeleteConfirm(null);
      fetchArticles(0);
    } catch (error) {
      console.error('Delete error:', error);
      notify('error', 'Erreur lors de la suppression.');
    }
  };

  const scrollToTop = () => {
    pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchArticles(skip + TAKE);
    }
  };

  return (
    <div ref={pageTopRef} className="min-h-screen bg-gray-50">
      {/* Header avec titre et boutons d'actions */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#00183A]">Gestion des produits</h1>
            <p className="text-sm text-gray-500 mt-1">{total} produit{total !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00183A] hover:bg-blue-900 text-white font-bold rounded-xl transition-colors"
          >
            <MdAdd className="w-5 h-5" />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Notifs */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl text-white font-medium z-50 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.msg}
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Chercher par désignation, Référence..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <MdFilterList className="w-5 h-5 text-gray-500" />
              <select
                value={filterFamilleId}
                onChange={e => {
                  setFilterFamilleId(e.target.value);
                  setSkip(0);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Toutes les catégories</option>
                {categories.flatMap(cat =>
                  cat.sousCategories?.flatMap((subcat: any) =>
                    subcat.familles?.map((fam: any) => (
                      <option key={fam.id} value={fam.id}>
                        {cat.nom} → {subcat.nom} → {fam.nom}
                      </option>
                    ))
                  )
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <MdUnfoldMore className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="designation">Trier par désignation</option>
                <option value="refEtn">Trier par ETN</option>
                <option value="familleOriginale">Trier par famille</option>
                <option value="createdAt">Trier par date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`px-3 py-2 border rounded-lg transition-colors ${
                  sortOrder === 'asc'
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="px-4 py-2 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <MdArrowUpward className="w-4 h-4" />
                Haut de la page
              </button>
            )}
          </div>
        </div>

        {/* Tableau */}
        {articles.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">Désignation</th>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">Réf. ETN</th>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">Catégorie</th>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">Fichiers</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr
                      key={article.id}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {article.imageUrl && (
                            <img
                              src={article.imageUrl}
                              alt={article.designation}
                              className="w-10 h-10 object-contain rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2">{article.designation}</p>
                            <p className="text-xs text-gray-500">{article.familleOriginale}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-xs">{article.refEtn}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="text-xs space-y-0.5">
                          {article.famille?.sousCategorie?.categorie && (
                            <p className="text-gray-700 font-medium">
                              {article.famille.sousCategorie.categorie.nom}
                            </p>
                          )}
                          {article.famille?.sousCategorie && (
                            <p className="text-gray-600">{article.famille.sousCategorie.nom}</p>
                          )}
                          {article.famille && <p className="text-gray-500">{article.famille.nom}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {article.imageUrl && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              <MdImage className="w-3 h-3" />
                              Img
                            </span>
                          )}
                          {article.pdfUrl && (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                              <MdPictureAsPdf className="w-3 h-3" />
                              PDF
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(article)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <MdEdit className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(article.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <MdDelete className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="border-t border-gray-100 p-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Charger plus'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit trouvé.</p>
          </div>
        )}
      </div>

      {/* Modal Ajout/Modification */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-[#00183A]">
                {modalMode === 'add' ? 'Ajouter un produit' : 'Modifier le produit'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MdClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-5">
              {/* Références */}
              <div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Référence ETN *
                  </label>
                  <input
                    type="text"
                    value={form.refEtn}
                    onChange={e => setForm(f => ({ ...f, refEtn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="ex: ETN-1234"
                  />
                </div>
              </div>

              {/* Désignation */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Désignation *
                </label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Description du produit"
                />
              </div>

              {/* Famille/Gamme */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Famille/Gamme
                </label>
                <input
                  type="text"
                  value={form.familleOriginale}
                  onChange={e => setForm(f => ({ ...f, familleOriginale: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="ex: Moteurs_hydrauliques (doit être identique au nom du pdf)"
                />
              </div>

              {/* Hiérarchie catalogue */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-3 border border-blue-100">
                <p className="text-xs font-bold text-blue-700 uppercase">📁 Rattacher au catalogue</p>
                <div>
                  <label className="block text-xs text-gray-700 font-medium mb-2">Catégorie</label>
                  <select
                    value={selectedCatId}
                    onChange={e => {
                      setSelectedCatId(e.target.value);
                      setSelectedSousCatId('');
                      setSelectedFamilleId('');
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Sélectionner --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {sousCats.length > 0 && (
                  <div>
                    <label className="block text-xs text-gray-700 font-medium mb-2">Sous-catégorie</label>
                    <select
                      value={selectedSousCatId}
                      onChange={e => {
                        setSelectedSousCatId(e.target.value);
                        setSelectedFamilleId('');
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Sélectionner --</option>
                      {sousCats.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {familles.length > 0 && (
                  <div>
                    <label className="block text-xs text-gray-700 font-medium mb-2">Sous Sous-catégorie</label>
                    <select
                      value={selectedFamilleId}
                      onChange={e => {
                        setSelectedFamilleId(e.target.value);
                        setForm(f => ({ ...f, familleId: e.target.value }));
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Sélectionner --</option>
                      {familles.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 🌟 ZONE DRAG & DROP : Image Produit */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Image produit (png/jpg/webp)
                </label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    } else if (file) {
                      notify('error', 'Veuillez déposer un fichier image valide.');
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col justify-center items-center min-h-[120px] ${
                    isDraggingImage
                      ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/20'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="preview" className="h-24 object-contain mx-auto" />
                      <p className="text-xs text-gray-400 mt-2 text-center">Déposez une autre image pour la remplacer</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <MdImage className={`w-8 h-8 transition-transform ${isDraggingImage ? 'scale-110 text-blue-500' : ''}`} />
                      <span className="text-sm font-medium">
                        {isDraggingImage ? 'Déposez l\'image ici !' : 'Glissez-déposez une image ou cliquez pour parcourir'}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imageFile && <p className="text-xs text-green-600 mt-1">✓ Prêt pour l'envoi : {imageFile.name}</p>}
              </div>

              {/* 🌟 ZONE DRAG & DROP : Documentation PDF */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Documentation PDF
                </label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(true);
                  }}
                  onDragLeave={() => setIsDraggingPdf(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
                      setPdfFile(file);
                    } else if (file) {
                      notify('error', 'Veuillez déposer un fichier PDF uniquement.');
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col justify-center items-center ${
                    isDraggingPdf
                      ? 'border-yellow-500 bg-yellow-50/80 scale-[1.01]'
                      : 'border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50/30 bg-yellow-50/10'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-yellow-700">
                    <MdPictureAsPdf className={`w-8 h-8 transition-transform ${isDraggingPdf ? 'scale-110 text-yellow-600' : ''}`} />
                    <span className="text-sm font-medium">
                      {isDraggingPdf 
                        ? 'Lâchez le PDF ici !' 
                        : pdfFile 
                          ? `Fichier sélectionné : ${pdfFile.name}` 
                          : 'Glissez-déposez un PDF ou cliquez pour parcourir'
                      }
                    </span>
                  </div>
                </div>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                />
                {pdfFile && <p className="text-xs text-green-600 mt-1">✓ Prêt pour l'envoi : {pdfFile.name}</p>}
                {!pdfFile && modalMode === 'edit' && selectedArticle?.pdfUrl && (
                  <p className="text-xs text-blue-600 mt-1">📄 PDF actuel conservé</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00183A] hover:bg-blue-900 text-white font-bold rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <MdSave className="w-4 h-4" />
                )}
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Supprimer ce produit ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Cette action est irréversible. Le produit sera supprimé de la base de données.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}