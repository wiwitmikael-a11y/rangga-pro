
export interface PortfolioSubItem {
  id: string;
  title: string;
  description: string; 
  content: string; 
  position: [number, number, number];
}

export interface CityDistrict {
  id: string;
  title: string;
  description: string;
  position3D: [number, number, number];
  shape: 'tower' | 'platform' | 'ring';
  // Defines which other district IDs this district should connect to with a data bridge
  connections?: string[]; 
  subItems: PortfolioSubItem[];
}