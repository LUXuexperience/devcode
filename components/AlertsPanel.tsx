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
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-700/50">
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center">
                <Siren className="w-6 h-6 mr-2 text-red-500" />
                Alertas Activas
            </h2>
            <span className="bg-red-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">{alerts.length}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <BarChart2 className="w-16 h-16 mb-4" />
                <p className="text-lg font-semibold">Todo tranquilo</p>
                <p>No hay alertas activas en este momento.</p>
            </div>
        ) : (
            alerts.map(alert => <AlertCard key={alert.id} alert={alert} onViewDetails={onViewDetails} user={user} />)
        )}
      </div>

      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Estadísticas Rápidas</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
            <StatCard 
                icon={<Video className="w-6 h-6 text-emerald-400"/>} 
                value={stats.activeCameras} 
                label="Cámaras Activas"
            />
             <StatCard 
                icon={<Siren className="w-6 h-6 text-orange-400"/>} 
                value={stats.alertsToday} 
                label="Alertas Hoy"
            />
             <StatCard 
                icon={<ShieldOff className="w-6 h-6 text-sky-400"/>} 
                value={stats.falsePositives} 
                label="Falsos Positivos"
            />
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;