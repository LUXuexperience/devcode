import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import StatisticsPage from './components/StatisticsPage';
import CameraManagementPage from './components/CameraManagementPage';
import ReportsPage from './components/ReportsPage';
import UserManagementPage from './components/UserManagementPage';
import AlertDetailModal from './components/AlertDetailModal';
import ProfileModal from './components/ProfileModal';
import CameraDetailModal from './components/CameraDetailModal';
import AddEditCameraModal from './components/AddEditCameraModal';
// 1. RENOMBRAR: Cambiamos la importación de Modal a Page
import AuditLogPage from './components/AuditLogPage'; 
import AddEditUserModal from './components/AddEditUserModal';
import LegalModal from './components/LegalModal';

import { User, UserRole, Alert, Camera, PredictedPerimeter, CameraStatus, AuditLogEntry, UserStatus, AuditLogDetail } from './types';
import { useForestFireData } from './hooks/useForestFireData';
import { INITIAL_CAMERAS, INITIAL_USERS } from './constants';


// 2. ACTUALIZAR TIPO: Agregamos 'audit_log' a las vistas posibles
type AppView = 'login' | 'dashboard' | 'forgot_password' | 'statistics' | 'camera_management' | 'reports' | 'user_management' | 'audit_log';

const App: React.FC = () => {
  // --- AUTH & NAVIGATION STATE ---
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  
  // --- DATA STATE ---
  const { cameras: streamingCameras, alerts: rawAlerts, stats } = useForestFireData();
  const [managedAlerts, setManagedAlerts] = useState<Alert[]>([]);
  const [managedCameras, setManagedCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [managedUsers, setManagedUsers] = useState<User[]>(INITIAL_USERS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const initialLogs: AuditLogEntry[] = [];
    INITIAL_CAMERAS.forEach(cam => {
        initialLogs.push({
            entityType: 'Cámara', entityId: cam.id, entityName: cam.name,
            action: 'Cámara Creada', user: 'Sistema', timestamp: new Date(cam.activationDate),
        });
        if (cam.status === CameraStatus.Inactive) {
             const inactiveHistory = cam.statusHistory.find(h => h.status === CameraStatus.Inactive);
             if(inactiveHistory) {
                initialLogs.push({
                    entityType: 'Cámara', entityId: cam.id, entityName: cam.name,
                    action: 'Cámara Desactivada', user: 'Admin', timestamp: inactiveHistory.timestamp,
                });
             }
        }
    });
    return initialLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  // --- MODAL & UI STATE ---
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [predictedPerimeter, setPredictedPerimeter] = useState<PredictedPerimeter | null>(null);
  const [mapFlyTo, setMapFlyTo] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [viewingCamera, setViewingCamera] = useState<Camera | null>(null);
  const [editingCamera, setEditingCamera] = useState<{ mode: 'add' | 'edit'; camera: Camera | null } | null>(null);
  const [editingUser, setEditingUser] = useState<{ mode: 'add' | 'edit'; user: User | null } | null>(null);
  // 3. ELIMINAR el estado del modal, ya no se usa:
  // const [isAuditLogOpen, setAuditLogOpen] = useState(false);
  const [isLegalModalOpen, setLegalModalOpen] = useState(false);


  // --- DATA SYNC EFFECTS ---
  useEffect(() => {
    setManagedAlerts(prevManaged => {
      const prevManagedMap = new Map(prevManaged.map(a => [a.id, a]));
      const rawAlertsMap = new Map(rawAlerts.map(a => [a.id, a]));
      const allIds = new Set([...prevManagedMap.keys(), ...rawAlertsMap.keys()]);
      
      const combined = Array.from(allIds).map(id => {
        const fromManaged = prevManagedMap.get(id);
        const fromRaw = rawAlertsMap.get(id);
        if (fromManaged && fromRaw) {
          return { ...fromRaw, confirmationStatus: fromManaged.confirmationStatus, notes: fromManaged.notes };
        }
        return fromManaged || fromRaw;
      }).filter(Boolean) as Alert[];

      return combined.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20);
    });
  }, [rawAlerts]);

  useEffect(() => {
     setManagedCameras(prevCameras => 
        prevCameras.map(mc => {
            const streamedCam = streamingCameras.find(sc => sc.id === mc.id);
            return streamedCam ? {...mc, status: streamedCam.status } : mc;
        })
     );
  }, [streamingCameras]);


  // --- HANDLERS ---
  const handleLogin = useCallback((email: string) => {
    let role: UserRole = UserRole.Viewer;
    if (email.startsWith('admin')) role = UserRole.Admin;
    else if (email.startsWith('operator')) role = UserRole.Operator;
    
    const genericAvatar = `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="35" r="20" fill="%2394a3b8"/><path d="M15 95 A 40 40 0 0 1 85 95 Z" fill="%2394a3b8"/></svg>`;

    setAuthenticatedUser({
      name: email.split('@')[0].replace(/^\w/, c => c.toUpperCase()),
      email: email,
      role: role,
      avatarUrl: genericAvatar,
      status: UserStatus.Active,
    });
    setView('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setAuthenticatedUser(null);
    setView('login');
  }, []);

  const handleUpdateAlert = (updatedAlert: Alert) => {
    if (!authenticatedUser) return;
    const user = authenticatedUser.name;
    const originalAlert = managedAlerts.find(a => a.id === updatedAlert.id);
    if (!originalAlert) return;

    if (updatedAlert.notes.length > originalAlert.notes.length) {
        const newNote = updatedAlert.notes[updatedAlert.notes.length - 1];
        setAuditLog(prev => [{
            entityType: 'Alerta', entityId: updatedAlert.id, entityName: `Alerta #${updatedAlert.id.split('-')[1]}`,
            action: 'Nota Añadida', user: newNote.author, timestamp: newNote.timestamp, details: newNote.text,
        }, ...prev]);
    }

    if (updatedAlert.confirmationStatus !== originalAlert.confirmationStatus) {
        setAuditLog(prev => [{
            entityType: 'Alerta', entityId: updatedAlert.id, entityName: `Alerta #${updatedAlert.id.split('-')[1]}`,
            action: 'Estado de Alerta Cambiado', user, timestamp: new Date(),
            details: [{ field: 'Estado', before: originalAlert.confirmationStatus, after: updatedAlert.confirmationStatus }],
        }, ...prev]);
    }
    
    setManagedAlerts(currentAlerts =>
      currentAlerts.map(a => (a.id === updatedAlert.id ? updatedAlert : a))
    );
     if (selectedAlert && selectedAlert.id === updatedAlert.id) {
        setSelectedAlert(updatedAlert);
    }
  };

  const handleSaveCamera = (cameraData: Camera) => {
    if (!authenticatedUser) return;
    const user = authenticatedUser.name;

    if (editingCamera?.mode === 'add') {
      const newCamera: Camera = { 
          ...cameraData, 
          id: `cam-${Date.now()}`, 
          activationDate: new Date().toISOString(), 
          statusHistory: [{ status: cameraData.status, timestamp: new Date()}],
      };
      setManagedCameras(prev => [newCamera, ...prev]);
      setAuditLog(prev => [{
          entityType: 'Cámara', entityId: newCamera.id, entityName: newCamera.name,
          action: 'Cámara Creada', user, timestamp: new Date()
      }, ...prev]);

    } else {
       const existingCamera = managedCameras.find(c => c.id === cameraData.id);
       if (!existingCamera) return;

       const details: AuditLogDetail[] = [];
       if (existingCamera.name !== cameraData.name) details.push({ field: 'Nombre', before: existingCamera.name, after: cameraData.name });
       if (existingCamera.lat !== cameraData.lat) details.push({ field: 'Latitud', before: String(existingCamera.lat), after: String(cameraData.lat) });
       if (existingCamera.lng !== cameraData.lng) details.push({ field: 'Longitud', before: String(existingCamera.lng), after: String(cameraData.lng) });
       if (existingCamera.model !== cameraData.model) details.push({ field: 'Modelo', before: existingCamera.model || 'N/A', after: cameraData.model || 'N/A' });
       if (existingCamera.status !== cameraData.status) details.push({ field: 'Estado', before: existingCamera.status, after: cameraData.status });
       
       if (details.length > 0) {
        setAuditLog(prev => [{
            entityType: 'Cámara', entityId: cameraData.id, entityName: cameraData.name,
            action: 'Cámara Editada', user, timestamp: new Date(), details
        }, ...prev]);
       }
       
       const newStatusHistory = existingCamera.status !== cameraData.status 
           ? [...existingCamera.statusHistory, { status: cameraData.status, timestamp: new Date() }]
           : existingCamera.statusHistory;

       const updatedCamera = { ...cameraData, statusHistory: newStatusHistory };
       setManagedCameras(prev => prev.map(c => c.id === cameraData.id ? updatedCamera : c));
    }
    setEditingCamera(null);
  };

  const handleDeactivateCamera = (cameraId: string) => {
    if (!authenticatedUser) return;
    const user = authenticatedUser.name;
    const existingCamera = managedCameras.find(c => c.id === cameraId);
    if (!existingCamera) return;

    setManagedCameras(prev => prev.map(c => {
        if (c.id === cameraId) {
            return {
                ...c,
                status: CameraStatus.Inactive,
                statusHistory: [...c.statusHistory, { status: CameraStatus.Inactive, timestamp: new Date()}],
            };
        }
        return c;
    }));

    setAuditLog(prev => [{
        entityType: 'Cámara', entityId: cameraId, entityName: existingCamera.name,
        action: 'Cámara Desactivada', user, timestamp: new Date(),
        details: [{ field: 'Estado', before: existingCamera.status, after: CameraStatus.Inactive }]
    }, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
      setManagedCameras(cams => cams.map(cam => cam.id === id ? {...cam, isFavorite: !cam.isFavorite} : cam));
  };
  
  const handleSaveUser = (userData: User) => {
    if (editingUser?.mode === 'add') {
      const newUser = { ...userData, avatarUrl: `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="35" r="20" fill="%2394a3b8"/><path d="M15 95 A 40 40 0 0 1 85 95 Z" fill="%2394a3b8"/></svg>` };
      setManagedUsers(prev => [newUser, ...prev]);
    } else {
      setManagedUsers(prev => prev.map(u => u.email === userData.email ? { ...u, ...userData } : u));
    }
    setEditingUser(null);
  };

  const handleDeactivateUser = (userEmail: string) => {
    setManagedUsers(prev => prev.map(u => u.email === userEmail ? { ...u, status: UserStatus.Inactive } : u));
  };


  const handlePredictPerimeter = (alert: Alert) => {
    const { lat, lng } = alert;
    const perimeter: PredictedPerimeter = [
      [lat + 0.05, lng - 0.05], [lat + 0.06, lng],
      [lat + 0.05, lng + 0.05], [lat, lng + 0.06],
      [lat - 0.05, lng + 0.05], [lat - 0.06, lng],
      [lat - 0.05, lng - 0.05], [lat, lng - 0.06],
    ];
    setPredictedPerimeter(perimeter);
    setMapFlyTo({ center: [lat, lng], zoom: 12 });
  };
  
  const handleCloseAlertModal = () => {
    setSelectedAlert(null);
  };

  const handleViewAlertDetails = (alert: Alert) => {
    setPredictedPerimeter(null);
    setMapFlyTo(null);
    setSelectedAlert(alert);
  };

  // --- NAVIGATION & MODAL OPENING ---
  const showForgotPassword = useCallback(() => setView('forgot_password'), []);
  const showLogin = useCallback(() => setView('login'), []);
  // Handler para volver del Audit Log a la vista principal
  const handleNavigateBack = useCallback(() => setView('dashboard'), []);

  const commonNavProps = {
      onNavigateToDashboard: () => setView('dashboard'),
      onNavigateToStatistics: () => setView('statistics'),
      onNavigateToCameraManagement: () => setView('camera_management'),
      onNavigateToReports: () => setView('reports'),
      onNavigateToUserManagement: () => setView('user_management'),
      onOpenProfile: () => setProfileOpen(true),
      // 4. CAMBIAR: Usar setView para ir a la nueva página de Bitácora
      onOpenAuditLog: () => setView('audit_log'),
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (!authenticatedUser) {
        switch(view) {
            case 'login': return <Login onLogin={handleLogin} onForgotPassword={showForgotPassword} onOpenLegalModal={() => setLegalModalOpen(true)} />;
            case 'forgot_password': return <ForgotPassword onBackToLogin={showLogin} />;
            default: return <Login onLogin={handleLogin} onForgotPassword={showForgotPassword} onOpenLegalModal={() => setLegalModalOpen(true)} />;
        }
    }
    
    const commonPageProps = {
      user: authenticatedUser,
      onLogout: handleLogout,
      ...commonNavProps,
    };

    switch(view) {
      case 'dashboard':
        return <Dashboard 
                  {...commonPageProps} 
                  cameras={managedCameras} 
                  alerts={managedAlerts} 
                  stats={stats} 
                  predictedPerimeter={predictedPerimeter}
                  onViewDetails={handleViewAlertDetails}
                  mapFlyTo={mapFlyTo}
                />;
      case 'statistics':
        return <StatisticsPage {...commonPageProps} />;
      case 'camera_management':
        return <CameraManagementPage 
                  {...commonPageProps} 
                  cameras={managedCameras}
                  onViewCamera={setViewingCamera}
                  onEditCamera={(camera) => setEditingCamera({ mode: 'edit', camera })}
                  onAddCamera={() => setEditingCamera({ mode: 'add', camera: null })}
                  onDeactivateCamera={handleDeactivateCamera}
                  onToggleFavorite={handleToggleFavorite}
                />;
      case 'reports':
        return <ReportsPage {...commonPageProps} />;
      case 'user_management':
        return <UserManagementPage
                  {...commonPageProps}
                  users={managedUsers}
                  onAddUser={() => setEditingUser({ mode: 'add', user: null })}
                  onEditUser={(user) => setEditingUser({ mode: 'edit', user })}
                  onDeactivateUser={handleDeactivateUser}
                />;
			case 'audit_log':
				// 5. NUEVA VISTA: Renderizamos la página completa y pasamos los props comunes (incluye `user`)
				return <AuditLogPage {...commonPageProps} logs={auditLog} onNavigateBack={handleNavigateBack} />;
      default:
        return <Dashboard 
                  {...commonPageProps} 
                  cameras={managedCameras} 
                  alerts={managedAlerts} 
                  stats={stats} 
                  predictedPerimeter={predictedPerimeter}
                  onViewDetails={handleViewAlertDetails}
                  mapFlyTo={mapFlyTo}
                />;
    }
  };

  return (
    <main className="h-screen w-screen bg-slate-900 text-slate-100 font-sans">
      {renderContent()}

      {/* MODALS RENDERED AT TOP LEVEL TO AVOID Z-INDEX ISSUES */}
      {authenticatedUser && isProfileOpen && <ProfileModal user={authenticatedUser} onClose={() => setProfileOpen(false)} onOpenLegalModal={() => setLegalModalOpen(true)} />}
      
      {authenticatedUser && selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          allAlerts={managedAlerts}
          user={authenticatedUser}
          onClose={handleCloseAlertModal}
          onUpdateAlert={handleUpdateAlert}
          onPredictPerimeter={handlePredictPerimeter}
        />
      )}
      
      {viewingCamera && <CameraDetailModal camera={viewingCamera} onClose={() => setViewingCamera(null)} />}
      
      {editingCamera && <AddEditCameraModal 
          mode={editingCamera.mode} 
          camera={editingCamera.camera} 
          onSave={handleSaveCamera} 
          onClose={() => setEditingCamera(null)} 
      />}
      
      {editingUser && authenticatedUser?.role === UserRole.Admin && (
        <AddEditUserModal
          mode={editingUser.mode}
          user={editingUser.user}
          onSave={handleSaveUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* 6. ELIMINAR el renderizado del modal, ahora es una vista principal: */}
      {/* {isAuditLogOpen && <AuditLogModal logs={auditLog} onClose={() => setAuditLogOpen(false)} />} */}
      
      {isLegalModalOpen && <LegalModal onClose={() => setLegalModalOpen(false)} />}
    </main>
  );
};

export default App;