import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, User as UserIcon, Mail, Shield, Save } from 'lucide-react';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onOpenLegalModal: () => void;
}

const getRoleClass = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin: 
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30';
    case UserRole.Operator: 
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30';
    case UserRole.Viewer: 
        return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30';
    default: 
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30';
  }
};

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="transition-colors text-slate-700 dark:text-slate-300">{label}</span>
        <button 
            onClick={() => onChange(!enabled)} 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            ${enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onOpenLegalModal }) => {
    const [name, setName] = useState(user.name);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true); 

    const handleSave = () => {
        console.log("Saved:", { name, notifications, darkMode });
        onClose();
    };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in" 
        onClick={onClose}
    >
        <div 
            className="rounded-2xl shadow-2xl w-full max-w-md border animate-fade-in-down transition-colors duration-300
                /* MODO CLARO */
                bg-white border-slate-200
                /* MODO OSCURO */
                dark:bg-slate-800 dark:border-slate-700"
            onClick={e => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b transition-colors duration-300 border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold transition-colors text-slate-800 dark:text-white">
                    Perfil de Usuario
                </h2>
                <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                    <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
                </button>
            </header>

            <div className="p-6">
                <div className="flex flex-col items-center space-y-4">
                    <img 
                        src={user.avatarUrl} 
                        alt="User Avatar" 
                        className="h-24 w-24 rounded-full border-4 transition-colors border-slate-200 dark:border-slate-600"
                    />
                    <div className="text-center">
                        <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border transition-colors ${getRoleClass(user.role)}`}>
                            {user.role}
                        </div>
                    </div>
                </div>

                <form className="mt-8 space-y-4">
                    <div>
                        <label className="text-sm font-medium flex items-center mb-1 transition-colors text-slate-600 dark:text-slate-400">
                            <UserIcon className="w-4 h-4 mr-2"/>Nombre
                        </label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full rounded-lg py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors
                                bg-white border-slate-300 text-slate-900
                                dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                        />
                    </div>
                     <div>
                        <label className="text-sm font-medium flex items-center mb-1 transition-colors text-slate-600 dark:text-slate-400">
                            <Mail className="w-4 h-4 mr-2"/>Email
                        </label>
                        <input 
                            type="email" 
                            value={user.email} 
                            readOnly 
                            className="w-full rounded-lg py-2 px-3 border cursor-not-allowed transition-colors
                                bg-slate-100 border-slate-200 text-slate-500
                                dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400" 
                        />
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t transition-colors space-y-4 border-slate-200 dark:border-slate-700">
                     <h3 className="text-lg font-semibold transition-colors text-slate-800 dark:text-slate-200">
                        Configuración
                     </h3>
                     <Toggle label="Notificaciones por Email" enabled={notifications} onChange={setNotifications} />
                     <Toggle label="Tema Oscuro" enabled={darkMode} onChange={setDarkMode} />
                </div>

                <div className="mt-6 pt-4 border-t transition-colors border-slate-200 dark:border-slate-700">
                    <button onClick={onOpenLegalModal} className="w-full text-center text-sm transition-colors text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">
                        Ver Marco Legal y Políticas de Privacidad
                    </button>
                </div>
            </div>

            <footer className="p-4 rounded-b-2xl border-t flex justify-end space-x-3 transition-colors
                bg-slate-50 border-slate-200
                dark:bg-slate-800/50 dark:border-slate-700"
            >
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 rounded-lg font-semibold transition-colors border shadow-sm
                        bg-white text-slate-700 border-slate-300 hover:bg-slate-50
                        dark:bg-slate-700 dark:text-slate-200 dark:border-transparent dark:hover:bg-slate-600"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleSave} 
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition flex items-center space-x-2 shadow-sm"
                >
                    <Save className="w-4 h-4"/><span>Guardar Cambios</span>
                </button>
            </footer>
        </div>
    </div>
  );
};

export default ProfileModal;