import React from 'react';
import { Alert, User, UserRole } from '../types';
import { MapPin, Clock, Percent, Eye } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onViewDetails: (alert: Alert) => void;
  user: User;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewDetails, user }) => {
  const confidenceColor = alert.confidence > 0.9 ? 'bg-red-500' : alert.confidence > 0.8 ? 'bg-orange-500' : 'bg-yellow-500';

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return "hace unos segundos";
  };


  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-red-500/50 transition-all duration-300 animate-fade-in">
      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <img src={alert.image} alt={`Alert from ${alert.cameraName}`} className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 p-3">
          <p className="text-sm font-semibold text-slate-200 truncate">{alert.cameraName}</p>
          
          <div className="text-xs text-slate-400 mt-1 space-y-1">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span>{alert.lat.toFixed(2)}, {alert.lng.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span>{timeAgo(alert.timestamp)}</span>
            </div>
             <div className="flex items-center">
              <Percent className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span>Confianza: {(alert.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
            <div className={`${confidenceColor} h-1.5 rounded-full`} style={{ width: `${alert.confidence * 100}%` }}></div>
          </div>

          {user.role === UserRole.Viewer ? (
            <div className="mt-3 w-full text-center bg-slate-700 text-slate-400 text-xs font-bold py-1.5 px-3 rounded-md flex items-center justify-center space-x-1.5 cursor-not-allowed">
              <Eye className="w-3.5 h-3.5" />
              <span>Solo Lectura</span>
            </div>
          ) : (
            <button 
              onClick={() => onViewDetails(alert)}
              className="mt-3 w-full text-center bg-slate-700 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded-md flex items-center justify-center space-x-1.5 transition duration-300">
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Detalle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;