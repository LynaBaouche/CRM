"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckSquare, Plus, ChevronLeft, ChevronRight, Check, Search, Bell, Settings, User, LogOut } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('...');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // VÉRIFICATION DE SÉCURITÉ ET RÉCUPÉRATION DU PROFIL
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirection si non connecté
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.firstName || 'Utilisateur');
        setUserRole(payload.role || '');
        setUserEmail(payload.email || '');
      } catch (e) {
        console.error("Erreur de lecture du token");
      }
    }
  }, [router]);

  // FONCTION DE DÉCONNEXION
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      {/* --- BARRE DU HAUT --- */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une tâche, une réunion..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-4 text-gray-400">
          <button className="p-2 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors"><Bell size={20} /></button>
          <button className="p-2 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors"><Settings size={20} /></button>
          
          {/* MENU PROFIL ET DÉCONNEXION */}
          <div className="relative ml-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-full transition-all"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform">
                {userName !== '...' ? userName.charAt(0).toUpperCase() : <User size={18}/>}
              </div>
            </button>

            {/* Fenêtre déroulante */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{userEmail}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- CONTENU DE LA PAGE --- */}
      <div className="p-10 max-w-5xl space-y-12">
        
        {/* --- EN-TÊTE DYNAMIQUE --- */}
        <div>
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">{today}</p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Bonjour {userName},</h1>
          <p className="text-gray-500 font-medium mt-1">
            Connecté(e) en tant que : <span className="text-emerald-600 font-bold">{userRole}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">Voici un aperçu de votre journée.</p>
        </div>

        {/* --- SECTION RÉUNIONS --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900">
              <div className="bg-blue-50 text-blue-500 p-2.5 rounded-xl">
                <Calendar size={20} />
              </div>
              Réunions
            </h2>
            <div className="flex items-center gap-3 text-gray-500">
              <button className="hover:bg-emerald-50 hover:text-emerald-600 p-2 rounded-xl transition-colors"><Plus size={20} /></button>
              <div className="flex items-center gap-1 bg-white border border-gray-100 px-2 py-1.5 rounded-xl shadow-sm">
                <button className="hover:bg-gray-100 p-1 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                <span className="text-sm font-bold text-gray-700 px-2">Aujourd'hui</span>
                <button className="hover:bg-gray-100 p-1 rounded-lg transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 text-center group">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="text-gray-400" size={28} />
            </div>
            <p className="text-gray-500 font-medium mb-6">Vous n'avez pas de réunion prévue aujourd'hui.</p>
            <button className="bg-white border-2 border-dashed border-gray-200 text-gray-600 font-bold py-3 px-6 rounded-2xl hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95">
              + Planifier une réunion
            </button>
          </div>
        </section>

        {/* --- SECTION TÂCHES --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900">
              <div className="bg-amber-50 text-amber-500 p-2.5 rounded-xl">
                <CheckSquare size={20} />
              </div>
              Tâches
              <span className="bg-gray-100 text-gray-600 text-sm py-0.5 px-2.5 rounded-full ml-1">1</span>
            </h2>
            <div className="flex items-center gap-3">
              <button className="hover:bg-emerald-50 hover:text-emerald-600 p-2 rounded-xl text-gray-500 transition-colors"><Plus size={20} /></button>
              <div className="flex bg-gray-100/80 p-1.5 rounded-2xl">
                <button className="px-5 py-2 text-sm font-bold bg-white rounded-xl shadow-sm text-gray-900 transition-all">À faire</button>
                <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all">Terminées</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-lg hover:shadow-gray-200/50 hover:border-emerald-100 cursor-pointer transition-all duration-300 group">
            <div className="flex items-center gap-5">
              {/* Bouton pour cocher la tâche avec effet smooth */}
              <button className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-transparent group-hover:border-emerald-500 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-300">
                <Check size={14} strokeWidth={3} />
              </button>
              <span className="text-gray-800 font-bold group-hover:text-emerald-700 transition-colors">Suivi de Lucas Hauchard</span>
            </div>
            <div className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg">
              févr. 17
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}