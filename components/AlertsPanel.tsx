import React from 'react';
import { Alert, Stats, User } from '../types';
import AlertCard from './AlertCard';
import StatCard from './StatCard';
import { BarChart2, Siren, ShieldOff, Video } from 'lucide-react';

interface AlertsPanelProps {
  user: User;
  alerts: Alert[];
  stats: Stats;
  onViewDetails: (alert: Alert) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ user, alerts, stats, onViewDetails }) => {
  return (
    <div className="h-full flex flex-col border-l transition-colors duration-300
        /* MODO CLARO: Fondo blanco general */
        bg-white border-slate-200 
        /* MODO OSCURO: Fondo oscuro */
        dark:bg-slate-900 dark:border-slate-700/50"
    >
      
      {/* Header del Panel */}
      <div className="p-4 border-b flex-shrink-0 transition-colors duration-300
        border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center transition-colors duration-300
                text-slate-800 dark:text-slate-100"
            >
                <Siren className="w-6 h-6 mr-2 text-red-500" />
                Alertas Activas
            </h2>
            <span className="bg-red-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {alerts.length}
            </span>
        </div>
      </div>
      
      {/* Lista de Alertas (Scroll) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-300
        /* Fondo gris suave en la lista para diferenciarlo */
        bg-slate-50 dark:bg-slate-900/50"
      >
        {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full transition-colors duration-300
                text-slate-500 dark:text-slate-400"
            >
                <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-semibold">Todo tranquilo</p>
                <p className="text-sm">No hay alertas activas en este momento.</p>
            </div>
        ) : (
            alerts.map(alert => (
                <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onViewDetails={onViewDetails} 
                    user={user} 
                />
            ))
        )}
      </div>

      {/* Footer de Estadísticas */}
      <div className="p-4 border-t flex-shrink-0 transition-colors duration-300
        /* AQUÍ EL TRUCO: Fondo gris suave (slate-50) para que las tarjetas blancas resalten */
        bg-slate-50 border-slate-200 
        dark:bg-slate-900 dark:border-slate-700"
      >
        <h3 className="text-lg font-semibold mb-3 transition-colors duration-300
            text-slate-700 dark:text-slate-300"
        >
            Estadísticas Rápidas
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
            {/* CÁMARAS */}
            <StatCard 
                icon={<Video className="w-6 h-6 text-emerald-600 dark:text-emerald-400"/>} 
                value={stats.activeCameras} 
                label="Cámaras"
            />
            
            {/* ALERTAS */}
             <StatCard 
                icon={<Siren className="w-6 h-6 text-orange-500 dark:text-orange-400"/>} 
                value={stats.alertsToday} 
                label="Alertas Hoy"
            />
            
             <StatCard 
                icon={<ShieldOff className="w-6 h-6 text-sky-600 dark:text-sky-400"/>} 
                value={stats.falsePositives} 
                label="Falsas"
            />
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;