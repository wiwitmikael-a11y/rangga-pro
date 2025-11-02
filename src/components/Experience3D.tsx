import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
// FIX: Add a side-effect import to ensure R3F's JSX types are globally available.
import '@react-three/fiber';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import { FlyingShips, shipsData } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData, OVERVIEW_CAMERA_POSITION } from '../constants';
import type { CityDistrict, ShipControlMode, ShipInputState } from '../types';
import { CameraRig } from './CameraRig';
import { HUD } from './ui/HUD';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import HolographicInfoPanel from './scene/HolographicInfoPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { PatrollingCore } from './scene/PatrollingCore';
import { CalibrationGrid } from './scene/CalibrationGrid';
import { BuildModeController } from './scene/BuildModeController';
import { ExportLayoutModal } from './ui/ExportLayoutModal';
import { useShipControls } from '../hooks/useShipControls';
import { HintsPanel } from './ui/HintsPanel';


// Define the sun's position for a sunset glow near the horizon
const sunPosition: [number, number, number] = [100, 2, -100]; // Lower sun for a more dramatic sunset
const sunColor = '#ffd0b3'; // Warmer light

interface SceneContentProps {
  districts: CityDistrict[];
  selectedDistrict: CityDistrict | null;
  handleDistrictSelect: (district: CityDistrict) => void;
  isCalibrationMode: boolean;
  heldDistrictId: string | null;
  setHeldDistrictId: (id: string | null) => void;
  setShipRefs: (refs: React.RefObject<THREE.Group>[]) => void;
  isPaused: boolean;
  controlledShipId: string | null;
  shipInputs: ShipInputState;
  fireRequest: number;
}

const SceneContent: React.FC<SceneContentProps> = ({ districts, selectedDistrict, handleDistrictSelect, isCalibrationMode, heldDistrictId, setHeldDistrictId, setShipRefs, isPaused, controlledShipId, shipInputs, fireRequest }) => {
  // Call useThree hook to ensure R3F types are loaded for JSX primitives.
  useThree();

  return (
    <>
      <ambientLight intensity={0.5} color={sunColor} />
      <directionalLight
        position={sunPosition}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        color={sunColor}
      />
      <Sky sunPosition={new THREE.Vector3(...sunPosition)} />
      <CityModel />
      <ProceduralTerrain />
      <DistrictRenderer
        districts={districts}
        selectedDistrict={selectedDistrict}
        onDistrictSelect={handleDistrictSelect}
        isCalibrationMode={isCalibrationMode}
        heldDistrictId={heldDistrictId}
        onSetHeldDistrict={setHeldDistrictId}
      />
      <FlyingShips
        setShipRefs={setShipRefs}
        isPaused={isPaused}
        controlledShipId={controlledShipId}
        shipInputs={shipInputs}
        fireRequest={fireRequest}
      />
      <PatrollingCore isPaused={isPaused} />
    </>
  );
};


