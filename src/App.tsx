import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';

const App: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);

  const isLoaded = progress >= 100;

  useEffect(() => {
    if (appState === 'loading' && isLoaded) {
      const timer = setTimeout(() => setAppState('start'), 500);
      return () => clearTimeout(timer);
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    setAppState('entering');
    // This timeout matches the 1.5s hydraulic gate animation duration.
    setTimeout(() => {
      setAppState('experience');
      // Show hints only on the very first entry.
      if (!sessionStorage.getItem('hasShownHints')) {
        setHasShownHints(true);
        sessionStorage.setItem('hasShownHints', 'true');
      }
    }, 1500); 
  }, []);

  const showStartScreen = appState === 'start' || appState === 'entering';
  const showExperience = appState === 'entering' || appState === 'experience';
  const showLoader = appState === 'loading';

  return (
    <>
      <main style={{ 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: 'var(--background-color)',
          opacity: showExperience ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
        }}>
        {/* The 3D scene is always mounted in the background to allow assets to load. */}
        <Suspense fallback={null}>
          <Experience3D />
        </Suspense>
      </main>

      {/* --- Overlays --- */}
      {showLoader && <Loader progress={progress} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}
      
      {hasShownHints && <ControlHints />}
    </>
  );
};

export default App;