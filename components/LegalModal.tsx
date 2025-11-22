import React from 'react';
import { X, Shield } from 'lucide-react';
import LegalFramework from './LegalFramework';

interface LegalModalProps {
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1001] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-down border transition-colors duration-300
          /* CONTENEDOR PRINCIPAL */
          bg-white border-slate-200
          dark:bg-slate-800 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between p-4 border-b flex-shrink-0 transition-colors border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold flex items-center transition-colors text-slate-800 dark:text-white">
            <Shield className="w-6 h-6 mr-3 text-emerald-600 dark:text-emerald-400" />
            Marco Legal y Políticas de Privacidad
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
          </button>
        </header>

        {/* --- BODY --- */}
        <div className="p-6 flex-1 overflow-y-auto transition-colors text-slate-600 dark:text-slate-300">
            {/* Nota: Asegúrate de que LegalFramework herede colores o use 'currentColor' para adaptarse bien */}
            <LegalFramework />
        </div>

        {/* --- FOOTER --- */}
        <footer className="p-4 border-t flex justify-end rounded-b-2xl transition-colors
            /* Footer background */
            bg-slate-50 border-slate-200
            dark:bg-slate-800/50 dark:border-slate-700"
        >
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-sm"
            >
              Cerrar
            </button>
        </footer>
      </div>
    </div>
  );
};

export default LegalModal;