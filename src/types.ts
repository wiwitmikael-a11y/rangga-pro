import { Vector3 } from 'three';

export type PerformanceTier = 'PERFORMANCE' | 'BALANCED' | 'QUALITY';

export interface CameraFocusPoint {
  pos: [number, number, number];
  lookAt: [number, number, number];
}

export interface PortfolioSubItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Tautan ke gambar thumbnail proyek
  position: [number, number, number]; // Posisi relatif terhadap distrik induk
}

export interface CityDistrict {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  type: 'major' | 'minor';
  height?: number; // Untuk bangunan generik
  subItems?: PortfolioSubItem[];
  cameraFocus?: CameraFocusPoint; // Posisi & target kamera unik
  modelUrl?: string; // URL ke model GLB untuk distrik ini
  modelScale?: number; // Skala untuk model GLB
  isDirty?: boolean; // Flag to track if the district has been moved by the user
}
