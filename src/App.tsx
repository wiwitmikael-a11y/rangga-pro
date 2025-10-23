import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { Experience3D } from './components/Experience3D';
import { HUD } from './components/ui/HUD';
import type { CityDistrict, PortfolioSubItem, PerformanceTier } from './types';
import { portfolioData } from './constants';
import { usePerformance } from './hooks/usePerformance';

// Enum untuk state aplikasi untuk kejelasan yang lebih baik
enum AppState {
  LOADING,
  START_SCREEN,
  EXPLORING,
}

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioSubItem | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set(['sub-philosophy', 'sub-skills']));

  const { initialTier, performanceTier, setPerformanceTier } = usePerformance();
  
  useEffect(() => {
    // Sinkronkan dengan durasi animasi loader
    const timer = setTimeout(() => setAppState(AppState.START_SCREEN), 5500); 
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    setAppState(AppState.EXPLORING);
  }, []);

  const handleSelectDistrict = useCallback((district: CityDistrict | null) => {
    setSelectedDistrict(district);
    setSelectedProject(null); // Tutup tampilan proyek saat berganti distrik
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
  
  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleGameComplete = useCallback(() => {
      setIsGameActive(false);
      setUnlockedItems(prev => new Set([...prev, 'sub-nexus-1', 'sub-nexus-2']));
      // Temukan distrik Nexus dan pilih untuk menampilkan item yang baru dibuka
      const nexusDistrict = portfolioData.find(d => d.id === 'project-nexus');
      if (nexusDistrict) {
          setSelectedDistrict(nexusDistrict);
      }
  }, []);
  
  // Tunggu deteksi GPU untuk mengatur tingkatan awal
  if (!initialTier) return null;

  const content = useMemo(() => {
    switch (appState) {
      case AppState.LOADING:
        return <Loader />;
      case AppState.START_SCREEN:
        return <StartScreen onStart={handleStart} />;
      case AppState.EXPLORING:
        return (
          <>
            <Suspense fallback={null}>
              <Experience3D
                selectedDistrict={selectedDistrict}
                onSelectDistrict={handleSelectDistrict}
                hoveredDistrictId={hoveredDistrictId}
                onHoverDistrict={setHoveredDistrictId}
                selectedProject={selectedProject}
                onCloseProject={handleCloseProject}
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
        );
      default:
        return null;
    }
    // FIX: Corrected typo in dependency array from 'onSetPerformanceTier' to 'setPerformanceTier'.
  }, [appState, handleStart, selectedDistrict, handleSelectDistrict, hoveredDistrictId, selectedProject, handleCloseProject, isGameActive, handleGameComplete, unlockedItems, handleProjectClick, performanceTier, handleGoHome, setPerformanceTier]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--background-color)' }}>
      {content}
    </div>
  );
}

export default App;