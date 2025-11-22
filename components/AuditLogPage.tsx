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

// 1. Helper de Estilos de Rol: Adaptado para ambos modos
const getUserRoleStyle = (user: string) => {
    const lowerUser = user?.toLowerCase?.() ?? "";
    if (lowerUser.includes("admin") || lowerUser.includes("system")) {
        // Admin: Fondo ámbar suave en claro, Oscuro/Amarillo en dark
        return 'font-extrabold px-2 py-1 rounded-md shadow-sm border transition-colors ' +
               'bg-amber-100 text-amber-800 border-amber-200 ' +
               'dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700';
    }
    // Usuario normal: Emerald oscuro en claro, Emerald brillante en dark
    return 'font-semibold transition-colors text-emerald-600 dark:text-emerald-400';
};

const AuditLogPage: React.FC<AuditLogPageProps> = (props) => {
    const { user, logs, onLogout, onNavigateToDashboard, onOpenProfile, onNavigateBack } = props;
    
    // logs seguros
    const safeLogs: AuditLogEntry[] = Array.isArray(logs) ? logs : [];

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
                onNavigateToDashboard={onNavigateToDashboard}
                {...props}
            />

            {/* --- TÍTULO Y BARRA SUPERIOR --- */}
            <div className="p-6 border-b flex-shrink-0 transition-colors duration-300
                bg-white border-slate-200
                dark:bg-slate-900 dark:border-slate-700"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold flex items-center transition-colors text-slate-800 dark:text-white">
                        <BookOpen className="w-8 h-8 mr-3 text-emerald-600 dark:text-emerald-400" />
                        Bitácora de Auditoría
                        <ShieldCheck className="w-5 h-5 ml-4 text-amber-500 dark:text-yellow-400" />
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

            {/* --- TABLA --- */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 transition-colors">
                <div className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-300
                    /* Contenedor de Tabla */
                    bg-white border-slate-200
                    dark:bg-slate-800 dark:border-slate-700"
                >

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y transition-colors divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0 z-10 transition-colors">
                                <tr>
                                    {['Entidad', 'Acción', 'Detalles', 'Usuario', 'Fecha'].map((header) => (
                                        <th key={header} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors text-slate-500 dark:text-slate-300">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y transition-colors divide-slate-100 dark:divide-slate-700">
                                {safeLogs.map((log, index) => (
                                    <tr key={index} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        
                                        {/* Entidad */}
                                        <td className="px-6 py-4 text-sm">
                                            <span className="font-semibold transition-colors text-sky-600 dark:text-sky-400">
                                                {log.entityType}
                                            </span>
                                            <span className="block text-xs font-mono transition-colors text-slate-500 dark:text-slate-400">
                                                {log.entityName}
                                            </span>
                                        </td>

                                        {/* Acción */}
                                        <td className="px-6 py-4 text-sm font-medium transition-colors text-slate-700 dark:text-slate-300">
                                            {log.action}
                                        </td>

                                        {/* Detalles */}
                                        <td className="px-6 py-4 text-sm max-w-xs">
                                            {typeof log.details === "string" ? (
                                                <p className="text-xs italic transition-colors text-slate-500 dark:text-slate-400">
                                                    "{log.details}"
                                                </p>
                                            ) : (
                                                <ul className="text-xs space-y-1">
                                                    {log.details?.map((d, i) => (
                                                        <li key={i}>
                                                            <span className="font-semibold transition-colors text-slate-600 dark:text-slate-400">
                                                                {d.field}: 
                                                            </span>
                                                            
                                                            {/* Valor Anterior (Rojo tachado) */}
                                                            <span className="font-mono line-through mr-2 transition-colors text-red-600 bg-red-50 px-1 rounded dark:bg-transparent dark:text-red-400">
                                                                {d.before}
                                                            </span>
                                                            
                                                            <span className="mr-1 transition-colors text-emerald-600 dark:text-emerald-400">➜</span>
                                                            
                                                            {/* Valor Nuevo (Texto fuerte) */}
                                                            <span className="font-mono transition-colors text-slate-900 bg-emerald-50 px-1 rounded dark:bg-transparent dark:text-white">
                                                                {d.after}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>

                                        {/* Usuario */}
                                        <td className="px-6 py-4 text-sm">
                                            <span className={getUserRoleStyle(log.user)}>
                                                {log.user}
                                            </span>
                                        </td>

                                        {/* Fecha */}
                                        <td className="px-6 py-4 text-sm transition-colors text-slate-500 dark:text-slate-400">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                                {safeLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 transition-colors text-slate-500 dark:text-slate-500">
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