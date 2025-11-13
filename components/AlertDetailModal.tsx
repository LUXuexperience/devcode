import React, { useState, useEffect, useMemo } from 'react';
import { Alert, User, UserRole, AlertConfirmationStatus, AlertNote } from '../types';
import MiniMap from './MiniMap';
import LiveCameraView from './LiveCameraView';
import { X, Check, ShieldAlert, Phone, MessageSquare, Clock, MapPin, Thermometer, Camera, History, Wind } from 'lucide-react';

interface AlertDetailModalProps {
  alert: Alert;
  allAlerts: Alert[];
  user: User;
  onClose: () => void;
  onUpdateAlert: (alert: Alert) => void;
  onPredictPerimeter: (alert: Alert) => void;
}

const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
  const percentage = Math.round(value * 100);
  const color = percentage > 85 ? 'bg-red-500' : percentage > 60 ? 'bg-orange-500' : 'bg-yellow-500';
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-300">Nivel de Confianza</span>
        <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4">
        <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: AlertConfirmationStatus }> = ({ status }) => {
    const statusMap = {
        [AlertConfirmationStatus.Pending]: { text: 'Pendiente Confirmación', color: 'bg-orange-500/20 text-orange-300', icon: <ShieldAlert className="w-4 h-4 mr-2" /> },
        [AlertConfirmationStatus.Confirmed]: { text: 'Confirmada', color: 'bg-red-500/20 text-red-300', icon: <Check className="w-4 h-4 mr-2" /> },
        [AlertConfirmationStatus.FalseAlarm]: { text: 'Falsa Alarma', color: 'bg-emerald-500/20 text-emerald-300', icon: <Check className="w-4 h-4 mr-2" /> },
    };
    const { text, color, icon } = statusMap[status];
    return <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${color}`}>{icon}{text}</div>;
};

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, allAlerts, user, onClose, onUpdateAlert, onPredictPerimeter }) => {
  const [noteText, setNoteText] = useState('');

  const images = useMemo(() => [
      { id: 'original', src: alert.image, label: 'Original' },
      { id: 'box', src: alert.imageWithBox, label: 'Detección' },
      { id: 'zoom', src: alert.imageZoom, label: 'Zoom' },
      { id: 'prev', src: alert.imagePrevFrame, label: 'Frame Anterior' },
  ], [alert]);
  
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'live'>('details');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleStatusChange = (newStatus: AlertConfirmationStatus) => {
    onUpdateAlert({ ...alert, confirmationStatus: newStatus });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote: AlertNote = {
      author: user.name,
      timestamp: new Date(),
      text: noteText.trim(),
    };
    onUpdateAlert({ ...alert, notes: [...alert.notes, newNote] });
    setNoteText('');
  };

  const cameraHistory = allAlerts.filter(a => a.cameraId === alert.cameraId && a.id !== alert.id)
    .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 3);
  
  const canTakeAction = user.role === UserRole.Admin || user.role === UserRole.Operator;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-fade-in-down" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Detalle de Alerta #{alert.id.split('-')[1]}</h2>
            <p className="text-sm text-slate-400">{new Date(alert.timestamp).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-6 space-y-4">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <StatusBadge status={alert.confirmationStatus} />
               </div>
              <ConfidenceMeter value={alert.confidence} />
              
                <div className="border-b border-slate-700">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Análisis de Imagen</button>
                        <button onClick={() => setActiveTab('live')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'live' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>Cámara en Vivo</button>
                    </nav>
                </div>

              {activeTab === 'details' ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                        <img src={selectedImage.src} alt={selectedImage.label} className="w-full h-full object-contain"/>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {images.map(img => (
                            <button key={img.id} onClick={() => setSelectedImage(img)} className={`relative aspect-video rounded-md overflow-hidden border-2 ${selectedImage.id === img.id ? 'border-emerald-500' : 'border-transparent hover:border-slate-500'}`}>
                                <img src={img.src} alt={img.label} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold">{img.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
              ) : (
                <LiveCameraView />
              )}
            </div>

            <div className="lg:col-span-4 space-y-4">
                <MiniMap lat={alert.lat} lng={alert.lng}/>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3 text-sm">
                    <div className="flex items-center"><Camera className="w-4 h-4 mr-3 text-emerald-400"/><span><strong className="text-slate-300">Cámara:</strong> {alert.cameraName}</span></div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-emerald-400"/><span><strong className="text-slate-300">Coordenadas:</strong> {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span></div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-emerald-400"/><span><strong className="text-slate-300">Detectado:</strong> {new Date(alert.timestamp).toLocaleTimeString()}</span></div>
                    <div className="flex items-center"><Thermometer className="w-4 h-4 mr-3 text-emerald-400"/><span><strong className="text-slate-300">Condiciones:</strong> {alert.weather}</span></div>
                </div>

                {canTakeAction && (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleStatusChange(AlertConfirmationStatus.Confirmed)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition"><Check className="w-5 h-5"/><span>Confirmar</span></button>
                        <button onClick={() => handleStatusChange(AlertConfirmationStatus.FalseAlarm)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition"><X className="w-5 h-5"/><span>Falsa Alarma</span></button>
                        <button className="col-span-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition"><Phone className="w-5 h-5"/><span>Notificar Autoridades</span></button>
                         {alert.confirmationStatus === AlertConfirmationStatus.Confirmed && (
                           <button onClick={() => onPredictPerimeter(alert)} className="col-span-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition"><Wind className="w-5 h-5"/><span>Predecir Perímetro</span></button>
                        )}
                    </div>
                )}
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                     <h4 className="font-bold text-slate-200 mb-3 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-emerald-400"/>Notas</h4>
                     <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                        {alert.notes.length === 0 && <p className="text-xs text-slate-500">No hay notas.</p>}
                        {alert.notes.map((note, i) => (
                            <div key={i} className="text-xs bg-slate-800 p-2 rounded">
                                <p className="text-slate-300">{note.text}</p>
                                <p className="text-slate-500 text-right font-semibold mt-1">- {note.author} @ {new Date(note.timestamp).toLocaleTimeString()}</p>
                            </div>
                        ))}
                     </div>
                     {canTakeAction && (
                        <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
                            <input value={noteText} onChange={e => setNoteText(e.target.value)} type="text" placeholder="Añadir nota..." className="flex-1 bg-slate-700 border-slate-600 rounded-md py-1.5 px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 rounded-md text-sm">Guardar</button>
                        </form>
                     )}
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                     <h4 className="font-bold text-slate-200 mb-3 flex items-center"><History className="w-5 h-5 mr-2 text-emerald-400"/>Historial de la Cámara</h4>
                     <div className="space-y-2">
                        {cameraHistory.length === 0 && <p className="text-xs text-slate-500">No hay alertas previas.</p>}
                         {cameraHistory.map(histAlert => (
                            <div key={histAlert.id} className="text-xs flex justify-between items-center bg-slate-800 p-2 rounded">
                                <p className="text-slate-400">Alerta #{histAlert.id.split('-')[1]}</p>
                                <p className="text-slate-500">{new Date(histAlert.timestamp).toLocaleDateString()}</p>
                            </div>
                         ))}
                     </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailModal;