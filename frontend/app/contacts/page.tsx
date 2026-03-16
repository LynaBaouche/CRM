"use client";

import { useState, useEffect } from 'react';
import { UserPlus, Mail, Trash2, X, Search, Filter, ArrowUpDown, Download, Edit2, Building2 } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [sortOrder, setSortOrder] = useState<'recent' | 'asc' | 'desc'>('recent'); // NOUVEAU: État pour le tri

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', status: 'Prospect', companyName: '' });

  // ÉTATS POUR L'EMAIL
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', content: '' });
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch (error) { console.error("Erreur", error); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce contact ?')) return;
    try {
      await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) { console.error("Erreur", error); }
  };

  const openEditModal = (contact: any) => {
    setEditingId(contact.id);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || '',
      status: contact.status || 'Prospect',
      companyName: contact.company?.name || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/contacts/${editingId}` : `${API_URL}/contacts`;             
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', status: 'Prospect', companyName: '' });
        fetchContacts();
      } else {
        const errorMsg = await res.text();
        alert(`Erreur du backend : ${errorMsg}`);
      }
    } catch (error) { alert("Le backend ne répond pas."); }
  };

  // FONCTIONS EMAIL
  const openEmailModal = (contact: any) => {
    setSelectedContact(contact);
    setEmailData({ subject: '', content: '' });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/contacts/${selectedContact.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      if (res.ok) {
        alert("✉️ Email envoyé avec succès !");
        setIsEmailModalOpen(false);
      } else {
        const err = await res.text();
        alert(`❌ Erreur d'envoi : ${err}`);
      }
    } catch (error) { alert("❌ Le backend ne répond pas."); } 
    finally { setIsSending(false); }
  };

  // NOUVEAU : FONCTION EXPORTER EN CSV
  const exportToCSV = () => {
    const headers = ["Prénom", "Nom", "Email", "Téléphone", "Entreprise", "Statut"];
    const rows = filteredContacts.map(c => [
      c.firstName, 
      c.lastName, 
      c.email, 
      c.phone || '', 
      c.company?.name || '', 
      c.status
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "veloria_contacts.csv";
    link.click();
  };

  // NOUVEAU : CYCLE DE TRI
  const toggleSort = () => {
    if (sortOrder === 'recent') setSortOrder('asc');
    else if (sortOrder === 'asc') setSortOrder('desc');
    else setSortOrder('recent');
  };

  // FILTRAGE ET TRI
  let filteredContacts = contacts.filter((contact) => {
    const searchString = (contact.firstName + " " + contact.lastName + " " + contact.email + " " + (contact.company?.name || "")).toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Tous' || contact.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (sortOrder === 'asc') {
    filteredContacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
  } else if (sortOrder === 'desc') {
    filteredContacts.sort((a, b) => b.lastName.localeCompare(a.lastName));
  }

  const counts = {
    Tous: contacts.length,
    Client: contacts.filter(c => c.status === 'Client').length,
    Prospect: contacts.filter(c => c.status === 'Prospect').length,
    Partenaire: contacts.filter(c => c.status === 'Partenaire').length,
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des contacts</h1>
          <p className="text-gray-500 font-medium mt-1">Gérez et organisez tous vos contacts</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', status: 'Prospect', companyName: '' });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <UserPlus size={20} /> Nouveau contact
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20" 
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"><Filter size={16} /> Filtres</button>
          
          {/* 👇 BOUTONS TRIER ET EXPORTER ACTIFS */}
          <button onClick={toggleSort} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50">
            <ArrowUpDown size={16} /> 
            Trier {sortOrder === 'asc' ? '(A-Z)' : sortOrder === 'desc' ? '(Z-A)' : ''}
          </button>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Download size={16} /> Exporter
          </button>
        </div>
        
        <div className="flex gap-2 text-sm font-bold overflow-x-auto pb-2">
          {['Tous', 'Client', 'Prospect', 'Partenaire'].map((status) => (
            <button 
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-colors ${
                activeFilter === status ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status} {status === 'Client' || status === 'Prospect' ? 's' : ''} 
              <span className={`${activeFilter === status ? 'bg-white/20' : 'bg-white'} px-2 py-0.5 rounded-full text-xs`}>
                {counts[status as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold bg-gray-50/50">
              <th className="p-5">Contact</th>
              <th className="p-5">Entreprise</th>
              <th className="p-5">Téléphone</th>
              <th className="p-5">Statut</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredContacts.map((contact: any) => (
              <tr key={contact.id} className="hover:bg-purple-50/30 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-600 text-sm shadow-sm">
                      {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{contact.firstName} {contact.lastName}</p>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2 font-medium text-sm text-gray-900">
                    <Building2 size={14} className="text-gray-400" />
                    {contact.company?.name || '-'}
                  </div>
                </td>
                <td className="p-5 text-sm font-medium text-gray-600">{contact.phone || '-'}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    contact.status === 'Client' ? 'bg-emerald-50 text-emerald-600' : 
                    contact.status === 'Partenaire' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(contact)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => openEmailModal(contact)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                      <Mail size={16} />
                    </button>
                    <button onClick={() => handleDelete(contact.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE D'AJOUT/ÉDITION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h2 className="text-2xl font-black mb-6 text-gray-900">{editingId ? 'Modifier le contact' : 'Nouveau Contact'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prénom</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Entreprise</label>
                  <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Téléphone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Statut</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20">
                    <option value="Prospect">Prospect</option>
                    <option value="Client">Client</option>
                    <option value="Partenaire">Partenaire</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-6 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                {editingId ? 'Mettre à jour' : 'Enregistrer le contact'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALE D'ENVOI D'EMAIL */}
      {isEmailModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsEmailModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h2 className="text-2xl font-black mb-2 text-gray-900">Envoyer un email</h2>
            <p className="text-sm text-gray-500 mb-6">À : <span className="font-bold text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</span> ({selectedContact.email})</p>
            
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sujet de l'email</label>
                <input required type="text" placeholder="Ex: Suite à notre rendez-vous..." value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                <textarea required rows={6} placeholder="Rédigez votre message ici..." value={emailData.content} onChange={e => setEmailData({...emailData, content: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"></textarea>
              </div>
              
              <button type="submit" disabled={isSending} className="w-full mt-6 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                {isSending ? 'Envoi en cours...' : <><Mail size={18} /> Envoyer l'email</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}