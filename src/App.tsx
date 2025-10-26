import React, { useState, useCallback, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import * as THREE from 'three';

import Experience3D from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { LoaderUI } from './components/ui/Loader';
import { UIController } from './components/ui/UIController';
import { useAppState } from './hooks/useAppState';
import { useBuildMode } from './hooks/useBuildMode';
import { useGameManager } from './hooks/useGameManager';

// Helper component to bridge the progress from inside the Canvas to the App state
const LoadingManager: React.FC<{ onProgress: (p: number) => void, onLoaded: () => void }> = ({ onProgress, onLoaded }) => {
  const { active, progress } = useProgress();
  
  useEffect(() => {
    onProgress(progress);
    if (!active && progress === 100) {
      setTimeout(onLoaded, 300); // Smooth transition
    }
  }, [active, progress, onProgress, onLoaded]);

  return null;
};

const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [progress, setProgress] = useState(0);
  
  const shipRefs = useRef<React.RefObject<THREE.Group>[]>([]);
  const hasShownHintsInitially = !!sessionStorage.getItem('hasShownHints');

  // All state management logic is now centralized here
  const {
    appState,
    handleDistrictSelect,
    handleGoHome,
    handleAnimationFinish,
    handleInteractionStart,
    handleInteractionEnd,
    handleAccessOracleChat,
    setPov,
    handleSetShipRefs,
  } = useAppState(shipRefs, hasShownHintsInitially);

  const {
    buildState,
    handleToggleCalibrationMode,
    handleSetHeldDistrict,
    handlePlaceDistrict,
    handleCancelMove,
    handleExportLayout,
    setDistricts,
    setIsExportModalOpen,
  } = useBuildMode(handleGoHome, handleInteractionEnd);

  const {
    gameState,
    handleLaunchGame,
    handleExitGame,
  } = useGameManager(handleGoHome);

  const navDistricts = useMemo(() => {
    const majorDistricts = buildState.districts.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [nexusCore, ...majorDistricts.filter(d => d.id !== 'nexus-core')]
      : majorDistricts;
  }, [buildState.districts]);


  const handleAssetsLoaded = useCallback(() => {
    setAppStatus('start');
  }, []);
  
  const handleStart = useCallback(() => {
    setAppStatus('entering');
    setTimeout(() => {
      setAppStatus('experience');
    }, 1500); // Matches hydraulic gate animation
  }, []);

  const showStartScreen = appStatus === 'start' || appStatus === 'entering';
  const isExperienceVisible = appStatus === 'experience';

  return (
    <>
      {appStatus === 'loading' && <LoaderUI progress={Math.round(progress)} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appStatus === 'entering'}
        />
      )}
      
      <main style={{
          position: 'fixed',
          inset: 0,
          opacity: isExperienceVisible ? 1 : 0,
          pointerEvents: isExperienceVisible ? 'auto' : 'none',
          transition: 'opacity 1.5s ease-in-out',
        }}>
        <Canvas
            frameloop="demand"
            shadows
        >
          <Suspense fallback={<LoadingManager onProgress={setProgress} onLoaded={handleAssetsLoaded} />}>
            <Experience3D 
              appState={appState}
              buildState={buildState}
              gameState={gameState}
              handlers={{
                setDistricts,
                handleDistrictSelect,
                handleGoHome,
                handleAnimationFinish,
                handleInteractionStart,
                handleInteractionEnd,
                handleAccessOracleChat,
                handleSetShipRefs,
                handleSetHeldDistrict,
                handlePlaceDistrict,
                handleExitGame,
              }}
            />
          </Suspense>
        </Canvas>
        
        {/* UI CONTROLLER IS NOW A SIBLING TO CANVAS, NOT A CHILD */}
        <UIController
            appState={appState}
            buildState={buildState}
            gameState={gameState}
            navDistricts={navDistricts}
            handlers={{
              onDistrictSelect: handleDistrictSelect,
              onGoHome: handleGoHome,
              onSetPov: setPov,
              onToggleCalibrationMode: handleToggleCalibrationMode,
              onExportLayout: handleExportLayout,
              onCancelMove: handleCancelMove,
              onLaunchGame: handleLaunchGame,
              onExitGame: handleExitGame,
              onCloseExportModal: () => setIsExportModalOpen(false),
            }}
          />
      </main>
    </>
  );
};

export default App;
