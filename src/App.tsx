import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { usePerformance } from './hooks/usePerformance';

const App: React.FC = () => {
  const { progress } = useProgress();
  const [hasEntered, setHasEntered] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isExitingStartScreen, setIsExitingStartScreen] = useState(false);
  const { performanceTier } = usePerformance();

  const isLoaded = progress >= 100;

  const handleStart = useCallback(() => {
    setHasEntered(true);
  }, []);

  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  useEffect(() => {
    if (hasEntered && isSceneReady) {
      setIsExitingStartScreen(true);
    }
  }, [hasEntered, isSceneReady]);
  
  // Conditionally render Experience3D to let it mount and report back when ready
  const showExperience = isLoaded && hasEntered;

  return (
    <>
      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
        <Suspense fallback={null}>
          {showExperience && (
            <Experience3D
              performanceTier={performanceTier}
              onSceneReady={handleSceneReady}
            />
          )}
        </Suspense>
      </main>
      
      {!isLoaded && <Loader progress={progress} />}
      
      {isLoaded && !hasEntered && <StartScreen onStart={handleStart} />}

      {/* The StartScreen remains visible during the fade-out transition */}
      {hasEntered && <StartScreen onStart={() => {}} isExiting={isExitingStartScreen} />}
    </>
  );
};

export default App;
