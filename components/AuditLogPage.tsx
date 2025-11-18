import React from 'react';
import Header from './Header';
import { User } from '../types';
import { X, BookOpen, ShieldCheck } from 'lucide-react';

interface AuditLogEntry {
    entityType: string;
    entityName: string;
    action: string;
    details: string | Array<{ field: string, before: string, after: string }>;
    user: string;
    timestamp: number | string | Date;
}

interface AuditLogPageProps {
    logs?: AuditLogEntry[];
    user: User;
    onLogout: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToStatistics: () => void;
    onNavigateToCameraManagement: () => void;
    onNavigateToReports: () => void;
    onNavigateToUserManagement: () => void;
    onOpenProfile: () => void;
    onOpenAuditLog: () => void;
    onNavigateBack: () => void;
}

const getUserRoleStyle = (user: string) => {
    const lowerUser = user?.toLowerCase?.() ?? "";
    if (lowerUser.includes("admin") || lowerUser.includes("system")) {
        return 'text-yellow-300 font-extrabold bg-yellow-900/40 px-2 py-1 rounded-md shadow-xl border border-yellow-700';
    }
    return 'text-emerald-300 font-semibold';
};

const AuditLogPage: React.FC<AuditLogPageProps> = (props) => {

    // destructuración correcta
    const { user, logs, onLogout, onNavigateToDashboard, onOpenProfile, onNavigateBack } = props;
    console.log('AuditLogPage - user:', props.user);

    // logs seguros
    const safeLogs: AuditLogEntry[] = Array.isArray(logs) ? logs : [];

    return (
        <div className="flex flex-col h-screen w-screen bg-slate-900 light:bg-gray-50 overflow-hidden">

            <Header
                user={user}
                onLogout={onLogout}
                alertCount={0}
                recentAlerts={[]}
                onNotificationClick={() => {}}
                onOpenProfile={onOpenProfile}
                onNavigateToDashboard={onNavigateToDashboard}
                {...props}
            />

            {/* Título */}
            <div className="p-6 border-b border-slate-700 light:border-gray-200 flex-shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <BookOpen className="w-8 h-8 mr-3 text-emerald-400" />
                        Bitácora de Auditoría
                        <ShieldCheck className="w-5 h-5 ml-4 text-yellow-400" />
                    </h1>

                    <button
                        onClick={onNavigateBack}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 shadow-md transition"
                    >
                        <X className="w-5 h-5" />
                        <span>Volver</span>
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-slate-800 light:bg-white rounded-xl shadow-2xl border border-slate-700 light:border-gray-200 overflow-hidden">

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700 light:divide-gray-300">
                            <thead className="bg-slate-700 light:bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 light:text-gray-700 uppercase tracking-wider">Entidad</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 light:text-gray-700 uppercase tracking-wider">Acción</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 light:text-gray-700 uppercase tracking-wider">Detalles</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 light:text-gray-700 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 light:text-gray-700 uppercase tracking-wider">Fecha</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-700 light:divide-gray-200">
                                {safeLogs.map((log, index) => (
                                    <tr key={index} className="hover:bg-slate-700/70 transition-colors">
                                        <td className="px-6 py-4 text-sm">
                                            <span className="font-semibold text-sky-400">{log.entityType}</span>
                                            <span className="block text-slate-400 text-xs font-mono">{log.entityName}</span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-300">{log.action}</td>

                                        <td className="px-6 py-4 text-sm text-slate-300 max-w-xs">
                                            {typeof log.details === "string" ? (
                                                <p className="text-xs text-slate-400 italic">"{log.details}"</p>
                                            ) : (
                                                <ul className="text-xs space-y-1">
                                                    {log.details?.map((d, i) => (
                                                        <li key={i}>
                                                            <span className="font-semibold text-slate-400">{d.field}: </span>
                                                            <span className="font-mono text-red-400 line-through mr-2">{d.before}</span>
                                                            <span className="text-emerald-400 mr-1">➜</span>
                                                            <span className="font-mono text-white">{d.after}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <span className={getUserRoleStyle(log.user)}>
                                                {log.user}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                                {safeLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-slate-500">
                                            No hay registros en la bitácora.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AuditLogPage;
