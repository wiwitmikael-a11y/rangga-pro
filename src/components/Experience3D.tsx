import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
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

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isCalibrationMode) return;
    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
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
    setPov('main');
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setTargetShipRef(null);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict) {
      // Ketika animasi ke distrik selesai, tampilkan panel kontennya.
      setShowContentPanel(true);

      // FIX: Sinkronkan target OrbitControls dengan titik fokus kamera yang baru.
      // Ini mencegah "snap" yang mengganggu saat pengguna berinteraksi dengan kamera
      // setelah animasi terprogram selesai.
      if (controlsRef.current && selectedDistrict.cameraFocus) {
        const { lookAt } = selectedDistrict.cameraFocus;
        controlsRef.current.target.set(lookAt[0], lookAt[1], lookAt[2]);
      }
    } else if (pov === 'main' && !isCalibrationMode) {
      // Saat kembali ke tinjauan umum, reset timer idle.
      resetIdleTimer();

      // FIX: Reset target OrbitControls ke posisi tinjauan umum default.
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 5, 0);
      }
    }
  }, [selectedDistrict, pov, isCalibrationMode, resetIdleTimer]);
  
  const handlePanelClose = () => {
      setInfoPanelItem(null);
      resetIdleTimer();
  };

  const handleQuickNavSelect = (district: CityDistrict) => {
    handleDistrictSelect(district);
    setIsNavMenuOpen(false);
  };
  
  const handleSetPov = (newPov: 'main' | 'ship') => {
    if (isCalibrationMode) return;

    if (newPov === 'ship' && pov === 'ship') {
      if (shipRefs.length > 1) {
        let newTargetIndex = -1;
        const currentTargetIndex = shipRefs.findIndex(ref => ref === targetShipRef);

        while (newTargetIndex === -1 || newTargetIndex === currentTargetIndex) {
            newTargetIndex = Math.floor(Math.random() * shipRefs.length);
        }
        
        setTargetShipRef(shipRefs[newTargetIndex]);
        setIsAnimating(true);
      }
      return;
    }

    if (newPov === pov) return;

    if (newPov === 'main') {
      setShipControlMode('follow');
      setControlledShipId(null);
      handleGoHome();
    } else {
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      if(selectedDistrict) {
        setSelectedDistrict(null);
        setShowContentPanel(false);
        setInfoPanelItem(null);
      }
      
      if (shipRefs.length > 0) {
        const randomIndex = Math.floor(Math.random() * shipRefs.length);
        setTargetShipRef(shipRefs[randomIndex]);
      }
      setPov('ship');
      setIsAnimating(true);
    }
  };
  
  const handleToggleShipControl = useCallback(() => {
    if (pov !== 'ship') return;

    setShipControlMode((prev: ShipControlMode) => {
      if (prev === 'follow') {
        if (targetShipRef?.current) {
          const targetNode = targetShipRef.current;
          // Find ship data by matching the ref object
          const shipIndex = shipRefs.findIndex(ref => ref.current === targetNode);
          if (shipIndex !== -1) {
            setControlledShipId(shipsData[shipIndex].id);
            return 'manual';
          }
        }
        return 'follow'; // Cannot switch if no target is found
      } else {
        setControlledShipId(null);
        return 'follow';
      }
    });
  }, [pov, targetShipRef, shipRefs]);
  
  const handleSetHeldDistrict = useCallback((id: string | null) => {
    if (id) {
        const district = districts.find(d => d.id === id);
        if (district) {
            setHeldDistrictId(id);
        }
    } else {
        setHeldDistrictId(null);
    }
  }, [districts]);

  const handlePlaceDistrict = useCallback(() => {
      setHeldDistrictId(null);
  }, []);

  const hintContext = useMemo(() => {
    if (pov === 'ship') {
      return shipControlMode === 'manual' ? 'shipManual' : 'shipFollow';
    }
    return 'overview';
  }, [pov, shipControlMode]);

  const handleFire = useCallback(() => {
    setFireRequest(Date.now());
  }, []);

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    // Hanya picu pada klik kiri mouse, dan hanya dalam mode pilot manual.
    // Pemeriksaan `pointerType` mencegah pemicuan pada sentuhan mobile.
    if (e.button === 0 && shipControlMode === 'manual' && e.pointerType === 'mouse') {
        handleFire();
    }
  }, [shipControlMode, handleFire]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: OVERVIEW_CAMERA_POSITION.toArray(), fov: 50, near: 0.1, far: 1000 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
        onDoubleClick={(e) => e.stopPropagation()}
        onPointerDown={handleCanvasPointerDown}
      >
        <Suspense fallback={null}>
            <>
              {/* The <Sky> component renders the background; fog has been removed for performance. */}
              <Sky sunPosition={sunPosition} turbidity={20} rayleigh={1} mieCoefficient={0.005} mieDirectionalG={0.8} />
              <ambientLight intensity={1.2} />
              <directionalLight
                position={sunPosition}
                intensity={6.0}
                color={sunColor}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-far={500}
                shadow-camera-left={-200}
                shadow-camera-right={200}
                shadow-camera-top={200}
                shadow-camera-bottom={-200}
              />

              <CityModel />
              <FlyingShips 
                setShipRefs={setShipRefs} 
                isPaused={isPaused} 
                controlledShipId={controlledShipId}
                shipInputs={shipInputs}
                fireRequest={fireRequest}
              />
              <PatrollingCore isPaused={isPaused} />
              <ProceduralTerrain />
              
              <group position={[0, 5, 0]}>
                <DistrictRenderer
                  districts={districts}
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                  isCalibrationMode={isCalibrationMode}
                  heldDistrictId={heldDistrictId}
                  onSetHeldDistrict={handleSetHeldDistrict}
                />
                {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={handlePanelClose} />}
              </group>
              
              {isCalibrationMode && <CalibrationGrid size={250} />}
              {isCalibrationMode && (
                  <BuildModeController
                    districts={districts}
                    setDistricts={setDistricts}
                    heldDistrictId={heldDistrictId}
                    onPlaceDistrict={handlePlaceDistrict}
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

              <EffectComposer>
                <Noise 
                  premultiply 
                  blendFunction={BlendFunction.ADD}
                  opacity={0.07} 
                />
              </EffectComposer>
            </>
        </Suspense>

        <OrbitControls
            ref={controlsRef}
            enabled={pov === 'main' && shipControlMode === 'follow' && !isAnimating && !isAnyPanelOpen}
            enableDamping
            dampingFactor={0.05}
            minDistance={20}
            maxDistance={300}
            maxPolarAngle={isCalibrationMode ? Math.PI / 2.05 : Math.PI / 2.2}
            target={[0, 5, 0]}
            autoRotate={isAutoRotating && !isCalibrationMode}
            autoRotateSpeed={0.5}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
            onChange={handleControlsChange}
        />
      </Canvas>
      
      <HUD 
          selectedDistrict={selectedDistrict} 
          onToggleNavMenu={() => setIsNavMenuOpen(!isNavMenuOpen)}
          onToggleHints={() => setIsHintsOpen(!isHintsOpen)}
          pov={pov}
          onSetPov={handleSetPov}
          isCalibrationMode={isCalibrationMode}
          heldDistrictId={heldDistrictId}
          shipControlMode={shipControlMode}
          onToggleShipControl={handleToggleShipControl}
          onFire={handleFire}
          isTouchDevice={isTouchDevice}
          onShipTouchInputChange={setShipTouchInputs}
          isAnyPanelOpen={isAnyPanelOpen}
      />

      {isNavMenuOpen && (
          <QuickNavMenu 
              isOpen={isNavMenuOpen}
              onClose={() => setIsNavMenuOpen(false)}
              onSelectDistrict={handleQuickNavSelect}
              districts={navDistricts}
          />
      )}
      {showContentPanel && (
          <ProjectSelectionPanel
              isOpen={showContentPanel}
              district={selectedDistrict}
              onClose={handleGoHome}
          />
      )}
      {isHintsOpen && (
        <HintsPanel 
          isOpen={isHintsOpen}
          onClose={() => setIsHintsOpen(false)}
          context={hintContext}
        />
      )}
      <ExportLayoutModal
        isOpen={isExportModalOpen}
        onClose={() => { /* Modal cannot be opened, but this keeps it functional */ }}
        jsonData={exportedLayoutJson}
      />
    </>
  );
};