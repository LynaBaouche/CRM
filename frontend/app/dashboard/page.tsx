"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, BarChart3, ArrowUpRight, Briefcase, Calendar } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export default function DashboardPage() {
  const [userRole, setUserRole] = useState("standard");
  const [userName, setUserName] = useState("Utilisateur");
  const [loading, setLoading] = useState(true);

  // NOUVEAU : État pour stocker les vraies statistiques
  const [stats, setStats] = useState({
    revenue: 0,
    totalLeads: 0,
    conversionRate: 0,
    recentActivity: [] as any[]
  });

  useEffect(() => {
    // 1. Récupérer les infos de l'utilisateur
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

    // 2. Récupérer les vraies données depuis le backend
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${API_URL}/leads`);
        if (res.ok) {
          const leads = await res.json();

          // Calcul du Chiffre d'Affaires (Somme des montants des leads "Gagné")
          const wonLeads = leads.filter((lead: any) => lead.status === 'Gagné');
          const totalRevenue = wonLeads.reduce((sum: number, lead: any) => sum + (lead.amount || 0), 0);

          // Calcul du taux de conversion
          const conversion = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;

          // Récupérer les 4 dernières opportunités pour l'activité récente
          const sortedLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

          setStats({
            revenue: totalRevenue,
            totalLeads: leads.length,
            conversionRate: conversion,
            recentActivity: sortedLeads
          });
        }
      } catch (error) {
        console.error("Erreur de chargement des stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
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
        <div className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Calendar size={16} className="text-purple-500" />
          Données en temps réel
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* KPI CARDS (Les stats clés) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARTE 1 : CHIFFRE D'AFFAIRES */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Chiffre d'affaires conclu</p>
                  <h3 className="text-4xl font-black text-gray-900">{stats.revenue.toLocaleString()} €</h3>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={16} /> En hausse
                </span>
                <span className="text-gray-400 font-medium">basé sur vos ventes</span>
              </div>
            </div>

            {/* CARTE 2 : TOTAL OPPORTUNITÉS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Opportunités</p>
                  <h3 className="text-4xl font-black text-gray-900">{stats.totalLeads}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="flex items-center text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded-lg">
                  Actives et passées
                </span>
                <span className="text-gray-400 font-medium">dans le pipeline</span>
              </div>
            </div>

            {/* CARTE 3 : TAUX DE CONVERSION */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Taux de conversion</p>
                  <h3 className="text-4xl font-black text-gray-900">{stats.conversionRate}%</h3>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="flex items-center text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-lg">
                  Efficacité
                </span>
                <span className="text-gray-400 font-medium">de vos négociations</span>
              </div>
            </div>
          </div>

          {/* ACTIVITÉ RÉCENTE (Liste dynamique au lieu d'un faux graphique) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600"/>
              Dernières opportunités ajoutées
            </h3>
            
            {stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                <Briefcase className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-bold text-lg">Aucune activité récente</p>
                <p className="text-gray-400 text-sm mt-1">Créez des opportunités dans le pipeline pour les voir apparaître ici.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-purple-600 font-bold">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{lead.title}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">Contact associé : {lead.contact?.firstName || 'Non assigné'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">{lead.amount ? lead.amount.toLocaleString() : 0} €</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-bold ${
                        lead.status === 'Gagné' ? 'bg-emerald-100 text-emerald-600' : 
                        lead.status === 'Perdu' ? 'bg-rose-100 text-rose-600' : 
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}