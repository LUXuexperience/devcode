
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
        <div className="mb-1">{icon}</div>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
};

export default StatCard;
