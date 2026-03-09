"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Target, TrendingUp, Briefcase, Search, Bell, Settings, BarChart2, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // VÉRIFICATION ET RÉCUPÉRATION DE L'UTILISATEUR
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      try {
        // On décode le token JWT pour récupérer l'email (c'est magique !)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email);
      } catch (e) {
        console.error("Erreur de lecture du token");
      }
    }
  }, [router]);

  // FONCTION DE DÉCONNEXION
  const handleLogout = () => {
    localStorage.removeItem('token'); // On jette le badge
    router.push('/login'); // Retour à la porte d'entrée
  };

  const stats = [
    { label: "Chiffre d'affaires", value: "148 500 €", change: "+12.5%", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Nouveaux leads", value: "24", change: "+8", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Taux de conversion", value: "34%", change: "+2.1%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Deals actifs", value: "12", change: "-1", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      {/* HEADER MODIFIÉ AVEC PROFIL ET DÉCONNEXION */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Rechercher un client..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        </div>
        
        <div className="flex items-center gap-6 text-gray-400">
          <button className="hover:text-emerald-600 transition-colors"><Bell size={20} /></button>
          
          {/* Menu Profil */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-xl transition-all"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {userEmail ? userEmail.charAt(0).toUpperCase() : <User size={18}/>}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Connecté(e)</p>
                <p className="text-xs font-medium text-gray-500">{userEmail}</p>
              </div>
            </button>

            {/* Fenêtre déroulante de déconnexion */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* LE FIX EST ICI : 
        1. On a retiré "max-w-7xl" pour que ça prenne toute la largeur (w-full).
        2. On a mis "px-8" pour s'aligner AU PIXEL PRÈS avec la barre de recherche au-dessus.
      */}
      <div className="w-full px-8 py-8 space-y-8">
        
        {/* Titre */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-500 font-medium">Bienvenue, voici le résumé de votre activité.</p>
        </div>

        {/* Grille des statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={26} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section Graphiques (Placeholder design) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenus mensuels</h3>
            <div className="w-full h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
              <BarChart2 className="text-gray-300 mr-2" />
              <span className="text-gray-400 font-medium italic">Graphique en cours de chargement...</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sources de leads</h3>
            <div className="aspect-square bg-gray-50 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-gray-400 font-medium italic">Pie Chart</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}