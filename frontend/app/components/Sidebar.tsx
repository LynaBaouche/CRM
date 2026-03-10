"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 👇 J'ai rajouté "Home" pour ta page d'accueil !
import { Home, LayoutDashboard, Users, Columns, Megaphone, Shield, Bell, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token'); 
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch (e) {
        console.error("Erreur de décodage", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!currentUserId) return;
      try {
        const res = await fetch(`http://localhost:3001/auth/notifications/${currentUserId}`);
        if (res.ok) {
          const data = await res.json();
          const unread = data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Erreur cloche notifs", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); 
    return () => clearInterval(interval);
  }, [currentUserId]);

  const navItems = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: Columns },
    { name: 'Campagnes', href: '/campaigns', icon: Megaphone },
    { name: 'Équipe', href: '/team', icon: Shield },
    { name: 'Paramètres', href: '/settings', icon: Settings},
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col justify-between fixed left-0 top-0 z-50">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black text-xl">V</div>
          <span className="text-xl font-black text-gray-900 tracking-tight">Veloria</span>
        </div>

        {/* Menu principal */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          {/* Lien Notifications */}
          <Link 
            href="/notifications" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/notifications' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'}`}
          >
            <div className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            Notifications
          </Link>
        </nav>
      </div>

      {/* Déconnexion */}
      <div className="p-6 border-t border-gray-100">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50 w-full transition-all"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}