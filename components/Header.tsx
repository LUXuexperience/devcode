import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Alert } from '../types';
import { Bell, LogOut, Mountain, Settings, User as UserIcon, BarChartHorizontalBig, Video, FileText, Users, Home, BookOpen } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  alertCount: number;
  recentAlerts: Alert[];
  onNotificationClick: (alert: Alert) => void;
  onNavigateToDashboard: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToCameraManagement: () => void;
  onNavigateToReports: () => void;
  onNavigateToUserManagement: () => void;
  onOpenProfile: () => void;
  onOpenAuditLog: () => void;
}

const getRoleClass = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin: return 'bg-red-500 text-red-100';
    case UserRole.Operator: return 'bg-orange-500 text-orange-100';
    case UserRole.Viewer: return 'bg-sky-500 text-sky-100';
    default: return 'bg-gray-500 text-gray-100';
  }
};

const Header: React.FC<HeaderProps> = ({ user, onLogout, alertCount, recentAlerts, onNotificationClick, onNavigateToDashboard, onNavigateToStatistics, onNavigateToCameraManagement, onNavigateToReports, onNavigateToUserManagement, onOpenProfile, onOpenAuditLog }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (alert: Alert) => {
    if (user.role === UserRole.Viewer) return;
    onNotificationClick(alert);
    setNotificationDropdownOpen(false);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "justo ahora";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `hace ${hours}h`;
  };

  const isViewer = user.role === UserRole.Viewer;

  return (
    <header className="h-16 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-4 md:px-6 z-30 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-900 p-2 rounded-lg border border-emerald-800">
           <Mountain className="h-6 w-6 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-100 hidden md:block">SIF Durango</h1>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={onNavigateToDashboard} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Volver al Dashboard">
            <Home className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
        </button>

        <button onClick={onNavigateToStatistics} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Ver estadísticas">
            <BarChartHorizontalBig className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
        </button>

        {!isViewer && (
          <>
            <button onClick={onNavigateToCameraManagement} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Gestionar cámaras">
                <Video className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
            </button>

            <button onClick={onNavigateToReports} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Generar Reportes">
                <FileText className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
            </button>

            <button onClick={onNavigateToUserManagement} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Gestionar Usuarios">
                <Users className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
            </button>

            <button onClick={onOpenAuditLog} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Ver Bitácora">
                <BookOpen className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
            </button>
          </>
        )}

        <div className="relative" ref={notificationDropdownRef}>
          <button onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)} className="relative p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none">
            <Bell className="h-6 w-6 text-slate-400 hover:text-slate-100 cursor-pointer transition"/>
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-slate-800">
                {alertCount}
              </span>
            )}
          </button>
          {notificationDropdownOpen && (
             <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden animate-fade-in-down">
               <div className="p-3 border-b border-slate-700">
                 <h3 className="font-semibold text-slate-100">Notificaciones Recientes</h3>
               </div>
               {recentAlerts.length > 0 ? (
                <ul>
                  {recentAlerts.map(alert => (
                    <li key={alert.id}>
                      <button 
                        onClick={() => handleNotificationClick(alert)} 
                        disabled={isViewer}
                        className="w-full text-left flex items-start p-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:text-slate-500"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-3 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-100">{alert.cameraName}</p>
                          <p className="text-xs text-slate-400">Posible incendio detectado.</p>
                        </div>
                        <span className="text-xs text-slate-500 ml-2">{timeAgo(alert.timestamp)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
               ) : (
                 <p className="p-4 text-sm text-slate-400 text-center">No hay notificaciones nuevas.</p>
               )}
             </div>
          )}
        </div>
        <div className="relative" ref={userDropdownRef}>
          <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="block focus:outline-none">
            <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-slate-600 hover:border-emerald-500 transition bg-slate-600"/>
          </button>
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden animate-fade-in-down">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-slate-100">{user.name}</p>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                <span className={`mt-2 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleClass(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <ul className="py-1">
                <li><button onClick={() => { onOpenProfile(); setUserDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><UserIcon className="w-4 h-4 mr-2"/>Perfil</button></li>
                <li><button onClick={() => setUserDropdownOpen(false)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><Settings className="w-4 h-4 mr-2"/>Configuración</button></li>
                <li><hr className="border-slate-700 my-1"/></li>
                <li><button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700"><LogOut className="w-4 h-4 mr-2"/>Cerrar Sesión</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;