import React, { useState, useCallback, Suspense, useEffect } from 'react';

// CRITICAL FIX: Lazy load the heavy 3D component.
// This prevents its code from being parsed and executed on initial load,
// which was the root cause of the "total black screen" crash.
const Experience3D = React.lazy(() => import('./components/Experience3D'));
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';
import { LoaderUI } from './components/ui/Loader'; 

const App: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Simulated Loading Effect ---
  // This provides a reliable loading screen while assets are pre-fetched by the browser in the background.
  // It guarantees the user sees feedback immediately.
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
      if (!sessionStorage.getItem('hasShownHints')) {
        setHasShownHints(true);
        sessionStorage.setItem('hasShownHints', 'true');
      }
    }, 1500);
  }, []);

  const showStartScreen = appState === 'start' || appState === 'entering';
  const shouldMountExperience = appState === 'entering' || appState === 'experience';

  return (
    <>
      {appState === 'loading' && <LoaderUI progress={progress} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}
      
      {/* 
        The Experience3D component is now lazy-loaded and wrapped in Suspense.
        It will only be requested and rendered when shouldMountExperience becomes true.
      */}
      {shouldMountExperience && (
          <main style={{
              width: '100vw',
              height: '100vh',
              backgroundColor: 'var(--background-color)',
              opacity: appState === 'experience' ? 1 : 0,
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
