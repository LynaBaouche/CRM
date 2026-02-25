import { DollarSign, Target, TrendingUp, Briefcase, Search, Bell, Settings, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: "Chiffre d'affaires", value: "148 500 €", change: "+12.5%", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Nouveaux leads", value: "24", change: "+8", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Taux de conversion", value: "34%", change: "+2.1%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Deals actifs", value: "12", change: "-1", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Barre de recherche du haut */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un client, un deal..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Bell size={20} /></button>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Settings size={20} /></button>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            JD
          </div>
        </div>
      </header>

      <div className="p-8 space-y-10">
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