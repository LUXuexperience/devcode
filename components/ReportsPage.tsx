import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import Header from './Header';
import { 
  FileText, List, Download, Upload, 
  Building2, RefreshCw, Edit3, Shield, CheckCircle 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsPageProps {
  user: User;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onOpenProfile: () => void;
  [key: string]: any;
}

const GOV_THEME = {
  primary: '#1a4d2e',
  secondary: '#bfa15f',
  accent: '#9f2241',
  text: '#333333',
  lightGray: '#f5f5f5'
};

const sampleAlertData = [
  { id: 1, date: '2023-10-15', time: '14:30', location: 'Bosque La Primavera', camera: 'Cámara 01', confidence: '92%', status: 'Confirmado' },
  { id: 2, date: '2023-10-14', time: '09:15', location: 'Sierra de Quila', camera: 'Cámara 03', confidence: '78%', status: 'En revisión' },
  { id: 3, date: '2023-10-13', time: '16:45', location: 'Volcán de Fuego', camera: 'Cámara 07', confidence: '95%', status: 'Confirmado' },
  { id: 4, date: '2023-10-12', time: '11:20', location: 'Cerro del Tesoro', camera: 'Cámara 12', confidence: '65%', status: 'Falso positivo' },
  { id: 5, date: '2023-10-15', time: '18:00', location: 'Sierra Madre', camera: 'Cámara 02', confidence: '88%', status: 'Confirmado' },
];

const sampleCameraData = [
  { id: 1, name: 'Cámara 01', location: 'Bosque La Primavera', status: 'Activa', lastMaintenance: '2023-09-20', alerts: 12 },
  { id: 2, name: 'Cámara 03', location: 'Sierra de Quila', status: 'Activa', lastMaintenance: '2023-10-01', alerts: 8 },
  { id: 3, name: 'Cámara 07', location: 'Volcán de Fuego', status: 'Inactiva', lastMaintenance: '2023-08-15', alerts: 15 },
];

const sampleSystemActivityData = [
  { id: 1, date: '2023-10-15', time: '14:30', user: 'admin', action: 'Inicio de sesión', details: 'IP: 192.168.1.100' },
  { id: 2, date: '2023-10-15', time: '13:45', user: 'operador1', action: 'Confirmó alerta', details: 'Alerta ID: 245' },
];

const ReportsPage: React.FC<ReportsPageProps> = (props) => {
  const { user, onLogout, onNavigateToDashboard, onOpenProfile } = props;
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [customShield, setCustomShield] = useState<string | null>(null);
  
  const [reportType, setReportType] = useState('Reporte de Alertas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');

  const [docTitle, setDocTitle] = useState('REPORTE DE INCIDENCIAS FORESTALES');
  const [departmentName, setDepartmentName] = useState('Secretaría de Recursos Naturales y Medio Ambiente');
  const [elaboratedBy, setElaboratedBy] = useState(user?.name || 'Coordinación de Monitoreo');
  const [observations, setObservations] = useState('Este documento contiene información sensible y es para uso exclusivo del personal autorizado.');
  const [folio, setFolio] = useState(`SRNMA-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    const savedLogo = localStorage.getItem('organizationCustomLogo');
    if (savedLogo) setCustomLogo(savedLogo);

    const savedShield = localStorage.getItem('organizationCustomShield');
    if (savedShield) setCustomShield(savedShield);
  }, []);

  const filteredData = useMemo(() => {
    let dataRaw: any[] = [];
    switch(reportType) {
      case 'Reporte de Alertas': dataRaw = sampleAlertData; break;
      case 'Reporte de Cámaras': dataRaw = sampleCameraData; break;
      case 'Reporte de Actividad del Sistema': dataRaw = sampleSystemActivityData; break;
      default: dataRaw = sampleAlertData;
    }

    if (!startDate && !endDate) return dataRaw;

    return dataRaw.filter(item => {
      const itemDate = item.date || item.lastMaintenance || ''; 
      if (!itemDate) return true;
      const start = startDate ? startDate : '0000-01-01';
      const end = endDate ? endDate : '9999-12-31';
      return itemDate >= start && itemDate <= end;
    });
  }, [reportType, startDate, endDate]);

  const getColumns = () => {
    switch(reportType) {
      case 'Reporte de Alertas': return ['Fecha', 'Hora', 'Ubicación', 'Cámara', 'Confianza', 'Estado'];
      case 'Reporte de Cámaras': return ['Nombre', 'Ubicación', 'Estado', 'Mantenimiento', 'Alertas'];
      case 'Reporte de Actividad del Sistema': return ['Fecha', 'Hora', 'Usuario', 'Acción', 'Detalles'];
      default: return [];
    }
  };

  // Manejadores de carga de imagen
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert('La imagen debe ser menor a 2MB'); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const res = e.target.result as string;
          setCustomLogo(res);
          localStorage.setItem('organizationCustomLogo', res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShieldUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert('La imagen debe ser menor a 2MB'); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const res = e.target.result as string;
          setCustomShield(res);
          localStorage.setItem('organizationCustomShield', res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- GENERADORES (PDF / CSV) ---
  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    
    doc.setFillColor(26, 77, 46);
    doc.rect(0, 0, pageWidth, 25, 'F'); 
    doc.setFillColor(191, 161, 95); 
    doc.rect(0, 25, pageWidth, 1.5, 'F');

    if (customLogo) { try { doc.addImage(customLogo, 'PNG', 10, 2, 20, 20); } catch (e) {} }
    if (customShield) { try { doc.addImage(customShield, 'PNG', pageWidth - 30, 2, 20, 20); } catch (e) {} }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12); 
    doc.setFont("helvetica", "bold");
    doc.text(departmentName.toUpperCase(), pageWidth / 2, 10, { align: 'center', maxWidth: pageWidth - 80 });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("SISTEMA DE MONITOREO Y PREDICCIÓN DE INCENDIOS FORESTALES", pageWidth / 2, 20, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text(docTitle, 14, 45); 

    const labelX = pageWidth - 45; const valueX = pageWidth - 14;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold"); doc.text("FOLIO:", labelX, 40, { align: 'right' });
    doc.setFont("helvetica", "normal"); doc.text(folio, valueX, 40, { align: 'right' });
    doc.setFont("helvetica", "bold"); doc.text("EMISIÓN:", labelX, 45, { align: 'right' });
    doc.setFont("helvetica", "normal"); doc.text(new Date().toLocaleDateString(), valueX, 45, { align: 'right' });
    if (startDate || endDate) {
        doc.setFont("helvetica", "bold"); doc.text("RANGO:", labelX, 50, { align: 'right' });
        doc.setFont("helvetica", "normal"); doc.text(startDate ? `${startDate} al ${endDate || 'Hoy'}` : 'Todo', valueX, 50, { align: 'right' });
    }

    doc.setDrawColor(200, 200, 200); doc.line(14, 55, pageWidth - 14, 55);

    // 5. Tabla
    const data = filteredData;
    const tableBody = data.map(item => Object.keys(item).filter(k => k !== 'id').map(k => String(item[k])));

    autoTable(doc, {
      head: [getColumns()],
      body: tableBody,
      startY: 65,
      theme: 'striped',
      headStyles: { fillColor: [26, 77, 46], textColor: 255, fontSize: 9, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      margin: { top: 65, left: 14, right: 14 }
    });

    let finalY = (doc as any).lastAutoTable.finalY + 15;
    if (finalY > pageHeight - 50) { doc.addPage(); finalY = 40; }

    doc.setFontSize(9); doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "bold"); doc.text("OBSERVACIONES / NOTAS:", 14, finalY);
    doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
    const splitNotes = doc.splitTextToSize(observations, pageWidth - 28); doc.text(splitNotes, 14, finalY + 6);

    const signatureY = finalY + 40;
    doc.setDrawColor(0, 0, 0); doc.line(pageWidth / 2 - 40, signatureY, pageWidth / 2 + 40, signatureY);
    doc.setFontSize(9); doc.setTextColor(0, 0, 0); doc.text(elaboratedBy.toUpperCase(), pageWidth / 2, signatureY + 5, { align: 'center' });
    doc.setFontSize(7); doc.text("RESPONSABLE DE ELABORACIÓN", pageWidth / 2, signatureY + 10, { align: 'center' });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); doc.setFontSize(7); doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount} | Folio: ${folio}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
      doc.text(`Sistema de Monitoreo Forestal - ${departmentName}`, 14, pageHeight - 10);
    }

    doc.save(`Reporte_${folio}.pdf`);
  };

  const generateCSV = () => {
    const columns = getColumns();
    const data = filteredData;
    const clean = (text: string) => {
        if (!text) return '';
        const str = String(text);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str.replace(/"/g, '""')}"`;
        return str;
    };

    const rows = [
        [clean(departmentName.toUpperCase())], ["SISTEMA DE MONITOREO Y PREDICCIÓN DE INCENDIOS FORESTALES"], [],
        ["REPORTE:", clean(docTitle)], ["FOLIO:", clean(folio)], ["FECHA DE EMISIÓN:", new Date().toLocaleDateString()],
        ["RANGO DE DATOS:", startDate ? `${startDate} al ${endDate}` : "Historial Completo"], [],
        columns.map(clean),
        ...data.map(item => Object.values(item).filter((_, idx) => Object.keys(item)[idx] !== 'id').map(val => clean(String(val)))),
        [], [], ["OBSERVACIONES:"], [clean(observations)], [], [], [],
        ["", "", "__________________________"], ["", "", clean(elaboratedBy.toUpperCase())], ["", "", "RESPONSABLE DE ELABORACIÓN"]
    ];

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType.replace(/ /g, '_')}_${folio}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        if (format === 'pdf') await generatePDF();
        else generateCSV();
      } catch (error) {
        console.error("Error generando reporte", error);
        alert("Hubo un error al generar el reporte");
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  const inputClass = `
    w-full rounded p-2 text-sm transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none border
    /* Modo Claro */
    bg-white border-slate-300 text-slate-900 placeholder-slate-400
    /* Modo Oscuro */
    dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-500
  `;

  const labelClass = `
    text-xs font-medium mb-1 block transition-colors
    text-slate-600 dark:text-slate-400
  `;

  const cardClass = `
    p-4 rounded-lg border transition-colors space-y-4
    bg-slate-50 border-slate-200
    dark:bg-slate-900/50 dark:border-slate-700
  `;

  const sectionTitleClass = `
    font-semibold text-sm uppercase tracking-wider border-b pb-2 flex items-center transition-colors
    text-slate-700 border-slate-200
    dark:text-slate-300 dark:border-slate-700
  `;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden transition-colors duration-500
        bg-slate-50 dark:bg-slate-900"
    >
      <Header 
        user={user} onLogout={onLogout} alertCount={0} recentAlerts={[]} 
        onNotificationClick={() => {}} onOpenProfile={onOpenProfile} {...props}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        <div className="w-full lg:w-1/3 border-r overflow-y-auto custom-scrollbar transition-colors
            bg-white border-slate-200
            dark:bg-slate-800 dark:border-slate-700"
        >
          <div className="p-6 space-y-8">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-1 transition-colors text-slate-800 dark:text-white">
                    <FileText className="text-emerald-600 dark:text-emerald-500" /> Configuración
                </h2>
                <p className="text-sm transition-colors text-slate-500 dark:text-slate-400">Define los parámetros del reporte oficial.</p>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-6">
                
                <div className={cardClass}>
                    <h3 className={sectionTitleClass}>
                        1. Filtrado de Datos
                    </h3>
                    <div>
                        <label className={labelClass}>Tipo de Reporte</label>
                        <div className="relative">
                            <select 
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className={`${inputClass} pl-8`}
                            >
                                <option>Reporte de Alertas</option>
                                <option>Reporte de Cámaras</option>
                                <option>Reporte de Actividad del Sistema</option>
                            </select>
                            <List className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Fecha Inicio</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Fecha Fin</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                    <div className="text-xs flex items-center justify-end transition-colors text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {filteredData.length} registros encontrados
                    </div>
                </div>

                <div className={cardClass}>
                    <h3 className={sectionTitleClass}>
                        <Edit3 className="w-4 h-4 mr-2" /> 2. Personalizar Documento
                    </h3>
                    <div>
                        <label className={labelClass}>Título del Reporte</label>
                        <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Dependencia / Secretaría</label>
                        <input type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Responsable (Elaboró)</label>
                        <input type="text" value={elaboratedBy} onChange={(e) => setElaboratedBy(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Notas / Observaciones</label>
                        <textarea value={observations} onChange={(e) => setObservations(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                    </div>
                    <div>
                        <label className={labelClass}>Folio (Auto-generado)</label>
                        <div className="flex gap-2">
                            <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} className={`${inputClass} font-mono text-slate-500`} />
                            <button 
                                type="button" 
                                onClick={() => setFolio(`SRNMA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`)}
                                className="p-2 rounded transition-colors bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300" 
                                title="Regenerar Folio"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                  type="submit" disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                >
                  {isGenerating ? (
                    <> <RefreshCw className="w-5 h-5 animate-spin" /> <span>Procesando...</span> </>
                  ) : (
                    <> <Download className="w-5 h-5" /> <span>{format === 'pdf' ? 'DESCARGAR PDF OFICIAL' : 'DESCARGAR CSV (EXCEL)'}</span> </>
                  )}
                </button>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-2/3 p-8 overflow-y-auto flex flex-col items-center transition-colors
            bg-slate-200 dark:bg-slate-950"
        >
            <div className="mb-4 w-full max-w-3xl flex justify-between items-center text-sm transition-colors text-slate-600 dark:text-slate-400">
                <span>Vista previa del documento (A4)</span>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition">
                        <input type="radio" checked={format === 'pdf'} onChange={() => setFormat('pdf')} className="accent-emerald-500"/> PDF
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition">
                        <input type="radio" checked={format === 'csv'} onChange={() => setFormat('csv')} className="accent-emerald-500"/> CSV (Excel)
                    </label>
                </div>
            </div>

            <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl relative text-slate-800 text-sm flex flex-col">
                
                <div style={{ backgroundColor: GOV_THEME.primary }} className="h-20 w-full relative flex items-center justify-between px-8">
                    
                    <div className="group relative bg-white/10 hover:bg-white/20 rounded transition cursor-pointer p-2">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" title="Clic para cambiar el logo" />
                        {customLogo ? (
                            <img src={customLogo} alt="Logo" className="h-14 w-auto object-contain" />
                        ) : (
                            <div className="h-14 w-14 flex items-center justify-center text-white/50 border-2 border-dashed border-white/30 rounded">
                                <Upload className="w-6 h-6" />
                            </div>
                        )}
                        <div className="absolute -bottom-6 left-0 text-[10px] text-white opacity-0 group-hover:opacity-100 w-full text-center bg-black/50 rounded px-1 pointer-events-none whitespace-nowrap">Cambiar Logo</div>
                    </div>

                    <div className="text-center text-white flex-1 mx-4">
                        <div className="font-bold text-sm tracking-wide">{departmentName.toUpperCase()}</div>
                        <div className="text-[10px] opacity-90 font-light mt-1">SISTEMA DE MONITOREO Y PREDICCIÓN DE INCENDIOS FORESTALES</div>
                    </div>

                    <div className="group relative bg-white/10 hover:bg-white/20 rounded transition cursor-pointer p-2">
                        <input type="file" accept="image/*" onChange={handleShieldUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" title="Clic para cambiar el escudo" />
                        {customShield ? (
                            <img src={customShield} alt="Escudo" className="h-14 w-auto object-contain" />
                        ) : (
                            <div className="h-14 w-14 flex items-center justify-center text-white/50 border-2 border-dashed border-white/30 rounded">
                                <Shield className="w-6 h-6" />
                            </div>
                        )}
                        <div className="absolute -bottom-6 left-0 text-[10px] text-white opacity-0 group-hover:opacity-100 w-full text-center bg-black/50 rounded px-1 pointer-events-none whitespace-nowrap">Cambiar Escudo</div>
                    </div>
                </div>
                <div style={{ backgroundColor: GOV_THEME.secondary }} className="h-1.5 w-full mb-8"></div>
                
                <div className="px-12 flex-1">
                    <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
                        <div><h1 className="text-xl font-bold text-slate-900 uppercase max-w-md leading-tight">{docTitle}</h1></div>
                        <div className="text-right text-xs space-y-1 text-slate-600">
                            <div><strong>FOLIO:</strong> <span className="font-mono text-slate-900">{folio}</span></div>
                            <div><strong>FECHA:</strong> {new Date().toLocaleDateString()}</div>
                            {startDate && <div><strong>PERIODO:</strong> {startDate} - {endDate || 'Actualidad'}</div>}
                        </div>
                    </div>
                    <div className="mb-8">
                        <table className="w-full text-xs">
                            <thead>
                                <tr style={{ backgroundColor: GOV_THEME.primary }} className="text-white uppercase">
                                    {getColumns().map((col, i) => <th key={i} className="py-2 px-2 text-left font-semibold first:pl-4 last:pr-4">{col}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.slice(0, 8).map((item, i) => (
                                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                            {Object.values(item).filter((_, idx) => Object.keys(item)[idx] !== 'id').map((val, idx) => (
                                                <td key={idx} className="py-2 px-2 first:pl-4 last:pr-4 text-slate-600">{String(val)}</td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={getColumns().length} className="py-8 text-center text-slate-400 italic bg-slate-50">No hay datos disponibles en el rango seleccionado.</td></tr>
                                )}
                            </tbody>
                        </table>
                        {filteredData.length > 8 && <div className="text-center text-xs text-slate-400 mt-2 italic">... {filteredData.length - 8} registros más visibles en el documento final ...</div>}
                    </div>
                    <div className="mt-auto mb-12">
                        <div className="bg-slate-50 p-4 rounded border border-slate-100 mb-12">
                            <h4 className="font-bold text-xs mb-1 text-slate-700">OBSERVACIONES:</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{observations}</p>
                        </div>
                        <div className="flex justify-center">
                            <div className="text-center w-64">
                                <div className="border-t border-slate-800 pt-2 mt-10">
                                    <div className="font-bold text-slate-800 uppercase text-xs">{elaboratedBy}</div>
                                    <div className="text-[10px] text-slate-500">RESPONSABLE DE ELABORACIÓN</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-100 h-10 flex items-center justify-between px-12 text-[10px] text-slate-400 border-t">
                    <span>Documento oficial - SRNMA Durango</span>
                    <span>Página 1 de 1</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;