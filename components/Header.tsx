import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Alert } from '../types';
import { Bell, LogOut, Mountain, Settings, User as UserIcon, BarChartHorizontalBig, Video, FileText, Users, Home, BookOpen, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  user?: User; // <-- AHORA OPCIONAL PARA EVITAR CRASH
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
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

// Clase del rol (sin cambios)
const getRoleClass = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin: return 'bg-red-500 text-red-100';
    case UserRole.Operator: return 'bg-orange-500 text-orange-100';
    case UserRole.Viewer: return 'bg-sky-500 text-sky-100';
    default: return 'bg-gray-500 text-gray-100';
  }
};

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  alertCount,
  recentAlerts,
  onNotificationClick,
  onNavigateToDashboard,
  onNavigateToStatistics,
  onNavigateToCameraManagement,
  onNavigateToReports,
  onNavigateToUserManagement,
  onOpenProfile,
  onOpenAuditLog,
  onThemeChange
}) => {

  // ⛔ SI NO HAY USER → header vacío, sin romper
  if (!user) {
    return (
      <header className="h-16 bg-slate-800/80 border-b border-slate-700 flex items-center px-4">
        <div className="text-slate-400 text-sm">Cargando usuario...</div>
      </header>
    );
  }

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage) {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown si clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node))
        setUserDropdownOpen(false);

      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node))
        setNotificationDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Aplicar tema
  useEffect(() => {
    const body = document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
    localStorage.setItem('theme', theme);

    if (onThemeChange) onThemeChange(theme);
  }, [theme, onThemeChange]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  // ⛔ Validación: si no hay user.role → no truena
  const isViewer = user?.role === UserRole.Viewer;

  const handleNotificationClick = (alert: Alert) => {
    if (isViewer) return;
    onNotificationClick(alert);
    setNotificationDropdownOpen(false);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "justo ahora";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes}m`;
    return `hace ${Math.floor(minutes / 60)}h`;
  };

  return (
    <header className="h-16 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-4 md:px-6 z-30">
      
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-900 p-2 rounded-lg border border-emerald-800">
          <Mountain className="h-6 w-6 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-100 hidden md:block">SIF Durango</h1>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center space-x-2 md:space-x-4">

        {/* Navegación */}
        <button onClick={onNavigateToDashboard} className="p-2 rounded-full hover:bg-slate-700">
          <Home className="h-6 w-6 text-slate-400 hover:text-slate-100" />
        </button>

        <button onClick={onNavigateToStatistics} className="p-2 rounded-full hover:bg-slate-700">
          <BarChartHorizontalBig className="h-6 w-6 text-slate-400 hover:text-slate-100" />
        </button>

        {!isViewer && (
          <>
            <button onClick={onNavigateToCameraManagement} className="p-2 rounded-full hover:bg-slate-700">
              <Video className="h-6 w-6 text-slate-400 hover:text-slate-100" />
            </button>

            <button onClick={onNavigateToReports} className="p-2 rounded-full hover:bg-slate-700">
              <FileText className="h-6 w-6 text-slate-400 hover:text-slate-100" />
            </button>

            <button onClick={onNavigateToUserManagement} className="p-2 rounded-full hover:bg-slate-700">
              <Users className="h-6 w-6 text-slate-400 hover:text-slate-100" />
            </button>

            <button onClick={onOpenAuditLog} className="p-2 rounded-full hover:bg-slate-700">
              <BookOpen className="h-6 w-6 text-slate-400 hover:text-slate-100" />
            </button>
          </>
        )}

        {/* Notificaciones */}
        <div className="relative" ref={notificationDropdownRef}>
          <button onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)} className="relative p-2 rounded-full hover:bg-slate-700">
            <Bell className="h-6 w-6 text-slate-400 hover:text-slate-100" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-slate-800">
                {alertCount}
              </span>
            )}
          </button>

          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
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
                        className="w-full text-left flex items-start p-3 text-sm text-slate-300 hover:bg-slate-700 disabled:text-slate-500"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-3" />
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

        {/* Usuario */}
        <div className="relative" ref={userDropdownRef}>
          <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="block">
            <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-slate-600 hover:border-emerald-500 bg-slate-600"/>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">

              {/* Info */}
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-slate-100">{user.name}</p>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                <span className={`mt-2 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleClass(user.role)}`}>
                  {user.role}
                </span>
              </div>

              <ul className="py-1">
                <li>
                  <button onClick={() => { onOpenProfile(); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 flex items-center text-sm text-slate-300 hover:bg-slate-700">
                    <UserIcon className="w-4 h-4 mr-2"/> Perfil
                  </button>
                </li>

                <li>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm text-slate-300 hover:bg-slate-700">
                    <Settings className="w-4 h-4 mr-2"/> Configuración
                  </button>
                </li>

                {/* Tema */}
                <li>
                  <hr className="border-slate-700 my-1"/>
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-300">
                    <span className="flex items-center">
                      {theme === 'dark' ? <Moon className="w-4 h-4 mr-2"/> : <Sun className="w-4 h-4 mr-2"/>}
                      {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                    </span>

                    <button 
                      onClick={toggleTheme}
                      role="switch"
                      aria-checked={theme === 'dark'}
                      className={`relative inline-flex h-6 w-11 rounded-full transition ${theme === 'dark' ? 'bg-emerald-600' : 'bg-slate-500'}`}
                    >
                      <span className={`h-5 w-5 bg-white rounded-full shadow transform transition ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </li>

                <li>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 flex items-center text-sm text-red-400 hover:bg-slate-700">
                    <LogOut className="w-4 h-4 mr-2"/> Cerrar Sesión
                  </button>
                </li>

              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
