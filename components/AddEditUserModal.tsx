import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { X, Save, Edit, Plus, User as UserIcon, Mail, Shield } from 'lucide-react';

interface AddEditUserModalProps {
  mode: 'add' | 'edit';
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

const emptyUser: Omit<User, 'avatarUrl'> = {
  name: '',
  email: '',
  role: UserRole.Viewer,
  status: UserStatus.Active,
};

const AddEditUserModal: React.FC<AddEditUserModalProps> = ({ mode, user, onSave, onClose }) => {
  const [formData, setFormData] = useState(mode === 'edit' && user ? user : emptyUser);

  useEffect(() => {
    setFormData(mode === 'edit' && user ? user : emptyUser);
  }, [mode, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, avatarUrl: user?.avatarUrl || '' });
  };

  const title = mode === 'add' ? 'Añadir Nuevo Usuario' : 'Editar Usuario';
  const Icon = mode === 'add' ? Plus : Edit;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Icon className="w-6 h-6 mr-3 text-emerald-400" />
            {title}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><UserIcon className="w-4 h-4 mr-2"/>Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><Mail className="w-4 h-4 mr-2"/>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={mode === 'edit'} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-900 disabled:cursor-not-allowed" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><Shield className="w-4 h-4 mr-2"/>Rol</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <footer className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition flex items-center space-x-2"><Save className="w-4 h-4"/><span>Guardar Cambios</span></button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddEditUserModal;
