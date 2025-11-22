import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Alert } from '../types';
import { Bell, LogOut, Mountain, Settings, User as UserIcon, BarChartHorizontalBig, Video, FileText, Users, Home, BookOpen, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  user?: User;
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

  // --- LÓGICA DEL TEMA ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Intenta leer del localStorage, si no existe usa 'dark' por defecto
    if (typeof window !== 'undefined' && localStorage) {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  // Este efecto aplica la clase 'dark' al body para que Tailwind sepa qué hacer
  useEffect(() => {
    const body = document.body;
    
    if (theme === 'dark') {
      body.classList.add('dark');
      // Opcional: Forzar color de fondo global al body para evitar parpadeos
      body.style.backgroundColor = '#0f172a'; // Slate-900
    } else {
      body.classList.remove('dark');
      body.style.backgroundColor = '#f8fafc'; // Slate-50 (Casi blanco)
    }
    
    localStorage.setItem('theme', theme);
    if (onThemeChange) onThemeChange(theme);
  }, [theme, onThemeChange]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  // -----------------------

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Cierra dropdowns al hacer clic fuera
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

  // ESTILOS COMUNES (DRY - Don't Repeat Yourself)
  // Base: Color claro (hover gris suave). Dark: Color oscuro (hover gris oscuro)
  const navBtnBase = "p-2 rounded-full transition-all duration-200";
  const navBtnStyle = `${navBtnBase} hover:bg-slate-100 text-slate-500 hover:text-emerald-600 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-100`;

  // Renderizado seguro si no hay usuario aún
  if (!user) {
    return (
      <header className="h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex items-center px-4 transition-colors duration-300">
        <div className="animate-pulse flex space-x-4">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mt-2"></div>
        </div>
      </header>
    );
  }

  const isViewer = user.role === UserRole.Viewer;

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
    <header className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-4 md:px-6 
        transition-colors duration-300
        /* MODO CLARO (Default): Blanco translúcido con borde gris suave */
        bg-white/90 border-b border-slate-200 backdrop-blur-md
        /* MODO OSCURO (Dark): Slate 800 translúcido con borde oscuro */
        dark:bg-slate-800/90 dark:border-slate-700"
    >
      
      {/* LOGO & TÍTULO */}
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50">
          <Mountain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="hidden md:block text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            SIF Durango
        </h1>
      </div>

      <div className="flex-1"></div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="flex items-center space-x-1 md:space-x-3">

        {/* Botones de Navegación */}
        <button onClick={onNavigateToDashboard} className={navBtnStyle} title="Inicio">
          <Home className="h-6 w-6" />
        </button>

        <button onClick={onNavigateToStatistics} className={navBtnStyle} title="Estadísticas">
          <BarChartHorizontalBig className="h-6 w-6" />
        </button>

        {!isViewer && (
          <>
            <button onClick={onNavigateToCameraManagement} className={navBtnStyle} title="Cámaras">
              <Video className="h-6 w-6" />
            </button>

            <button onClick={onNavigateToReports} className={navBtnStyle} title="Reportes">
              <FileText className="h-6 w-6" />
            </button>

            <button onClick={onNavigateToUserManagement} className={navBtnStyle} title="Usuarios">
              <Users className="h-6 w-6" />
            </button>

            <button onClick={onOpenAuditLog} className={navBtnStyle} title="Auditoría">
              <BookOpen className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Separador vertical sutil */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        {/* NOTIFICACIONES */}
        <div className="relative" ref={notificationDropdownRef}>
          <button 
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)} 
            className={`${navBtnStyle} relative`}
          >
            <Bell className="h-6 w-6" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800">
                {alertCount}
              </span>
            )}
          </button>

          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5
                bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Notificaciones Recientes</h3>
              </div>

              {recentAlerts.length > 0 ? (
                <ul className="max-h-[20rem] overflow-y-auto">
                  {recentAlerts.map(alert => (
                    <li key={alert.id}>
                      <button 
                        onClick={() => handleNotificationClick(alert)} 
                        disabled={isViewer}
                        className="w-full text-left flex items-start p-3 text-sm transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0
                            hover:bg-slate-50 dark:hover:bg-slate-700/50
                            text-slate-600 dark:text-slate-300"
                      >
                        <span className="flex h-2 w-2 mt-1.5 mr-3 rounded-full bg-red-500 shrink-0 shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{alert.cameraName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Posible incendio detectado.</p>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 whitespace-nowrap">{timeAgo(alert.timestamp)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Todo tranquilo.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No hay nuevas alertas.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* USUARIO Y MENÚ */}
        <div className="relative" ref={userDropdownRef}>
          <button 
            onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
            className="flex items-center focus:outline-none ml-1 transition-transform active:scale-95"
          >
            <img 
                src={user.avatarUrl} 
                alt="Perfil" 
                className="h-9 w-9 rounded-full object-cover border-2 border-slate-100 dark:border-slate-600 shadow-sm hover:border-emerald-500 transition-colors"
            />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5 z-50
                bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">

              {/* Info Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30">
                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                <div className="mt-2 flex">
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${getRoleClass(user.role)}`}>
                    {user.role}
                    </span>
                </div>
              </div>

              <div className="py-1">
                <button onClick={() => { onOpenProfile(); setUserDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2.5 flex items-center text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <UserIcon className="w-4 h-4 mr-3 text-slate-400"/> Perfil
                </button>

                <button className="w-full text-left px-4 py-2.5 flex items-center text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <Settings className="w-4 h-4 mr-3 text-slate-400"/> Configuración
                </button>

                {/* --- SWITCH DE TEMA EN EL MENÚ --- */}
                <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                
                <div 
                    onClick={toggleTheme}
                    className="cursor-pointer w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <div className="flex items-center">
                        {theme === 'dark' ? (
                            <Moon className="w-4 h-4 mr-3 text-indigo-500" />
                        ) : (
                            <Sun className="w-4 h-4 mr-3 text-amber-500" />
                        )}
                        <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
                    </div>
                    {/* Toggle Switch Visual */}
                    <div className={`relative w-9 h-5 transition-colors duration-200 ease-in-out rounded-full ${theme === 'dark' ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                        <span className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </div>
                {/* -------------------------------- */}

                <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                
                <button onClick={onLogout} className="w-full text-left px-4 py-2.5 flex items-center text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <LogOut className="w-4 h-4 mr-3"/> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;