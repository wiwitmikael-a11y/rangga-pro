import React, { useState, useCallback, Suspense, useEffect } from 'react';

import { Experience3D } from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';
import { LoaderUI } from './components/ui/Loader'; 

const App: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Simulated Loading Effect ---
  // This provides a reliable loading screen while assets are pre-fetched in the background.
  // It guarantees the user sees feedback immediately, preventing the "black screen" crash.
  useEffect(() => {
    if (appState === 'loading') {
      const totalDuration = 3500; // 3.5 seconds simulated loading time
      let startTime = 0;
      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const currentProgress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
        setProgress(currentProgress);

        if (elapsed < totalDuration) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Wait for one more frame to ensure 100% is displayed before transitioning
          setTimeout(() => setAppState('start'), 100);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [appState]);

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
  // CRITICAL FIX: Only mount the heavy 3D experience when it's time to show it.
  const shouldMountExperience = appState === 'entering' || appState === 'experience';

  return (
    <>
      {/* 
        The asset preloader has been removed as it was the likely cause of the startup crash.
        Assets will now be loaded just-in-time when the Experience3D component is mounted.
      */}

      {appState === 'loading' && <LoaderUI progress={progress} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}
      
      {/* 
        The <main> and <Experience3D> components are now only mounted when needed.
        This is the core fix for the "total black screen" crash, as it prevents
        heavy WebGL initialization from happening too early.
      */}
      {shouldMountExperience && (
          <main style={{
              width: '100vw',
              height: '100vh',
              backgroundColor: 'var(--background-color)',
              opacity: appState === 'experience' ? 1 : 0, // Fade in the canvas
              transition: 'opacity 1.5s ease-in-out',
            }}>
            <Suspense fallback={null}>
                <Experience3D />
            </Suspense>
          </main>
      )}
      
      {hasShownHints && <ControlHints />}
    </>
  );
};

export default App;