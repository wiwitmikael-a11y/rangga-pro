export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Left Brain / Logic' | 'Right Brain / Creativity';
  description: string;
  position3D: [number, number, number];
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
