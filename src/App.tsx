import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from './components/ui/Loader';
import { HUD } from './components/ui/HUD';
import Experience3D from './components/Experience3D';
import { portfolioData } from './constants';
import { CityDistrict, PortfolioSubItem } from './types';
import { NexusProtocolGame } from './components/game/NexusProtocolGame';
import { StartScreen } from './components/ui/StartScreen';
import { usePerformance } from './hooks/usePerformance';
import { ACESFilmicToneMapping } from 'three';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [projectedItem, setProjectedItem] = useState<PortfolioSubItem | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set(['sub-philosophy', 'sub-skills']));
  const [gameActive, setGameActive] = useState<CityDistrict | null>(null);

  const { initialTier, performanceTier, setPerformanceTier } = usePerformance();
  
  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => setIsLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === 'contact-terminal') {
      // Open mail link for contact
      window.location.href = "mailto:example@example.com";
      return;
    }
    setSelectedDistrict(district);
    setProjectedItem(null); // Close any open project when selecting a new district
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setProjectedItem(null);
  }, []);

  const handleProjectClick = useCallback((item: PortfolioSubItem) => {
    if (unlockedItems.has(item.id)) {
      setProjectedItem(item);
    } else {
      const parentDistrict = portfolioData.find(d => d.subItems?.some(si => si.id === item.id));
      if (parentDistrict) {
        setGameActive(parentDistrict);
      }
    }
  }, [unlockedItems]);

  const handleGameWin = useCallback(() => {
    if (gameActive?.subItems) {
      setUnlockedItems(prev => {
        const newSet = new Set(prev);
        gameActive.subItems?.forEach(item => newSet.add(item.id));
        return newSet;
      });
    }
    setGameActive(null);
  }, [gameActive]);

  const handleGameExit = () => {
    setGameActive(null);
  };

  const handleCloseProjector = useCallback(() => {
    setProjectedItem(null);
  }, []);
  
  if (isLoading) {
    return <Loader />;
  }

  if (!isStarted) {
    return <StartScreen onStart={handleStart} />;
  }
  
  if (!initialTier) return null; // Wait for performance detection

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [100, 60, 150], fov: 45 }}
        style={{ background: '#000510' }}
        gl={{ 
            antialias: performanceTier !== 'PERFORMANCE', 
            powerPreference: 'high-performance',
            toneMapping: ACESFilmicToneMapping,
        }}
      >
        <Experience3D
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
          hoveredDistrictId={hoveredDistrictId}
          onDistrictHover={setHoveredDistrictId}
          projectedItem={projectedItem}
          onProjectClick={handleProjectClick}
          onCloseProjector={handleCloseProjector}
          unlockedItems={unlockedItems}
          performanceTier={performanceTier}
        />
      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict} 
        onGoHome={handleGoHome}
        performanceTier={performanceTier}
        onSetPerformanceTier={setPerformanceTier}
      />
      {gameActive && (
        <NexusProtocolGame 
          district={gameActive}
          onWin={handleGameWin}
          onExit={handleGameExit}
        />
      )}
    </>
  );
};

export default App;
