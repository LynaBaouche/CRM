"use client";

import { useState, useEffect } from 'react';
import { Megaphone, Plus, X, Users, Mail, BarChart3, Search, CheckSquare, CalendarDays, AlignLeft } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', subject: '', content: '' });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 👉 NOUVEAU : État pour gérer la campagne sélectionnée pour les détails
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      const resCamp = await fetch(`${API_URL}/campaigns`);
      if (resCamp.ok) setCampaigns(await resCamp.json());

      const resCont = await fetch(`${API_URL}/contacts`);
      if (resCont.ok) setContacts(await resCont.json());
    } catch (error) {
      console.error("Erreur de chargement", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch (e) {
        console.error("Erreur token");
      }
    }
    fetchData(); 
  }, []);

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]); 
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContacts.length === 0) return alert("Veuillez sélectionner au moins un contact !");
    if (!currentUserId) return alert("Erreur : Impossible d'identifier l'utilisateur connecté.");

    setLoading(true);
    try {
      const payload = { ...formData, contactIds: selectedContacts, userId: currentUserId };
      const res = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("🚀 Campagne envoyée avec succès !");
        setIsModalOpen(false);
        setFormData({ name: '', subject: '', content: '' });
        setSelectedContacts([]);
        fetchData(); 
      } else {
        const err = await res.text();
        alert(`Erreur : ${err}`);
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    (c.firstName + " " + c.lastName + " " + c.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Campagnes Email</h1>
          <p className="text-gray-500 font-medium mt-1">Envoyez des communications groupées et analysez les KPIs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Megaphone size={20} /> Nouvelle campagne
        </button>
      </div>

      {/* LISTE DES CAMPAGNES */}
      <div className="grid grid-cols-1 gap-6">
        {campaigns.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
            <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune campagne envoyée</h3>
            <p className="text-gray-500">Créez votre première campagne pour communiquer avec vos clients.</p>
          </div>
        ) : (
          campaigns.map((camp) => {
            const totalSent = camp.contacts?.length || 0;
            const opened = camp.contacts?.filter((c:any) => c.status === 'ouvert').length || 0;
            const openRate = totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0;

            return (
              <div 
                key={camp.id} 
                onClick={() => setSelectedCampaign(camp)} // 👉 NOUVEAU : Ouvre les détails au clic
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{camp.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span className="font-medium text-gray-900">Sujet :</span> {camp.subject}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Envoyé le {new Date(camp.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 border-l border-gray-100 pl-8">
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-900">{totalSent}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Envoyés</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-500">{openRate}%</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1 flex items-center gap-1 justify-center"><BarChart3 size={12}/> Ouverture</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 👉 NOUVEAU : MODALE DES DÉTAILS DE LA CAMPAGNE */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedCampaign(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 z-10 bg-gray-100 rounded-full p-2"><X size={20} /></button>
            
            <div className="mb-6 border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-black text-gray-900">{selectedCampaign.name}</h2>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-2"><CalendarDays size={16} className="text-purple-500"/> {new Date(selectedCampaign.createdAt).toLocaleString('fr-FR')}</span>
                <span className="flex items-center gap-2"><Users size={16} className="text-purple-500"/> {selectedCampaign.contacts?.length || 0} Destinataires</span>
              </div>
            </div>

            <div className="flex gap-8 overflow-hidden h-full">
              {/* Colonne gauche : Contenu */}
              <div className="flex-1 overflow-y-auto pr-4">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><AlignLeft size={18} /> Sujet : {selectedCampaign.subject}</h3>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {/* Si le contenu n'est pas sauvegardé en BDD, on met un texte par défaut pour la démo */}
                  {selectedCampaign.content || "Le contenu de cette campagne n'est pas disponible pour cet envoi historique. Les prochains envois s'afficheront ici."}
                </div>
              </div>

              {/* Colonne droite : Destinataires */}
              <div className="w-1/3 bg-gray-50 rounded-2xl p-6 overflow-y-auto border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Liste d'envoi</h3>
                <div className="space-y-3">
                  {selectedCampaign.contacts?.map((c: any, index: number) => (
                    <div key={c.contact?.id || index} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <p className="font-bold text-gray-800 text-sm">{c.contact.firstName} {c.contact.lastName}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{c.contact.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE CRÉATION DE CAMPAGNE (Gardée intacte) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 relative animate-in fade-in zoom-in duration-200 overflow-hidden flex h-[80vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10"><X size={24} /></button>
            {/* Colonne Gauche : Formulaire */}
            <div className="w-1/2 p-8 border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
              <h2 className="text-2xl font-black mb-6 text-gray-900">Créer la campagne</h2>
              <form id="campaign-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom de la campagne</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sujet de l'email</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contenu</label>
                  <textarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"></textarea>
                </div>
              </form>
            </div>
            {/* Colonne Droite : Destinataires */}
            <div className="w-1/2 p-8 bg-white flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><Users size={20}/> Destinataires</h3>
                <span className="bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1 rounded-full">{selectedContacts.length}</span>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
              </div>
              <button type="button" onClick={selectAll} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-purple-600 mb-4 transition-colors">
                <CheckSquare size={16}/> Tout cocher
              </button>
              <div className="flex-1 overflow-y-auto space-y-2 border-t border-gray-100 pt-4">
                {filteredContacts.map(contact => (
                  <label key={contact.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${selectedContacts.includes(contact.id) ? 'border-purple-500 bg-purple-50/30' : 'border-transparent hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={selectedContacts.includes(contact.id)} onChange={() => toggleContact(contact.id)} className="w-4 h-4 text-purple-600 rounded" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{contact.firstName} {contact.lastName}</p>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button form="campaign-form" type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? 'Envoi...' : <><Megaphone size={18} /> Lancer la campagne</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}