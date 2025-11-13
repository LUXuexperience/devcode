import React, { useState } from 'react';
import { User } from '../types';
import Header from './Header';
import { FileText, Calendar, List, Download } from 'lucide-react';

interface ReportsPageProps {
  user: User;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToCameraManagement: () => void;
  onNavigateToReports: () => void;
  onNavigateToUserManagement: () => void;
  onOpenProfile: () => void;
  onOpenAuditLog: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = (props) => {
  const { user, onLogout, onNavigateToDashboard, onOpenProfile } = props;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
        setIsGenerating(false);
        alert('¡Reporte generado exitosamente! (Simulación)');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden">
      <Header 
        user={user} 
        onLogout={onLogout} 
        alertCount={0}
        recentAlerts={[]}
        onNotificationClick={() => {}}
        onOpenProfile={onOpenProfile}
        {...props}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold text-white flex items-center"><FileText className="w-8 h-8 mr-3 text-emerald-400" />Generador de Reportes</h1>
             <button onClick={onNavigateToDashboard} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Volver al Dashboard
             </button>
          </div>
        </div>
        
        <div className="p-6 flex justify-center">
            <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-lg p-8">
                <form onSubmit={handleGenerateReport} className="space-y-6">
                    <h2 className="text-xl font-semibold text-center text-slate-200 mb-4">Configurar Reporte</h2>
                    
                    <div>
                        <label className="text-sm font-medium text-slate-400 flex items-center mb-2"><List className="w-4 h-4 mr-2"/>Tipo de Reporte</label>
                        <select className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option>Reporte de Alertas</option>
                            <option>Reporte de Cámaras</option>
                            <option>Reporte de Actividad del Sistema</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-400 flex items-center mb-2"><Calendar className="w-4 h-4 mr-2"/>Rango de Fechas</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                             <input type="date" className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                        </div>
                    </div>

                     <div>
                        <label className="text-sm font-medium text-slate-400 flex items-center mb-2"><Download className="w-4 h-4 mr-2"/>Formato de Exportación</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 text-slate-300">
                                <input type="radio" name="format" value="pdf" defaultChecked className="h-4 w-4 bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500" />
                                <span>PDF</span>
                            </label>
                            <label className="flex items-center space-x-2 text-slate-300">
                                <input type="radio" name="format" value="csv" className="h-4 w-4 bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500" />
                                <span>CSV</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                         <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 transform hover:scale-105 disabled:scale-100"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generando...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="h-5 w-5" />
                                    <span>Generar Reporte</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;