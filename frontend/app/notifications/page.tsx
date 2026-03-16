"use client";

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Circle } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. Récupération dynamique du vrai ID de l'utilisateur
  useEffect(() => {
    // On regarde si le token s'appelle 'access_token' (ton backend) ou 'token'
    const token = localStorage.getItem('access_token') || localStorage.getItem('token'); 
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub); // "sub" contient l'ID
      } catch (e) {
        console.error("Erreur de décodage", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Chargement des vraies notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUserId) return;

      try {
        const res = await fetch(`${API_URL}/auth/notifications/${currentUserId}`);
        if (res.ok) {
          setNotifications(await res.json());
        }
      } catch (error) {
        console.error("Erreur chargement notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  // 3. Marquer comme lu
  const markAllAsRead = async () => {
    if (!currentUserId) return;
    
    try {
      await fetch(`${API_URL}/auth/notifications/${currentUserId}/read`, { method: 'PATCH' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8 bg-[#F9FAFB] min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Bell className="text-purple-600" size={32} />
            Mes Notifications
          </h1>
          <p className="text-gray-500 font-medium mt-1">Retrouvez toutes vos alertes et mises à jour.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-sm font-bold text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Bell size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Vous n'avez aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-6 rounded-2xl border transition-colors flex gap-4 ${notif.isRead ? 'bg-white border-gray-100' : 'bg-purple-50/50 border-purple-100 shadow-sm'}`}>
              <div className="mt-1">
                {notif.isRead ? <CheckCircle2 className="text-gray-300" size={24}/> : <Circle className="text-purple-500 fill-purple-500" size={14}/>}
              </div>
              <div>
                <h3 className={`text-lg ${notif.isRead ? 'font-bold text-gray-700' : 'font-black text-gray-900'}`}>{notif.title}</h3>
                <p className={`${notif.isRead ? 'text-gray-500' : 'text-gray-700'} mt-1`}>{notif.message}</p>
                <p className="text-xs text-gray-400 font-medium mt-3">
                  {new Date(notif.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}