import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { GatewayScreen } from './components/ui/GatewayScreen';

const App: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'gateway' | 'experience'>('loading');

  const isLoaded = progress >= 100;

  useEffect(() => {
    if (appState === 'loading' && isLoaded) {
      setAppState('start');
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    setAppState('entering');
    // Unmount StartScreen dan mount GatewayScreen setelah transisi fade-out
    setTimeout(() => {
      setAppState('gateway');
    }, 1000); // Durasi ini cocok dengan fade-out dari StartScreen
  }, []);

  const handleGatewayEnd = useCallback(() => {
    setAppState('experience');
  }, []);

  const showStartScreen = appState === 'start' || appState === 'entering';
  const showGateway = appState === 'gateway';
  // Pasang Experience3D lebih awal untuk memungkinkan preload aset di latar belakang
  const showExperience = appState === 'entering' || appState === 'gateway' || appState === 'experience';

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#050810' }}>
        <Suspense fallback={null}>
          {showExperience && <Experience3D />}
        </Suspense>
      </main>

      {appState === 'loading' && <Loader progress={progress} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}

      {showGateway && <GatewayScreen onAnimationEnd={handleGatewayEnd} />}
    </>
  );
};

export default App;
