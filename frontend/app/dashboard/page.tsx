"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, BarChart3, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState("standard");
  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role) setUserRole(payload.role);
        if (payload.firstName) setUserName(payload.firstName);
      } catch (e) {
        console.error("Erreur token");
      }
    }
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="text-purple-600" size={32} />
          Tableau de bord
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          {userRole === 'admin' 
            ? "Vue globale des performances de l'entreprise." 
            : "Aperçu de vos performances commerciales."}
        </p>
      </div>

      {/* KPI CARDS (Les stats clés) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARTE 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Chiffre d'affaires</p>
              <h3 className="text-4xl font-black text-gray-900">45 200 €</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={16} /> +12.5%
            </span>
            <span className="text-gray-400 font-medium">vs mois dernier</span>
          </div>
        </div>

        {/* CARTE 2 */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Nouveaux Prospects</p>
              <h3 className="text-4xl font-black text-gray-900">28</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={16} /> +4
            </span>
            <span className="text-gray-400 font-medium">cette semaine</span>
          </div>
        </div>

        {/* CARTE 3 */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Taux de conversion</p>
              <h3 className="text-4xl font-black text-gray-900">64%</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
              <Target size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg">
              -2.1%
            </span>
            <span className="text-gray-400 font-medium">vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* ZONE GRAPHIQUE OU LISTE (Espace rempli pour faire pro) */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Activité récente</h3>
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <TrendingUp className="text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-bold text-lg">Graphique d'évolution des ventes</p>
          <p className="text-gray-400 text-sm mt-1">Les données analytiques s'afficheront ici après les premières ventes conclues.</p>
        </div>
      </div>
    </div>
  );
}