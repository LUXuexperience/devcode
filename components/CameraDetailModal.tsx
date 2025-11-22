import React from 'react';
import { Camera, CameraStatus } from '../types';
import LiveCameraView from './LiveCameraView';
import MiniMap from './MiniMap';
import { X, Video, MapPin, Cpu, CheckCircle, AlertTriangle, XCircle, Calendar, History } from 'lucide-react';

interface CameraDetailModalProps {
  camera: Camera;
  onClose: () => void;
}

// 1. StatusDisplay: Ajuste de colores para legibilidad en ambos fondos
const StatusDisplay: React.FC<{ status: CameraStatus }> = ({ status }) => {
    const statusMap = {
        [CameraStatus.Active]: { 
            text: 'Activa', 
            color: 'text-emerald-600 dark:text-emerald-400', 
            icon: <CheckCircle className="w-4 h-4 mr-2" /> 
        },
        [CameraStatus.Alert]: { 
            text: 'Alerta', 
            color: 'text-red-600 dark:text-red-400', 
            icon: <AlertTriangle className="w-4 h-4 mr-2" /> 
        },
        [CameraStatus.Inactive]: { 
            text: 'Inactiva', 
            color: 'text-slate-500 dark:text-slate-500', 
            icon: <XCircle className="w-4 h-4 mr-2" /> 
        },
    };
    const { text, color, icon } = statusMap[status];
    return <div className={`flex items-center text-sm font-semibold ${color}`}>{icon}{text}</div>;
};

const CameraDetailModal: React.FC<CameraDetailModalProps> = ({ camera, onClose }) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "justo ahora";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
  };

  // Clases comunes para iconos de sección
  const iconSectionClass = "w-4 h-4 mr-3 flex-shrink-0 text-emerald-600 dark:text-emerald-400";
  
  // Clases comunes para contenedores internos (Historial y Detalles)
  const innerBoxClass = `
    p-4 rounded-lg border transition-colors
    /* Modo Claro */
    bg-slate-50 border-slate-200
    /* Modo Oscuro */
    dark:bg-slate-900/50 dark:border-slate-700
  `;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
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
          <div>
            <h2 className="text-xl font-bold transition-colors text-slate-800 dark:text-white">
                {camera.name}
            </h2>
            <p className="text-sm font-mono transition-colors text-slate-500 dark:text-slate-400">
                {camera.id}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
          </button>
        </header>

        {/* --- BODY (GRID) --- */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMNA IZQUIERDA: Video y Historial */}
            <div className="space-y-4">
                 <LiveCameraView />
                 
                 <div className={innerBoxClass}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center transition-colors text-slate-800 dark:text-white">
                        <History className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400"/>
                        Historial de Estados
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {camera.statusHistory.length === 0 && <p className="text-xs text-slate-500">No hay historial de estados.</p>}
                        {camera.statusHistory.slice().reverse().map((hist, i) => (
                            <div key={i} className="text-xs flex justify-between items-center p-2 rounded transition-colors
                                /* Items de historial */
                                bg-white border border-slate-100
                                dark:bg-slate-800 dark:border-transparent"
                            >
                                <StatusDisplay status={hist.status} />
                                <p className="text-slate-400 dark:text-slate-500">{timeAgo(new Date(hist.timestamp))}</p>
                            </div>
                         ))}
                     </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: Mapa y Detalles */}
            <div className="space-y-4">
                 <MiniMap lat={camera.lat} lng={camera.lng} />
                 
                 <div className={innerBoxClass}>
                    <h3 className="text-lg font-semibold mb-3 transition-colors text-slate-800 dark:text-white">
                        Detalles de la Cámara
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {/* Estado */}
                        <div className="flex items-center">
                            <Video className={iconSectionClass}/>
                            <div>
                                <strong className="block transition-colors text-slate-500 dark:text-slate-400">Estado Actual</strong>
                                <StatusDisplay status={camera.status} />
                            </div>
                        </div>
                        
                        {/* Modelo */}
                        <div className="flex items-center">
                            <Cpu className={iconSectionClass}/>
                            <div>
                                <strong className="block transition-colors text-slate-500 dark:text-slate-400">Modelo</strong>
                                <span className="transition-colors text-slate-700 dark:text-slate-200">
                                    {camera.model || 'No especificado'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Coordenadas */}
                        <div className="flex items-center col-span-full">
                            <MapPin className={iconSectionClass}/>
                            <div>
                                <strong className="block transition-colors text-slate-500 dark:text-slate-400">Coordenadas</strong>
                                <span className="font-mono transition-colors text-slate-700 dark:text-slate-200">
                                    {`${camera.lat.toFixed(6)}, ${camera.lng.toFixed(6)}`}
                                </span>
                            </div>
                        </div>
                        
                        {/* Fecha */}
                        <div className="flex items-center col-span-full">
                            <Calendar className={iconSectionClass}/>
                            <div>
                                <strong className="block transition-colors text-slate-500 dark:text-slate-400">Fecha de Activación</strong>
                                <span className="transition-colors text-slate-700 dark:text-slate-200">
                                    {new Date(camera.activationDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetailModal;