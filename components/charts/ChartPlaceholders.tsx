import React from 'react';

export const LineChartPlaceholder: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="text-emerald-500">
    <path d="M 20 180 C 80 40, 150 150, 250 80 S 380 20, 380 20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 20 180 C 80 40, 150 150, 250 80 S 380 20, 380 20" stroke="url(#lineGradient)" fill="url(#lineGradient)" strokeWidth="2" />
    <defs>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <line x1="20" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="1" />
    <line x1="20" y1="20" x2="20" y2="180" stroke="#475569" strokeWidth="1" />
  </svg>
);

export const BarChartPlaceholder: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
    <rect x="30" y="100" width="40" height="80" rx="4" className="text-sky-600" fill="currentColor" />
    <rect x="90" y="60" width="40" height="120" rx="4" className="text-sky-500" fill="currentColor" />
    <rect x="150" y="120" width="40" height="60" rx="4" className="text-sky-600" fill="currentColor" />
    <rect x="210" y="20" width="40" height="160" rx="4" className="text-sky-400" fill="currentColor" />
    <rect x="270" y="80" width="40" height="100" rx="4" className="text-sky-500" fill="currentColor" />
    <rect x="330" y="140" width="40" height="40" rx="4" className="text-sky-600" fill="currentColor" />
    <line x1="20" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="1" />
    <line x1="20" y1="20" x2="20" y2="180" stroke="#475569" strokeWidth="1" />
  </svg>
);

export const PieChartPlaceholder: React.FC = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
      <circle cx="100" cy="100" r="80" fill="#475569" />
      <circle cx="100" cy="100" r="80" className="text-red-500" fill="transparent" stroke="currentColor" strokeWidth="32" strokeDasharray="calc(0.5 * 3.14159 * 160) calc(3.14159 * 160)" transform="rotate(-90 100 100)" />
      <circle cx="100" cy="100" r="80" className="text-emerald-500" fill="transparent" stroke="currentColor" strokeWidth="32" strokeDasharray="calc(0.3 * 3.14159 * 160) calc(3.14159 * 160)" transform="rotate(90 100 100)" />
      <circle cx="100" cy="100" r="80" className="text-orange-500" fill="transparent" stroke="currentColor" strokeWidth="32" strokeDasharray="calc(0.2 * 3.14159 * 160) calc(3.14159 * 160)" transform="rotate(234 100 100)" />
      <circle cx="100" cy="100" r="55" fill="#1e293b" />
    </svg>
);
