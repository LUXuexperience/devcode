import React, { useState } from 'react';
import { User, Alert, PredictedPerimeter, Camera, Stats } from '../types';
import Header from './Header';
import MapView from './MapView';
import AlertsPanel from './AlertsPanel';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToCameraManagement: () => void;
  onNavigateToReports: () => void;
  onNavigateToUserManagement: () => void;
  onOpenProfile: () => void;
  onOpenAuditLog: () => void;
  cameras: Camera[];
  alerts: Alert[];
  stats: Stats;
  predictedPerimeter: PredictedPerimeter | null;
  onViewDetails: (alert: Alert) => void;
  mapFlyTo: { center: [number, number]; zoom: number } | null;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
    user, onLogout, onOpenProfile,
    cameras, alerts, stats, predictedPerimeter, onViewDetails,
    mapFlyTo,
    ...navProps 
  } = props;
  
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const alertCount = alerts.filter(a => new Date(a.timestamp).getTime() > Date.now() - 60000).length;
  const recentAlertsForNotification = alerts.slice(0, 5);

  return (
    <div className="relative flex flex-col h-screen w-screen bg-slate-900 overflow-hidden">
      <Header 
        user={user} 
        onLogout={onLogout} 
        alertCount={alertCount}
        recentAlerts={recentAlertsForNotification}
        onNotificationClick={onViewDetails}
        onOpenProfile={onOpenProfile}
        {...navProps}
      />
      <div className="flex flex-1 relative overflow-hidden">
        <div className="relative flex-1 h-full">
            <MapView cameras={cameras} alerts={alerts} predictedPerimeter={predictedPerimeter} flyTo={mapFlyTo} />
        </div>
        
        <div className={`w-full md:w-[30%] h-full absolute md:static top-0 right-0 transition-transform duration-300 ease-in-out bg-slate-900/80 backdrop-blur-sm md:bg-slate-900
          ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <AlertsPanel user={user} alerts={alerts} stats={stats} onViewDetails={onViewDetails}/>
        </div>

         <button 
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="absolute z-20 top-4 right-4 md:hidden bg-slate-800/80 p-2 rounded-full text-white hover:bg-slate-700 transition"
          aria-label="Toggle alerts panel"
        >
          {isPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;