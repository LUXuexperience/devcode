
import React, { useState } from 'react';
import { Mail, Send, ArrowLeft, Mountain } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-900 p-3 rounded-full mb-4 border-2 border-emerald-700">
            <Mountain className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Recuperar Contraseña</h1>
          <p className="text-slate-400 text-center mt-2">
            {submitted 
              ? `Se ha enviado un enlace de recuperación a ${email}`
              : "Ingresa tu email para recibir un enlace de recuperación."
            }
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 transform hover:scale-105"
            >
              <Send className="h-5 w-5" />
              <span>Enviar Enlace</span>
            </button>
          </form>
        ) : (
             <div className="text-center p-4 bg-emerald-900/50 border border-emerald-700 rounded-lg">
                <p className="text-emerald-300">Por favor, revisa tu bandeja de entrada.</p>
            </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition duration-300 flex items-center justify-center w-full space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
