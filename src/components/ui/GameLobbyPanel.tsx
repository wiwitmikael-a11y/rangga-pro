import React from 'react';

interface GameLobbyPanelProps {
  isOpen: boolean;
  onLaunch: () => void;
  onClose: () => void;
}

// This component has been removed to focus on the free flight portfolio experience.
export const GameLobbyPanel: React.FC<GameLobbyPanelProps> = () => {
  return null;
};
