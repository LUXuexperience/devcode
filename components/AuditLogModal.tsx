import React from 'react';
import { AuditLogEntry } from '../types';
import { X, BookOpen } from 'lucide-react';

interface AuditLogModalProps {
  logs: AuditLogEntry[];
  onClose: () => void;
}

const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-700 animate-fade-in-down flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-emerald-400" />
            Bitácora de Auditoría del Sistema
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Entidad</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Detalles del Cambio</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usuario</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Fecha y Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {logs.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${log.entityType === 'Cámara' ? 'text-sky-400' : 'text-orange-400'}`}>{log.entityType}</span>
                        <span className="block text-slate-400 text-xs font-mono">{log.entityName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                         {typeof log.details === 'string' ? (
                            <p className="text-xs text-slate-300 italic">"{log.details}"</p>
                         ) : Array.isArray(log.details) && log.details.length > 0 ? (
                            <ul className="text-xs space-y-1">
                              {log.details.map((d, i) => (
                                <li key={i}>
                                  <span className="font-semibold text-slate-400">{d.field}: </span>
                                  <span className="font-mono text-slate-500 line-through">{d.before}</span>
                                  <span className="text-emerald-400 mx-1">➔</span>
                                  <span className="font-mono text-slate-300">{d.after}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-500">--</span>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{log.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                   {logs.length === 0 && (
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
    </div>
  );
};

export default AuditLogModal;