"use client";

import { useState, useEffect } from 'react';
import { User, Bell, Lock, Save, Shield, Moon } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', role: 'standard' });
  const [loading, setLoading] = useState(false);
  
  // États pour les préférences (visuels pour la démo)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Récupération des infos depuis le token
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName || 'Utilisateur',
          lastName: payload.lastName || '',
          email: payload.email || 'email@veloria.com',
          role: payload.role || 'standard'
        });
      } catch (e) {
        console.error("Erreur token");
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation de sauvegarde pour la démo
    setTimeout(() => {
      setLoading(false);
      alert("✅ Vos paramètres ont été mis à jour avec succès !");
    }, 800);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Paramètres du compte</h1>
        <p className="text-gray-500 font-medium mt-1">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* MENU LATÉRAL DES PARAMÈTRES */}
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-600 font-bold rounded-xl transition-all">
            <User size={20} /> Profil public
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 font-bold rounded-xl transition-all">
            <Bell size={20} /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 font-bold rounded-xl transition-all">
            <Lock size={20} /> Sécurité
          </button>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="col-span-2 space-y-8">
          
          <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg">
                {user.firstName.charAt(0)}{user.lastName ? user.lastName.charAt(0) : ''}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Photo de profil</h2>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                <button type="button" className="mt-2 text-sm font-bold text-purple-600 hover:text-purple-700">Changer la photo</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prénom</label>
                <input type="text" value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom</label>
                <input type="text" value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Adresse Email</label>
                <input type="email" value={user.email} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-500 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Shield size={12}/> L'email de connexion ne peut pas être modifié.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70">
                {loading ? 'Sauvegarde...' : <><Save size={18} /> Enregistrer les modifications</>}
              </button>
            </div>
          </form>

          {/* SECTION PRÉFÉRENCES */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Préférences de l'application</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Notifications par email</p>
                <p className="text-sm text-gray-500">Recevoir un récapitulatif quotidien des tâches.</p>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)} 
                className={`w-12 h-6 rounded-full relative transition-colors ${emailNotifs ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div>
                <p className="font-bold text-gray-900 flex items-center gap-2">Mode Sombre <span className="bg-gray-100 text-gray-500 text-[10px] uppercase px-2 py-0.5 rounded font-black tracking-wider">Bêta</span></p>
                <p className="text-sm text-gray-500">Passer l'interface en thème sombre.</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}