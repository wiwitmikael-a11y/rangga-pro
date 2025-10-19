export interface PortfolioSubItem {
  id: string;
  title: string;
  // A brief description for the 3D banner
  description: string; 
  // Detailed content for the 2D InfoPanel, can include markdown or plain text.
  content: string; 
  position: [number, number, number];
}

export interface CityDistrict {
  id: string;
  title: string;
  description: string;
  position3D: [number, number, number];
  color: string;
  subItems: PortfolioSubItem[];
}
