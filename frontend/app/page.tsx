"use client";

import { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, CheckSquare, Circle, CheckCircle2, Plus } from 'lucide-react';

export default function HomePage() {
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("standard");

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.firstName) setUserName(payload.firstName);
        if (payload.role) setUserRole(payload.role);
      } catch (e) {
        console.error("Erreur token");
      }
    }
  }, []);

  // Formatage de la date du jour (Ex: Mardi 10 Mars 2026)
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-[#F9FAFB] min-h-screen">
      
      {/* BARRE DE RECHERCHE */}
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une tâche, une réunion..." 
          className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
        />
      </div>

      {/* HEADER BIENVENUE */}
      <div>
        <p className="text-gray-500 font-bold text-sm capitalize mb-2">{today}</p>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Bonjour {userName},</h1>
        <p className="text-gray-600 mt-2 font-medium">
          Connecté(e) en tant que : <span className={`font-bold ${userRole === 'admin' ? 'text-emerald-500' : 'text-purple-600'}`}>{userRole}</span>
        </p>
      </div>

      {/* GRILLES : RÉUNIONS & TÂCHES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARTE : RÉUNIONS */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="text-gray-400" size={24} />
              Réunions
            </h2>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-white">
              <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors"><ChevronLeft size={18}/></button>
              <span className="text-sm font-bold text-gray-800 px-2">Aujourd'hui</span>
              <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors"><ChevronRight size={18}/></button>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {/* Item Réunion 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 shrink-0 mt-1 shadow-sm"></div>
              <div>
                <p className="font-bold text-gray-900">(14:00) Démonstration Produit - Prospect</p>
                <p className="text-emerald-600 font-bold text-sm mt-1">Alice Dubois</p>
              </div>
            </div>
            {/* Ligne séparatrice */}
            <hr className="border-gray-50" />
            {/* Item Réunion 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 shrink-0 mt-1 shadow-sm"></div>
              <div>
                <p className="font-bold text-gray-900">(16:30) Team Sync: Feedback Soutenance</p>
                <p className="text-emerald-600 font-bold text-sm mt-1">Emerald</p>
              </div>
            </div>
          </div>

          <button className="mt-8 w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2">
            <Plus size={20} /> Planifier une réunion
          </button>
        </div>

        {/* CARTE : VOS TÂCHES */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="text-[#F59E0B]"><CheckSquare size={24} /></div>
              <h2 className="text-xl font-bold text-gray-900">Vos Tâches</h2>
              <span className="bg-gray-100 text-gray-500 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full">3</span>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button className="bg-white shadow-sm text-gray-900 text-sm font-bold px-4 py-2 rounded-lg">À faire</button>
              <button className="text-gray-500 text-sm font-medium px-4 py-2 rounded-lg hover:text-gray-800">Terminées</button>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {/* Tâche 1 */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <Circle className="text-gray-200 group-hover:text-gray-400" size={24} />
                <span className="font-bold text-gray-700">Suivi de Lucas Hauchard</span>
              </div>
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg">Feb 17</span>
            </div>
            <hr className="border-gray-50" />
            
            {/* Tâche 2 */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <Circle className="text-gray-200 group-hover:text-gray-400" size={24} />
                <span className="font-bold text-gray-700">Suivi de Lucas Hauchard</span>
              </div>
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg">Rose</span>
            </div>
            <hr className="border-gray-50" />

            {/* Tâche 3 (Cochée) */}
            <div className="flex items-center justify-between p-2 bg-purple-50/50 rounded-xl border border-purple-100/50">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-[#8B5CF6] mt-0.5" size={24} />
                <div>
                  <span className="font-bold text-gray-900 block">Envoyer Newsletter Promo Noël</span>
                  <span className="text-gray-500 text-sm mt-1 block">Campaign task</span>
                </div>
              </div>
              <span className="bg-purple-100 text-[#8B5CF6] text-xs font-bold px-3 py-1.5 rounded-lg">Campaign task</span>
            </div>
            <hr className="border-gray-50" />

            {/* Tâche 4 */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <Circle className="text-gray-200 group-hover:text-gray-400" size={24} />
                <span className="font-bold text-gray-700">Relance Jean Dupuis</span>
              </div>
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg">Next Week</span>
            </div>
          </div>

          <button className="mt-6 w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2">
            <Plus size={20} /> Créer une tâche
          </button>
        </div>

      </div>
    </div>
  );
}