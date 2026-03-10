"use client";

import './globals.css';
import { usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar'; // Adjusted the path to match the relative location of Sidebar

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // On vérifie si on est sur la page login
  const isLoginPage = pathname === '/login';

  return (
    <html lang="fr">
      <body className="flex h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden">
        {/* Si on n'est PAS sur le login, on affiche la Sidebar */}
        {!isLoginPage && <Sidebar />}
        
        {/* Le contenu de la page (prend tout l'espace si pas de sidebar) */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}