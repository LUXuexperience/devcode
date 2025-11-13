import { useState, useEffect } from 'react';
import { Camera, Alert, Stats, CameraStatus, AlertConfirmationStatus } from '../types';
import { INITIAL_CAMERAS } from '../constants';

const createInitialAlert = () => {
    const cameras = [...INITIAL_CAMERAS];
    const cameraToAlert = cameras.find(c => c.id === 'cam-05' && c.status === CameraStatus.Active);
    if (!cameraToAlert) return { initialAlert: null, initialCameras: cameras };

    const cameraIndex = cameras.indexOf(cameraToAlert);
    cameras[cameraIndex] = { ...cameraToAlert, status: CameraStatus.Alert };

    const now = Date.now();
    const alert: Alert = {
        id: `alert-${now}`,
        cameraId: cameraToAlert.id,
        cameraName: cameraToAlert.name,
        image: `https://picsum.photos/seed/${now}/400/300`,
        imageWithBox: `https://picsum.photos/seed/${now}-box/400/300`,
        imageZoom: `https://picsum.photos/seed/${now}-zoom/400/300`,
        imagePrevFrame: `https://picsum.photos/seed/${now}-prev/400/300`,
        confidence: Math.random() * (0.98 - 0.75) + 0.75,
        timestamp: new Date(),
        lat: cameraToAlert.lat,
        lng: cameraToAlert.lng,
        confirmationStatus: AlertConfirmationStatus.Pending,
        notes: [],
        weather: `Soleado, ${Math.floor(Math.random() * 10 + 25)}°C, Viento ${Math.floor(Math.random() * 15 + 5)}km/h N`
    };
    return { initialAlert: alert, initialCameras: cameras };
}

const { initialAlert, initialCameras } = createInitialAlert();

export const useForestFireData = () => {
  const [cameras, setCameras] = useState<Camera[]>(initialCameras);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlert ? [initialAlert] : []);
  const [stats, setStats] = useState<Stats>({
    activeCameras: initialCameras.filter(c => c.status !== CameraStatus.Inactive).length,
    alertsToday: initialAlert ? 1 : 0,
    falsePositives: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate camera status change
      setCameras(prevCameras => {
        const newCameras = [...prevCameras];
        const randomIndex = Math.floor(Math.random() * newCameras.length);
        const cameraToUpdate = newCameras[randomIndex];

        // 10% chance to create a new alert
        if (Math.random() < 0.1 && cameraToUpdate.status === CameraStatus.Active) {
          const newStatus = CameraStatus.Alert;
          newCameras[randomIndex] = { ...cameraToUpdate, status: newStatus };
          
          const now = Date.now();
          const newAlert: Alert = {
            id: `alert-${now}`,
            cameraId: cameraToUpdate.id,
            cameraName: cameraToUpdate.name,
            image: `https://picsum.photos/seed/${now}/400/300`,
            imageWithBox: `https://picsum.photos/seed/${now}-box/400/300`,
            imageZoom: `https://picsum.photos/seed/${now}-zoom/400/300`,
            imagePrevFrame: `https://picsum.photos/seed/${now}-prev/400/300`,
            confidence: Math.random() * (0.98 - 0.75) + 0.75,
            timestamp: new Date(),
            lat: cameraToUpdate.lat,
            lng: cameraToUpdate.lng,
            confirmationStatus: AlertConfirmationStatus.Pending,
            notes: [],
            weather: `Soleado, ${Math.floor(Math.random() * 10 + 25)}°C, Viento ${Math.floor(Math.random() * 15 + 5)}km/h N`
          };

          setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 19)]);
          setStats(prevStats => ({...prevStats, alertsToday: prevStats.alertsToday + 1}));
        
        } else if (cameraToUpdate.status === CameraStatus.Alert && Math.random() < 0.5) {
            // 50% chance for an alert to go back to active
            newCameras[randomIndex] = { ...cameraToUpdate, status: CameraStatus.Active };
        } else if (Math.random() < 0.05) {
            // 5% chance for any camera to toggle between active/inactive
             const newStatus = cameraToUpdate.status === CameraStatus.Inactive ? CameraStatus.Active : CameraStatus.Inactive;
             newCameras[randomIndex] = { ...cameraToUpdate, status: newStatus };
        }
        
        setStats(prevStats => ({
            ...prevStats,
            activeCameras: newCameras.filter(c => c.status !== CameraStatus.Inactive).length,
        }));
        
        return newCameras;
      });
      
      // Simulate false positive increase
      if(Math.random() < 0.02) {
          setStats(prevStats => ({...prevStats, falsePositives: prevStats.falsePositives + 1}));
      }

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { cameras, alerts, stats };
};