import React, { useMemo } from 'react';
import { User, Camera, Alert, AlertConfirmationStatus } from '../types';
import Header from './Header';
// Asumo que useForestFireData está definido en tu proyecto
// import { useForestFireData } from '../hooks/useForestFireData';
import { INITIAL_CAMERAS } from '../constants';
import StatCard from './StatCard';
// Simulamos la importación de componentes de gráficos que aceptarían props
import { LineChartPlaceholder, BarChartPlaceholder, PieChartPlaceholder } from './charts/ChartPlaceholders'; 
import { Calendar, Camera as CameraIcon, Hash, CheckCircle, XCircle, ShieldAlert, BarChart2, TrendingUp, Clock } from 'lucide-react';

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

// ----------------------------------------------------------------------
// SIMULACIÓN DEL HOOK Y PROCESAMIENTO DE DATOS
// ----------------------------------------------------------------------

// Nota: He añadido la simulación de datos aquí para la coherencia del ejemplo
const useForestFireData = () => {
    // Generación de datos simulados
    const alerts: Alert[] = INITIAL_CAMERAS.flatMap(c => 
        Array.from({ length: 5 }, (_, i) => ({ 
            id: `alert-${c.id.substring(0, 4)}-${i}-${Math.random().toFixed(2)}`, 
            cameraName: c.name, 
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 30),
            confirmationStatus: [AlertConfirmationStatus.Confirmed, AlertConfirmationStatus.FalseAlarm, AlertConfirmationStatus.Pending][Math.floor(Math.random() * 3)],
            lat: c.lat, lng: c.lng, confidence: Math.random(), cameraId: c.id, 
            image: 'placeholder.jpg', imageWithBox: 'placeholder.jpg', imageZoom: 'placeholder.jpg', imagePrevFrame: 'placeholder.jpg', notes: [],
            weather: { temperature: 25, humidity: 60, windSpeed: 10 }
        }))
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Ordenar por tiempo descendente (más reciente primero)

    return { 
        alerts, 
        stats: { alertsToday: alerts.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length || 42 }
    };
};
// ----------------------------------------------------------------------


