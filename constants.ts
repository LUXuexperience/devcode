import { Camera, CameraStatus, User, UserRole, UserStatus } from './types';

export const INITIAL_USERS: User[] = [
    { name: 'Admin User', email: 'admin@sifdurango.com', role: UserRole.Admin, status: UserStatus.Active, avatarUrl: '' },
    { name: 'Operator User', email: 'operator@sifdurango.com', role: UserRole.Operator, status: UserStatus.Active, avatarUrl: '' },
    { name: 'Viewer User', email: 'viewer@sifdurango.com', role: UserRole.Viewer, status: UserStatus.Active, avatarUrl: '' },
    { name: 'Inactive Operator', email: 'inactiveop@sifdurango.com', role: UserRole.Operator, status: UserStatus.Inactive, avatarUrl: '' },
];


export const INITIAL_CAMERAS: Camera[] = [
  { id: 'cam-01', name: 'Cerro del Púlpito', lat: 24.13, lng: -104.57, status: CameraStatus.Active, model: 'AXIS Q6075-E', activationDate: '2023-01-15T10:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-01-15T10:00:00Z') }] },
  { id: 'cam-02', name: 'Sierra de la Candela', lat: 24.85, lng: -105.11, status: CameraStatus.Active, model: 'Bosch MIC IP 7100i', activationDate: '2023-02-20T11:30:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-02-20T11:30:00Z') }] },
  { id: 'cam-03', name: 'Cañón de Piaxtla', lat: 23.71, lng: -105.89, status: CameraStatus.Inactive, model: 'Hikvision DS-2DF8C842IXS', activationDate: '2023-03-10T09:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-03-10T09:00:00Z') }, { status: CameraStatus.Inactive, timestamp: new Date('2024-05-10T18:00:00Z') }] },
  { id: 'cam-04', name: 'Reserva La Michilía', lat: 23.44, lng: -104.27, status: CameraStatus.Active, model: 'AXIS Q6075-E', activationDate: '2023-04-05T14:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-04-05T14:00:00Z') }] },
  { id: 'cam-05', name: 'El Salto', lat: 23.78, lng: -105.36, status: CameraStatus.Active, model: 'Panasonic WV-X6531N', activationDate: '2023-05-01T12:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-05-01T12:00:00Z') }] },
  { id: 'cam-06', name: 'Pico de la Bufa', lat: 24.03, lng: -104.69, status: CameraStatus.Active, model: 'Bosch MIC IP 7100i', activationDate: '2023-06-15T16:45:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-06-15T16:45:00Z') }] },
  { id: 'cam-07', name: 'Sierra del Nayar', lat: 25.20, lng: -105.45, status: CameraStatus.Inactive, model: 'AXIS Q6075-E', activationDate: '2023-07-22T08:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-07-22T08:00:00Z') }, { status: CameraStatus.Inactive, timestamp: new Date('2024-06-01T10:00:00Z') }] },
  { id: 'cam-08', name: 'Valle de Guatimapé', lat: 24.88, lng: -104.93, status: CameraStatus.Active, model: 'Hikvision DS-2DF8C842IXS', activationDate: '2023-08-18T13:20:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-08-18T13:20:00Z') }] },
  { id: 'cam-09', name: 'Puente de Ojuela', lat: 25.79, lng: -103.78, status: CameraStatus.Active, model: 'Panasonic WV-X6531N', activationDate: '2023-09-30T17:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-09-30T17:00:00Z') }] },
  { id: 'cam-10', name: 'Parque Nacional Guadiana', lat: 23.95, lng: -104.85, status: CameraStatus.Active, model: 'Bosch MIC IP 7100i', activationDate: '2023-10-12T11:00:00Z', statusHistory: [{ status: CameraStatus.Active, timestamp: new Date('2023-10-12T11:00:00Z') }] },
];