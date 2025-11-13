import React from 'react';
import { X, Shield } from 'lucide-react';
import LegalFramework from './LegalFramework';

interface LegalModalProps {
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1001] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Shield className="w-6 h-6 mr-3 text-emerald-400" />
            Marco Legal y Políticas de Privacidad
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </header>
        <div className="p-6 flex-1 overflow-y-auto text-slate-300">
            <LegalFramework />
        </div>
        <footer className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">Cerrar</button>
        </footer>
      </div>
    </div>
  );
};

export default LegalModal;
