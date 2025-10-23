

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { Experience3D } from './components/Experience3D';
import { HUD } from './components/ui/HUD';
import type { CityDistrict, PortfolioSubItem } from './types';
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
  const [, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioSubItem | null>(null);
  // Game dihapus, item Nexus sekarang tidak terkunci secara default
  const [unlockedItems] = useState<Set<string>>(new Set(['sub-philosophy', 'sub-skills', 'sub-nexus-1', 'sub-nexus-2']));

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
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setSelectedProject(null);
  }, []);

  const handleProjectClick = useCallback((item: PortfolioSubItem) => {
      if (unlockedItems.has(item.id)) {
          setSelectedProject(item);
      }
  }, [unlockedItems]);
  
  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
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
                onHoverDistrict={setHoveredDistrictId}
                selectedProject={selectedProject}
                onCloseProject={handleCloseProject}
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
            />
          </>
        );
      default:
        return null;
    }
  }, [appState, handleStart, selectedDistrict, handleSelectDistrict, selectedProject, handleCloseProject, unlockedItems, handleProjectClick, performanceTier, handleGoHome, setPerformanceTier]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--background-color)' }}>
      {content}
    </div>
  );
}

export default App;