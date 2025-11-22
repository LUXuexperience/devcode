import React, { useMemo, useState } from 'react'; // Se agregó useState
// IMPORTACIONES DE TIPOS Y CONSTANTES
import { User, Camera, Alert, AlertConfirmationStatus } from '../types';
import Header from './Header';
import { INITIAL_CAMERAS } from '../constants';
import StatCard from './StatCard';
// ICONOS
import { 
    Calendar, Camera as CameraIcon, Hash, CheckCircle, XCircle, ShieldAlert, 
    BarChart2, TrendingUp, Clock, Zap, AlarmCheck, ThermometerSun, List, 
    Activity, PieChart as PieChartIcon 
} from 'lucide-react';

// ----------------------------------------------------------------------
// SIMULACIÓN DE DATOS (Mantenida)
// ----------------------------------------------------------------------
const useForestFireData = () => {
    // Generación de datos simulados
    const alerts: Alert[] = INITIAL_CAMERAS.flatMap(c => 
        Array.from({ length: 15 }, (_, i) => { 
            const timestamp = new Date(Date.now() - Math.random() * 86400000 * 30);
            const hour = timestamp.getHours();
            let temperature = 15 + Math.random() * 15;
            if (hour >= 10 && hour <= 18) {
                temperature += Math.random() * 10;
            }

            return { 
                id: `alert-${c.id.substring(0, 4)}-${i}-${Math.random().toFixed(2)}`, 
                cameraName: c.name, 
                timestamp: timestamp,
                confirmationStatus: [AlertConfirmationStatus.Confirmed, AlertConfirmationStatus.FalseAlarm, AlertConfirmationStatus.Pending][Math.floor(Math.random() * 3)],
                lat: c.lat, lng: c.lng, confidence: Math.random(), cameraId: c.id, 
                image: 'placeholder.jpg', imageWithBox: 'placeholder.jpg', imageZoom: 'placeholder.jpg', imagePrevFrame: 'placeholder.jpg', notes: [],
                weather: { temperature: parseFloat(temperature.toFixed(1)), humidity: 60, windSpeed: 10 }
            }
        })
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return { 
        alerts, 
        stats: { alertsToday: alerts.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length || 42 }
    };
};

// ----------------------------------------------------------------------
// IMPORTACIÓN Y COMPONENTES REALES DE GRÁFICOS (con Recharts)
// ----------------------------------------------------------------------
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

// Componente para Gráfico de Área (Alertas Diarias) 
const DailyAlertsAreaChart = ({ data }: { data: { day: string, value: number }[] }) => (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="day" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B' }} />
            <Area type="monotone" dataKey="value" stroke="#34D399" fill="url(#colorUv)" name="Alertas" />
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                </linearGradient>
            </defs>
        </AreaChart>
    </ResponsiveContainer>
);

// Distribución de Alertas por Hora del Día 
const HourlyAlertsBarChart = ({ data }: { data: { hour: string, count: number }[] }) => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="hour" stroke="#64748B" label={{ value: 'Hora del Día (24h)', position: 'bottom', fill: '#64748B' }} />
            <YAxis stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B' }} formatter={(value: number) => [`${value} Alertas`, 'Total']} />
            <Bar dataKey="count" fill="#FACC15" name="Alertas por Hora" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

// Helper function to get color based on value
const getColorForValue = (value: number, max: number): string => {
    if (max === 0) return '#60A5FA'; 
    const ratio = value / max;
    if (ratio < 0.2) return '#60A5FA'; 
    if (ratio < 0.5) return '#FACC15'; 
    if (ratio < 0.8) return '#FB923C'; 
    return '#F87171';
};

// Distribución de Alertas por Temperatura (Heatmap Style)
const TemperatureDistributionHeatmap = ({ data }: { data: { range: string, count: number }[] }) => {
    const maxCount = Math.max(...data.map(d => d.count), 0);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" />
                <YAxis dataKey="range" type="category" stroke="#64748B" width={80} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B' }} 
                    formatter={(value: number) => [`${value} Alertas`, 'Total']} 
                />
                <Bar dataKey="count" name="Alertas" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColorForValue(entry.count, maxCount)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// Gráfico de Pastel para Estado de Confirmación 
const ConfirmationStatusPieChart = ({ data }: { data: { name: string, value: number, color: string }[] }) => {
    const COLORS = data.map(d => d.color);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ color: '#1E293B' }}/>
            </PieChart>
        </ResponsiveContainer>
    );
};

