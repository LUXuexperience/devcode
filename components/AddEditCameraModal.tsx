import React, { useState, useEffect } from 'react';
import { Camera, CameraStatus } from '../types';
import { X, Save, Edit, Plus, MapPin, Text, Type, SlidersHorizontal } from 'lucide-react';

interface AddEditCameraModalProps {
  mode: 'add' | 'edit';
  camera: Camera | null;
  onSave: (camera: Camera) => void;
  onClose: () => void;
}

const emptyCamera: Omit<Camera, 'id'> = {
  name: '',
  lat: 0,
  lng: 0,
  status: CameraStatus.Active,
  model: '',
  isFavorite: false,
  activationDate: '',
  statusHistory: [],
};

const AddEditCameraModal: React.FC<AddEditCameraModalProps> = ({ mode, camera, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Camera, 'id'>>(() => 
    mode === 'edit' && camera ? { ...camera } : emptyCamera
  );

  useEffect(() => {
    if (mode === 'edit' && camera) {
      setFormData({ ...camera });
    } else {
      setFormData(emptyCamera);
    }
  }, [mode, camera]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'lat' || name === 'lng' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: camera?.id || '' }); // id will be replaced for 'add' mode in parent
  };

  const title = mode === 'add' ? 'Añadir Nueva Cámara' : 'Editar Cámara';
  const Icon = mode === 'add' ? Plus : Edit;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Icon className="w-6 h-6 mr-3 text-emerald-400" />
            {title}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><Text className="w-4 h-4 mr-2"/>Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><MapPin className="w-4 h-4 mr-2"/>Latitud</label>
                <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><MapPin className="w-4 h-4 mr-2"/>Longitud</label>
                <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><Type className="w-4 h-4 mr-2"/>Modelo</label>
              <input type="text" name="model" value={formData.model || ''} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 flex items-center mb-1"><SlidersHorizontal className="w-4 h-4 mr-2"/>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {Object.values(CameraStatus).map(status => (
                  <option key={status} value={status} className="capitalize">{status}</option>
                ))}
              </select>
            </div>
          </div>

          <footer className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition flex items-center space-x-2"><Save className="w-4 h-4"/><span>Guardar Cambios</span></button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddEditCameraModal;