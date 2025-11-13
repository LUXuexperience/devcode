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

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const roleMap = {
    [UserRole.Admin]: 'bg-red-500/20 text-red-300',
    [UserRole.Operator]: 'bg-orange-500/20 text-orange-300',
    [UserRole.Viewer]: 'bg-sky-500/20 text-sky-300',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleMap[role]}`}>{role}</span>;
};

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const statusMap = {
      [UserStatus.Active]: 'bg-emerald-500/20 text-emerald-300',
      [UserStatus.Inactive]: 'bg-slate-600/30 text-slate-400',
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status]}`}>{status}</span>;
};

const UserManagementPage: React.FC<UserManagementPageProps> = (props) => {
  const { user, users, onAddUser, onEditUser, onDeactivateUser, ...headerProps } = props;

  const isAdmin = user.role === UserRole.Admin;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden">
      <Header user={user} alertCount={0} recentAlerts={[]} onNotificationClick={() => {}} {...headerProps} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <h1 className="text-3xl font-bold text-white flex items-center"><Users className="w-8 h-8 mr-3 text-emerald-400" />Gestión de Usuarios</h1>
             {isAdmin && (
                <button onClick={onAddUser} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Añadir Usuario</span>
                </button>
             )}
          </div>
        </div>

        <div className="p-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rol</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((managedUser) => (
                    <tr key={managedUser.email} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{managedUser.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{managedUser.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><RoleBadge role={managedUser.role} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={managedUser.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => onEditUser(managedUser)} disabled={!isAdmin} className="p-2 rounded-md hover:bg-slate-600 text-sky-400 hover:text-sky-300 transition-colors disabled:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed" title="Editar Usuario"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => onDeactivateUser(managedUser.email)} disabled={!isAdmin || managedUser.email === user.email} className="p-2 rounded-md hover:bg-slate-600 text-red-500 hover:text-red-400 transition-colors disabled:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed" title="Desactivar Usuario"><Trash2 className="w-4 h-4"/></button>
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