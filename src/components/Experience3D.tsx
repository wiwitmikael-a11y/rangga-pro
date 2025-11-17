import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
// FIX: Add a side-effect import to ensure R3F's JSX types are globally available.
import '@react-three/fiber';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { EffectComposer, Noise, Bloom } from '@react-three/postprocessing';
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
import { useAudio } from '../hooks/useAudio';
import { InitialHintTooltip } from './ui/InitialHintTooltip';


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

interface Experience3DProps {
  isHudVisible: boolean;
  isEntering: boolean;
}

export const Experience3D: React.FC<Experience3DProps> = ({ isHudVisible, isEntering }) => {
  const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContentPanel, setShowContentPanel] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const audio = useAudio();
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isCalibrationMode] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [isTouring, setIsTouring] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const isTouchDevice = useMemo(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0, []);

  const [shipControlMode, setShipControlMode] = useState<ShipControlMode>('follow');
  const [controlledShipId, setControlledShipId] = useState<string | null>(null);
  const [fireRequest, setFireRequest] = useState(0);
  
  const shipKeyboardInputs = useShipControls(shipControlMode === 'manual' && !isTouchDevice);
  const [shipTouchInputs, setShipTouchInputs] = useState<ShipInputState>({ forward: 0, turn: 0, ascend: 0, roll: 0 });
  const shipInputs = isTouchDevice ? shipTouchInputs : shipKeyboardInputs;
  
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
  const [isExportModalOpen] = useState(false);
  const [exportedLayoutJson] = useState('');

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isPaused = isCalibrationMode;
  
  const isAnyPanelOpen = showContentPanel || isNavMenuOpen || isHintsOpen;
  
  const [showInitialHint, setShowInitialHint] = useState(false);

  // Effect to trigger the cinematic entry camera animation
  useEffect(() => {
    if (isEntering) {
      setIsAnimating(true);
    }
  }, [isEntering]);
  
  // New effect to show the initial tooltip once
  useEffect(() => {
    if (isHudVisible) {
        const timer = setTimeout(() => {
            setShowInitialHint(true);
        }, 1500); // Show after 1.5s delay
        return () => clearTimeout(timer);
    }
  }, [isHudVisible]);


  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const order: string[] = ['skills-matrix', 'visual-arts', 'nova-forge', 'defi-data-vault', 'contact', 'nexus-core'];
    return [...majorDistricts].sort((a, b) => {
        let indexA = order.indexOf(a.id);
        let indexB = order.indexOf(b.id);
        if (indexA === -1) indexA = Infinity;
        if (indexB === -1) indexB = Infinity;
        return indexA - indexB;
    });
  }, [districts]);

  const tourStops = useMemo(() => {
    const tourDistrictIds = ['skills-matrix', 'visual-arts', 'nova-forge'];
    const stops = tourDistrictIds.map(id => districts.find(d => d.id === id)).filter((d): d is CityDistrict => !!d);
    return [...stops, null];
  }, [districts]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isAnimating || isCalibrationMode || district.id === selectedDistrict?.id) return;
    setIsTouring(false);
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setIsAutoRotating(false);
    setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    setIsAnimating(true);
    audio.play('confirm');
  }, [selectedDistrict, isAnimating, districts, isCalibrationMode, audio]);
  
  const isDetailViewActive = showContentPanel || !!infoPanelItem || !!selectedDistrict;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !isDetailViewActive && !isCalibrationMode) {
            setIsAutoRotating(true);
        }
    }, 60000);
  }, [pov, isDetailViewActive, isCalibrationMode]);

  const handleInteractionStart = useCallback(() => {
      setIsTouring(false);
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
      target.y = THREE.MathUtils.clamp(target.y, 0, 50);
    }
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleGoHome = useCallback(() => {
    if (isAnimating) return;
    audio.play('confirm');
    setIsTouring(false);
    setPov('main');
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setTargetShipRef(null);
    setShipControlMode('follow');
    setControlledShipId(null);
  }, [isAnimating, audio]);

  const onAnimationFinish = useCallback(() => {
    if (isEntering) { // Special case for the entry animation finishing
      setIsAnimating(false);
      resetIdleTimer();
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 5, 0); // Set initial target
        controlsRef.current.update();
      }
      return;
    }
    
    if (isTouring) {
      const nextIndex = tourIndex + 1;
      if (nextIndex < tourStops.length) {
        setTourIndex(nextIndex);
        setSelectedDistrict(tourStops[nextIndex]);
      } else {
        setIsTouring(false);
        setIsAnimating(false);
        setSelectedDistrict(null);
        resetIdleTimer();
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 5, 0);
          controlsRef.current.update();
        }
      }
      return;
    }

    setIsAnimating(false);
    if (selectedDistrict) {
      setShowContentPanel(true);
      if (controlsRef.current && selectedDistrict.cameraFocus) {
        const { lookAt } = selectedDistrict.cameraFocus;
        controlsRef.current.target.set(lookAt[0], lookAt[1], lookAt[2]);
        controlsRef.current.update();
      }
    } else if (pov === 'main' && !isCalibrationMode) {
      resetIdleTimer();
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 5, 0);
        controlsRef.current.update();
      }
    }
  }, [isEntering, isTouring, tourIndex, tourStops, selectedDistrict, pov, isCalibrationMode, resetIdleTimer]);

  const handleClosePanel = useCallback(() => {
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setSelectedDistrict(null);
    setIsAnimating(true);
    audio.play('panel_close');
  }, [audio]);

  const handleToggleNavMenu = useCallback(() => setIsNavMenuOpen(prev => {
    if (!prev) audio.play('panel_open'); else audio.play('panel_close');
    return !prev;
  }), [audio]);

  const handleToggleHints = useCallback(() => setIsHintsOpen(prev => {
    if (!prev) audio.play('panel_open'); else audio.play('panel_close');
    return !prev;
  }), [audio]);

  const handleSetPov = useCallback((newPov: 'main' | 'ship') => {
    if (newPov === 'ship' && shipRefs.length > 0) {
      audio.play('confirm');
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
  }, [shipRefs, targetShipRef, pov, audio]);

  const handleToggleShipControl = useCallback(() => {
    if (shipControlMode === 'follow') {
      if (targetShipRef?.current) {
        audio.play('pilot_engage');
        audio.playLoop('engine_hum', { volume: 0.1 });
        const shipIndex = shipRefs.findIndex(ref => ref.current === targetShipRef.current);
        setControlledShipId(shipsData[shipIndex].id);
        setShipControlMode('manual');
        if (controlsRef.current) controlsRef.current.enabled = false;
      }
    } else {
      audio.play('pilot_disengage');
      audio.stop('engine_hum');
      setShipControlMode('follow');
      setControlledShipId(null);
    }
  }, [shipControlMode, targetShipRef, shipRefs, audio]);

  const handleFire = useCallback(() => {
    audio.play('laser');
    setFireRequest(prev => prev + 1)
  }, [audio]);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    handleInteractionStart();
    if (shipControlMode === 'manual' && e.button === 0) handleFire();
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
          isEntering={isEntering}
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
          enabled={!isAnimating && !isEntering && pov !== 'ship'}
        />

        <EffectComposer>
          <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.05} />
          <Bloom luminanceThreshold={1.2} intensity={0.6} levels={8} mipmapBlur />
        </EffectComposer>

        {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={() => setInfoPanelItem(null)} />}

      </Canvas>
      {showInitialHint && <InitialHintTooltip />}
      <div
        className={`hud-container ${isHudVisible ? 'visible' : ''}`}
        style={{ pointerEvents: isHudVisible ? 'auto' : 'none' }}
      >
        {/* FIX: Corrected handler names passed as props to the HUD component. */}
        <HUD 
          selectedDistrict={selectedDistrict}
          onToggleNavMenu={handleToggleNavMenu}
          onToggleHints={handleToggleHints}
          pov={pov}
          onSetPov={handleSetPov}
          onGoHome={handleGoHome}
          isCalibrationMode={isCalibrationMode}
          heldDistrictId={heldDistrictId}
          shipControlMode={shipControlMode}
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
      </div>
    </>
  );
};