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

const StatusBadge: React.FC<{ status: CameraStatus }> = ({ status }) => {
  const statusMap = {
    [CameraStatus.Active]: { text: 'Activa', color: 'bg-emerald-500/20 text-emerald-300' },
    [CameraStatus.Alert]: { text: 'Alerta', color: 'bg-red-500/20 text-red-300' },
    [CameraStatus.Inactive]: { text: 'Inactiva', color: 'bg-slate-600/30 text-slate-400' },
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
    <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden">
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
        <div className="p-6 border-b border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <h1 className="text-3xl font-bold text-white flex items-center"><Video className="w-8 h-8 mr-3 text-emerald-400" />Gestión de Cámaras</h1>
             <div className="flex items-center space-x-2 md:space-x-4">
                 <button onClick={onAddCamera} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Añadir Cámara</span>
                 </button>
             </div>
          </div>
        </div>
        
        <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-400">Filtrar:</span>
                    {(['all', ...Object.values(CameraStatus)] as const).map(status => (
                         <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-sm font-semibold rounded-full transition ${filter === status ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
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
                        className="w-full md:w-64 bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"></th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nombre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Coordenadas</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredCameras.map((camera) => (
                                <tr key={camera.id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <button onClick={() => onToggleFavorite(camera.id)} className="text-slate-500 hover:text-yellow-400 transition">
                                            <Star className={`w-5 h-5 ${camera.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        <div className="flex flex-col">
                                            <span>{camera.name}</span>
                                            <span className="font-mono text-xs text-slate-500">{camera.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={camera.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{`${camera.lat.toFixed(4)}, ${camera.lng.toFixed(4)}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => onViewCamera(camera)} className="p-2 rounded-md hover:bg-slate-600 text-emerald-400 hover:text-emerald-300 transition-colors" title="Ver Detalles"><Eye className="w-4 h-4"/></button>
                                        <button onClick={() => onEditCamera(camera)} className="p-2 rounded-md hover:bg-slate-600 text-sky-400 hover:text-sky-300 transition-colors" title="Editar Cámara"><Edit className="w-4 h-4"/></button>
                                        <button 
                                            onClick={() => onDeactivateCamera(camera.id)} 
                                            disabled={!isAdmin}
                                            className="p-2 rounded-md hover:bg-slate-600 text-red-500 hover:text-red-400 transition-colors disabled:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
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