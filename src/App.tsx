import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';

const App: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');

  const isLoaded = progress >= 100;

  useEffect(() => {
    if (appState === 'loading' && isLoaded) {
      // Short delay to ensure the final loading text is visible before transitioning.
      const timer = setTimeout(() => setAppState('start'), 500);
      return () => clearTimeout(timer);
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    if (appState === 'start') {
      setAppState('entering');
    }
  }, [appState]);

  const handleIntroEnd = useCallback(() => {
    setAppState('experience');
  }, []);

  // The intro screen (gate/console) is shown during loading, start, and the entering animation.
  const showIntro = appState === 'loading' || appState === 'start' || appState === 'entering';
  // The 3D experience canvas is mounted after loading is complete to be revealed by the gate.
  const showExperienceCanvas = appState !== 'loading';
  // The HUD only becomes visible after the gate is fully open and the state is 'experience'.
  const isHudVisible = appState === 'experience';

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#050810' }}>
        <Suspense fallback={null}>
          {showExperienceCanvas && (
            <Experience3D 
              isHudVisible={isHudVisible} 
              isEntering={appState === 'entering'} 
            />
          )}
        </Suspense>
      </main>
      
      {showIntro && (
        <StartScreen
          appState={appState}
          progress={progress}
          onStart={handleStart}
          onIntroEnd={handleIntroEnd}
        />
      )}
    </>
  );
};

export default App;