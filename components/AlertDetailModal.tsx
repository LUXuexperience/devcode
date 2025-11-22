import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, User, UserRole, AlertConfirmationStatus, AlertNote } from '../types';
import MiniMap from './MiniMap';
import LiveCameraView from './LiveCameraView';
import { X, Check, ShieldAlert, Phone, MessageSquare, Clock, MapPin, Thermometer, Camera, History, Wind, Plus, Minus } from 'lucide-react';

interface AlertDetailModalProps {
  alert: Alert;
  allAlerts: Alert[];
  user: User;
  onClose: () => void;
  onUpdateAlert: (alert: Alert) => void;
  onPredictPerimeter: (alert: Alert) => void;
}

// Componente para el medidor de confianza (ADAPTADO A MODO CLARO)
const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
  const percentage = Math.round(value * 100);
  const color = percentage > 85 ? 'bg-red-500' : percentage > 60 ? 'bg-orange-500' : 'bg-yellow-500';
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700">Nivel de Confianza</span> {/* Text: De slate-300 a slate-700 */}
        <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-slate-300 rounded-full h-4"> {/* Fondo de barra: De slate-700 a slate-300 */}
        <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

// Componente para la insignia de estado (ADAPTADO A MODO CLARO)
const StatusBadge: React.FC<{ status: AlertConfirmationStatus }> = ({ status }) => {
    // Se mantiene la misma lógica de colores de acento, solo se ajusta el fondo más sutil para claro
    const statusMap = {
      [AlertConfirmationStatus.Pending]: { text: 'Pendiente Confirmación', color: 'bg-orange-100 text-orange-600', icon: <ShieldAlert className="w-4 h-4 mr-2" /> }, // Ajustado
      [AlertConfirmationStatus.Confirmed]: { text: 'Confirmada', color: 'bg-red-100 text-red-600', icon: <Check className="w-4 h-4 mr-2" /> }, // Ajustado
      [AlertConfirmationStatus.FalseAlarm]: { text: 'Falsa Alarma', color: 'bg-emerald-100 text-emerald-600', icon: <Check className="w-4 h-4 mr-2" /> }, // Ajustado
    };
    const { text, color, icon } = statusMap[status];
    return <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${color}`}>{icon}{text}</div>;
};

// Nuevo componente para el visor de imagen con zoom (ADAPTADO A MODO CLARO)
const ImageZoomViewer: React.FC<{ src: string, alt: string }> = ({ src, alt }) => {
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleZoom = (factor: number) => {
        const newScale = Math.min(Math.max(1, scale * factor), 4); // Limit zoom between 1x and 4x
        setScale(newScale);
        if (newScale === 1) {
            setOffsetX(0);
            setOffsetY(0);
        }
    };

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({ x: e.clientX, y: e.clientY });
        }
    }, [scale]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;

        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        
        // Calculate boundaries to prevent dragging the image out of the viewer
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const imgWidth = containerWidth * scale;
            const imgHeight = containerHeight * scale;

            const maxOffsetX = (imgWidth - containerWidth) / 2;
            const maxOffsetY = (imgHeight - containerHeight) / 2;

            const newOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, offsetX + dx));
            const newOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, offsetY + dy));
            
            setOffsetX(newOffsetX);
            setOffsetY(newOffsetY);
            setStartPos({ x: e.clientX, y: e.clientY });
        }
    }, [isDragging, startPos, offsetX, offsetY, scale]);

    useEffect(() => {
        // Reset scale and position when image changes
        setScale(1);
        setOffsetX(0);
        setOffsetY(0);
    }, [src]);


    return (
        <div 
            ref={containerRef}
            className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-300 relative cursor-move" 
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp} // Stop dragging if mouse leaves the area
            onMouseMove={onMouseMove}
        >
            <img 
                src={src} 
                alt={alt} 
                className="w-full h-full object-contain transition-transform duration-100 ease-out"
                style={{
                    transform: `scale(${scale}) translate(${offsetX / scale}px, ${offsetY / scale}px)`,
                    cursor: scale > 1 ? 'grab' : 'default',
                }}
            />
            
            {/* Controles de Zoom */}
            <div className="absolute top-4 right-4 z-10 bg-white/70 rounded-lg p-1 flex space-x-1 shadow-lg"> {/* BG y sombra ajustados */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handleZoom(1.2); }}
                    className="p-1 rounded-full text-slate-800 hover:bg-slate-300 disabled:opacity-50" // Color de texto y hover ajustados
                    disabled={scale >= 4}
                >
                    <Plus className="w-5 h-5" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleZoom(1 / 1.2); }}
                    className="p-1 rounded-full text-slate-800 hover:bg-slate-300 disabled:opacity-50" // Color de texto y hover ajustados
                    disabled={scale === 1}
                >
                    <Minus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Nuevo componente para la línea de tiempo (ADAPTADO A MODO CLARO)


const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, allAlerts, user, onClose, onUpdateAlert, onPredictPerimeter }) => {
  const [noteText, setNoteText] = useState('');

  // Las imágenes no deben depender de useMemo ya que la prop `alert` ya es el array de dependencia
  const images = [
      { id: 'original', src: alert.image, label: 'Original' },
      { id: 'box', src: alert.imageWithBox, label: 'Detección' },
      { id: 'zoom', src: alert.imageZoom, label: 'Zoom' },
      { id: 'prev', src: alert.imagePrevFrame, label: 'Frame Anterior' },
  ];
  
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'live'>('details');

  // Asegúrate de que selectedImage se inicialice correctamente si la alerta cambia desde el exterior
  useEffect(() => {
    setSelectedImage(images[0]);
  }, [alert.id]); // Cuando la ID de la alerta cambie, actualiza la imagen seleccionada

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

  const cameraHistory = useMemo(() => {
    return allAlerts.filter(a => a.cameraId === alert.cameraId && a.id !== alert.id)
      .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [allAlerts, alert.cameraId, alert.id]);
  
  const canTakeAction = user.role === UserRole.Admin || user.role === UserRole.Operator;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in" // Opacidad de fondo ajustada
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-300 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-fade-in-down" // Fondo blanco y borde claro
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0"> {/* Borde más claro */}
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalle de Alerta #{alert.id.split('-')[1]}</h2> {/* Texto oscuro */}
            <p className="text-sm text-slate-500">{new Date(alert.timestamp).toLocaleString()}</p> {/* Texto gris */}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors"> {/* Hover claro */}
            <X className="w-6 h-6 text-slate-500" /> {/* Icono oscuro */}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-6 space-y-4">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <StatusBadge status={alert.confirmationStatus} />
               </div>
               <ConfidenceMeter value={alert.confidence} />
               
                <div className="border-b border-slate-200"> {/* Borde más claro */}
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-400'}`}>Análisis de Imagen</button> {/* Texto y hover ajustados */}
                        <button onClick={() => setActiveTab('live')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'live' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-400'}`}>Cámara en Vivo</button> {/* Texto y hover ajustados */}
                    </nav>
                </div>

              {activeTab === 'details' ? (
                <div className="space-y-4 animate-fade-in">
                    {/* Visor de Imagen con Zoom (Nuevo componente) */}
                    <ImageZoomViewer src={selectedImage.src} alt={selectedImage.label} />
                    
                    {/* Selector de Imágenes */}
                    <div className="grid grid-cols-4 gap-2">
                        {images.map(img => (
                            <button key={img.id} onClick={() => setSelectedImage(img)} className={`relative aspect-video rounded-md overflow-hidden border-2 ${selectedImage.id === img.id ? 'border-emerald-500' : 'border-transparent hover:border-slate-300'}`}>
                                <img src={img.src} alt={img.label} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold">{img.label}</div> {/* Opacidad de fondo ajustada */}
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
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-3 text-sm"> {/* Fondo y borde ajustados */}
                    <div className="flex items-center"><Camera className="w-4 h-4 mr-3 text-emerald-600"/><span><strong className="text-slate-800">Cámara:</strong> {alert.cameraName}</span></div> {/* Texto ajustado */}
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-emerald-600"/><span><strong className="text-slate-800">Coordenadas:</strong> {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span></div> {/* Texto ajustado */}
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-emerald-600"/><span><strong className="text-slate-800">Detectado:</strong> {new Date(alert.timestamp).toLocaleTimeString()}</span></div> {/* Texto ajustado */}
                    <div className="flex items-center"><Thermometer className="w-4 h-4 mr-3 text-emerald-600"/><span><strong className="text-slate-800">Condiciones:</strong> {alert.weather}</span></div> {/* Texto ajustado */}
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
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-300"> {/* Fondo y borde ajustados */}
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-emerald-600"/>Notas</h4> {/* Texto y color de icono ajustados */}
                     <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                         {alert.notes.length === 0 && <p className="text-xs text-slate-500">No hay notas.</p>} {/* Texto ajustado */}
                         {alert.notes.map((note, i) => (
                             <div key={i} className="text-xs bg-slate-200 p-2 rounded"> {/* Fondo de nota ajustado */}
                                 <p className="text-slate-800">{note.text}</p> {/* Texto ajustado */}
                                 <p className="text-slate-500 text-right font-semibold mt-1">- {note.author} @ {new Date(note.timestamp).toLocaleTimeString()}</p> {/* Texto ajustado */}
                             </div>
                         ))}
                     </div>
                     {canTakeAction && (
                         <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
                             <input value={noteText} onChange={e => setNoteText(e.target.value)} type="text" placeholder="Añadir nota..." className="flex-1 bg-white border-slate-300 text-slate-800 rounded-md py-1.5 px-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"/> {/* Input ajustado */}
                             <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 rounded-md text-sm">Guardar</button>
                         </form>
                     )}
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailModal;