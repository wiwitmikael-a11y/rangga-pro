import React, { useState, Suspense, useCallback } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { usePerformance } from './hooks/usePerformance';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const { progress } = useProgress();
  const { performanceTier } = usePerformance();

  const handleStart = useCallback(() => {
    setHasStarted(true);
  }, []);

  const isLoaded = progress >= 100;

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
        <Suspense fallback={null}>
          {hasStarted && isLoaded && <Experience3D performanceTier={performanceTier} />}
        </Suspense>
      </main>
      
      {!isLoaded && <Loader progress={progress} />}
      {isLoaded && !hasStarted && <StartScreen onStart={handleStart} />}
    </>
  );
};

export default App;
