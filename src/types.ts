export interface PortfolioSubItem {
  id: string;
  title: string;
  description: string;
  bannerImage?: string; // Placeholder for future image uploads
  position: [number, number, number]; // Position relative to the district center
}

export interface CityDistrict {
  id: string;
  title: string;
  description: string;
  position3D: [number, number, number];
  color: string;
  subItems: PortfolioSubItem[];
}


export interface ChatMessage {
  id: number;
  sender: 'user' | 'curator';
  text: string;
}

export interface GenArtParams {
  color: string;
  distort: number;
  speed: number;
}