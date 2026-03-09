"use client";

import { useState, useEffect } from 'react';
import { Search, Bell, Settings, Plus, DollarSign, X, Edit2, Trash2 } from 'lucide-react';

const COLUMNS = [
  { id: 'Lead Capturé', title: 'Nouveaux Leads', color: 'border-blue-500', bg: 'bg-blue-50' },
  { id: 'Qualification', title: 'Qualification', color: 'border-purple-500', bg: 'bg-purple-50' },
  { id: 'Proposition', title: 'Proposition', color: 'border-amber-500', bg: 'bg-amber-50' },
  { id: 'Gagné', title: 'Gagnés 🎉', color: 'border-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Perdu', title: 'Perdus', color: 'border-rose-500', bg: 'bg-rose-50' },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Nouveau state pour savoir si on "Créé" ou si on "Modifie"
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', amount: '', contactId: '' });

  const fetchData = async () => {
    try {
      const [leadsRes, contactsRes] = await Promise.all([
        fetch('http://localhost:3001/leads'),
        fetch('http://localhost:3001/contacts')
      ]);
      setLeads(await leadsRes.json());
      setContacts(await contactsRes.json());
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- GLISSER DEPOSER ---
  const handleDragStart = (e: React.DragEvent, leadId: string) => e.dataTransfer.setData('leadId', leadId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
    try {
      await fetch(`http://localhost:3001/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) { fetchData(); }
  };

  // --- SUPPRIMER ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce deal définitivement ?")) return;
    try {
      await fetch(`http://localhost:3001/leads/${id}`, { method: 'DELETE' });
      fetchData(); // On recharge
    } catch (error) { console.error(error); }
  };

  // --- OUVRIR LA MODALE POUR MODIFIER ---
  const openEditModal = (lead: any) => {
    setEditingId(lead.id);
    setFormData({ title: lead.title, amount: lead.amount.toString(), contactId: lead.contactId });
    setIsModalOpen(true);
  };

  // --- OUVRIR LA MODALE POUR CREER ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ title: '', amount: '', contactId: '' });
    setIsModalOpen(true);
  };

  // --- SAUVEGARDER (CREATION OU MODIFICATION) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactId && !editingId) { alert("Sélectionnez un client !"); return; }

    const url = editingId ? `http://localhost:3001/leads/${editingId}` : 'http://localhost:3001/leads';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, amount: parseInt(formData.amount) || 0, contactId: formData.contactId })
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Erreur du serveur !");
      }
    } catch (error) { alert("Erreur réseau !"); }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col w-full">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 w-full">
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
          <input type="text" placeholder="Rechercher un deal..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="p-2 hover:bg-gray-50 rounded-lg"><Bell size={20} /></button>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center">L</div>
        </div>
      </header>

      <div className="px-8 py-8 shrink-0 flex justify-between items-end w-full">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pipeline de Ventes</h1>
          <p className="text-gray-500 font-medium mt-1">Gérez vos opportunités commerciales.</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
          <Plus size={20} /> Nouveau Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto px-8 pb-8 w-full">
        <div className="flex gap-6 h-full items-start">
          {COLUMNS.map(column => (
            <div key={column.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column.id)} className="w-80 shrink-0 min-h-[500px] bg-gray-100/50 rounded-3xl p-4 flex flex-col border border-gray-200/60">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border-2 ${column.color} ${column.bg}`}></span> {column.title}
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-lg">{leads.filter(l => l.status === column.id).length}</span>
              </div>

              <div className="flex-1 space-y-3">
                {leads.filter(lead => lead.status === column.id).map(lead => (
                  <div key={lead.id} draggable onDragStart={(e) => handleDragStart(e, lead.id)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-emerald-200 group relative">
                    
                    {/* BOUTONS D'ACTION (Apparaissent au survol) */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(lead)} className="p-1.5 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(lead.id)} className="p-1.5 bg-gray-50 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>

                    <div className="mb-2"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{lead.contact?.firstName || 'Client'}</span></div>
                    <h4 className="font-bold text-gray-900 mb-3 pr-10">{lead.title}</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1"><DollarSign size={14} />{lead.amount} €</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h2 className="text-2xl font-black mb-6 text-gray-900">{editingId ? 'Modifier le Deal' : 'Nouveau Deal'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Titre de l'opportunité</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Montant (€)</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Client Associé</label>
                  <select required value={formData.contactId} onChange={e => setFormData({...formData, contactId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option value="">Sélectionnez un contact...</option>
                    {contacts.map(contact => <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl active:scale-95 transition-all">
                {editingId ? 'Mettre à jour' : "Créer l'opportunité"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}