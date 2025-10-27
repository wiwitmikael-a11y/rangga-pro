import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import { FlyingShips } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData, OVERVIEW_CAMERA_POSITION } from '../constants';
import type { CityDistrict, PortfolioSubItem, ShipControlMode, ShipInputState } from '../types';
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
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isCalibrationMode] = useState(false); // Setter removed as it's no longer used
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastCycledDistrictId, setLastCycledDistrictId] = useState<string | null>(null);
  
  const isTouchDevice = useMemo(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0, []);

  // Ship Control State
  const [shipControlMode, setShipControlMode] = useState<ShipControlMode>('follow');
  const [controlledShipId, setControlledShipId] = useState<string | null>(null);
  
  const shipKeyboardInputs = useShipControls(shipControlMode === 'manual' && !isTouchDevice);
  const [shipTouchInputs, setShipTouchInputs] = useState<ShipInputState>({ forward: 0, turn: 0, ascend: 0, roll: 0 });
  const shipInputs = isTouchDevice ? shipTouchInputs : shipKeyboardInputs;
  
  // Build Mode State
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
  const [isExportModalOpen] = useState(false); // Setter removed as it's no longer used
  const [exportedLayoutJson] = useState(''); // Setter removed as it's no longer used

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isPaused = isCalibrationMode;
  
  const isAnyPanelOpen = showContentPanel || isNavMenuOpen;

  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const order: string[] = [
      'skills-matrix',    // Core Matrix
      'visual-arts',      // Visual Archiver
      'nova-forge',       // AI Engineer Lab
      'defi-data-vault',  // DeFi Vault
      'contact',          // Contact Hub
      'nexus-core',       // @rangga.p.h
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
    // Allow re-selecting if coming from a different view (like ship POV)
    if (district.id === selectedDistrict?.id && !isAnimating && pov === 'main') return;
    
    setPov('main'); // Ensure we are in the main camera view
    setShowContentPanel(false);
    setInfoPanelItem(null);
    setIsAutoRotating(false);
    
    setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    setIsAnimating(true);
  }, [selectedDistrict, isAnimating, districts, isCalibrationMode, pov]);
  
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


  const handleProjectClick = (item: PortfolioSubItem) => {
    console.log('Project clicked:', item.title);
  };
  
  const handlePanelClose = () => {
      setInfoPanelItem(null);
      resetIdleTimer();
  };

  const handleQuickNavSelect = (district: CityDistrict) => {
    handleDistrictSelect(district);
    setIsNavMenuOpen(false);
  };
  
  const handleOverviewCycle = useCallback(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    if (majorDistricts.length === 0) return;

    // Determine the current district to avoid repeating it.
    const currentDistrictId = selectedDistrict?.id || lastCycledDistrictId;
    let availableDistricts = majorDistricts.filter(d => d.id !== currentDistrictId);

    // If filtering leaves no options (e.g., only one district exists), use the full list.
    if (availableDistricts.length === 0) {
        availableDistricts = majorDistricts;
    }

    const randomIndex = Math.floor(Math.random() * availableDistricts.length);
    const nextDistrict = availableDistricts[randomIndex];
    
    setLastCycledDistrictId(nextDistrict.id);
    handleDistrictSelect(nextDistrict);
  }, [districts, selectedDistrict, handleDistrictSelect, lastCycledDistrictId]);

  const handleSetPov = useCallback((newPov: 'main' | 'ship') => {
    if (newPov === 'main') {
      handleOverviewCycle();
    } else { // newPov is 'ship'
        setPov('ship');
        if (shipRefs.length > 0) {
          const randomIndex = Math.floor(Math.random() * shipRefs.length);
          setTargetShipRef(shipRefs[randomIndex]);
        }
        setSelectedDistrict(null);
        setShowContentPanel(false);
        setInfoPanelItem(null);
        setIsAnimating(true);
        resetIdleTimer();
    }
  }, [handleOverviewCycle, shipRefs, resetIdleTimer]);

  const handleShipControlToggle = () => {
    if (shipControlMode === 'follow') {
        setShipControlMode('manual');
        if (targetShipRef?.current) {
            setControlledShipId(targetShipRef.current.uuid);
        } else if (shipRefs.length > 0) {
            const firstShipRef = shipRefs[0];
            setTargetShipRef(firstShipRef);
            setControlledShipId(firstShipRef.current?.uuid || null);
        }
    } else {
        setShipControlMode('follow');
        setControlledShipId(null);
    }
  };

  const handleShipTouchInputChange = (inputs: ShipInputState) => {
    setShipTouchInputs(inputs);
  };

  const handleSetHeldDistrict = (id: string | null) => {
    if (!isCalibrationMode) return;
    setHeldDistrictId(id);
    if(id) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'grab';
    }
  };


  return (
    <>
      <Canvas
        shadows
        camera={{ position: OVERVIEW_CAMERA_POSITION, fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
      >
        <fog attach="fog" args={['#050810', 50, 400]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={sunPosition}
          intensity={3}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={500}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
          color={sunColor}
        />
        <Sky sunPosition={sunPosition} />
        
        <Suspense fallback={null}>
          <CityModel />
          <ProceduralTerrain />
          <DistrictRenderer
            districts={districts}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={handleDistrictSelect}
            isCalibrationMode={isCalibrationMode}
            heldDistrictId={heldDistrictId}
            onSetHeldDistrict={handleSetHeldDistrict}
          />
          <FlyingShips
            setShipRefs={setShipRefs}
            isPaused={isPaused}
            controlledShipId={controlledShipId}
            shipInputs={shipInputs}
          />
          <PatrollingCore isPaused={isPaused} />
          {isCalibrationMode && <CalibrationGrid size={250} />}
        </Suspense>

        <CameraRig 
            selectedDistrict={selectedDistrict} 
            onAnimationFinish={onAnimationFinish}
            isAnimating={isAnimating}
            pov={pov}
            targetShipRef={targetShipRef}
            isCalibrationMode={isCalibrationMode}
        />
        
        {isCalibrationMode && (
          <BuildModeController 
            districts={districts}
            setDistricts={setDistricts}
            heldDistrictId={heldDistrictId}
            onPlaceDistrict={() => handleSetHeldDistrict(null)}
            gridSize={250}
            gridDivisions={25}
          />
        )}
        
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          enablePan={!isAnimating}
          enableZoom={!isAnimating}
          enableRotate={!isAnimating && pov === 'main'}
          minDistance={10}
          maxDistance={300}
          maxPolarAngle={Math.PI / 2 - 0.05}
          onChange={handleControlsChange}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.3}
        />

        <EffectComposer>
            <Noise opacity={0.02} blendFunction={BlendFunction.MULTIPLY} />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0005, 0.0005)}
              radialModulation={false}
              modulationOffset={0.0}
            />
        </EffectComposer>

        {infoPanelItem && (
            <HolographicInfoPanel district={infoPanelItem} onClose={handlePanelClose} />
        )}
      </Canvas>
      
      {/* UI Layer */}
      <HUD 
        selectedDistrict={selectedDistrict}
        onToggleNavMenu={() => setIsNavMenuOpen(prev => !prev)}
        pov={pov}
        onSetPov={handleSetPov}
        isCalibrationMode={isCalibrationMode}
        heldDistrictId={heldDistrictId}
        shipControlMode={shipControlMode}
        onToggleShipControl={handleShipControlToggle}
        isTouchDevice={isTouchDevice}
        onShipTouchInputChange={handleShipTouchInputChange}
        isAnyPanelOpen={isAnyPanelOpen}
      />
      
      <QuickNavMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={handleQuickNavSelect}
        districts={navDistricts}
      />

      <ProjectSelectionPanel 
        isOpen={showContentPanel}
        district={selectedDistrict}
        onClose={handleGoHome}
        onProjectSelect={handleProjectClick}
      />
      
      <ExportLayoutModal 
        isOpen={isExportModalOpen}
        onClose={() => { /* Logic to close */ }}
        jsonData={exportedLayoutJson}
      />
    </>
  );
};
