import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Veloria CRM',
  description: 'CRM pour la gestion commerciale',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#F9FAFB]`}>
        <div className="flex min-h-screen">
          {/* Ta barre latérale */}
          <Sidebar />
          
          {/* 👉 C'est ICI qu'on corrige ! On ajoute 'md:ml-64' pour décaler le contenu de la largeur de la sidebar (64 = 16rem = 256px) */}
          <main className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}