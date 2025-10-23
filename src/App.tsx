import React, { useState, Suspense, useCallback } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { usePerformance } from './hooks/usePerformance';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const { progress } = useProgress();
  const isLoading = !hasStarted || progress < 100;
  const { performanceTier } = usePerformance();

  const handleStart = useCallback(() => {
    setHasStarted(true);
  }, []);

  // Show loader until assets are ready, then show start screen.
  const showStartScreen = !hasStarted && progress >= 100;

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
        <Suspense fallback={<Loader progress={progress} />}>
          {hasStarted && <Experience3D performanceTier={performanceTier} />}
        </Suspense>
      </main>
      
      {isLoading && <Loader progress={progress} />}
      {showStartScreen && <StartScreen onStart={handleStart} />}
    </>
  );
};

export default App;
