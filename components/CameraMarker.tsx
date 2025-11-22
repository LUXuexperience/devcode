import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Camera, CameraStatus } from '../types';
import { renderToStaticMarkup } from 'react-dom/server';
import { Video, TriangleAlert, MapPin, CheckCircle, Clock } from 'lucide-react';

interface CameraMarkerProps {
  camera: Camera;
}

// 1. Icono del Marcador: Mantenemos colores semánticos (Verde/Rojo) ya que son universales
// pero añadimos una sombra y borde limpio.
const createStatusIcon = (status: CameraStatus) => {
  let bgColor = 'bg-slate-500';
  let iconColor = 'text-slate-100';
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
    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-md`}>
      {pulse && <div className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></div>}
      <div className={`${iconColor} z-10`}>
        {iconComponent}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: '', // Limpiar estilos por defecto de Leaflet
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    tooltipAnchor: [0, -12]
  });
};

// 2. Detalles de Estado: Adaptados para contraste Light/Dark
const getStatusDetails = (status: CameraStatus) => {
    switch (status) {
        case CameraStatus.Active: return { 
            text: 'Activa', 
            color: 'text-emerald-700 dark:text-emerald-400', 
            icon: <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-500" /> 
        };
        case CameraStatus.Alert: return { 
            text: 'Alerta de Incendio', 
            color: 'text-red-700 dark:text-red-400', 
            icon: <TriangleAlert size={14} className="text-red-600 dark:text-red-500" /> 
        };
        case CameraStatus.Inactive: return { 
            text: 'Inactiva', 
            color: 'text-slate-600 dark:text-slate-400', 
            icon: <Clock size={14} className="text-slate-500 dark:text-slate-400" /> 
        };
        default: return { 
            text: 'Desconocido', 
            color: 'text-gray-600 dark:text-gray-400', 
            icon: <Clock size={14} /> 
        };
    }
}

const CameraMarker: React.FC<CameraMarkerProps> = ({ camera }) => {
  const icon = createStatusIcon(camera.status);
  const statusDetails = getStatusDetails(camera.status);

  return (
    <Marker position={[camera.lat, camera.lng]} icon={icon}>
      <Tooltip 
        direction="top" 
        offset={[0, -12]}
        opacity={1}
        className="leaflet-tooltip-custom-reset" // Clase opcional si necesitas resetear estilos globales de Leaflet
      >

        <div className="min-w-[220px] -m-[6px] rounded-lg shadow-xl border overflow-hidden transition-colors duration-300 font-sans
            /* MODO CLARO */
            bg-white border-slate-200
            /* MODO OSCURO */
            dark:bg-slate-800 dark:border-slate-700"
        >
          
          {/* Header: Nombre de la Cámara */}
          <div className="px-3 py-2 border-b font-bold text-sm transition-colors
              bg-slate-50 border-slate-200 text-slate-800
              dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
          >
            {camera.name}
          </div>
          
          <div className="p-3 space-y-2">
              {/* Fila de Estado */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center font-medium transition-colors text-slate-500 dark:text-slate-400">
                    {statusDetails.icon}
                    <span className="ml-1.5">Estado:</span>
                </span>
                <span className={`font-bold ${statusDetails.color} capitalize`}>
                    {statusDetails.text}
                </span>
              </div>

              {/* Fila de Coordenadas */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center font-medium transition-colors text-slate-500 dark:text-slate-400">
                    <MapPin size={14} className="text-slate-400 dark:text-slate-500"/>
                    <span className="ml-1.5">Ubicación:</span>
                </span>
                <span className="font-mono transition-colors text-slate-700 dark:text-slate-300">
                    {camera.lat.toFixed(3)}, {camera.lng.toFixed(3)}
                </span>
              </div>
              
              {/* Última Detección (Si existe) */}
              {camera.lastAlertTime && (
                <div className="flex items-center justify-between text-xs pt-2 border-t transition-colors border-slate-100 dark:border-slate-700">
                    <span className="flex items-center font-medium transition-colors text-slate-500 dark:text-slate-400">
                        <Clock size={14} className="text-slate-400 dark:text-slate-500"/>
                        <span className="ml-1.5">Últ. Evento:</span>
                    </span>
                    <span className="transition-colors text-slate-700 dark:text-slate-300">
                        {new Date(camera.lastAlertTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
              )}
          </div>

        </div>
      </Tooltip>
    </Marker>
  );
};

export default CameraMarker;