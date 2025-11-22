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

  const inputClasses = `
    w-full rounded-lg py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors
    /* MODO CLARO */
    bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400
    /* MODO OSCURO */
    dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500
  `;

  const labelClasses = `
    text-sm font-medium flex items-center mb-1 transition-colors
    text-slate-600 dark:text-slate-400
  `;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-lg border animate-fade-in-down transition-colors duration-300
          /* CONTENEDOR */
          bg-white border-slate-200
          dark:bg-slate-800 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between p-4 border-b transition-colors border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold flex items-center transition-colors text-slate-800 dark:text-white">
            <Icon className="w-6 h-6 mr-3 text-emerald-600 dark:text-emerald-400" />
            {title}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            {/* Nombre */}
            <div>
              <label className={labelClasses}>
                <UserIcon className="w-4 h-4 mr-2"/>Nombre
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className={inputClasses} 
              />
            </div>

            {/* Email (Con estado Disabled estilizado) */}
            <div>
              <label className={labelClasses}>
                <Mail className="w-4 h-4 mr-2"/>Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={mode === 'edit'} 
                className={`
                  ${inputClasses}
                  disabled:cursor-not-allowed
                  /* Estilos específicos para disabled */
                  disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300
                  dark:disabled:bg-slate-900 dark:disabled:text-slate-500 dark:disabled:border-slate-800
                `} 
              />
            </div>

            {/* Rol */}
            <div>
              <label className={labelClasses}>
                <Shield className="w-4 h-4 mr-2"/>Rol
              </label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className={inputClasses}
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <footer className="p-4 border-t flex justify-end space-x-3 transition-colors rounded-b-2xl
            /* Footer background */
            bg-slate-50 border-slate-200
            dark:bg-slate-800/50 dark:border-slate-700"
          >
            <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 rounded-lg font-semibold transition border shadow-sm
                /* Botón Cancelar */
                bg-white text-slate-700 border-slate-300 hover:bg-slate-100
                dark:bg-slate-700 dark:text-slate-200 dark:border-transparent dark:hover:bg-slate-600"
            >
                Cancelar
            </button>
            <button 
                type="submit" 
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition flex items-center space-x-2 shadow-sm"
            >
                <Save className="w-4 h-4"/><span>Guardar Cambios</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddEditUserModal;