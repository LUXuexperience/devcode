import React, { useState, useMemo } from 'react';
import { User, Camera, CameraStatus, UserRole } from '../types';
import Header from './Header';
import { Video, Plus, Edit, Trash2, Star, Eye, Search } from 'lucide-react';

interface CameraManagementPageProps {
  user: User;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToCameraManagement: () => void;
  onNavigateToReports: () => void;
  onNavigateToUserManagement: () => void;
  onOpenProfile: () => void;
  onOpenAuditLog: () => void;
  cameras: Camera[];
  onViewCamera: (camera: Camera) => void;
  onEditCamera: (camera: Camera) => void;
  onAddCamera: () => void;
  onDeactivateCamera: (cameraId: string) => void;
  onToggleFavorite: (id: string) => void;
}

// 1. StatusBadge: Colores adaptados para Light/Dark
const StatusBadge: React.FC<{ status: CameraStatus }> = ({ status }) => {
  const statusMap = {
    [CameraStatus.Active]: { 
        text: 'Activa', 
        // Light: Verde suave fondo / Verde oscuro texto | Dark: Transparente verde / Verde brillante
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-transparent' 
    },
    [CameraStatus.Alert]: { 
        text: 'Alerta', 
        color: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-200 dark:border-transparent' 
    },
    [CameraStatus.Inactive]: { 
        text: 'Inactiva', 
        color: 'bg-slate-100 text-slate-600 dark:bg-slate-600/30 dark:text-slate-400 border border-slate-200 dark:border-transparent' 
    },
  };
  const { text, color } = statusMap[status];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{text}</span>;
};

const CameraManagementPage: React.FC<CameraManagementPageProps> = (props) => {
  const { 
      user, onLogout, onOpenProfile, 
      cameras, onViewCamera, onEditCamera, onAddCamera, onDeactivateCamera,
      onToggleFavorite,
      ...navProps
  } = props;
  
  const [filter, setFilter] = useState<'all' | CameraStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCameras = useMemo(() => {
    return cameras
    .filter(camera => {
        const statusMatch = filter === 'all' || camera.status === filter;
        const searchMatch = camera.name.toLowerCase().includes(searchQuery.toLowerCase()) || camera.id.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
    })
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [cameras, filter, searchQuery]);
  
  const isAdmin = user.role === UserRole.Admin;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden transition-colors duration-500
        /* FONDO PRINCIPAL */
        bg-slate-50 dark:bg-slate-900"
    >
      <Header 
        user={user} 
        onLogout={onLogout} 
        alertCount={0}
        recentAlerts={[]}
        onNotificationClick={() => {}}
        onOpenProfile={onOpenProfile}
        {...navProps}
      />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* --- TÍTULO Y BOTÓN AÑADIR --- */}
        <div className="p-6 border-b flex-shrink-0 transition-colors
            border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <h1 className="text-3xl font-bold flex items-center transition-colors text-slate-800 dark:text-white">
                <Video className="w-8 h-8 mr-3 text-emerald-600 dark:text-emerald-400" />
                Gestión de Cámaras
             </h1>
             <div className="flex items-center space-x-2 md:space-x-4">
                 <button onClick={onAddCamera} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2 shadow-sm">
                    <Plus className="w-5 h-5" />
                    <span>Añadir Cámara</span>
                 </button>
             </div>
          </div>
        </div>
        
        <div className="p-6">
            {/* --- BARRA DE HERRAMIENTAS (FILTROS Y BÚSQUEDA) --- */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium transition-colors text-slate-600 dark:text-slate-400">
                        Filtrar:
                    </span>
                    {(['all', ...Object.values(CameraStatus)] as const).map(status => (
                         <button 
                            key={status} 
                            onClick={() => setFilter(status)} 
                            className={`px-3 py-1 text-sm font-semibold rounded-full transition border
                            ${filter === status 
                                ? 'bg-emerald-600 text-white border-emerald-600' 
                                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:border-transparent dark:hover:bg-slate-600'
                            }`}
                        >
                            {status === 'all' ? 'Todas' : status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Buscar por nombre o ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition border
                            bg-white border-slate-300 text-slate-900 placeholder-slate-400
                            dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                </div>
            </div>

            {/* --- TABLA --- */}
            <div className="rounded-lg overflow-hidden border shadow-sm transition-colors
                bg-white border-slate-200
                dark:bg-slate-800 dark:border-slate-700"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y transition-colors divide-slate-200 dark:divide-slate-700">
                        <thead className="transition-colors bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-400"></th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-400">Nombre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-400">Estado</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-400">Coordenadas</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y transition-colors divide-slate-200 dark:divide-slate-700">
                            {filteredCameras.map((camera) => (
                                <tr key={camera.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">
                                        <button onClick={() => onToggleFavorite(camera.id)} className="text-slate-400 hover:text-yellow-500 transition">
                                            <Star className={`w-5 h-5 ${camera.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col">
                                            <span className="transition-colors text-slate-900 dark:text-white">{camera.name}</span>
                                            <span className="font-mono text-xs transition-colors text-slate-500 dark:text-slate-500">{camera.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={camera.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono transition-colors text-slate-500 dark:text-slate-400">
                                        {`${camera.lat.toFixed(4)}, ${camera.lng.toFixed(4)}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => onViewCamera(camera)} 
                                            className="p-2 rounded-md transition-colors text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-600" 
                                            title="Ver Detalles"
                                        >
                                            <Eye className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            onClick={() => onEditCamera(camera)} 
                                            className="p-2 rounded-md transition-colors text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-slate-600" 
                                            title="Editar Cámara"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            onClick={() => onDeactivateCamera(camera.id)} 
                                            disabled={!isAdmin}
                                            className="p-2 rounded-md transition-colors text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-slate-600 disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                                            title={isAdmin ? "Desactivar Cámara" : "Acción restringida a Administradores"}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CameraManagementPage;