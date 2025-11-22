import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="
        p-3 rounded-lg border flex flex-col items-center justify-center shadow-sm transition-colors duration-300
        
        /* MODO CLARO: Tarjeta blanca para contrastar con el footer gris */
        bg-white border-slate-200
        
        /* MODO OSCURO: El estilo original que tenías */
        dark:bg-slate-800 dark:border-slate-700
    ">
        <div className="mb-1">{icon}</div>
        
        <p className="text-2xl font-bold transition-colors duration-300 text-slate-800 dark:text-slate-100">
            {value}
        </p>
      
        <p className="text-xs transition-colors duration-300 text-slate-500 dark:text-slate-400">
            {label}
        </p>
    </div>
  );
};

export default StatCard;