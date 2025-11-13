import React from 'react';
import { User, Camera, Alert, AlertConfirmationStatus } from '../types';
import Header from './Header';
import { useForestFireData } from '../hooks/useForestFireData';
import { INITIAL_CAMERAS } from '../constants';
import StatCard from './StatCard';
import { LineChartPlaceholder, BarChartPlaceholder, PieChartPlaceholder } from './charts/ChartPlaceholders';
import { Calendar, Camera as CameraIcon, Hash, CheckCircle, XCircle, ShieldAlert, BarChart2 } from 'lucide-react';

interface StatisticsPageProps {
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

const StatisticsPage: React.FC<StatisticsPageProps> = (props) => {
  const { user, onLogout, onNavigateToDashboard, onOpenProfile } = props;
  const { alerts, stats } = useForestFireData();
  const cameras: Camera[] = INITIAL_CAMERAS;

  const confirmedCount = alerts.filter(a => a.confirmationStatus === AlertConfirmationStatus.Confirmed).length;
  const falseAlarmCount = alerts.filter(a => a.confirmationStatus === AlertConfirmationStatus.FalseAlarm).length;
  const pendingCount = alerts.filter(a => a.confirmationStatus === AlertConfirmationStatus.Pending).length;

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
             <h1 className="text-3xl font-bold text-white flex items-center"><BarChart2 className="w-8 h-8 mr-3 text-emerald-400" />Estadísticas Avanzadas</h1>
             <button onClick={onNavigateToDashboard} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Volver al Dashboard
             </button>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1 flex items-center"><Calendar className="w-4 h-4 mr-2"/>Rango de Fechas</label>
                    <input type="text" placeholder="Últimos 30 días" className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
                 <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1 flex items-center"><CameraIcon className="w-4 h-4 mr-2"/>Cámara</label>
                    <select className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>Todas las cámaras</option>
                        {cameras.map(c => <option key={c.id}>{c.name}</option>)}
                    </select>
                </div>
                 <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1 flex items-center"><Hash className="w-4 h-4 mr-2"/>Estado</label>
                    <select className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>Todos</option>
                        <option>Confirmada</option>
                        <option>Falsa Alarma</option>
                        <option>Pendiente</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<BarChart2 className="w-6 h-6 text-orange-400"/>} value={stats.alertsToday} label="Alertas Totales (Hoy)" />
                <StatCard icon={<CheckCircle className="w-6 h-6 text-red-400"/>} value={confirmedCount} label="Alertas Confirmadas" />
                <StatCard icon={<XCircle className="w-6 h-6 text-emerald-400"/>} value={falseAlarmCount} label="Falsas Alarmas" />
                <StatCard icon={<ShieldAlert className="w-6 h-6 text-yellow-400"/>} value={pendingCount} label="Alertas Pendientes" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-semibold text-lg text-white mb-3">Alertas a lo largo del tiempo</h3>
                    <div className="h-64">
                       <LineChartPlaceholder />
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-semibold text-lg text-white mb-3">Alertas por Cámara</h3>
                     <div className="h-64">
                       <BarChartPlaceholder />
                    </div>
                </div>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 lg:col-span-1">
                    <h3 className="font-semibold text-lg text-white mb-3">Estado de Confirmación</h3>
                     <div className="h-64">
                       <PieChartPlaceholder />
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 lg:col-span-2">
                    <h3 className="font-semibold text-lg text-white mb-3">Actividad Reciente</h3>
                    <div className="overflow-y-auto h-64">
                        <ul className="divide-y divide-slate-700">
                            {alerts.slice(0, 10).map(alert => (
                                <li key={alert.id} className="py-3 flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-slate-200">Alerta en {alert.cameraName}</p>
                                        <p className="text-slate-400">ID: {alert.id}</p>
                                    </div>
                                    <span className="text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;