import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useProgress } from '@react-three/drei';
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

function AppContent() {
  const [appState, setAppState] = useState<AppState>(AppState.START_SCREEN);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioSubItem | null>(null);
  const [unlockedItems] = useState<Set<string>>(new Set(['sub-philosophy', 'sub-skills', 'sub-nexus-1', 'sub-nexus-2']));

  const { initialTier, performanceTier, setPerformanceTier } = usePerformance();

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
  
  if (!initialTier) return null;

  const content = useMemo(() => {
    switch (appState) {
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

  return content;
}


function App() {
  // `active` akan true selama ada aset yang dimuat
  // `progress` adalah nilai 0-100
  const { active, progress } = useProgress();

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--background-color)' }}>
      {active ? <Loader progress={progress} /> : <AppContent />}
    </div>
  );
}

export default App;
