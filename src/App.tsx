import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';

import Experience3D from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';
import { LoaderUI } from './components/ui/Loader'; 

// Helper component to bridge the progress from inside the Canvas to the App state
const LoadingManager: React.FC<{ onProgress: (p: number) => void, onLoaded: () => void }> = ({ onProgress, onLoaded }) => {
  const { active, progress } = useProgress();
  
  useEffect(() => {
    onProgress(progress);
    if (!active) {
      // Use a small timeout to ensure the final 100% is visible and transition is smooth
      setTimeout(onLoaded, 300);
    }
  }, [active, progress, onProgress, onLoaded]);

  return null; // This component doesn't render anything itself
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAssetsLoaded = useCallback(() => {
    setAppState('start');
  }, []);
  
  const handleStart = useCallback(() => {
    setAppState('entering');
    // This timeout matches the 1.5s hydraulic gate animation duration
    setTimeout(() => {
      setAppState('experience');
      if (!sessionStorage.getItem('hasShownHints')) {
        setHasShownHints(true);
        sessionStorage.setItem('hasShownHints', 'true');
      }
    }, 1500);
  }, []);

  const showStartScreen = appState === 'start' || appState === 'entering';
  // The 3D experience is always in the DOM after the initial load to prevent re-loading assets.
  // Its visibility is controlled by the appState.
  const isExperienceVisible = appState === 'experience';

  return (
    <>
      {appState === 'loading' && <LoaderUI progress={Math.round(progress)} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}
      
      {/* 
        The main container for the 3D experience.
        It's mounted immediately but kept hidden during the loading and start screens.
        This ensures assets are loaded in the background and ready for a seamless transition.
      */}
      <main style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--background-color)',
          // Control visibility and fade-in via opacity
          opacity: isExperienceVisible ? 1 : 0,
          // Hide from mouse events when not visible to prevent interference
          pointerEvents: isExperienceVisible ? 'auto' : 'none',
          transition: 'opacity 1.5s ease-in-out',
        }}>
        <Canvas>
          <Suspense fallback={null}>
            <Experience3D />
          </Suspense>
          {/* This component hooks into the loader and reports progress back up to the App */}
          {appState === 'loading' && (
            <LoadingManager onProgress={setProgress} onLoaded={handleAssetsLoaded} />
          )}
        </Canvas>
      </main>
      
      {hasShownHints && <ControlHints />}
    </>
  );
};

export default App;
