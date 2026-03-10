"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Users, Shield } from 'lucide-react';

export default function TeamPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/admin-requests');
      if (res.ok) setRequests(await res.json());
      setLoading(false);
    } catch (error) {
      console.error("Erreur", error);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleRequest = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(`http://localhost:3001/auth/users/${id}/approve-admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve })
      });

      if (res.ok) {
        // Retire la demande de l'écran avec une belle animation
        setRequests(requests.filter(req => req.id !== id));
        alert(approve ? "✅ Droits Administrateur accordés !" : "❌ Demande refusée.");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Shield className="text-purple-600" size={32} />
            Espace Sécurité & Équipe
          </h1>
          <p className="text-gray-500 font-medium mt-1">Gérez les accès et les membres de votre CRM.</p>
        </div>
      </div>

      {/* NOTIFICATIONS DES DEMANDES ADMIN */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Demandes d'accès en attente
          <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs">{requests.length}</span>
        </h2>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <ShieldAlert size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aucune demande d'accès administrateur en attente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-rose-50/50 border border-rose-100 p-6 rounded-3xl flex justify-between items-center shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-sm">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{req.firstName} {req.lastName}</h3>
                    <p className="text-gray-500 text-sm">Email : <span className="font-medium text-gray-700">{req.email}</span></p>
                    <p className="text-xs text-rose-500 font-bold mt-1">Demande les droits Administrateur</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRequest(req.id, false)}
                    className="px-6 py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-rose-600 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={18} /> Refuser
                  </button>
                  <button 
                    onClick={() => handleRequest(req.id, true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Approuver (Passer Admin)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}