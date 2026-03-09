"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, PieChart, Columns3, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname(); // Permet de savoir sur quelle page on est

  // Petite fonction pour gérer la couleur du lien actif
  const isActive = (path: string) => pathname === path ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm z-10 h-full">
      <div>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg mr-3 shadow-md shadow-emerald-500/20"></div>
          <span className="font-black text-xl tracking-tight">CRM.io</span>
        </div>

        {/* Menu Principal */}
        <nav className="p-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/')}`}>
            <Home size={20} />
            Accueil
          </Link>

          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard')}`}>
            <PieChart size={20} />
            Dashboard
          </Link>

          <Link href="/contacts" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/contacts')}`}>
            <Users size={20} />
            Contacts
          </Link>

          <Link href="/pipeline" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/pipeline')}`}>
            <Columns3 size={20} />
            Pipeline Ventes
          </Link>
        </nav>
      </div>

      {/* Menu du bas */}
      <div className="p-4 border-t border-gray-100">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <Settings size={20} />
          Paramètres
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}