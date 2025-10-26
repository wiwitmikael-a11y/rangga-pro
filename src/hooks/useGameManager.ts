import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { portfolioData } from '../constants';

export type GameState = {
  isGameLobbyOpen: boolean;
  isGameActive: boolean;
  playerSpawnPosition: React.MutableRefObject<THREE.Vector3>;
};

export const useGameManager = (goHome: () => void) => {
  const [isGameLobbyOpen, setIsGameLobbyOpen] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const playerSpawnPosition = useRef(new THREE.Vector3());

  const handleLaunchGame = useCallback(() => {
      setIsGameLobbyOpen(false);
      const aegisDistrict = portfolioData.find(d => d.id === 'aegis-command');
      if (aegisDistrict) {
          const [x, y, z] = aegisDistrict.position;
          playerSpawnPosition.current.set(x, y + 20, z);
      } else {
          playerSpawnPosition.current.set(-50, 40, -50);
      }
      setIsGameActive(true);
  }, []);

  const handleExitGame = useCallback(() => {
      setIsGameActive(false);
      goHome();
  }, [goHome]);

  const gameState: GameState = {
    isGameLobbyOpen,
    isGameActive,
    playerSpawnPosition,
  };

  return {
    gameState,
    handleLaunchGame,
    handleExitGame,
  };
};
