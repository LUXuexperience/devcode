import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Header from './Header';
import { FileText, Calendar, List, Download, Upload, X, Image, Building2 } from 'lucide-react';

interface ReportsPageProps {
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

//configuración unificada sin separar
const ORGANIZATION_CONFIG = {
  name: 'Secretaría de Medio Ambiente y Recursos Naturales',
  shortName: 'SEMARNAT',
  colors: {
    primary: '#6378bdff',
    secondary: '#53dfa9ff', 
    background: '#6378bdff'
  }
};

//componente de Logo en uno
const OrganizationLogo = ({ customLogo, onLogoChange }: { 
  customLogo: string | null, 
  onLogoChange: (logo: string | null) => void 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      //validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }

      setIsUploading(true);
      
      //simular carga y procesamiento
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          if (e.target?.result) {
            onLogoChange(e.target.result as string);
            setShowUploadModal(false);
          }
          setIsUploading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  //si hay un logo personalizado, muestralo
  if (customLogo) {
    return (
      <div className="flex items-center space-x-3 group relative">
        <div className="bg-white rounded-lg p-1 border-2" style={{ borderColor: ORGANIZATION_CONFIG.colors.primary }}>
          <img 
            src={customLogo} 
            alt={ORGANIZATION_CONFIG.name}
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="text-left">
          <div className="text-white font-bold text-lg">{ORGANIZATION_CONFIG.shortName}</div>
          <div className="text-slate-300 text-xs">{ORGANIZATION_CONFIG.name}</div>
        </div>
        
        {/*botón para cambiar logo */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="absolute -top-2 -right-2 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: ORGANIZATION_CONFIG.colors.primary }}
          title="Cambiar logo"
        >
          <Image className="h-3 w-3" />
        </button>

        {/*modal ventanita para subir imagen */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Subir nuevo logo</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center mb-4 relative">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2" 
                         style={{ borderColor: ORGANIZATION_CONFIG.colors.primary }}></div>
                    <p className="text-slate-400">Subiendo imagen...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-300 mb-2">Arrastra tu logo aquí o haz clic para seleccionar</p>
                    <p className="text-slate-500 text-sm">PNG, JPG (Máx. 2MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  //logo por defecto - icono
  return (
    <div className="flex items-center space-x-3 group relative">
      <div className="rounded-lg p-2 text-white" 
           style={{ backgroundColor: ORGANIZATION_CONFIG.colors.primary }}>
        <Building2 className="h-8 w-8" />
      </div>
      <div className="text-left">
        <div className="text-white font-bold text-lg">{ORGANIZATION_CONFIG.shortName}</div>
        <div className="text-slate-300 text-xs">Sistema de Monitoreo</div>
      </div>
      
      <button
        onClick={() => setShowUploadModal(true)}
        className="absolute -top-2 -right-2 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: ORGANIZATION_CONFIG.colors.primary }}
        title="Subir logo personalizado"
      >
        <Upload className="h-3 w-3" />
      </button>

      {/*modal para subir imagen */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Subir nuevo logo</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center mb-4 relative">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2"
                       style={{ borderColor: ORGANIZATION_CONFIG.colors.primary }}></div>
                  <p className="text-slate-400">Subiendo imagen...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-300 mb-2">Arrastra tu logo aquí o haz clic para seleccionar</p>
                  <p className="text-slate-500 text-sm">PNG, JPG (Máx. 2MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//datos de ejemplo para simular
const sampleAlertData = [
  { id: 1, date: '2023-10-15 14:30', location: 'Bosque La Primavera', camera: 'Cámara 01', confidence: '92%', status: 'Confirmado' },
  { id: 2, date: '2023-10-14 09:15', location: 'Sierra de Quila', camera: 'Cámara 03', confidence: '78%', status: 'En revisión' },
  { id: 3, date: '2023-10-13 16:45', location: 'Volcán de Fuego', camera: 'Cámara 07', confidence: '95%', status: 'Confirmado' },
  { id: 4, date: '2023-10-12 11:20', location: 'Cerro del Tesoro', camera: 'Cámara 12', confidence: '65%', status: 'Falso positivo' },
];

const sampleCameraData = [
  { id: 1, name: 'Cámara 01', location: 'Bosque La Primavera', status: 'Activa', lastMaintenance: '2023-09-20', alerts: 12 },
  { id: 2, name: 'Cámara 03', location: 'Sierra de Quila', status: 'Activa', lastMaintenance: '2023-10-01', alerts: 8 },
  { id: 3, name: 'Cámara 07', location: 'Volcán de Fuego', status: 'Inactiva', lastMaintenance: '2023-08-15', alerts: 15 },
  { id: 4, name: 'Cámara 12', location: 'Cerro del Tesoro', status: 'Activa', lastMaintenance: '2023-10-05', alerts: 5 },
];

const sampleSystemActivityData = [
  { id: 1, timestamp: '2023-10-15 14:30', user: 'admin', action: 'Inicio de sesión', details: 'IP: 192.168.1.100' },
  { id: 2, timestamp: '2023-10-15 13:45', user: 'operador1', action: 'Confirmó alerta', details: 'Alerta ID: 245' },
  { id: 3, timestamp: '2023-10-15 12:20', user: 'admin', action: 'Actualizó configuración', details: 'Umbral de detección' },
  { id: 4, timestamp: '2023-10-15 10:15', user: 'sistema', action: 'Generó reporte', details: 'Reporte semanal' },
];

const ReportsPage: React.FC<ReportsPageProps> = (props) => {
  const { user, onLogout, onNavigateToDashboard, onOpenProfile } = props;
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('Reporte de Alertas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  //cargar logo personalizado desde localStorage al iniciar
  useEffect(() => {
    const savedLogo = localStorage.getItem('organizationCustomLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  //guardar logo personalizado en localStorage cuando cambie
  useEffect(() => {
    if (customLogo) {
      localStorage.setItem('organizationCustomLogo', customLogo);
    } else {
      localStorage.removeItem('organizationCustomLogo');
    }
  }, [customLogo]);

  //previsualización automática
  useEffect(() => {
    console.log('Actualizando previsualización con:', { reportType, startDate, endDate });
  }, [reportType, startDate, endDate]);

  const getPreviewData = () => {
    switch(reportType) {
      case 'Reporte de Alertas': return sampleAlertData;
      case 'Reporte de Cámaras': return sampleCameraData;
      case 'Reporte de Actividad del Sistema': return sampleSystemActivityData;
      default: return sampleAlertData;
    }
  };

  const getPreviewColumns = () => {
    switch(reportType) {
      case 'Reporte de Alertas': return ['Fecha', 'Ubicación', 'Cámara', 'Confianza', 'Estado'];
      case 'Reporte de Cámaras': return ['Nombre', 'Ubicación', 'Estado', 'Último Mantenimiento', 'Alertas'];
      case 'Reporte de Actividad del Sistema': return ['Fecha/Hora', 'Usuario', 'Acción', 'Detalles'];
      default: return ['Fecha', 'Ubicación', 'Cámara', 'Confianza', 'Estado'];
    }
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      const logoType = customLogo ? 'logo personalizado' : 'logo predeterminado';
      alert(`¡Reporte ${reportType} generado exitosamente!\n\nIncluye ${logoType} de: ${ORGANIZATION_CONFIG.name}`);
    }, 2000);
  };

  const previewData = getPreviewData();
  const previewColumns = getPreviewColumns();

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden">
      <Header 
        user={user} 
        onLogout={onLogout} 
        alertCount={0}
        recentAlerts={[]}
        onNotificationClick={() => {}}
        onOpenProfile={onOpenProfile}
        {...props}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="w-8 h-8 mr-3 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Generador de Reportes</h1>
                <p className="text-slate-400 text-sm">
                  {ORGANIZATION_CONFIG.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <OrganizationLogo 
                customLogo={customLogo} 
                onLogoChange={setCustomLogo} 
              />
              <button 
                onClick={onNavigateToDashboard} 
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/*panel de configuración */}
          <div className="w-full lg:w-1/3">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-6">
              <form onSubmit={handleGenerateReport} className="space-y-6">
                <h2 className="text-xl font-semibold text-center text-slate-200 mb-4">
                  Configurar Reporte
                </h2>
                
                <div>
                  <label className="text-sm font-medium text-slate-400 flex items-center mb-2">
                    <List className="w-4 h-4 mr-2"/>Tipo de Reporte
                  </label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Reporte de Alertas</option>
                    <option>Reporte de Cámaras</option>
                    <option>Reporte de Actividad del Sistema</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2"/>Rango de Fechas
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 flex items-center mb-2">
                    <Download className="w-4 h-4 mr-2"/>Formato de Exportación
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input 
                        type="radio" 
                        name="format" 
                        value="pdf" 
                        checked={format === 'pdf'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="h-4 w-4 bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500" 
                      />
                      <span>PDF</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input 
                        type="radio" 
                        name="format" 
                        value="csv" 
                        checked={format === 'csv'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="h-4 w-4 bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500" 
                      />
                      <span>CSV</span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span>Generar Reporte</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/*panel de previsualización automática */}
          <div className="w-full lg:w-2/3">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-200">
                  Previsualización del Reporte
                </h2>
                <div className="text-sm text-slate-400">
                  {previewData.length} registros encontrados
                </div>
              </div>
              
              {/* membrete con logo */}
              <div 
                className="rounded-lg p-6 mb-6 border-l-4"
                style={{ 
                  background: `linear-gradient(135deg, ${ORGANIZATION_CONFIG.colors.primary}99 0%, ${ORGANIZATION_CONFIG.colors.primary} 100%)`,
                  borderLeftColor: ORGANIZATION_CONFIG.colors.secondary
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {customLogo ? (
                      <div className="bg-white rounded-lg p-2 border-2 border-white">
                        <img 
                          src={customLogo} 
                          alt={ORGANIZATION_CONFIG.name}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-white">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                    <div className="text-white">
                      <div className="font-bold text-xl">{ORGANIZATION_CONFIG.name}</div>
                      <div className="text-white text-opacity-90 text-sm">
                        Sistema de Monitoreo de Incendios Forestales
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    <div className="font-bold text-lg">{reportType}</div>
                    <div className="text-sm opacity-90">
                      {startDate && endDate 
                        ? `Período: ${startDate} - ${endDate}`
                        : 'Todos los registros'
                      }
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      Generado: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs uppercase bg-slate-700 text-slate-300">
                    <tr>
                      {previewColumns.map((column, index) => (
                        <th key={index} className="px-4 py-3">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((item) => (
                      <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-750">
                        {Object.keys(item).filter(key => key !== 'id').map((key, index) => (
                          <td key={index} className="px-4 py-3">{item[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-slate-750 rounded-lg border border-slate-600">
                <div className="text-slate-400 text-sm text-center">
                  <strong>Nota:</strong> Esta es una previsualización. 
                  El reporte final incluirá el logo oficial de {ORGANIZATION_CONFIG.name} 
                  y será generado en formato {format.toUpperCase()}.
                  {customLogo && ' (Incluye logo personalizado)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;