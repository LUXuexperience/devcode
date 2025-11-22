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
    <div className="
        rounded-lg overflow-hidden border transition-all duration-300 animate-fade-in group
        
        /* ESTILO CLARO */
        bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-red-500/50
        
        /* ESTILO OSCURO */
        dark:bg-slate-800 dark:border-slate-700 dark:hover:border-red-500/50 dark:shadow-none
    ">
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-1 relative overflow-hidden">
          <img 
            src={alert.image} 
            alt={`Alert from ${alert.cameraName}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        
        <div className="col-span-2 p-3 flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">
                {alert.cameraName}
            </p>
            
            <div className="text-xs mt-1.5 space-y-1 text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0 opacity-70" />
                <span>{alert.lat.toFixed(2)}, {alert.lng.toFixed(2)}</span>
                </div>
                <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5 flex-shrink-0 opacity-70" />
                <span>{timeAgo(alert.timestamp)}</span>
                </div>
                <div className="flex items-center">
                <Percent className="w-3 h-3 mr-1.5 flex-shrink-0 opacity-70" />
                <span>Confianza: {(alert.confidence * 100).toFixed(1)}%</span>
                </div>
            </div>
          </div>
          
          <div>
            <div className="w-full rounded-full h-1.5 mt-3 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className={`${confidenceColor} h-1.5 rounded-full`} style={{ width: `${alert.confidence * 100}%` }}></div>
            </div>

            {user.role === UserRole.Viewer ? (
                <div className="mt-3 w-full text-center text-xs font-bold py-1.5 px-3 rounded-md flex items-center justify-center space-x-1.5 cursor-not-allowed
                    bg-slate-100 text-slate-400
                    dark:bg-slate-700 dark:text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>Solo Lectura</span>
                </div>
            ) : (
                <button 
                onClick={() => onViewDetails(alert)}
                className="mt-3 w-full text-center text-xs font-bold py-1.5 px-3 rounded-md flex items-center justify-center space-x-1.5 transition duration-300
                    bg-slate-100 text-slate-700 hover:bg-red-500 hover:text-white
                    dark:bg-slate-700 dark:text-white dark:hover:bg-red-600">
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Detalle</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;