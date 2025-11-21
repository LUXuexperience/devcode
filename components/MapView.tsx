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

// Componente para asegurar que el mapa se renderice bien al cargar
const MapResizer: React.FC = () => {
    const map = useMap();
    
    useEffect(() => {
        map.invalidateSize();
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    
    return null;
};

interface MapViewProps {
  cameras: Camera[];
  alerts: Alert[];
  predictedPerimeter?: PredictedPerimeter | null;
  flyTo?: { center: [number, number]; zoom: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ cameras, alerts, predictedPerimeter, flyTo }) => {
  // Coordenadas centradas en Durango
  const durangoPosition: [number, number] = [24.0277, -104.6532]; 
  
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
      <MapContainer 
        center={durangoPosition} 
        zoom={9} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <MapResizer />
        
        <LayersControl position="topright">
          
          {/* --- CAPAS BASE --- */}
          
          {/* 1. SATÉLITE (Activada por defecto) */}
          {/* Esta capa muestra FOTOS REALES del terreno */}
          <LayersControl.BaseLayer checked name="Satélite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>

          {/* 2. RELIEVE / TOPOGRÁFICO */}
          {/* Esta capa muestra CURVAS DE NIVEL y alturas (Topografía) */}
          <LayersControl.BaseLayer name="Relieve (Topográfico)">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            />
          </LayersControl.BaseLayer>

          {/* 3. CALLES (Mapa estándar) */}
           <LayersControl.BaseLayer name="Calles / Carreteras">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          {/* 4. MODO OSCURO (Para monitoreo nocturno) */}
          <LayersControl.BaseLayer name="Modo Oscuro">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>


          {/* --- SUPERPOSICIONES (Overlays) --- */}
          
          {/* Etiquetas Híbridas: Nombres de lugares sobre el satélite */}
          <LayersControl.Overlay checked name="Etiquetas y Lugares">
             <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri'
             />
          </LayersControl.Overlay>

        </LayersControl>
        
        {/* Elementos del Mapa */}
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