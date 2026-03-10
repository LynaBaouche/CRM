"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('standard'); 
  
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? 'login' : 'signup';
    const bodyData = isLogin 
      ? { email, password } 
      : { email, password, firstName, lastName, role };

    try {
      const res = await fetch(`http://localhost:3001/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) { setError("Impossible de joindre le serveur"); }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">{isLogin ? 'Connexion' : 'Créer un compte'}</h1>
        </div>

        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prénom</label>
                  <input required={!isLogin} value={firstName} onChange={e => setFirstName(e.target.value)} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" placeholder="Prénom" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom</label>
                  <input required={!isLogin} value={lastName} onChange={e => setLastName(e.target.value)} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" placeholder="Nom" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Votre Rôle</label>
                {/* 👇 ET C'EST ICI QUE J'AI MIS LES 3 NOUVELLES OPTIONS */}
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none">
                  <option value="standard">Utilisateur Standard</option>
                  <option value="commercial">Commercial</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
            <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" placeholder="vous@entreprise.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mot de passe</label>
            <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl active:scale-95 transition-all mt-6">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-gray-500 font-medium hover:text-emerald-600 transition-colors text-sm">
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}