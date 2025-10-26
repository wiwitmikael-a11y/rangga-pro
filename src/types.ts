
// FIX: Define CityDistrictId to resolve circular dependency.
export type CityDistrictId =
  | 'nexus-core'
  | 'aegis-command'
  | 'skills-matrix'
  | 'visual-archives'
  | 'ai-labs'
  | 'contact-hub'
  | 'oracle-ai';

export interface CameraFocus {
  pos: [number, number, number];
  lookAt: [number, number, number];
}

export interface PortfolioSubItem {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    position: [number, number, number];
}

export interface CityDistrict {
  id: CityDistrictId;
  title: string;
  description: string;
  position: [number, number, number];
  type: 'major' | 'minor';
  height?: number;
  cameraFocus?: CameraFocus;
  modelUrl?: string;
  modelScale?: number;
  subItems?: PortfolioSubItem[];
  isLocked?: boolean;
  isDirty?: boolean; // Used for architect mode
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: Skill[];
  keyMetrics: string[];
}

// --- Oracle AI Advanced Types ---

export interface OracleActionLink {
  type: 'navigate';
  targetId: CityDistrictId;
  en: { label: string; };
  id: { label:string; };
}

export interface OracleGimmickContent {
  keywords: string[];
  fullAnswer: string[];
  contextualAnswer: string[];
  followUpQuestions?: string[];
  actionLink?: OracleActionLink;
}

export interface OracleGimmick {
  gimmickId: string;
  id: OracleGimmickContent;
  en: OracleGimmickContent;
}

export interface OracleResponse {
  text: string;
  gimmickId: string | null;
  followUpQuestions?: string[];
  actionLink?: OracleActionLink;
}

export interface FallbackResponses {
    en: string[];
    id: string[];
    moderation: {
        en: string[];
        id: string[];
    }
}