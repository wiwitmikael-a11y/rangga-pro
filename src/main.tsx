import React, { useState, Suspense, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';

const MainApp: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);

  const isLoaded = progress >= 100;

  useEffect(() => {
    // When loading is complete, transition to the start screen.
    if (appState === 'loading' && isLoaded) {
       // A small delay prevents a jarring flash if loading is very fast.
      const timer = setTimeout(() => setAppState('start'), 500);
      return () => clearTimeout(timer);
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    setAppState('entering');
    // This timeout should match the fade-out transition duration on the StartScreen.
    setTimeout(() => {
      setAppState('experience');
      if (!hasShownHints) {
        setHasShownHints(true);
      }
    }, 1000);
  }, [hasShownHints]);

  const showStartScreen = appState === 'start' || appState === 'entering';
  const showExperience = appState === 'entering' || appState === 'experience';

  return (
    <>
      {/* The 3D experience is always mounted so assets can be loaded by Suspense.
          UI Overlays like the Loader and StartScreen will cover it initially. */}
      <main style={{ 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: '#5e3a1f',
          // Fade in the canvas for a smooth transition once the experience starts
          opacity: showExperience ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
        }}>
        <Suspense fallback={null}>
          <Experience3D />
        </Suspense>
      </main>

      {/* --- Overlays --- */}
      {/* Loader is visible only during the 'loading' state */}
      {appState === 'loading' && <Loader progress={progress} />}

      {/* StartScreen is visible during 'start' and fades out during 'entering' */}
      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}
      
      {/* Control hints are shown once the experience starts for the first time */}
      {hasShownHints && <ControlHints />}
    </>
  );
};


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Fatal Error: Root element 'root' not found in the DOM.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);