const StatisticsPage: React.FC<StatisticsPageProps> = (props) => {
  const { user, onLogout, onNavigateToDashboard, onOpenProfile } = props;
  const { alerts, stats } = useForestFireData();
  const cameras: Camera[] = INITIAL_CAMERAS;

  // ----------------------------------------------------------------------
  // 1. PROCESAMIENTO DE DATOS PARA GRÁFICAS (useMemo)
  // ----------------------------------------------------------------------
  const processedData = useMemo(() => {
    const counts = { confirmed: 0, falseAlarm: 0, pending: 0 };
    const alertsByCamera: { name: string, count: number }[] = [];
    const cameraMap = new Map<string, number>();
    const dailyAlerts: { [key: string]: number } = {};
    const MS_PER_DAY = 86400000;

    alerts.forEach(a => {
      // Conteo por estado
      switch (a.confirmationStatus) {
        case AlertConfirmationStatus.Confirmed: counts.confirmed++; break;
        case AlertConfirmationStatus.FalseAlarm: counts.falseAlarm++; break;
        case AlertConfirmationStatus.Pending: counts.pending++; break;
      }
      
      // Conteo por cámara
      const currentCount = cameraMap.get(a.cameraName) || 0;
      cameraMap.set(a.cameraName, currentCount + 1);

      // Conteo por día (para la gráfica de línea)
      const dateKey = new Date(a.timestamp).toISOString().split('T')[0];
      dailyAlerts[dateKey] = (dailyAlerts[dateKey] || 0) + 1;
    });

    // Pie Chart Data (Estado de Confirmación)
    const pieChartData = [
        { name: 'Confirmada', value: counts.confirmed, color: '#F87171' }, // red-400
        { name: 'Falsa Alarma', value: counts.falseAlarm, color: '#34D399' }, // emerald-400
        { name: 'Pendiente', value: counts.pending, color: '#FACC15' }, // yellow-400
    ].filter(d => d.value > 0); // Omitir si el valor es 0

    // Bar Chart Data (Alertas por Cámara)
    cameraMap.forEach((count, name) => {
      alertsByCamera.push({ name, count });
    });
    alertsByCamera.sort((a, b) => b.count - a.count);
    
    // Line Chart Data (Últimos 7 días)
    const lineChartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - (7 - 1 - i) * MS_PER_DAY);
        const dateKey = date.toISOString().split('T')[0];
        const dayLabel = i === 6 ? 'Hoy' : `Día -${7 - 1 - i}`;
        return { 
            day: dayLabel, 
            value: dailyAlerts[dateKey] || 0 
        };
    });


    return {
      confirmedCount: counts.confirmed,
      falseAlarmCount: counts.falseAlarm,
      pendingCount: counts.pending,
      pieChartData,
      alertsByCamera,
      lineChartData,
    };
  }, [alerts]);

  const { confirmedCount, falseAlarmCount, pendingCount, pieChartData, alertsByCamera, lineChartData } = processedData;

  // ----------------------------------------------------------------------
  // Función auxiliar para obtener el estilo de estado (sin cambios)
  // ----------------------------------------------------------------------
  const getAlertStatusStyle = (status: AlertConfirmationStatus) => {
    switch (status) {
        case AlertConfirmationStatus.Confirmed: return 'text-red-500 light:text-red-600';
        case AlertConfirmationStatus.FalseAlarm: return 'text-emerald-500 light:text-emerald-600';
        case AlertConfirmationStatus.Pending: return 'text-yellow-500 light:text-yellow-600';
        default: return 'text-slate-500 light:text-gray-500';
    }
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 light:bg-gray-50 overflow-hidden transition-colors duration-500 font-inter">
      <Header 
        user={user} 
        onLogout={onLogout} 
        alertCount={pendingCount}
        recentAlerts={alerts.slice(0, 5)}
        onNotificationClick={() => {}}
        onOpenProfile={onOpenProfile}
        {...props}
      />
      
      {/* Título, Filter Bar, StatCards (sin cambios) */}
      <div className="p-4 md:p-6 border-b border-slate-700 light:border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-white light:text-gray-900 flex items-center">
                <BarChart2 className="w-8 h-8 mr-3 text-emerald-400" />
                Estadísticas Avanzadas
            </h1>
            <button onClick={onNavigateToDashboard} className="
              bg-slate-700 light:bg-gray-200 
              hover:bg-slate-600 light:hover:bg-gray-300 
              text-white light:text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Volver al Dashboard
            </button>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800 light:bg-white border-b border-slate-700 light:border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col">
                  <label className="text-xs font-medium text-slate-400 light:text-gray-600 mb-1 flex items-center"><Calendar className="w-3 h-3 mr-2"/>Rango de Fechas</label>
                  <input type="text" placeholder="Últimos 30 días" className="bg-slate-700 light:bg-gray-100 border border-slate-600 light:border-gray-300 rounded-lg py-2 px-3 text-sm text-slate-100 light:text-gray-900 placeholder-slate-400 light:placeholder-gray-500 focus:ring-emerald-500 focus:border-emerald-500"/>
              </div>
              <div className="flex flex-col">
                  <label className="text-xs font-medium text-slate-400 light:text-gray-600 mb-1 flex items-center"><CameraIcon className="w-3 h-3 mr-2"/>Cámara</label>
                  <select className="bg-slate-700 light:bg-gray-100 border border-slate-600 light:border-gray-300 rounded-lg py-2 px-3 text-sm text-slate-100 light:text-gray-900 focus:ring-emerald-500 focus:border-emerald-500">
                      <option className="bg-slate-700 light:bg-gray-100">Todas las cámaras</option>
                      {cameras.map(c => <option key={c.id} className="bg-slate-700 light:bg-gray-100">{c.name}</option>)}
                  </select>
              </div>
              <div className="flex flex-col">
                  <label className="text-xs font-medium text-slate-400 light:text-gray-600 mb-1 flex items-center"><Hash className="w-3 h-3 mr-2"/>Estado</label>
                  <select className="bg-slate-700 light:bg-gray-100 border border-slate-600 light:border-gray-300 rounded-lg py-2 px-3 text-sm text-slate-100 light:text-gray-900 focus:ring-emerald-500 focus:border-emerald-500">
                      <option className="bg-slate-700 light:bg-gray-100">Todos</option>
                      <option className="bg-slate-700 light:bg-gray-100">Confirmada</option>
                      <option className="bg-slate-700 light:bg-gray-100">Falsa Alarma</option>
                      <option className="bg-slate-700 light:bg-gray-100">Pendiente</option>
                  </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                  <TrendingUp className="w-4 h-4 mr-1 inline-block" /> Aplicar
                </button>
              </div>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              <StatCard icon={<BarChart2 className="w-6 h-6 text-orange-400"/>} value={stats.alertsToday} label="Alertas Totales (Hoy)" />
              <StatCard icon={<CheckCircle className="w-6 h-6 text-red-400"/>} value={confirmedCount} label="Alertas Confirmadas" />
              <StatCard icon={<XCircle className="w-6 h-6 text-emerald-400"/>} value={falseAlarmCount} label="Falsas Alarmas" />
              <StatCard icon={<ShieldAlert className="w-6 h-6 text-yellow-400"/>} value={pendingCount} label="Alertas Pendientes" />
          </div>

          {/* Fila de Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 light:bg-white p-4 rounded-xl shadow-md border border-slate-700 light:border-gray-200">
                  <h3 className="font-semibold text-lg text-white light:text-gray-900 mb-3">Alertas a lo largo del tiempo</h3>
                  <div className="h-64">
                      <LineChartPlaceholder data={lineChartData} /> 
                  </div>
              </div>
              <div className="bg-slate-800 light:bg-white p-4 rounded-xl shadow-md border border-slate-700 light:border-gray-200">
                  <h3 className="font-semibold text-lg text-white light:text-gray-900 mb-3">Alertas por Cámara</h3>
                  <div className="h-64">
                      <BarChartPlaceholder data={alertsByCamera} /> 
                  </div>
              </div>
          </div>
          
          {/* Fila de Gráficos y Actividad Reciente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 light:bg-white p-4 rounded-xl shadow-md border border-slate-700 light:border-gray-200 lg:col-span-1">
                  <h3 className="font-semibold text-lg text-white light:text-gray-900 mb-3">Estado de Confirmación</h3>
                  <div className="h-64">
                      <PieChartPlaceholder data={pieChartData} /> 
                  </div>
              </div>
              
              {/* Actividad Reciente (Tabla Grid) */}
              <div className="bg-slate-800 light:bg-white p-4 rounded-xl shadow-md border border-slate-700 light:border-gray-200 lg:col-span-2">
                  <h3 className="font-semibold text-lg text-white light:text-gray-900 mb-3">Actividad Reciente</h3>
                  
                  {/* Encabezados de la Tabla */}
                  <div className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr] gap-4 pb-2 border-b border-slate-700 light:border-gray-200 text-xs font-bold uppercase text-slate-400 light:text-gray-600">
                    <span className="flex items-center"><Hash className="w-3 h-3 mr-1"/> ID</span>
                    <span className="flex items-center"><CameraIcon className="w-3 h-3 mr-1"/> Cámara</span>
                    <span className="flex items-center"><ShieldAlert className="w-3 h-3 mr-1"/> Estado</span>
                    <span className="flex items-center justify-end"><Clock className="w-3 h-3 mr-1"/> Hora</span>
                  </div>

                  {/* Cuerpo de la Tabla */}
                  <div className="overflow-y-auto h-64">
                      {/* Las alertas ya están ordenadas de más reciente a más antigua en useForestFireData */}
                      {alerts.slice(0, 20).map(alert => (
                          <div key={alert.id} className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr] gap-4 py-3 text-sm border-b border-slate-700/50 light:border-gray-200/50 hover:bg-slate-700/30 light:hover:bg-gray-100/50 transition-colors">
                              <span className="text-slate-400 light:text-gray-500 truncate">{alert.id.substring(6, 15)}...</span>
                              <span className="font-medium text-slate-200 light:text-gray-800 truncate">{alert.cameraName}</span>
                              <span className={`font-semibold ${getAlertStatusStyle(alert.confirmationStatus)}`}>{alert.confirmationStatus.replace('Alarm', ' A.')}</span>
                              <span className="text-slate-500 light:text-gray-400 text-right">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default StatisticsPage;