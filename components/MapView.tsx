import React, { useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, Circle, Tooltip, Polygon, useMap } from 'react-leaflet';
import { Camera, Alert, PredictedPerimeter } from '../types';
import CameraMarker from './CameraMarker';

interface MapFlyerProps {
  flyTo: { center: [number, number]; zoom: number } | null | undefined;
}

const MapFlyer: React.FC<MapFlyerProps> = ({ flyTo }) => {
    const map = useMap();
    useEffect(() => {
        if (flyTo) {
            map.flyTo(flyTo.center, flyTo.zoom);
        }
    }, [flyTo, map]);
    return null;
};

interface MapViewProps {
  cameras: Camera[];
  alerts: Alert[];
  predictedPerimeter?: PredictedPerimeter | null;
  flyTo?: { center: [number, number]; zoom: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ cameras, alerts, predictedPerimeter, flyTo }) => {
  const durangoPosition: [number, number] = [24.5, -105.0];

  const heatZoneOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.3,
    weight: 1,
  };

  const perimeterOptions = {
      color: 'orange',
      fillColor: 'orange',
      fillOpacity: 0.2,
      weight: 2,
  };

  return (
    <div className="h-full w-full bg-slate-700">
      <MapContainer center={durangoPosition} zoom={8} scrollWheelZoom={true} className="h-full w-full">
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Relieve">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
           <LayersControl.BaseLayer name="Calles">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {cameras.map(camera => (
          <CameraMarker key={camera.id} camera={camera} />
        ))}

        {alerts.map(alert => (
           <Circle key={`heat-${alert.id}`} center={[alert.lat, alert.lng]} pathOptions={heatZoneOptions} radius={5000}>
               <Tooltip>Fuego Detectado en {alert.cameraName}</Tooltip>
           </Circle>
        ))}

        {predictedPerimeter && (
            <Polygon pathOptions={perimeterOptions} positions={predictedPerimeter}>
                <Tooltip sticky>Perímetro de Fuego Predicho</Tooltip>
            </Polygon>
        )}
        <MapFlyer flyTo={flyTo} />
      </MapContainer>
    </div>
  );
};

export default MapView;