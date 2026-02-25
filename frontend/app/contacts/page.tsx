import { UserPlus, MoreVertical, Mail, Phone, Building2 } from 'lucide-react';

export default function ContactsPage() {
  const contacts = [
    { id: 1, name: "Sarah Koné", email: "s.kone@tech.fr", phone: "06 12 34 56 78", company: "Avenir Digital", status: "Actif" },
    { id: 2, name: "Marc Rossi", email: "m.rossi@luxe.it", phone: "07 88 99 00 11", company: "Style & Co", status: "En attente" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#F9FAFB] min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Répertoire Clients</h1>
          <p className="text-gray-500 font-medium mt-1">Gérez vos relations commerciales en un coup d'œil.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
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
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-emerald-50/30 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center font-bold text-gray-600 shadow-inner group-hover:scale-110 transition-transform">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg leading-tight">{contact.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-gray-400">
                        <span className="flex items-center gap-1 text-xs"><Mail size={12}/> {contact.email}</span>
                        <span className="flex items-center gap-1 text-xs"><Phone size={12}/> {contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-600 font-semibold italic">
                   <div className="flex items-center gap-2">
                     <Building2 size={16} className="text-emerald-400" />
                     {contact.company}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    contact.status === 'Actif' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-gray-300 hover:text-gray-600 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}