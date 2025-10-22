export interface PortfolioSubItem {
  id: string;
  title: string;
  description: string; 
  content: string; 
  position: [number, number, number];
  imageUrl?: string;
}

export interface CityDistrict {
  id: string;
  title: string;
  description: string;
  position: [number, number, number]; // Grid position [x, 0, z]
  type: 'major' | 'minor'; // Major districts are portfolio items, minor are ambient buildings
  height?: number;
  subItems?: PortfolioSubItem[];
}