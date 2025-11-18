import React from 'react';

// Ajustes del área de dibujo SVG
const SVG_WIDTH = 400;
const SVG_HEIGHT = 200;
const PADDING = 20;

// ----------------------------------------------------------------------
// LineChartPlaceholder (Alertas a lo largo del tiempo)
// ----------------------------------------------------------------------

interface LineChartData {
    day: string;
    value: number;
}

export const LineChartPlaceholder: React.FC<{ data: LineChartData[] }> = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-slate-500 light:text-gray-400 text-center p-4">Sin datos para mostrar.</div>;

    const values = data.map(d => d.value);
    const maxValue = Math.max(...values, 10); // Asegurar un mínimo de 10
    const scaleY = (value: number) => SVG_HEIGHT - PADDING - (value / maxValue) * (SVG_HEIGHT - 2 * PADDING);
    const scaleX = (index: number) => PADDING + index * ((SVG_WIDTH - 2 * PADDING) / (data.length - 1));

    // Generar la ruta SVG (path)
    const pathD = data.map((d, i) => {
        const x = scaleX(i);
        const y = scaleY(d.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Generar el área de relleno (area path)
    const areaD = pathD + ` L ${scaleX(data.length - 1)} ${SVG_HEIGHT - PADDING} L ${scaleX(0)} ${SVG_HEIGHT - PADDING} Z`;

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="text-emerald-500 light:text-emerald-600">
            {/* Eje X (Horizontal) */}
            <line x1={PADDING} y1={SVG_HEIGHT - PADDING} x2={SVG_WIDTH - PADDING} y2={SVG_HEIGHT - PADDING} stroke="#475569" className="light:stroke-gray-300" strokeWidth="1" />
            
            {/* Etiquetas X */}
            {data.map((d, i) => (
                <text key={i} x={scaleX(i)} y={SVG_HEIGHT - PADDING / 2} textAnchor="middle" fontSize="10" fill="#94a3b8" className="light:fill-gray-600">
                    {d.day}
                </text>
            ))}

            <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Área de Relleno */}
            <path d={areaD} fill="url(#lineGradient)" />

            {/* Línea */}
            <path d={pathD} stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Puntos de Datos */}
            {data.map((d, i) => (
                <circle key={i} cx={scaleX(i)} cy={scaleY(d.value)} r="3" fill="currentColor" className="shadow-lg" />
            ))}
        </svg>
    );
};

// ----------------------------------------------------------------------
// BarChartPlaceholder (Alertas por Cámara)
// ----------------------------------------------------------------------

interface BarChartData {
    name: string;
    count: number;
}

export const BarChartPlaceholder: React.FC<{ data: BarChartData[] }> = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-slate-500 light:text-gray-400 text-center p-4">Sin datos para mostrar.</div>;

    const top6 = data.slice(0, 6); // Mostrar solo el Top 6
    const values = top6.map(d => d.count);
    const maxValue = Math.max(...values, 10);
    const numBars = top6.length;
    const barWidth = 40;
    const totalContentWidth = SVG_WIDTH - 2 * PADDING;
    const gap = (totalContentWidth - numBars * barWidth) / (numBars + 1);

    const scaleY = (value: number) => (value / maxValue) * (SVG_HEIGHT - 2 * PADDING);

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
            {/* Eje X */}
            <line x1={PADDING} y1={SVG_HEIGHT - PADDING} x2={SVG_WIDTH - PADDING} y2={SVG_HEIGHT - PADDING} stroke="#475569" className="light:stroke-gray-300" strokeWidth="1" />

            {top6.map((d, i) => {
                const height = scaleY(d.count);
                const x = PADDING + gap + i * (barWidth + gap);
                const y = SVG_HEIGHT - PADDING - height;

                return (
                    <g key={d.name}>
                        {/* Barra */}
                        <rect 
                            x={x} 
                            y={y} 
                            width={barWidth} 
                            height={height} 
                            rx="4" 
                            fill="#06b6d4" // Tailwind cyan-500
                            className="text-cyan-500" 
                        />
                        {/* Etiqueta de la base */}
                        <text x={x + barWidth / 2} y={SVG_HEIGHT - PADDING / 2} textAnchor="middle" fontSize="10" fill="#94a3b8" className="light:fill-gray-600">
                            {d.name.substring(0, 8)}...
                        </text>
                        {/* Etiqueta del valor */}
                         <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#94a3b8" className="light:fill-gray-700">
                            {d.count}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

// ----------------------------------------------------------------------
// PieChartPlaceholder (Estado de Confirmación)
// ----------------------------------------------------------------------

interface PieChartData {
    name: string;
    value: number;
    color: string;
}

export const PieChartPlaceholder: React.FC<{ data: PieChartData[] }> = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-slate-500 light:text-gray-400 text-center p-4">Sin datos para mostrar.</div>;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-slate-500 light:text-gray-400 text-center p-4">Sin datos de confirmación.</div>;

    const R = 80;
    const CX = 100;
    const CY = 100;
    const STROKE_WIDTH = 32;
    const CIRCUMFERENCE = 2 * Math.PI * R;

    let cumulativeOffset = 0;

    return (
        // CLASES DE COLOR APLICADAS AQUÍ: text-white en Dark Mode, light:text-slate-900 en Light Mode
        <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 200 200" 
            preserveAspectRatio="xMidYMid meet"
            className="text-white light:text-slate-900" 
        >
            {/* Círculo de fondo (para el centro) */}
            <circle cx={CX} cy={CY} r={R + STROKE_WIDTH / 2 + 5} fill="transparent" stroke="#475569" className="light:stroke-gray-200" strokeWidth="1" />
            
            {/* NOTA: El fondo central es oscuro (#1e293b) en Dark Mode y blanco (light:fill-white) en Light Mode */}
            <circle cx={CX} cy={CY} r={R - STROKE_WIDTH / 2} fill="#1e293b" className="light:fill-white" />
            
            {/* Dibujar segmentos (sin cambios) */}
            {data.map((item, index) => {
                const percentage = item.value / total;
                const dasharray = `${percentage * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
                const rotation = cumulativeOffset * 360 - 90;
                
                const segment = (
                    <circle 
                        key={index}
                        cx={CX} 
                        cy={CY} 
                        r={R} 
                        fill="transparent" 
                        stroke={item.color} 
                        strokeWidth={STROKE_WIDTH} 
                        strokeDasharray={dasharray} 
                        transform={`rotate(${rotation} ${CX} ${CY})`}
                        strokeLinecap="butt"
                    />
                );
                
                cumulativeOffset += percentage;
                return segment;
            })}

        </svg>
    );
};