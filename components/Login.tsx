import React, { useState } from 'react';
import { LogIn, Mail, Lock, Mountain } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onForgotPassword: () => void;
  onOpenLegalModal: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword, onOpenLegalModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, ingrese email y contraseña.');
      return;
    }
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingrese un email válido.');
      return;
    }
    setError('');
    onLogin(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-900 p-3 rounded-full mb-4 border-2 border-emerald-700">
            <Mountain className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">SIF Durango</h1>
          <p className="text-slate-400">Sistema de Monitoreo Forestal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-slate-400">
              <input type="checkbox" className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500" />
              <span className="ml-2">Recuérdame</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition duration-300"
            >
              ¿Olvidé contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 transform hover:scale-105"
          >
            <LogIn className="h-5 w-5" />
            <span>Iniciar Sesión</span>
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
                ¿Necesitas acceso? Contacta a tu administrador.
            </p>
            <button onClick={onOpenLegalModal} className="mt-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                Marco Legal y Políticas de Privacidad
            </button>
        </div>

      </div>
    </div>
  );
};

export default Login;