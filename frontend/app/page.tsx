"use client";

import { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, CheckSquare, Circle, CheckCircle2, Plus, X } from 'lucide-react';

export default function HomePage() {
  const [userName, setUserName] = useState("Utilisateur");
  const [userRole, setUserRole] = useState("standard");
  
  // Contacts récupérés de la base de données
  const [contacts, setContacts] = useState<any[]>([]);

  // Modales
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Filtre des tâches
  const [taskFilter, setTaskFilter] = useState<'todo' | 'done'>('todo');

  // Vraies données interactives pour la démo
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Suivi de Lucas Hauchard', date: '2026-03-17', completed: false },
    { id: 2, title: 'Envoyer Newsletter Promo Noël', date: '2026-03-11', completed: true },
    { id: 3, title: 'Relance Jean Dupuis', date: '2026-03-18', completed: false },
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Démonstration Produit - Prospect', time: '14:00', date: 'Aujourd\'hui', contact: 'Alice Dubois' },
    { id: 2, title: 'Team Sync: Feedback Soutenance', time: '16:30', date: 'Aujourd\'hui', contact: 'Emerald' }
  ]);

  // Formulaires
  const [newTask, setNewTask] = useState({ title: '', date: '' });
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', contact: '' });

  useEffect(() => {
    // Récupération de l'utilisateur
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.firstName) setUserName(payload.firstName);
        if (payload.role) setUserRole(payload.role);
      } catch (e) {
        console.error("Erreur token");
      }
    }

    // 👉 NOUVEAU : On récupère tes vrais contacts !
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:3001/contacts');
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (error) {
        console.error("Erreur de chargement des contacts", error);
      }
    };

    fetchContacts();
  }, []);

  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Actions interactives
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const task = {
      id: Date.now(),
      title: newTask.title,
      date: newTask.date || new Date().toISOString().split('T')[0],
      completed: false
    };
    setTasks([...tasks, task]);
    setIsTaskModalOpen(false);
    setNewTask({ title: '', date: '' });
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title) return;
    
    const formattedDate = newMeeting.date 
      ? new Date(newMeeting.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      : 'Aujourd\'hui';

    const meeting = {
      id: Date.now(),
      title: newMeeting.title,
      time: newMeeting.time || '10:00',
      date: formattedDate,
      contact: newMeeting.contact || 'Non spécifié' 
    };
    
    setMeetings([...meetings, meeting]);
    setIsMeetingModalOpen(false);
    setNewMeeting({ title: '', date: '', time: '', contact: '' });
  };

  const filteredTasks = tasks.filter(t => taskFilter === 'todo' ? !t.completed : t.completed);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-[#F9FAFB] min-h-screen">
      
      {/* HEADER BIENVENUE */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-500 font-bold text-sm capitalize mb-2">{todayStr}</p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Bonjour {userName},</h1>
          <p className="text-gray-600 mt-2 font-medium">
            Connecté(e) en tant que : <span className={`font-bold ${userRole === 'admin' ? 'text-emerald-500' : 'text-purple-600'}`}>{userRole}</span>
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Rechercher..." className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARTE : RÉUNIONS */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="text-gray-400" size={24} /> Réunions
            </h2>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-white">
              <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors"><ChevronLeft size={18}/></button>
              <span className="text-sm font-bold text-gray-800 px-2">Aujourd'hui</span>
              <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors"><ChevronRight size={18}/></button>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {meetings.map((meeting, index) => (
              <div key={meeting.id}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 shrink-0 mt-1 shadow-sm flex items-center justify-center text-white text-xs font-bold">
                    {meeting.time.split(':')[0]}h
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">({meeting.time}) {meeting.title}</p>
                    <p className="text-emerald-600 font-bold text-sm mt-1">{meeting.contact} <span className="text-gray-400 font-normal ml-2">• {meeting.date}</span></p>
                  </div>
                </div>
                {index !== meetings.length - 1 && <hr className="border-gray-50 mt-6" />}
              </div>
            ))}
          </div>

          <button onClick={() => setIsMeetingModalOpen(true)} className="mt-8 w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2">
            <Plus size={20} /> Planifier une réunion
          </button>
        </div>

        {/* CARTE : VOS TÂCHES */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="text-[#F59E0B]"><CheckSquare size={24} /></div>
              <h2 className="text-xl font-bold text-gray-900">Vos Tâches</h2>
              <span className="bg-gray-100 text-gray-500 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full">{filteredTasks.length}</span>
            </div>
            
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button onClick={() => setTaskFilter('todo')} className={`text-sm font-bold px-4 py-2 rounded-lg transition-all ${taskFilter === 'todo' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
                À faire
              </button>
              <button onClick={() => setTaskFilter('done')} className={`text-sm font-bold px-4 py-2 rounded-lg transition-all ${taskFilter === 'done' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
                Terminées
              </button>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {filteredTasks.length === 0 ? (
              <p className="text-center text-gray-400 font-bold py-10">Aucune tâche dans cette liste.</p>
            ) : (
              filteredTasks.map((task, index) => (
                <div key={task.id}>
                  <div 
                    onClick={() => toggleTask(task.id)} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group ${task.completed ? 'bg-purple-50/50 border border-purple-100/50' : 'hover:bg-gray-50 border border-transparent'}`}
                  >
                    <div className="flex items-start gap-4">
                      {task.completed ? (
                        <CheckCircle2 className="text-[#8B5CF6] mt-0.5 shrink-0" size={24} />
                      ) : (
                        <Circle className="text-gray-200 group-hover:text-gray-400 mt-0.5 shrink-0 transition-colors" size={24} />
                      )}
                      <div>
                        <span className={`font-bold block ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{task.title}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${task.completed ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                      {new Date(task.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  {index !== filteredTasks.length - 1 && <hr className="border-gray-50 mt-4" />}
                </div>
              ))
            )}
          </div>

          <button onClick={() => setIsTaskModalOpen(true)} className="mt-6 w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2">
            <Plus size={20} /> Créer une tâche
          </button>
        </div>

      </div>

      {/* MODALE RÉUNION */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button type="button" onClick={() => setIsMeetingModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>
            <h2 className="text-2xl font-black mb-6 text-gray-900">Nouvelle Réunion</h2>
            
            <form onSubmit={handleAddMeeting} className="space-y-4">
              <input required type="text" placeholder="Titre de la réunion" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              
              {/* 👉 NOUVEAU : LA VRAIE LISTE DÉROULANTE DE TES CONTACTS */}
              <select 
                required 
                value={newMeeting.contact} 
                onChange={e => setNewMeeting({...newMeeting, contact: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-700 font-medium"
              >
                <option value="" disabled>Sélectionner un contact</option>
                {contacts.length === 0 ? (
                  <option disabled>Chargement des contacts...</option>
                ) : (
                  contacts.map(c => (
                    <option key={c.id} value={`${c.firstName} ${c.lastName}`}>
                      {c.firstName} {c.lastName} {c.company?.name ? `(${c.company.name})` : ''}
                    </option>
                  ))
                )}
              </select>
              
              <input required type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-700 font-medium" />
              <input required type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-700 font-medium" />
              
              <button type="submit" className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                Planifier la réunion
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALE TÂCHE */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>
            <h2 className="text-2xl font-black mb-6 text-gray-900">Nouvelle Tâche</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input required type="text" placeholder="Que devez-vous faire ?" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20" />
              <input required type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-700 font-medium" />
              
              <button type="submit" className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                Créer la tâche
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}