import React, { useRef, Suspense, useCallback } from 'react';
import { OrbitControls, Sky } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
// import { FlyingShips } from './scene/FlyingShips'; // Disabled for performance
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData } from '../constants';
import { CameraRig } from './CameraRig';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import { PatrollingCore } from './scene/PatrollingCore';
import { CalibrationGrid } from './scene/CalibrationGrid';
import { BuildModeController } from './scene/BuildModeController';
import { AegisProtocolGame } from './game/AegisProtocolGame';
import { FrameInvalidator } from './FrameInvalidator';
import HolographicInfoPanel from './scene/HolographicInfoPanel';

// Import state types from hooks to define props
import { AppState } from '../hooks/useAppState';
import { BuildState } from '../hooks/useBuildMode';
import { GameState } from '../hooks/useGameManager';

const sunPosition: [number, number, number] = [100, 2, -100];
const sunColor = '#ffd0b3';

interface Experience3DProps {
    appState: AppState;
    buildState: BuildState;
    gameState: GameState;
    handlers: {
      setDistricts: React.Dispatch<React.SetStateAction<any[]>>;
      handleDistrictSelect: (district: any) => void;
      handleGoHome: () => void;
      handleAnimationFinish: () => void;
      handleInteractionStart: () => void;
      handleInteractionEnd: () => void;
      handleAccessOracleChat: () => void;
      handleSetShipRefs: (refs: React.RefObject<THREE.Group>[]) => void;
      handleSetHeldDistrict: (id: string | null) => void;
      handlePlaceDistrict: () => void;
      handleExitGame: () => void;
    };
}

const Experience3D: React.FC<Experience3DProps> = ({ appState, buildState, gameState, handlers }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const patrollingCoreRef = useRef<THREE.Group>(null);

  const {
    selectedDistrict,
    isAnimating,
    isOracleFocused,
    pov,
    targetShipRef,
    isAutoRotating,
    activeModal,
  } = appState;

  const {
    districts,
    isCalibrationMode,
    heldDistrictId,
  } = buildState;

  const {
    isGameActive,
    playerSpawnPosition,
  } = gameState;

  const handleControlsChange = useCallback(() => {
    if (controlsRef.current) {
      const target = controlsRef.current.target;
      const boundary = 150;
      target.x = THREE.MathUtils.clamp(target.x, -boundary, boundary);
      target.z = THREE.MathUtils.clamp(target.z, -boundary, boundary);
      target.y = THREE.MathUtils.clamp(target.y, 0, 50);
    }
  }, []);

  const isPaused = isCalibrationMode || isGameActive;

  return (
    <>
        {/* Environment */}
        <Sky sunPosition={sunPosition} />
        <ambientLight intensity={0.2} color={sunColor} />
        <directionalLight
          castShadow
          position={sunPosition}
          intensity={1.5}
          color={sunColor}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={500}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
        />

        {/* Scene Objects */}
        <CityModel />
        <ProceduralTerrain onDeselect={handlers.handleGoHome} />
        {/* <FlyingShips setShipRefs={handlers.handleSetShipRefs} isPaused={isPaused} /> */}
        <DistrictRenderer
          districts={districts}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handlers.handleDistrictSelect}
          isCalibrationMode={isCalibrationMode}
          heldDistrictId={heldDistrictId}
          onSetHeldDistrict={handlers.handleSetHeldDistrict}
        />
        <PatrollingCore
          ref={patrollingCoreRef}
          isPaused={isPaused}
          isSelected={selectedDistrict?.id === 'oracle-ai'}
          onSelect={() => handlers.handleDistrictSelect(portfolioData.find(d => d.id === 'oracle-ai')!)}
          isFocused={isOracleFocused}
          onAccessChat={handlers.handleAccessOracleChat}
        />

        {/* Conditional Scene Components */}
        {isCalibrationMode && (
          <>
            <CalibrationGrid size={250} />
            <BuildModeController
              districts={districts}
              setDistricts={handlers.setDistricts}
              heldDistrictId={heldDistrictId}
              onPlaceDistrict={handlers.handlePlaceDistrict}
              gridSize={250}
              gridDivisions={25}
            />
          </>
        )}
        {isGameActive && <AegisProtocolGame onExit={handlers.handleExitGame} playerSpawnPosition={playerSpawnPosition.current} />}
        
        {/* 3D UI that must live inside the canvas */}
        <Suspense fallback={null}>
            <HolographicInfoPanel
                district={activeModal === 'infoPanel' ? selectedDistrict : null}
                onClose={handlers.handleGoHome}
            />
        </Suspense>

        {/* Controls & Camera */}
        <CameraRig
          selectedDistrict={selectedDistrict}
          onAnimationFinish={handlers.handleAnimationFinish}
          isAnimating={isAnimating}
          pov={pov}
          targetShipRef={targetShipRef}
          isCalibrationMode={isCalibrationMode}
          patrollingCoreRef={patrollingCoreRef}
        />
        
        {!isGameActive && (
            <OrbitControls
              ref={controlsRef}
              enableDamping={true}
              dampingFactor={0.05}
              minDistance={20}
              maxDistance={300}
              maxPolarAngle={Math.PI / 2.1}
              autoRotate={isAutoRotating}
              autoRotateSpeed={0.3}
              enablePan={!isCalibrationMode}
              enabled={pov === 'main' && !isAnimating && !isCalibrationMode}
              onStart={handlers.handleInteractionStart}
              onEnd={handlers.handleInteractionEnd}
              onChange={handleControlsChange}
          />
        )}
        
        {/* This component handles invalidating the canvas for frameloop="demand" */}
        <FrameInvalidator isAnimating={isAnimating} isAutoRotating={isAutoRotating} />
    </>
  );
};

export default Experience3D;