import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);
  const { active: isLoading } = useProgress();

  useEffect(() => {
    // This effect transitions from the loading state to the start screen
    // once all assets tracked by `useProgress` are fully loaded.
    if (!isLoading && appState === 'loading') {
      const timer = setTimeout(() => {
        setAppState('start');
      }, 500); // A brief delay to ensure the 100% state is visible.
      return () => clearTimeout(timer);
    }
  }, [isLoading, appState]);

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

  return (
    <>
      <main style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--background-color)',
          opacity: showExperience ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
        }}>
        {/* The 3D scene is always mounted to allow for preloading */}
        <Suspense fallback={null}>
          <Canvas>
            <Experience3D />
          </Canvas>
        </Suspense>
      </main>
      
      {/* --- Overlays --- */}
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


const App: React.FC = () => {
  return (
    <>
      <AppContent />
       {/* 
        This is the official Drei loader. It hooks into the Suspense context
        and automatically tracks the loading progress of all assets within the Canvas.
        It is styled to match the project's aesthetic.
      */}
      <Loader
        containerStyles={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--background-color)',
          zIndex: 2000,
          color: 'var(--primary-color)',
          fontFamily: 'var(--font-family)',
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          padding: '20px',
          boxSizing: 'border-box',
        }}
        innerStyles={{
          textAlign: 'center',
        }}
        barStyles={{
          marginTop: '20px',
          height: '4px',
          width: '200px',
          backgroundColor: 'rgba(0, 170, 255, 0.2)',
          borderRadius: '2px',
        }}
        dataStyles={{
          margin: '2px 0',
          whiteSpace: 'pre-wrap',
          textShadow: '0 0 5px var(--primary-color)',
          letterSpacing: '0.05em',
        }}
      />
    </>
  );
};

export default App;
