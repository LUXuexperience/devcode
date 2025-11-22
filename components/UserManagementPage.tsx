import React from 'react';
import { User, UserRole, UserStatus } from '../types';
import Header from './Header';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

interface UserManagementPageProps {
  user: User;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToCameraManagement: () => void;
  onNavigateToReports: () => void;
  onNavigateToUserManagement: () => void;
  onOpenProfile: () => void;
  onOpenAuditLog: () => void;
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeactivateUser: (userEmail: string) => void;
}

// 1. RoleBadge: Adaptado para legibilidad en ambos modos
const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const roleMap = {
    [UserRole.Admin]: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-transparent',
    [UserRole.Operator]: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-transparent',
    [UserRole.Viewer]: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-transparent',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleMap[role]}`}>{role}</span>;
};

// 2. StatusBadge: Adaptado para legibilidad en ambos modos
const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const statusMap = {
      [UserStatus.Active]: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-transparent',
      [UserStatus.Inactive]: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-600/30 dark:text-slate-400 dark:border-transparent',
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusMap[status]}`}>{status}</span>;
};

const UserManagementPage: React.FC<UserManagementPageProps> = (props) => {
  const { user, users, onAddUser, onEditUser, onDeactivateUser, ...headerProps } = props;

  const isAdmin = user.role === UserRole.Admin;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden transition-colors duration-500
        /* FONDO PRINCIPAL */
        bg-slate-50 dark:bg-slate-900"
    >
      <Header user={user} alertCount={0} recentAlerts={[]} onNotificationClick={() => {}} {...headerProps} />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* --- HEADER DE PÁGINA --- */}
        <div className="p-6 border-b flex-shrink-0 transition-colors border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <h1 className="text-3xl font-bold flex items-center transition-colors text-slate-800 dark:text-white">
                <Users className="w-8 h-8 mr-3 text-emerald-600 dark:text-emerald-400" />
                Gestión de Usuarios
             </h1>
             {isAdmin && (
                <button 
                    onClick={onAddUser} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2 shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Añadir Usuario</span>
                </button>
             )}
          </div>
        </div>

        {/* --- TABLA DE CONTENIDO --- */}
        <div className="p-6">
          <div className="rounded-lg overflow-hidden border shadow-sm transition-colors
              /* Contenedor Tabla */
              bg-white border-slate-200 
              dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y transition-colors divide-slate-200 dark:divide-slate-700">
                <thead className="transition-colors bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    {['Nombre', 'Email', 'Rol', 'Estado', 'Acciones'].map((header) => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-400">
                            {header}
                        </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y transition-colors divide-slate-200 dark:divide-slate-700">
                  {users.map((managedUser) => (
                    <tr key={managedUser.email} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      
                      {/* Nombre */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors text-slate-900 dark:text-white">
                          {managedUser.name}
                      </td>
                      
                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm transition-colors text-slate-500 dark:text-slate-400">
                          {managedUser.email}
                      </td>
                      
                      {/* Badges */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><RoleBadge role={managedUser.role} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={managedUser.status} /></td>
                      
                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                            onClick={() => onEditUser(managedUser)} 
                            disabled={!isAdmin} 
                            className="p-2 rounded-md transition-colors text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-slate-600 disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                            title="Editar Usuario"
                        >
                            <Edit className="w-4 h-4"/>
                        </button>
                        <button 
                            onClick={() => onDeactivateUser(managedUser.email)} 
                            disabled={!isAdmin || managedUser.email === user.email} 
                            className="p-2 rounded-md transition-colors text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-slate-600 disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                            title="Desactivar Usuario"
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

export default UserManagementPage;