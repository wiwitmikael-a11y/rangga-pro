import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';

const App: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');

  const isLoaded = progress >= 100;

  useEffect(() => {
    if (appState === 'loading' && isLoaded) {
      setAppState('start');
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    setAppState('entering');
  }, []);

  const handleIntroEnd = useCallback(() => {
    setAppState('experience');
  }, []);

  const showIntro = appState === 'start' || appState === 'entering';
  // Pre-mount Experience3D to allow asset preloading in the background, but keep it invisible behind the gate.
  const showExperience = appState !== 'loading';
  // The HUD should only be visible after the intro sequence is complete.
  const isHudVisible = appState === 'experience';

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#050810' }}>
        <Suspense fallback={null}>
          {showExperience && <Experience3D isHudVisible={isHudVisible} />}
        </Suspense>
      </main>

      {appState === 'loading' && <Loader progress={progress} />}

      {showIntro && (
        <StartScreen
          onIntroEnd={handleIntroEnd}
          isEntering={appState === 'entering'}
        />
      )}
    </>
  );
};

export default App;
