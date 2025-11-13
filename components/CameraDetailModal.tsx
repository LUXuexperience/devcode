import React from 'react';
import { Camera, CameraStatus } from '../types';
import LiveCameraView from './LiveCameraView';
import MiniMap from './MiniMap';
import { X, Video, MapPin, Cpu, CheckCircle, AlertTriangle, XCircle, Calendar, History } from 'lucide-react';

interface CameraDetailModalProps {
  camera: Camera;
  onClose: () => void;
}

const StatusDisplay: React.FC<{ status: CameraStatus }> = ({ status }) => {
    const statusMap = {
        [CameraStatus.Active]: { text: 'Activa', color: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4 mr-2" /> },
        [CameraStatus.Alert]: { text: 'Alerta', color: 'text-red-400', icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
        [CameraStatus.Inactive]: { text: 'Inactiva', color: 'text-slate-500', icon: <XCircle className="w-4 h-4 mr-2" /> },
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

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-down" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{camera.name}</h2>
            <p className="text-sm text-slate-400 font-mono">{camera.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <LiveCameraView />
                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><History className="w-5 h-5 mr-2 text-emerald-400"/>Historial de Estados</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {camera.statusHistory.length === 0 && <p className="text-xs text-slate-500">No hay historial de estados.</p>}
                        {camera.statusHistory.slice().reverse().map((hist, i) => (
                            <div key={i} className="text-xs flex justify-between items-center bg-slate-800 p-2 rounded">
                                <StatusDisplay status={hist.status} />
                                <p className="text-slate-500">{timeAgo(new Date(hist.timestamp))}</p>
                            </div>
                         ))}
                     </div>
                </div>
            </div>
            <div className="space-y-4">
                 <MiniMap lat={camera.lat} lng={camera.lng} />
                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Detalles de la Cámara</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                            <Video className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0"/>
                            <div>
                                <strong className="text-slate-400 block">Estado Actual</strong>
                                <StatusDisplay status={camera.status} />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Cpu className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0"/>
                            <div>
                            <strong className="text-slate-400 block">Modelo</strong>
                            <span className="text-slate-200">{camera.model || 'No especificado'}</span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-full">
                            <MapPin className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0"/>
                            <div>
                                <strong className="text-slate-400 block">Coordenadas</strong>
                                <span className="text-slate-200 font-mono">{`${camera.lat.toFixed(6)}, ${camera.lng.toFixed(6)}`}</span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-full">
                            <Calendar className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0"/>
                            <div>
                                <strong className="text-slate-400 block">Fecha de Activación</strong>
                                <span className="text-slate-200">{new Date(camera.activationDate).toLocaleDateString()}</span>
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