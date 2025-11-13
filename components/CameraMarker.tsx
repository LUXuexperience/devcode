
import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Camera, CameraStatus } from '../types';
import { renderToStaticMarkup } from 'react-dom/server';
import { Video, TriangleAlert } from 'lucide-react';

interface CameraMarkerProps {
  camera: Camera;
}

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

const CameraMarker: React.FC<CameraMarkerProps> = ({ camera }) => {
  const icon = createStatusIcon(camera.status);

  return (
    <Marker position={[camera.lat, camera.lng]} icon={icon}>
      <Tooltip>
        <div className="font-bold">{camera.name}</div>
        <div>Estado: <span className="capitalize">{camera.status}</span></div>
      </Tooltip>
    </Marker>
  );
};

export default CameraMarker;