export const Experience3D: React.FC = () => {
  const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContentPanel, setShowContentPanel] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isCalibrationMode] = useState(false); // Setter removed as it's no longer used
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // --- NEW: Cinematic Tour State ---
  const [isTouring, setIsTouring] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const isTouchDevice = useMemo(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0, []);

  // Ship Control State
  const [shipControlMode, setShipControlMode] = useState<ShipControlMode>('follow');
  const [controlledShipId, setControlledShipId] = useState<string | null>(null);
  const [fireRequest, setFireRequest] = useState(0);
  
  const shipKeyboardInputs = useShipControls(shipControlMode === 'manual' && !isTouchDevice);
  const [shipTouchInputs, setShipTouchInputs] = useState<ShipInputState>({ forward: 0, turn: 0, ascend: 0, roll: 0 });
  const shipInputs = isTouchDevice ? shipTouchInputs : shipKeyboardInputs;
  
  // Build Mode State
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
  const [isExportModalOpen] = useState(false); // Setter removed as it's no longer used
  const [exportedLayoutJson] = useState(''); // Setter removed as it's no longer used

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isPaused = isCalibrationMode;
  
  const isAnyPanelOpen = showContentPanel || isNavMenuOpen || isHintsOpen;

  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const order: string[] = [
      'skills-matrix',
      'visual-arts',
      'nova-forge',
      'defi-data-vault',
      'contact',
      'nexus-core',
    ];
    
    // Create a copy to avoid mutating the original `majorDistricts` array if it's used elsewhere
    return [...majorDistricts].sort((a, b) => {
        let indexA = order.indexOf(a.id);
        let indexB = order.indexOf(b.id);
        
        // If an item is not in the order list, treat its index as infinity so it goes to the end
        if (indexA === -1) indexA = Infinity;
        if (indexB === -1) indexB = Infinity;
        
        return indexA - indexB;
    });
  }, [districts]);

  const tourStops = useMemo(() => {
    const tourDistrictIds = ['skills-matrix', 'visual-arts', 'nova-forge'];
    const stops = tourDistrictIds
        .map(id => districts.find(d => d.id === id))
        .filter((d): d is CityDistrict => !!d);
    return [...stops, null]; // End with the overview position
  }, [districts]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isCalibrationMode) return;
    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    setIsTouring(false); // Cancel tour on direct selection
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setIsAutoRotating(false);
    
    setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    setIsAnimating(true);
  }, [selectedDistrict, isAnimating, districts, isCalibrationMode]);
  
  const isDetailViewActive = showContentPanel || !!infoPanelItem || !!selectedDistrict;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !isDetailViewActive && !isCalibrationMode) {
            setIsAutoRotating(true);
        }
    }, 60000); // Waktu idle ditingkatkan menjadi 60 detik
  }, [pov, isDetailViewActive, isCalibrationMode]);

  const handleInteractionStart = useCallback(() => {
      setIsTouring(false); // Cancel tour on manual interaction
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
      resetIdleTimer();
  }, [resetIdleTimer]);

  const handleControlsChange = useCallback(() => {
    if (controlsRef.current) {
      const target = controlsRef.current.target;
      const boundary = 150;
      target.x = THREE.MathUtils.clamp(target.x, -boundary, boundary);
      target.z = THREE.MathUtils.clamp(target.z, -boundary, boundary);
      target.y = THREE.MathUtils.clamp(target.y, 0, 50); // Prevent looking underground or too high
    }
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleGoHome = useCallback(() => {
    // This function now starts the cinematic tour
    setIsTouring(true);
    setTourIndex(0);
    setPov('main');
    setSelectedDistrict(tourStops[0]);
    setIsAnimating(true);
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setTargetShipRef(null);
    setShipControlMode('follow');
    setControlledShipId(null);
    if(controlsRef.current) controlsRef.current.enabled = true;
  }, [tourStops]);

  const onAnimationFinish = useCallback(() => {
    if (isTouring) {
      const nextIndex = tourIndex + 1;
      if (nextIndex < tourStops.length) {
        // Continue to the next stop
        setTourIndex(nextIndex);
        setSelectedDistrict(tourStops[nextIndex]);
        // Animation remains true
      } else {
        // Tour finished
        setIsTouring(false);
        setIsAnimating(false);
        setSelectedDistrict(null);
        resetIdleTimer();
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 5, 0);
          controlsRef.current.update(); // BUG FIX: Sync controls state
        }
      }
      return;
    }

    // Original animation finish logic
    setIsAnimating(false);
    if (selectedDistrict) {
      setShowContentPanel(true);
      if (controlsRef.current && selectedDistrict.cameraFocus) {
        const { lookAt } = selectedDistrict.cameraFocus;
        controlsRef.current.target.set(lookAt[0], lookAt[1], lookAt[2]);
        controlsRef.current.update(); // BUG FIX: Sync controls state
      }
    } else if (pov === 'main' && !isCalibrationMode) {
      resetIdleTimer();
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 5, 0);
        controlsRef.current.update(); // BUG FIX: Sync controls state
      }
    }
  }, [isTouring, tourIndex, tourStops, selectedDistrict, pov, isCalibrationMode, resetIdleTimer]);

  const handleClosePanel = useCallback(() => {
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setSelectedDistrict(null);
    setIsAnimating(true); // Animate back to overview
  }, []);

  const handleToggleNavMenu = useCallback(() => {
    setIsNavMenuOpen(prev => !prev);
  }, []);

  const handleToggleHints = useCallback(() => {
    setIsHintsOpen(prev => !prev);
  }, []);

  const handleSetPov = useCallback((newPov: 'main' | 'ship') => {
    if (newPov === 'ship' && shipRefs.length > 0) {
      const currentShipIndex = shipRefs.findIndex(ref => ref.current === targetShipRef?.current);
      const nextShipIndex = (currentShipIndex + 1) % shipRefs.length;
      setTargetShipRef(shipRefs[nextShipIndex]);
      setPov('ship');
      setSelectedDistrict(null);
      setIsAnimating(true);
    } else {
      setPov('main');
      setTargetShipRef(null);
      if (pov === 'ship') {
        setSelectedDistrict(null);
        setIsAnimating(true);
      }
    }
  }, [shipRefs, targetShipRef, pov]);

  const handleToggleShipControl = useCallback(() => {
    if (shipControlMode === 'follow') {
      if (targetShipRef?.current) {
        const shipIndex = shipRefs.findIndex(ref => ref.current === targetShipRef.current);
        setControlledShipId(shipsData[shipIndex].id);
        setShipControlMode('manual');
        if (controlsRef.current) controlsRef.current.enabled = false;
      }
    } else {
      setShipControlMode('follow');
      setControlledShipId(null);
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  }, [shipControlMode, targetShipRef, shipRefs]);

  const handleFire = useCallback(() => {
    setFireRequest(prev => prev + 1);
  }, []);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    handleInteractionStart();
    if (shipControlMode === 'manual' && e.button === 0) { // Left click
      handleFire();
    }
  };

  const hudContext = useMemo(() => {
    if (shipControlMode === 'manual') return 'shipManual';
    if (pov === 'ship') return 'shipFollow';
    return 'overview';
  }, [shipControlMode, pov]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: OVERVIEW_CAMERA_POSITION, fov: 50, near: 1, far: 1000 }}
        onPointerDown={handleCanvasPointerDown}
        onPointerUp={handleInteractionEnd}
        onWheel={handleInteractionStart}
      >
        <Suspense fallback={null}>
            <SceneContent
              districts={districts}
              selectedDistrict={selectedDistrict}
              handleDistrictSelect={handleDistrictSelect}
              isCalibrationMode={isCalibrationMode}
              heldDistrictId={heldDistrictId}
              setHeldDistrictId={setHeldDistrictId}
              setShipRefs={setShipRefs}
              isPaused={isPaused}
              controlledShipId={controlledShipId}
              shipInputs={shipInputs}
              fireRequest={fireRequest}
            />
        </Suspense>

        {isCalibrationMode && <CalibrationGrid size={250} />}
        {heldDistrictId && (
            <BuildModeController
                districts={districts}
                setDistricts={setDistricts}
                heldDistrictId={heldDistrictId}
                onPlaceDistrict={() => setHeldDistrictId(null)}
                gridSize={250}
                gridDivisions={25}
            />
        )}
        
        <CameraRig 
          selectedDistrict={selectedDistrict} 
          onAnimationFinish={onAnimationFinish} 
          isAnimating={isAnimating} 
          pov={pov}
          targetShipRef={targetShipRef}
          isCalibrationMode={isCalibrationMode}
        />
        
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.1}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.2}
          minDistance={15}
          maxDistance={300}
          maxPolarAngle={Math.PI / 2.1}
          enablePan={!isCalibrationMode}
          target={[0, 5, 0]}
          onChange={handleControlsChange}
          // BUG FIX: Disable controls during any camera animation to prevent user input
          // from interfering and causing the camera to shake or get stuck.
          enabled={!isAnimating && shipControlMode !== 'manual'}
        />

        <EffectComposer>
          <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.05} />
        </EffectComposer>

        {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={() => setInfoPanelItem(null)} />}

      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict}
