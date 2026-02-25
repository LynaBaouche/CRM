import Link from 'next/link';
import { 
  LayoutDashboard, Users, Building2, Target, 
  Kanban, CheckSquare, Mail, BarChart2 
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, href: '/', active: true },
    { name: 'Contacts', icon: Users, href: '/contacts' },
    { name: 'Entreprises', icon: Building2, href: '/entreprises' },
    { name: 'Leads', icon: Target, href: '/leads' },
    { name: 'Pipeline', icon: Kanban, href: '/pipeline' },
    { name: 'Tâches', icon: CheckSquare, href: '/taches' },
    { name: 'Campagnes', icon: Mail, href: '/campagnes' },
    { name: 'Analytique', icon: BarChart2, href: '/analytique' },
  ];

  return (
    <div className="w-64 h-screen bg-[#111827] text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      <div className="flex items-center gap-3 p-8">
        <div className="bg-emerald-400 text-gray-900 font-bold w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-emerald-500/20">
          CR
        </div>
        <span className="text-xl font-bold tracking-tight">CRM Pro</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={`${item.active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium">Système en ligne</span>
        </button>
      </div>
    </div>
  );
}