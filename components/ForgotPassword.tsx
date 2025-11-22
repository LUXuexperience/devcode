import React, { useState } from 'react';
import { Mail, Send, ArrowLeft, Mountain, CheckCircle, Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hook de tema
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    setIsLoading(true);
    
    // Simulación de envío
    setTimeout(() => {
        setSubmitted(true);
        setIsLoading(false);
    }, 1000);
  };

  return (
    /* Contenedor principal con transición de fondo light/dark */
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 dark:bg-slate-900 light:bg-slate-50 font-sans transition-colors duration-300">
      
      {/* --- 1. FONDO AMBIENTADO --- */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop" 
            alt="Fondo Forestal" 
            /* Opacidad dinámica según el tema */
            className="w-full h-full object-cover dark:opacity-60 light:opacity-30 transition-opacity duration-300"
        />
        {/* Gradiente dinámico según el tema */}
        <div className="absolute inset-0 bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/80 light:from-white/70 light:via-slate-50/80 light:to-emerald-50/70 mix-blend-multiply transition-all duration-300" />
      </div>

      {/* --- BOTÓN TOGGLE TEMA --- */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 p-3 rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 text-emerald-400 hover:scale-110 transition-all duration-300 shadow-lg hover:bg-slate-700/70"
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* --- 2. TARJETA DE RECUPERACIÓN --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        
        {/* Resplandores de fondo */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Tarjeta estilo "Glass Oscuro" (Fijo, igual que en Login) */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
            
            {/* Encabezado */}
            <div className="p-8 pb-0 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/50 mb-6 border border-emerald-400/30">
                    <Mountain className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Recuperar Acceso</h1>
                <p className="text-slate-300 text-sm mt-2 font-light">
                    {!submitted 
                        ? "Ingresa tu correo institucional para recibir instrucciones." 
                        : "Correo enviado exitosamente."
                    }
                </p>
            </div>

            {/* Contenido */}
            <div className="p-8">
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="usuario@durango.gob.mx"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-600/50 rounded-xl leading-5 bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition duration-200 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                                <p className="text-red-400 text-xs font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span className="mr-2">Enviar Enlace</span>
                                    <Send className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center">
                            <div className="bg-emerald-500/20 p-3 rounded-full mb-3">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">¡Enlace Enviado!</h3>
                            <p className="text-slate-400 text-sm mt-2">
                                Hemos enviado las instrucciones de recuperación a: <br/>
                                <span className="text-emerald-300 font-medium">{email}</span>
                            </p>
                        </div>
                        <p className="text-xs text-slate-500">
                            Si no lo encuentras, revisa tu carpeta de Spam.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer de la tarjeta (Volver) */}
            <div className="px-8 py-4 bg-slate-950/30 border-t border-slate-700/50 text-center">
                <button 
                    onClick={onBackToLogin}
                    className="flex items-center justify-center w-full text-sm text-slate-400 hover:text-emerald-400 transition-colors gap-2 font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver al Inicio de Sesión</span>
                </button>
            </div>
        </div>
        
        {/* Copyright - Texto adaptable light/dark */}
        <p className="mt-6 text-center text-xs dark:text-slate-500 light:text-slate-700 font-medium transition-colors duration-300">
            &copy; {new Date().getFullYear()} Gobierno del Estado de Durango. <br/>Secretaría de Recursos Naturales y Medio Ambiente.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;