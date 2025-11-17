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
    audio.play('panel_open');
    setSelectedDistrict(district);
    setIsAnimating(true);
    setShowContentPanel(false);
    setIsAutoRotating(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (pov === 'ship') {
      setPov('main');
    }
  }, [isAnimating, isCalibrationMode, selectedDistrict?.id, audio, pov]);

  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict) {
      setShowContentPanel(true);
    }
  }, [selectedDistrict]);

  const handleClosePanel = useCallback(() => {
    audio.play('panel_close');
    setShowContentPanel(false);
    // Timeout to allow the panel to fade out before camera moves
    setTimeout(() => {
      setSelectedDistrict(null);
      setIsAnimating(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsAutoRotating(true), 5000);
    }, 300);
  }, [audio]);
  
  const handleGoHome = useCallback(() => {
    audio.play('panel_close');
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowContentPanel(false);
    setIsNavMenuOpen(false);
    setPov('main');
  }, [audio]);
  
  const handleSetPov = useCallback((newPov: 'main' | 'ship') => {
    if (newPov === pov) {
        if (newPov === 'ship') {
            // Cycle to the next ship if already in ship POV
            setTargetShipRef(prevRef => {
                if (!prevRef) return shipRefs[0] || null;
                const currentIndex = shipRefs.findIndex(ref => ref === prevRef);
                const nextIndex = (currentIndex + 1) % shipRefs.length;
                return shipRefs[nextIndex] || null;
            });
        }
        return;
    }
    
    setPov(newPov);
    setSelectedDistrict(null);
    setShowContentPanel(false);
    setIsAnimating(true);

    if (newPov === 'ship') {
        setShipControlMode('follow');
        setTargetShipRef(shipRefs[0] || null);
        setIsAutoRotating(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    } else { // newPov is 'main'
        setTargetShipRef(null);
        setControlledShipId(null);
        setShipControlMode('follow');
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => setIsAutoRotating(true), 5000);
    }
  }, [pov, shipRefs]);
  
  const handleToggleShipControl = useCallback(() => {
    setShipControlMode(prev => {
        const newMode = prev === 'follow' ? 'manual' : 'follow';
        if (newMode === 'manual') {
            audio.play('pilot_engage', { volume: 0.6 });
            audio.playLoop('engine_hum', { volume: 0.2 });
            setControlledShipId(shipsData.find(s => s.id === (targetShipRef?.current?.userData.shipId as string))?.id ?? null);
        } else {
            audio.play('pilot_disengage', { volume: 0.6 });
            audio.stop('engine_hum');
            setControlledShipId(null);
        }
        return newMode;
    });
  }, [audio, targetShipRef]);
  
  const handleTour = useCallback(() => {
    setIsTouring(isTouring => {
        if (isTouring) {
            // Stop the tour
            setSelectedDistrict(null);
            setIsAnimating(true);
            return false;
        } else {
            // Start the tour
            const nextStop = tourStops[0];
            setSelectedDistrict(nextStop);
            setIsAnimating(true);
            setTourIndex(0);
            return true;
        }
    });
  }, [tourStops]);

  useEffect(() => {
    let tourTimeout: ReturnType<typeof setTimeout>;
    if (isTouring && !isAnimating) {
        tourTimeout = setTimeout(() => {
            const nextIndex = (tourIndex + 1) % tourStops.length;
            const nextStop = tourStops[nextIndex];
            setSelectedDistrict(nextStop);
            setIsAnimating(true);
            setTourIndex(nextIndex);
        }, 5000); // Wait 5 seconds at each stop
    }
    return () => clearTimeout(tourTimeout);
  }, [isTouring, isAnimating, tourIndex, tourStops]);
  
  const handleFire = useCallback(() => {
    audio.play('laser', { volume: 0.3, rate: 1.1 + Math.random() * 0.2 });
    setFireRequest(prev => prev + 1);
  }, [audio]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: OVERVIEW_CAMERA_POSITION, fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onPointerDown={() => {
          if (isAutoRotating) setIsAutoRotating(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        }}
        onPointerUp={() => {
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          idleTimerRef.current = setTimeout(() => setIsAutoRotating(true), 5000);
        }}
      >
        <Suspense fallback={null}>
          <CameraRig
            selectedDistrict={selectedDistrict}
            onAnimationFinish={handleAnimationFinish}
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
            rotateSpeed={0.5}
            minDistance={30}
            maxDistance={300}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
            enabled={pov === 'main' && !isAnimating && !isCalibrationMode}
            autoRotate={isAutoRotating}
            autoRotateSpeed={0.3}
          />
          
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
          
          {selectedDistrict && <HolographicInfoPanel district={selectedDistrict} onClose={handleClosePanel} />}
          
          {isCalibrationMode && (
            <>
              <CalibrationGrid size={250} />
              <BuildModeController
                districts={districts}
                setDistricts={setDistricts}
                heldDistrictId={heldDistrictId}
                onPlaceDistrict={() => setHeldDistrictId(null)}
                gridSize={250}
                gridDivisions={25}
              />
            </>
          )}

        </Suspense>
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.8} intensity={0.8} mipmapBlur />
          <Noise opacity={0.05} blendFunction={BlendFunction.COLOR_DODGE} />
        </EffectComposer>
      </Canvas>
      
      {isHudVisible && (
        <div className={`hud-container ${isHudVisible ? 'visible' : ''}`}>
          <HUD
            selectedDistrict={selectedDistrict}
            onToggleNavMenu={() => setIsNavMenuOpen(!isNavMenuOpen)}
            onToggleHints={() => setIsHintsOpen(!isHintsOpen)}
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
        </div>
      )}
      
      {showInitialHint && <InitialHintTooltip />}

      <QuickNavMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={(district) => {
          handleDistrictSelect(district);
          setIsNavMenuOpen(false);
        }}
        districts={navDistricts}
      />
      
      <HintsPanel 
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
        context={shipControlMode === 'manual' ? 'shipManual' : (pov === 'ship' ? 'shipFollow' : 'overview')}
      />

      <ProjectSelectionPanel
        isOpen={showContentPanel}
        district={selectedDistrict}
        onClose={handleClosePanel}
      />
      
      <ExportLayoutModal
        isOpen={isExportModalOpen}
        onClose={() => { /* Logic to close */ }}
        jsonData={exportedLayoutJson}
      />
    </>
  );
};