// FIX: Changed onToggleNavMenu to handleToggleNavMenu to match the function name.
        onToggleNavMenu={handleToggleNavMenu}
// FIX: Changed onToggleHints to handleToggleHints to match the function name.
        onToggleHints={handleToggleHints}
        pov={pov}
        onSetPov={handleSetPov}
        onGoHome={handleGoHome}
        isCalibrationMode={isCalibrationMode}
        heldDistrictId={heldDistrictId}
        shipControlMode={shipControlMode}
// FIX: Changed onToggleShipControl to handleToggleShipControl to match the function name.
        onToggleShipControl={handleToggleShipControl}
        onFire={handleFire}
        isTouchDevice={isTouchDevice}
        onShipTouchInputChange={setShipTouchInputs}
        isAnyPanelOpen={isAnyPanelOpen}
      />
      <QuickNavMenu 
        isOpen={isNavMenuOpen}
        onClose={handleToggleNavMenu}
        onSelectDistrict={(d) => {
          handleDistrictSelect(d);
          setIsNavMenuOpen(false);
        }}
        districts={navDistricts}
      />
      <ProjectSelectionPanel
        isOpen={showContentPanel}
        district={selectedDistrict}
        onClose={handleClosePanel}
      />
      <HintsPanel
        isOpen={isHintsOpen}
        onClose={handleToggleHints}
        context={hudContext}
      />
       <ExportLayoutModal
          isOpen={isExportModalOpen}
          onClose={() => { /* setIsExportModalOpen(false) */ }}
          jsonData={exportedLayoutJson}
      />
    </>
  );
};