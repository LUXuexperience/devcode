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
    if (!data || data.length === 0) return <div className="text-slate-500 dark:text-slate-400 text-center p-4">Sin datos para mostrar.</div>;

    const values = data.map(d => d.value);
    const maxValue = Math.max(...values, 10);
    const scaleY = (value: number) => SVG_HEIGHT - PADDING - (value / maxValue) * (SVG_HEIGHT - 2 * PADDING);
    const scaleX = (index: number) => PADDING + index * ((SVG_WIDTH - 2 * PADDING) / (data.length - 1));

    const pathD = data.map((d, i) => {
        const x = scaleX(i);
        const y = scaleY(d.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const areaD = pathD + ` L ${scaleX(data.length - 1)} ${SVG_HEIGHT - PADDING} L ${scaleX(0)} ${SVG_HEIGHT - PADDING} Z`;

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="text-emerald-600 dark:text-emerald-500 transition-colors duration-300">
            {/* Eje X */}
            <line 
                x1={PADDING} y1={SVG_HEIGHT - PADDING} x2={SVG_WIDTH - PADDING} y2={SVG_HEIGHT - PADDING} 
                strokeWidth="1" 
                className="stroke-slate-300 dark:stroke-slate-600 transition-colors"
            />
            
            {/* Etiquetas X */}
            {data.map((d, i) => (
                <text key={i} x={scaleX(i)} y={SVG_HEIGHT - PADDING / 2} textAnchor="middle" fontSize="10" 
                    className="fill-slate-500 dark:fill-slate-400 transition-colors"
                >
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
            
            {/* Puntos */}
            {data.map((d, i) => (
                <circle key={i} cx={scaleX(i)} cy={scaleY(d.value)} r="3" fill="currentColor" />
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
    if (!data || data.length === 0) return <div className="text-slate-500 dark:text-slate-400 text-center p-4">Sin datos para mostrar.</div>;

    const top6 = data.slice(0, 6);
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
            <line 
                x1={PADDING} y1={SVG_HEIGHT - PADDING} x2={SVG_WIDTH - PADDING} y2={SVG_HEIGHT - PADDING} 
                strokeWidth="1" 
                className="stroke-slate-300 dark:stroke-slate-600 transition-colors"
            />

            {top6.map((d, i) => {
                const height = scaleY(d.count);
                const x = PADDING + gap + i * (barWidth + gap);
                const y = SVG_HEIGHT - PADDING - height;

                return (
                    <g key={d.name}>
                        {/* Barra: Cyan en ambos modos, ligeramente ajustado */}
                        <rect 
                            x={x} y={y} width={barWidth} height={height} rx="4" 
                            className="fill-cyan-600 dark:fill-cyan-500 transition-colors"
                        />
                        {/* Etiqueta Base */}
                        <text x={x + barWidth / 2} y={SVG_HEIGHT - PADDING / 2} textAnchor="middle" fontSize="10" 
                            className="fill-slate-500 dark:fill-slate-400 transition-colors"
                        >
                            {d.name.substring(0, 8)}...
                        </text>
                        {/* Valor */}
                         <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="10" 
                            className="fill-slate-600 dark:fill-slate-300 transition-colors font-semibold"
                        >
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
    if (!data || data.length === 0) return <div className="text-slate-500 dark:text-slate-400 text-center p-4">Sin datos para mostrar.</div>;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-slate-500 dark:text-slate-400 text-center p-4">Sin datos de confirmación.</div>;

    const R = 80;
    const CX = 100;
    const CY = 100;
    const STROKE_WIDTH = 32;
    const CIRCUMFERENCE = 2 * Math.PI * R;

    let cumulativeOffset = 0;

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
            {/* Guía Circular Externa (opcional, sutil) */}
            <circle 
                cx={CX} cy={CY} r={R + STROKE_WIDTH / 2 + 2} 
                fill="transparent" strokeWidth="1" 
                className="stroke-slate-200 dark:stroke-slate-700 transition-colors"
            />
            
            {/* EL TRUCO DEL DONUT: 
                El círculo central debe coincidir con el fondo de la tarjeta contenedora.
                White en modo claro, Slate-800 en modo oscuro.
            */}
            <circle 
                cx={CX} cy={CY} r={R - STROKE_WIDTH / 2} 
                className="fill-white dark:fill-slate-800 transition-colors duration-300" 
            />
            
            {data.map((item, index) => {
                const percentage = item.value / total;
                const dasharray = `${percentage * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
                const rotation = cumulativeOffset * 360 - 90;
                
                const segment = (
                    <circle 
                        key={index}
                        cx={CX} cy={CY} r={R} 
                        fill="transparent" 
                        stroke={item.color} // El color viene de props, asegurarse que el padre envíe colores compatibles
                        strokeWidth={STROKE_WIDTH} 
                        strokeDasharray={dasharray} 
                        transform={`rotate(${rotation} ${CX} ${CY})`}
                        strokeLinecap="butt"
                    />
                );
                
                cumulativeOffset += percentage;
                return segment;
            })}

            <text x={CX} y={CY} dy="0.3em" textAnchor="middle" className="text-2xl font-bold fill-slate-700 dark:fill-white transition-colors pointer-events-none">
                {total}
            </text>
            <text x={CX} y={CY + 15} dy="0.3em" textAnchor="middle" className="text-[10px] font-medium fill-slate-400 dark:fill-slate-400 transition-colors pointer-events-none">
                TOTAL
            </text>

        </svg>
    );
};