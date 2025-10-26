import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import { portfolioData } from '../constants';
import type { CityDistrict } from '../types';

import { CameraRig } from './CameraRig';
import { CityModel } from './scene/CityModel';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import FloatingParticles from './scene/FloatingParticles';
import { FlyingShips } from './scene/FlyingShips';
import { PatrollingCore } from './scene/PatrollingCore';
import DataTrail from './scene/DataTrail';
import { BuildModeController } from './scene/BuildModeController';
import { CalibrationGrid } from './scene/CalibrationGrid';

import { HUD } from './ui/HUD';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ExportLayoutModal } from './ui/ExportLayoutModal';
import { useCopterControls } from '../hooks/useCopterControls';
import { ThrustTrail } from './scene/ThrustTrail';

// A simple player ship model for POV mode, corrected for forwardRef usage
const PlayerShip = React.forwardRef<THREE.Group, {}>((_props, ref) => (
  <group ref={ref}>
    <mesh>
      <coneGeometry args={[0.5, 2, 8]} />
      <meshStandardMaterial color="gold" emissive="orange" />
    </mesh>
    <ThrustTrail position={[0, 0, -1]} length={4} width={0.3} />
  </group>
));
PlayerShip.displayName = 'PlayerShip';


export const Experience3D: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isDetailViewActive, setIsDetailViewActive] = useState(false);
  const [isCameraAnimating, setIsCameraAnimating] = useState(false);
  
  // UI Panels State
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // POV and Architect Mode State
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);

  // FIX: Provide an explicit `null` initial value to `useRef` to resolve potential type inference issues.
  const controlsRef = useRef<any>(null);
  const playerShipRef = useRef<THREE.Group>(null);
  
  // --- HOOKS ---
  // FIX: Enable Copter Controls only when POV is 'ship'
  useCopterControls(playerShipRef, pov === 'ship');

  useEffect(() => {
    if (controlsRef.current) {
        controlsRef.current.enabled = pov === 'main' && !isCameraAnimating && !isCalibrationMode;
    }
  }, [pov, isCameraAnimating, isCalibrationMode]);

  // --- HANDLERS ---
  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isCalibrationMode) return;
    setSelectedDistrict(district);
    setIsCameraAnimating(true);
  }, [isCalibrationMode]);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setIsCameraAnimating(true);
    setIsDetailViewActive(false);
    if(pov === 'ship') setPov('main');
  }, [pov]);

  const handleCameraAnimationFinish = useCallback(() => {
    setIsCameraAnimating(false);
    if (selectedDistrict) {
      setIsDetailViewActive(true);
    }
  }, [selectedDistrict]);

  const handleToggleCalibrationMode = useCallback(() => {
    setIsCalibrationMode(prev => !prev);
    if (selectedDistrict) {
      handleGoHome();
    }
  }, [selectedDistrict, handleGoHome]);
  
  const handlePlaceDistrict = useCallback(() => {
    setHeldDistrictId(null);
  }, []);

  const handleCancelMove = useCallback(() => {
    // This is a simplified reset. A more robust implementation might store original positions separately.
    const originalPositions = portfolioData.reduce((acc, d) => ({ ...acc, [d.id]: d.position }), {} as {[key: string]: [number, number, number]});
    setDistricts(prev => prev.map(d => ({ ...d, position: originalPositions[d.id] || d.position, isDirty: false })));
    setHeldDistrictId(null);
  }, []);

  const exportedJsonData = useMemo(() => {
    const dirtyDistricts = districts.filter(d => d.isDirty);
    if (dirtyDistricts.length === 0) return "No layout changes to export.";
    // Create a string representation of the new positions for easy copy-paste
    return JSON.stringify(districts, (_key, value) => { // Fixed unused 'key' parameter
      if (typeof value === 'number') {
        return parseFloat(value.toFixed(2));
      }
      return value;
    }, 2);
  }, [districts]);

  return (
    <>
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={60} position={[0, 60, 120]} />
        <OrbitControls 
          ref={controlsRef} 
          enableDamping 
          dampingFactor={0.1}
          minDistance={10} 
          maxDistance={200} 
          maxPolarAngle={Math.PI / 2.1}
        />
        
        {/* --- LIGHTING & ENVIRONMENT --- */}
        <ambientLight intensity={0.2} />
        <directionalLight
          castShadow
          position={[50, 80, 50]}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 30, 0]} intensity={2} color="#00ffff" distance={100} />
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade />
        
        {/* --- SCENE CONTENT --- */}
        <ProceduralTerrain onDeselect={handleGoHome} />
        <CityModel />
        <FloatingParticles count={200} />
        <FlyingShips />
        <PatrollingCore isPaused={pov === 'ship'} />
        {pov === 'main' && <DataTrail />}

        <DistrictRenderer
          districts={districts}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
          isCalibrationMode={isCalibrationMode}
          heldDistrictId={heldDistrictId}
          onSetHeldDistrict={setHeldDistrictId}
        />

        {pov === 'ship' && <PlayerShip ref={playerShipRef} />}

        {isCalibrationMode && (
          <>
            <CalibrationGrid />
            <BuildModeController
              districts={districts}
              setDistricts={setDistricts}
              heldDistrictId={heldDistrictId}
              onPlaceDistrict={handlePlaceDistrict}
              gridSize={250}
              gridDivisions={50}
            />
          </>
        )}

        {/* --- CAMERA & EFFECTS --- */}
        <CameraRig
          selectedDistrict={selectedDistrict}
          onAnimationFinish={handleCameraAnimationFinish}
          isAnimating={isCameraAnimating && pov === 'main'}
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.8} intensity={0.8} levels={8} mipmapBlur />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Canvas>
      
      {/* --- UI OVERLAYS --- */}
      <HUD
        selectedDistrict={selectedDistrict}
        onGoHome={handleGoHome}
        onToggleNavMenu={() => setIsNavMenuOpen(true)}
        isDetailViewActive={isDetailViewActive}
        pov={pov}
        onSetPov={setPov}
        isCalibrationMode={isCalibrationMode}
        onToggleCalibrationMode={handleToggleCalibrationMode}
        onExportLayout={() => setIsExportModalOpen(true)}
        heldDistrictId={heldDistrictId}
        onCancelMove={handleCancelMove}
      />
      <ProjectSelectionPanel
        isOpen={isDetailViewActive}
        district={selectedDistrict}
        onClose={handleGoHome}
        onProjectSelect={(item) => console.log('Project selected:', item)}
      />
      <QuickNavMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={(d) => {
          setIsNavMenuOpen(false);
          handleDistrictSelect(d);
        }}
        districts={districts.filter(d => d.type === 'major')}
      />
      <ExportLayoutModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jsonData={exportedJsonData}
      />
    </>
  );
};