// ----------------------------------------------------------------------

interface StatisticsPageProps {
  user: User;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToCameraManagement: () => void;
  onNavigateToReports: () => void;
  onNavigateToUserManagement: () => void;
  onOpenProfile: () => void;
  onOpenAuditLog: () => void;
}

// Tipos para las Tabs
type TabType = 'temporal' | 'analysis' | 'list';

const StatisticsPage: React.FC<StatisticsPageProps> = (props) => {
  const { user, onLogout, onNavigateToDashboard, onOpenProfile } = props;
  const { alerts, stats } = useForestFireData();
  const cameras: Camera[] = INITIAL_CAMERAS;

  // Estado para manejar la Tab activa
  const [activeTab, setActiveTab] = useState<TabType>('temporal');

  // ----------------------------------------------------------------------
  // PROCESAMIENTO DE DATOS PARA GRÁFICAS (useMemo)
  // ----------------------------------------------------------------------
  const processedData = useMemo(() => {
    const counts = { confirmed: 0, falseAlarm: 0, pending: 0 };
    const dailyAlerts: { [key: string]: number } = {};
    const hourlyAlertsMap = new Map<number, number>();
    const tempRanges = ['<15°C', '15-20°C', '20-25°C', '25-30°C', '>30°C'];
    const temperatureDistributionMap = new Map<string, number>(tempRanges.map(r => [r, 0]));

    const MS_PER_DAY = 86400000;

    alerts.forEach(a => {
      // Conteo por estado
      switch (a.confirmationStatus) {
        case AlertConfirmationStatus.Confirmed: counts.confirmed++; break;
        case AlertConfirmationStatus.FalseAlarm: counts.falseAlarm++; break;
        case AlertConfirmationStatus.Pending: counts.pending++; break;
      }
      
      // Conteo por día
      const date = new Date(a.timestamp);
      const dateKey = date.toISOString().split('T')[0];
      dailyAlerts[dateKey] = (dailyAlerts[dateKey] || 0) + 1;

        // Conteo por Hora
        const hour = date.getHours();
        hourlyAlertsMap.set(hour, (hourlyAlertsMap.get(hour) || 0) + 1);

        // Conteo por Temperatura
        const temp = a.weather.temperature;
        let tempRange = '';
        if (temp < 15) tempRange = '<15°C';
        else if (temp < 20) tempRange = '15-20°C';
        else if (temp < 25) tempRange = '20-25°C';
        else if (temp < 30) tempRange = '25-30°C';
        else tempRange = '>30°C';

        temperatureDistributionMap.set(tempRange, (temperatureDistributionMap.get(tempRange) || 0) + 1);
    });

    // Pie Chart Data
    const pieChartData = [
        { name: 'Confirmada', value: counts.confirmed, color: '#F87171' }, 
        { name: 'Falsa Alarma', value: counts.falseAlarm, color: '#34D399' }, 
        { name: 'Pendiente', value: counts.pending, color: '#FACC15' }, 
    ].filter(d => d.value > 0);
    
    // Line/Area Chart Data
    const dailyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - (7 - 1 - i) * MS_PER_DAY);
        const dateKey = date.toISOString().split('T')[0];
        const dayLabel = i === 6 ? 'Hoy' : date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        
        return { 
            day: dayLabel, 
            value: dailyAlerts[dateKey] || 0,
        };
    });

    // Hourly Alerts Data
    const hourlyAlertsData = Array.from({ length: 24 }, (_, hour) => ({
        hour: hour.toString().padStart(2, '0') + ':00',
        count: hourlyAlertsMap.get(hour) || 0
    }));

    // Temperature Distribution Data
    const temperatureDistributionData = tempRanges.map(range => ({
        range,
        count: temperatureDistributionMap.get(range) || 0
    }));

    return {
      confirmedCount: counts.confirmed,
      falseAlarmCount: counts.falseAlarm,
      pendingCount: counts.pending,
      pieChartData,
      dailyAlertsData: dailyData.map(d => ({ day: d.day, value: d.value })),
      hourlyAlertsData,
      temperatureDistributionData
    };
  }, [alerts]);

  const { 
    confirmedCount, falseAlarmCount, pendingCount, 
    pieChartData, 
    dailyAlertsData, hourlyAlertsData, temperatureDistributionData 
  } = processedData;

  const getAlertStatusStyle = (status: AlertConfirmationStatus) => {
    switch (status) {
        case AlertConfirmationStatus.Confirmed: return 'text-red-600 dark:text-red-500'; 
        case AlertConfirmationStatus.FalseAlarm: return 'text-emerald-600 dark:text-emerald-500'; 
        case AlertConfirmationStatus.Pending: return 'text-yellow-600 dark:text-yellow-500';
        default: return 'text-gray-500 dark:text-slate-500';
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-500 font-inter">
      <Header 
        user={user} 
        onLogout={onLogout} 
        alertCount={pendingCount}
        recentAlerts={alerts.slice(0, 5)}
        onNotificationClick={() => {}}
        onOpenProfile={onOpenProfile}
        {...props}
      />
      
      {/* Título y Barra de Filtros */}
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                <BarChart2 className="w-8 h-8 mr-3 text-emerald-600" dark:text-emerald-400 />
                Dashboard de Analíticas
            </h1>
            <button onClick={onNavigateToDashboard} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/30">
              <Clock className="w-4 h-4 mr-2 inline-block"/> Volver al Dashboard
            </button>
        </div>

        {/* Barra de Filtros (Compacta) */}
        <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col min-w-[150px]">
                <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center"><Calendar className="w-3 h-3 mr-2"/>Rango</label>
                <input type="text" placeholder="Últimos 7 días" className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg py-2 px-3 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"/>
            </div>
            <div className="flex flex-col min-w-[150px]">
                <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center"><CameraIcon className="w-3 h-3 mr-2"/>Cámara</label>
                <select className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg py-2 px-3 text-sm text-gray-900 dark:text-slate-100 focus:ring-emerald-500 focus:border-emerald-500">
                    <option className="bg-white dark:bg-slate-700">Todas</option>
                    {cameras.map(c => <option key={c.id} className="bg-white dark:bg-slate-700">{c.name}</option>)}
                </select>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm h-[38px]">
                <TrendingUp className="w-4 h-4 mr-1 inline-block" /> Aplicar
            </button>
        </div>
      </div>
      
      {/* Contenido Principal con Tabs */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {/* StatCards (Siempre visibles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
              <StatCard icon={<Zap className="w-6 h-6 text-orange-400"/>} value={alerts.length} label="Alertas Totales" />
              <StatCard icon={<CheckCircle className="w-6 h-6 text-red-600"/>} dark:icon={<CheckCircle className="w-6 h-6 text-red-400"/>} value={confirmedCount} label="Confirmadas" />
              <StatCard icon={<XCircle className="w-6 h-6 text-emerald-600"/>} dark:icon={<XCircle className="w-6 h-6 text-emerald-400"/>} value={falseAlarmCount} label="Falsas Alarmas" />
              <StatCard icon={<ShieldAlert className="w-6 h-6 text-yellow-600"/>} dark:icon={<ShieldAlert className="w-6 h-6 text-yellow-400"/>} value={pendingCount} label="Pendientes" />
          </div>

          {/* NAVEGACIÓN DE TABS */}
          <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                      onClick={() => setActiveTab('temporal')}
                      className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                          ${activeTab === 'temporal'
                              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300'}
                      `}
                  >
                      <Activity className="w-4 h-4 mr-2" />
                      Tendencias Temporales
                  </button>
                  <button
                      onClick={() => setActiveTab('analysis')}
                      className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                          ${activeTab === 'analysis'
                              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300'}
                      `}
                  >
                      <PieChartIcon className="w-4 h-4 mr-2" />
                      Análisis y Distribución
                  </button>
                  <button
                      onClick={() => setActiveTab('list')}
                      className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                          ${activeTab === 'list'
                              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300'}
                      `}
                  >
                      <List className="w-4 h-4 mr-2" />
                      Registro Detallado
                  </button>
              </nav>
          </div>

          {/* CONTENIDO DE TABS */}
          <div className="mt-4">
              
              {/* TAB 1: TEMPORAL GRAPHS */}
              {activeTab === 'temporal' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Alertas (Últimos 7 días)</h3>
                          <div className="h-80">
                              <DailyAlertsAreaChart data={dailyAlertsData} /> 
                          </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 flex items-center"><AlarmCheck className="w-5 h-5 mr-2 text-yellow-600" dark:text-yellow-400 />Alertas por Hora del Día</h3>
                          <div className="h-80">
                              <HourlyAlertsBarChart data={hourlyAlertsData} />
                          </div>
                      </div>
                  </div>
              )}

              {/* TAB 2: ANALYSIS GRAPHS */}
              {activeTab === 'analysis' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700 lg:col-span-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 flex items-center"><ThermometerSun className="w-5 h-5 mr-2 text-red-600" dark:text-red-400 />Concentración por Temperatura (°C)</h3>
                          <div className="h-80">
                              <TemperatureDistributionHeatmap data={temperatureDistributionData} /> 
                          </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700 lg:col-span-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Estado de Confirmación</h3>
                          <div className="h-80">
                              <ConfirmationStatusPieChart data={pieChartData} /> 
                          </div>
                      </div>
                  </div>
              )}

              {/* TAB 3: DETAILED LIST TABLE */}
              {activeTab === 'list' && (
                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700 animate-fadeIn">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Registro Histórico Completo</h3>
                      
                      <div className="grid grid-cols-[1fr_2fr_1.5fr_1fr_0.8fr] gap-4 pb-2 border-b border-gray-200 dark:border-slate-700 text-xs font-bold uppercase text-gray-600 dark:text-slate-400">
                        <span className="flex items-center"><Hash className="w-3 h-3 mr-1"/> ID</span>
                        <span className="flex items-center"><CameraIcon className="w-3 h-3 mr-1"/> Cámara</span>
                        <span className="flex items-center"><ThermometerSun className="w-3 h-3 mr-1"/> Temp.</span>
                        <span className="flex items-center"><ShieldAlert className="w-3 h-3 mr-1"/> Estado</span>
                        <span className="flex items-center justify-end"><Clock className="w-3 h-3 mr-1"/> Hora</span>
                      </div>

                      <div className="overflow-y-auto max-h-[500px]">
                          {alerts.map(alert => (
                              <div key={alert.id} className="grid grid-cols-[1fr_2fr_1.5fr_1fr_0.8fr] gap-4 py-3 text-sm border-b border-gray-200/50 hover:bg-gray-100/50 dark:border-slate-700/50 dark:hover:bg-slate-700/30 transition-colors items-center">
                                  <span className="text-gray-500 dark:text-slate-400 truncate font-mono text-xs">{alert.id.split('-')[1]}...{alert.id.split('-')[3]}</span>
                                  <span className="font-medium text-gray-800 dark:text-slate-200 truncate">{alert.cameraName}</span>
                                  <span className="text-gray-700 dark:text-slate-300 font-mono">{alert.weather.temperature.toFixed(1)}°C</span>
                                  <span className={`font-semibold text-xs px-2 py-1 rounded-full w-fit ${
                                      alert.confirmationStatus === AlertConfirmationStatus.Confirmed ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                      alert.confirmationStatus === AlertConfirmationStatus.FalseAlarm ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                      {alert.confirmationStatus === AlertConfirmationStatus.Confirmed ? 'CONFIRMADA' : 
                                       alert.confirmationStatus === AlertConfirmationStatus.FalseAlarm ? 'FALSA' : 'PENDIENTE'}
                                  </span>
                                  <span className="text-gray-400 dark:text-slate-500 text-right text-xs">
                                      {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default StatisticsPage;