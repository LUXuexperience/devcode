import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Camera, CameraStatus } from '../types';
import { renderToStaticMarkup } from 'react-dom/server';
import { Video, TriangleAlert, MapPin, CheckCircle, Clock } from 'lucide-react'; // Añadidas más iconos para detalle

interface CameraMarkerProps {
  camera: Camera;
}

// Función para crear el icono con el estado (sin cambios)
const createStatusIcon = (status: CameraStatus) => {
  let bgColor = 'bg-gray-500';
  let iconColor = 'text-gray-100';
  let pulse = false;
  let iconComponent = <Video size={14} />;

  switch (status) {
    case CameraStatus.Active:
      bgColor = 'bg-emerald-500';
      iconColor = 'text-emerald-100';
      break;
    case CameraStatus.Alert:
      bgColor = 'bg-red-500';
      iconColor = 'text-red-100';
      pulse = true;
      iconComponent = <TriangleAlert size={14} />;
      break;
    case CameraStatus.Inactive:
      bgColor = 'bg-slate-600';
      iconColor = 'text-slate-200';
      break;
  }

  const iconMarkup = renderToStaticMarkup(
    <div className={`relative flex items-center justify-center w-6 h-6 rounded-full ${bgColor} border-2 border-white/50 shadow-lg`}>
      {pulse && <div className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></div>}
      <div className={`${iconColor} z-10`}>
        {iconComponent}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: '', // important to clear default styling
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const getStatusDetails = (status: CameraStatus) => {
    switch (status) {
        case CameraStatus.Active: return { text: 'Activa', color: 'text-emerald-400', icon: <CheckCircle size={14} /> };
        case CameraStatus.Alert: return { text: 'Alerta de Incendio', color: 'text-red-400', icon: <TriangleAlert size={14} /> };
        case CameraStatus.Inactive: return { text: 'Inactiva', color: 'text-slate-400', icon: <Clock size={14} /> };
        default: return { text: 'Desconocido', color: 'text-gray-400', icon: <Clock size={14} /> };
    }
}


const CameraMarker: React.FC<CameraMarkerProps> = ({ camera }) => {
  const icon = createStatusIcon(camera.status);
  const statusDetails = getStatusDetails(camera.status);

  return (
    <Marker position={[camera.lat, camera.lng]} icon={icon}>
      <Tooltip 
        direction="top" 
        offset={[0, -10]}
      >
        <div >
          
          {/* Nombre de la Cámara */}
          <div className="font-bold text-sm text-white mb-2 pb-1 border-b border-slate-700">{camera.name}</div>
          
          {/* Fila de Estado */}
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center">
                {statusDetails.icon}
                <span className="ml-1 text-slate-300">Estado:</span>
            </span>
            <span className={`font-semibold ${statusDetails.color} capitalize`}>
                {statusDetails.text}
            </span>
          </div>

          {/* Fila de Coordenadas */}
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center">
                <MapPin size={14} />
                <span className="ml-1">Coordenadas:</span>
            </span>
            <span className="truncate">
                {camera.lat.toFixed(4)}, {camera.lng.toFixed(4)}
            </span>
          </div>
          
          {/* Última Detección (Simulación de datos adicionales) */}
          {camera.lastAlertTime && (
            <div className="flex items-center justify-between text-slate-500 mt-1 pt-1 border-t border-slate-700">
                <span className="flex items-center">
                    <Clock size={14} />
                    <span className="ml-1">Últ. Detección:</span>
                </span>
                <span className="truncate">
                    {new Date(camera.lastAlertTime).toLocaleTimeString()}
                </span>
            </div>
          )}

        </div>
      </Tooltip>
    </Marker>
  );
};

export default CameraMarker;