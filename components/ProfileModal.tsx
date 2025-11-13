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
    case UserRole.Admin: return 'bg-red-500/20 text-red-300 border-red-500/30';
    case UserRole.Operator: return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case UserRole.Viewer: return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-slate-300">{label}</span>
        <button onClick={() => onChange(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-600' : 'bg-slate-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onOpenLegalModal }) => {
    const [name, setName] = useState(user.name);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    const handleSave = () => {
        // Here you would typically dispatch an action to update user data
        console.log("Saved:", { name, notifications, darkMode });
        onClose();
    };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in" 
        onClick={onClose}
    >
        <div 
            className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 animate-fade-in-down"
            onClick={e => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                    <X className="w-6 h-6 text-slate-300" />
                </button>
            </header>

            <div className="p-6">
                <div className="flex flex-col items-center space-y-4">
                    <img src={user.avatarUrl} alt="User Avatar" className="h-24 w-24 rounded-full border-4 border-slate-600"/>
                    <div className="text-center">
                        <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getRoleClass(user.role)}`}>
                            {user.role}
                        </div>
                    </div>
                </div>

                <form className="mt-8 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><UserIcon className="w-4 h-4 mr-2"/>Nombre</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><Mail className="w-4 h-4 mr-2"/>Email</label>
                        <input type="email" value={user.email} readOnly className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-400 cursor-not-allowed" />
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-700 space-y-4">
                     <h3 className="text-lg font-semibold text-slate-200">Configuración</h3>
                     <Toggle label="Notificaciones por Email" enabled={notifications} onChange={setNotifications} />
                     <Toggle label="Tema Oscuro" enabled={darkMode} onChange={setDarkMode} />
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                    <button onClick={onOpenLegalModal} className="w-full text-center text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                        Ver Marco Legal y Políticas de Privacidad
                    </button>
                </div>
            </div>

            <footer className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition flex items-center space-x-2"><Save className="w-4 h-4"/><span>Guardar Cambios</span></button>
            </footer>
        </div>
    </div>
  );
};

export default ProfileModal;