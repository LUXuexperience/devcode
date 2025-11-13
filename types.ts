export enum UserRole {
  Admin = 'Admin',
  Operator = 'Operator',
  Viewer = 'Viewer',
}

export enum UserStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  status: UserStatus;
}

export enum CameraStatus {
  Active = 'active',
  Alert = 'alert',
  Inactive = 'inactive',
}

export interface CameraStatusHistory {
    status: CameraStatus;
    timestamp: Date;
}

export type AuditLogDetail = {
    field: string;
    before: string;
    after: string;
};

export interface AuditLogEntry {
    entityType: 'Alerta' | 'Cámara';
    entityId: string;
    entityName: string;
    action: string;
    user: string;
    timestamp: Date;
    details?: string | AuditLogDetail[];
}


export interface Camera {
  id: string;
  lat: number;
  lng: number;
  status: CameraStatus;
  name: string;
  model?: string;
  isFavorite?: boolean;
  activationDate: string;
  statusHistory: CameraStatusHistory[];
}

export enum AlertConfirmationStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    FalseAlarm = 'false-alarm',
}

export interface AlertNote {
    author: string;
    timestamp: Date;
    text: string;
}

export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  image: string;
  imageWithBox: string;
  imageZoom: string;
  imagePrevFrame: string;
  confidence: number;
  timestamp: Date;
  lat: number;
  lng: number;
  confirmationStatus: AlertConfirmationStatus;
  notes: AlertNote[];
  weather: string;
}

export interface Stats {
  activeCameras: number;
  alertsToday: number;
  falsePositives: number;
}

export type PredictedPerimeter = [number, number][];