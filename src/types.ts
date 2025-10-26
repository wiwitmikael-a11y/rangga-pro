// FIX: Removed self-import of CityDistrict type.
// import { Vector3 } from 'three'; // Unused import

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

// --- New Types for Skills Radar Chart ---
export interface Skill {
  name: string;
  level: number; // A value from 0 to 100
}

export interface SkillCategory {
  category: string;
  description: string; // Narrative description for the category
  skills: Skill[];
  keyMetrics: string[]; // Concrete achievements for the category
}

// --- Types for Oracle AI Gimmick Engine V3 (with Actions & Moderation) ---

export type CityDistrictId = 'nexus-core' | 'aegis-command' | 'oracle-ai' | 'nova-forge' | 'visual-arts' | 'defi-data-vault' | 'skills-matrix' | 'contact';

export interface OracleActionLink {
    text: string;
    targetId: CityDistrictId;
}

export interface OracleGimmickContent {
  keywords: string[];
  fullAnswer: string[]; // Array for variation
  contextualAnswer: string[]; // Array for variation when topic is revisited
  followUpQuestions?: string[];
  actionLink?: OracleActionLink;
}

export interface OracleGimmick {
    gimmickId: string; // e.g., 'bri-experience'
    en: OracleGimmickContent;
    id: OracleGimmickContent;
}

export interface OracleResponse {
    answer: string;
    followUpQuestions: string[];
    gimmickId: string | null; // Used to track conversation state
    actionLink?: OracleActionLink;
}

export interface FallbackContent {
  answer: string;
  followUpQuestions: string[];
  moderation?: boolean;
}

export interface FallbackResponses {
  en: FallbackContent;
  id: FallbackContent;
}