"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Euro, Briefcase, Trophy, PieChart, LayoutGrid, List, X, Calendar } from 'lucide-react';

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]); // Pour lier le lead à un client
  const [loading, setLoading] = useState(true);

  // État de la modale d'ajout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', status: 'Prospection', contactId: '' });

  // 1. CHARGEMENT DES VRAIES DONNÉES
  const fetchData = async () => {
    try {
      // Récupérer les leads
      const resLeads = await fetch('http://localhost:3001/leads');
      const dataLeads = await resLeads.json();
      setLeads(dataLeads);

      // Récupérer les contacts pour la liste déroulante
      const resContacts = await fetch('http://localhost:3001/contacts');
      const dataContacts = await resContacts.json();
      setContacts(dataContacts);

      setLoading(false);
    } catch (err) { console.error("Erreur de chargement", err); }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. FONCTIONS DRAG & DROP
  const handleDragStart = (e: any, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDrop = async (e: any, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');

    // 1. Mise à jour visuelle instantanée
    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));

    // 2. Sauvegarde dans la base de données (AVEC LA BONNE URL !)
    try {
      await fetch(`http://localhost:3001/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) { 
      console.error("Erreur de sauvegarde", error); 
    }
  };

  // 3. AJOUTER UNE OPPORTUNITÉ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          amount: parseInt(formData.amount) || 0,
          status: formData.status,
          contactId: formData.contactId
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', amount: '', status: 'Prospection', contactId: '' });
        fetchData(); // Rafraîchir l'affichage
      }
    } catch (error) { console.error("Erreur lors de la création", error); }
  };

  const columns = [
    { name: 'Prospection', color: 'bg-purple-500' },
    { name: 'Qualification', color: 'bg-blue-500' },
    { name: 'Proposition', color: 'bg-amber-500' },
    { name: 'Négociation', color: 'bg-orange-500' },
    { name: 'Gagné', color: 'bg-emerald-500' },
    { name: 'Perdu', color: 'bg-rose-500' }
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pipeline des opportunités</h1>
          <p className="text-gray-500 font-medium mt-1">Gérez vos opportunités avec le glisser-déposer</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform">
          <Plus size={20} /> Nouvelle opportunité
        </button>
      </div>

      {loading ? (
        <p className="text-center font-bold text-gray-500 py-10">Chargement de vos opportunités...</p>
      ) : (
        <div className="flex gap-6 items-start overflow-x-auto pb-4 snap-x">
          {columns.map((col) => {
            const colLeads = leads.filter(l => l.status === col.name);
            const totalAmount = colLeads.reduce((sum, l) => sum + (l.amount || 0), 0);

            return (
              <div 
                key={col.name}
                // 👇 On fixe la largeur minimale pour que les cartes ne s'écrasent pas
                className="min-w-[320px] w-[320px] snap-center bg-gray-50/50 rounded-3xl p-4 min-h-[500px] border border-gray-100/50 shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, col.name)}
              >
                <div className="flex justify-between items-center mb-4 px-2">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> 
                      {col.name} 
                      <span className="bg-white text-xs px-2 py-0.5 rounded-full text-gray-500 shadow-sm border border-gray-100">{colLeads.length}</span>
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">{totalAmount.toLocaleString()} € au total</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {colLeads.map((lead) => {
                    const isUrgent = lead.amount > 20000;
                    const tagClass = isUrgent ? 'bg-rose-50 text-rose-600' : (lead.amount > 10000 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500');
                    const tagText = isUrgent ? 'Urgent' : (lead.amount > 10000 ? 'Moyen' : 'Faible');
                    
                    // 👇 Mise à jour des probabilités (Gagné = 100%, Perdu = 0%)
                    const prob = col.name === 'Prospection' ? 20 : col.name === 'Qualification' ? 40 : col.name === 'Proposition' ? 70 : col.name === 'Négociation' ? 90 : col.name === 'Gagné' ? 100 : 0;
                    const dateStr = new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

                    return (
                      <div 
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`bg-white p-5 rounded-2xl shadow-sm border space-y-4 hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:-translate-y-1 ${col.name === 'Gagné' ? 'border-emerald-200 bg-emerald-50/30' : col.name === 'Perdu' ? 'border-rose-200 opacity-75 grayscale' : 'border-gray-100'}`}
                      >
                        <span className={`${tagClass} text-xs font-bold px-2 py-1 rounded-md`}>{tagText}</span>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">{lead.title}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                            <Briefcase size={12}/> {lead.contact?.company?.name || 'Indépendant'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">
                             {lead.contact?.firstName?.charAt(0)}{lead.contact?.lastName?.charAt(0)}
                          </div>
                          <p className="text-xs text-gray-600 truncate">{lead.contact?.firstName} {lead.contact?.lastName}</p>
                        </div>

                        <div className="flex justify-between items-end pt-2">
                          <div>
                            <p className="text-lg font-black text-gray-900">{lead.amount.toLocaleString()} €</p>
                            <p className="text-xs font-bold text-gray-400 mt-2">Probabilité</p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1 w-24">
                              <div className={`${col.color} h-1.5 rounded-full transition-all duration-500`} style={{width: `${prob}%`}}></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 flex items-center gap-1 mb-2 justify-end"><Calendar size={12}/> {dateStr}</p>
                            <p className="text-xs font-bold text-gray-400">{prob}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {colLeads.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex items-center justify-center text-xs font-bold text-gray-400">
                      Glisser une carte ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALE D'AJOUT D'OPPORTUNITÉ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-gray-900">Nouvelle Opportunité</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Titre du projet</label>
                <input required type="text" placeholder="Ex: Refonte site web" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Montant (€)</label>
                <input required type="number" placeholder="Ex: 5000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Associé</label>
                <select required value={formData.contactId} onChange={e => setFormData({...formData, contactId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20">
                  <option value="" disabled>Sélectionner un contact</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.company?.name || 'Indépendant'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Statut de départ</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20">
                  <option value="Prospection">Prospection</option>
                  <option value="Qualification">Qualification</option>
                  <option value="Proposition">Proposition</option>
                  <option value="Négociation">Négociation</option>
                </select>
              </div>
              
              <button type="submit" className="w-full mt-6 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                Créer l'opportunité
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
