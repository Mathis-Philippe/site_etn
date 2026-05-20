// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MdPeople, MdInventory, MdSync, MdHistory, MdArrowForward } from 'react-icons/md';
import Link from 'next/link';

type DashboardData = {
  stats: {
    totalClients: number;
    totalArticles: number;
    derniereSynchro: string;
  };
  activiteRecente: Array<{
    id: string;
    texte: string;
    refEtn: string;
    date: string;
  }>;
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error('Erreur chargement données dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mb-4"></div>
        <p className="text-gray-500 text-sm">Chargement des données en temps réel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-[#00183A]">Tableau de bord</h1>
      
      {/* 📊 Section des KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box Clients */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-500 transition-all">
          <div className="flex flex-col">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Clients / Users</h3>
            <p className="text-4xl font-black text-[#00183A] mt-2">{data?.stats.totalClients ?? 0}</p>
            <p className="text-sm text-gray-400 mt-2">Inscrits sur la plateforme</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <MdPeople className="w-8 h-8" />
          </div>
        </div>
        
        {/* Box Catalogue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-500 transition-all">
          <div className="flex flex-col">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Produits Catalogue</h3>
            <p className="text-4xl font-black text-[#00183A] mt-2">{data?.stats.totalArticles ?? 0}</p>
            <p className="text-sm text-gray-400 mt-2">Références actives</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <MdInventory className="w-8 h-8" />
          </div>
        </div>
        
        {/* Box Synchro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-500 transition-all">
          <div className="flex flex-col">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Dernier ajout</h3>
            <p className="text-lg font-bold text-gray-700 mt-4 line-clamp-1">{data?.stats.derniereSynchro}</p>
            <p className="text-sm text-gray-400 mt-2">Dernière activité disque/catalogue</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
            <MdSync className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* 🕒 Activité Récente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MdHistory className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-800">Modifications et ajouts récents</h2>
          </div>
          <Link href="/admin/produits" className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors">
            Gérer le catalogue <MdArrowForward />
          </Link>
        </div>

        {data && data.activiteRecente.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {data.activiteRecente.map((item) => (
              <div key={item.id} className="py-3.5 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.texte}</span>
                  <span className="text-xs text-gray-400 font-mono mt-0.5">Réf ETN: {item.refEtn}</span>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm py-4">Aucune activité récente enregistrée sur le catalogue.</p>
        )}
      </div>
    </div>
  );
}