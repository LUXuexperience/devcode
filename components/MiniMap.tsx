import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

interface MiniMapProps {
  lat: number;
  lng: number;
}

const pinIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative">
      <MapPin className="text-red-500 w-10 h-10 drop-shadow-lg" fill="currentColor" strokeWidth={1} stroke="white" />
    </div>
  ),
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const MiniMap: React.FC<MiniMapProps> = ({ lat, lng }) => {
  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border border-slate-700">
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={true} 
        dragging={true}
        zoomControl={true}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
};

export default MiniMap;