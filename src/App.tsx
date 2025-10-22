import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
// Fix: Explicitly use .tsx extension for the Experience3D import to ensure it's resolved as a module.
import { Experience3D } from './components/Experience3D.tsx';
import { HUD } from './components/ui/HUD';
import { CityDistrict, PortfolioSubItem, PerformanceTier } from './types';
import { portfolioData } from './constants';
import { usePerformance } from './hooks/usePerformance';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioSubItem | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set(['sub-philosophy', 'sub-skills']));

  const { initialTier, performanceTier, setPerformanceTier } = usePerformance();
  
  useEffect(() => {
    // Sync with loader animation duration
    const timer = setTimeout(() => setIsLoading(false), 5500); 
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    setIsStarted(true);
  }, []);

  const handleSelectDistrict = useCallback((district: CityDistrict | null) => {
    setSelectedDistrict(district);
    setSelectedProject(null); // Close project view when changing districts
    if (district?.id === 'project-nexus') {
        setIsGameActive(true);
    }
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setSelectedProject(null);
    setIsGameActive(false);
  }, []);

  const handleProjectClick = useCallback((item: PortfolioSubItem) => {
      if (unlockedItems.has(item.id)) {
          setSelectedProject(item);
      }
  }, [unlockedItems]);

  const handleGameComplete = useCallback(() => {
      setIsGameActive(false);
      setUnlockedItems(prev => new Set([...prev, 'sub-nexus-1', 'sub-nexus-2']));
      // Find the Nexus district and select it to show the newly unlocked items
      const nexusDistrict = portfolioData.find(d => d.id === 'project-nexus');
      if (nexusDistrict) {
          setSelectedDistrict(nexusDistrict);
      }
  }, []);
  
  // Wait for GPU detection to set the initial tier
  if (!initialTier) return null; 

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {isLoading ? (
        <Loader />
      ) : !isStarted ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <>
          <Suspense fallback={null}>
            <Experience3D
              selectedDistrict={selectedDistrict}
              onSelectDistrict={handleSelectDistrict}
              hoveredDistrictId={hoveredDistrictId}
              onHoverDistrict={setHoveredDistrictId}
              selectedProject={selectedProject}
              onCloseProject={() => setSelectedProject(null)}
              isGameActive={isGameActive}
              onGameComplete={handleGameComplete}
              unlockedItems={unlockedItems}
              onProjectClick={handleProjectClick}
              performanceTier={performanceTier}
            />
          </Suspense>
          <HUD
            selectedDistrict={selectedDistrict}
            onGoHome={handleGoHome}
            performanceTier={performanceTier}
            onSetPerformanceTier={setPerformanceTier}
            isGameActive={isGameActive}
          />
        </>
      )}
    </div>
  );
}

export default App;