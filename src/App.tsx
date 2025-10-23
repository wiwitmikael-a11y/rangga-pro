import React, { useState, Suspense, useCallback } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { usePerformance } from './hooks/usePerformance';

const App: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const { performanceTier } = usePerformance();

  const isLoaded = progress >= 100;

  // Transisi dari loading ke start screen setelah progress selesai
  if (appState === 'loading' && isLoaded) {
    setAppState('start');
  }
  
  const handleStart = useCallback(() => {
    setAppState('entering');
    // Unmount StartScreen setelah transisi fade-out selesai
    setTimeout(() => setAppState('experience'), 1000); 
  }, []);
  
  const showStartScreen = appState === 'start' || appState === 'entering';
  const showExperience = appState === 'entering' || appState === 'experience';

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
        <Suspense fallback={null}>
          {showExperience && <Experience3D performanceTier={performanceTier} />}
        </Suspense>
      </main>
      
      {appState === 'loading' && <Loader progress={progress} />}
      
      {showStartScreen && (
        <StartScreen 
          onStart={handleStart} 
          isExiting={appState === 'entering'} 
        />
      )}
    </>
  );
};

export default App;
