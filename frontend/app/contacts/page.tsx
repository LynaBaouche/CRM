"use client"; // Indispensable pour utiliser useState, useEffect et les clics !

import { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Mail, Phone, Building2, Trash2, X } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  // 1. READ : Récupérer les contacts au chargement de la page
  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:3001/contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Erreur de connexion au backend :", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 2. DELETE : Supprimer un contact
  const handleDelete = async (id: string) => {
    if (!window.confirm('Es-tu sûr de vouloir supprimer ce contact ?')) return;
    
    try {
      await fetch(`http://localhost:3001/contacts/${id}`, { method: 'DELETE' });
      // On met à jour l'affichage en retirant le contact supprimé
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // 3. CREATE : Ajouter un contact
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false); // On ferme la modale
        setFormData({ firstName: '', lastName: '', email: '' }); // On vide le formulaire
        fetchContacts(); // On recharge la liste pour voir le nouveau contact !
      }
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#F9FAFB] min-h-screen relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Répertoire Clients</h1>
          <p className="text-gray-500 font-medium mt-1">Gérez vos relations commerciales en un coup d'œil.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
          <UserPlus size={20} />
          Ajouter un contact
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Contact</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Entreprise</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Statut</th>
              <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.map((contact: any) => (
              <tr key={contact.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center font-bold text-gray-600 shadow-inner">
                      {contact.firstName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg leading-tight">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-gray-400">
                        <span className="flex items-center gap-1 text-xs"><Mail size={12}/> {contact.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-600 font-semibold italic">
                   <div className="flex items-center gap-2">
                     <Building2 size={16} className="text-emerald-400" />
                     {contact.company?.name || 'Indépendant'}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">
                    ACTIF
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(contact.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FENÊTRE MODALE D'AJOUT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-gray-900">Nouveau Contact</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prénom</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              </div>
              
              <button type="submit" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95">
                Créer le contact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}