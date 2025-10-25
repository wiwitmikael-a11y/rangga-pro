import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three-fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import Rain from './scene/Rain';
import { FlyingShips } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData } from '../constants';
import type { CityDistrict, PortfolioSubItem } from '../types';
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

// Define the sun's position to be used by the light, sky, and mesh
const sunPosition: [number, number, number] = [100, 2, -200]; // Lower sun for sunset effect
const sunColor = '#FFFFF0'; // A warm, sun-like white
const backgroundColor = '#2c1912'; // Dark, desaturated orange to match the sky's bottom gradient
const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 100, 250];

export const Experience3D: React.FC = () => {
  const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build Mode State
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
  const [originalHeldDistrictPosition, setOriginalHeldDistrictPosition] = useState<[number, number, number] | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportedLayoutJson, setExportedLayoutJson] = useState('');

  const isPaused = isCalibrationMode; // Freeze dynamic elements when in calibration mode

  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [...majorDistricts.filter(d => d.id !== 'nexus-core'), nexusCore]
      : majorDistricts;
  }, [districts]);
  
  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isCalibrationMode) return;
    if (district.id === 'nexus-core') {
      window.open('https://www.instagram.com/rangga.p.h/', '_blank');
      setSelectedDistrict(district); 
      setShowProjects(false);
      setInfoPanelItem(null);
      setTimeout(() => setSelectedDistrict(null), 1000);
      return;
    }

    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    if (district.subItems && district.subItems.length > 0) {
      setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    } else {
      setSelectedDistrict(null); 
      setInfoPanelItem(districts.find(d => d.id === district.id) || null);
    }
    setIsAnimating(true);
    setShowProjects(false);
    setIsAutoRotating(false);
  }, [selectedDistrict, isAnimating, districts, isCalibrationMode]);

  const isDetailViewActive = showProjects || !!infoPanelItem || !!selectedDistrict;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !selectedDistrict && !isDetailViewActive && !isCalibrationMode) {
            setIsAutoRotating(true);
        }
    }, 5000);
  }, [pov, selectedDistrict, isDetailViewActive, isCalibrationMode]);

  const handleInteractionStart = useCallback(() => {
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
      resetIdleTimer();
  }, [resetIdleTimer]);

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
    setShowProjects(false);
    setInfoPanelItem(null);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict && selectedDistrict.id !== 'nexus-core') {
      setShowProjects(true);
    } else if (!selectedDistrict && pov === 'main' && !isCalibrationMode) {
      resetIdleTimer();
    }
  }, [selectedDistrict, resetIdleTimer, pov, isCalibrationMode]);

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
  
  const handleSetPov = (newPov: 'main' | 'ship') => {
    if (newPov === pov || isCalibrationMode) return;

    if (newPov === 'main') {
      handleGoHome();
    } else {
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      if(selectedDistrict) {
        setSelectedDistrict(null);
        setShowProjects(false);
        setInfoPanelItem(null);
      }
      
      if (shipRefs.length > 0) {
        let newTargetRef = targetShipRef;
        if (shipRefs.length > 1) {
          while (newTargetRef === targetShipRef) {
            const randomIndex = Math.floor(Math.random() * shipRefs.length);
            newTargetRef = shipRefs[randomIndex];
          }
        } else {
          newTargetRef = shipRefs[0];
        }
        setTargetShipRef(newTargetRef);
      }
      setPov('ship');
      setIsAnimating(true);
    }
  };
  
  const handleToggleCalibrationMode = useCallback(() => {
    setIsCalibrationMode(prev => {
      const newMode = !prev;
      if (newMode) {
        // Entering architect mode
        setIsAnimating(true);
        setIsAutoRotating(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (isDetailViewActive) handleGoHome();
        if (pov === 'ship') setPov('main');
      } else {
        // Exiting architect mode
        if (heldDistrictId) { // If holding an item, cancel move
            const districtToReset = districts.find(d => d.id === heldDistrictId);
            if(districtToReset && originalHeldDistrictPosition) {
              setDistricts(prev => prev.map(d => d.id === heldDistrictId ? {...d, position: originalHeldDistrictPosition} : d));
            }
            setHeldDistrictId(null);
            setOriginalHeldDistrictPosition(null);
        }
        handleGoHome();
      }
      return newMode;
    });
  }, [handleGoHome, isDetailViewActive, pov, heldDistrictId, districts, originalHeldDistrictPosition]);

  const handleExportLayout = () => {
    const layoutToExport = districts.map(d => {
      // Create a clean object, removing any temporary flags like isDirty
      const { isDirty, ...rest } = d;
      return rest;
    });
    setExportedLayoutJson(JSON.stringify(layoutToExport, null, 2));
    setIsExportModalOpen(true);
  };
  
  const handleSetHeldDistrict = useCallback((id: string | null) => {
    if (id) {
        const district = districts.find(d => d.id === id);
        if (district) {
            setHeldDistrictId(id);
            setOriginalHeldDistrictPosition(district.position);
        }
    } else {
        setHeldDistrictId(null);
        setOriginalHeldDistrictPosition(null);
    }
  }, [districts]);

  const handleCancelMove = useCallback(() => {
    if (heldDistrictId && originalHeldDistrictPosition) {
        setDistricts(prev => prev.map(d => d.id === heldDistrictId ? {...d, position: originalHeldDistrictPosition} : d));
        setHeldDistrictId(null);
        setOriginalHeldDistrictPosition(null);
    }
  }, [heldDistrictId, originalHeldDistrictPosition]);

  const handlePlaceDistrict = useCallback(() => {
      // The position is already updated by the controller, we just need to finalize it.
      setHeldDistrictId(null);
      setOriginalHeldDistrictPosition(null);
  }, []);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 50, near: 0.1, far: 1000 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[backgroundColor]} />
          
          <Sky sunPosition={sunPosition} turbidity={10} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={sunPosition}
            intensity={3}
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
          <Rain count={2500} />
          <FlyingShips setShipRefs={setShipRefs} isPaused={isPaused} />
          <PatrollingCore isPaused={isPaused} />
          <ProceduralTerrain onDeselect={handleGoHome} />

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
            <ChromaticAberration 
              offset={new THREE.Vector2(0.001, 0.001)}
              radialModulation={false}
              modulationOffset={0.15}
            />
          </EffectComposer>

        </Suspense>

        <OrbitControls
            enabled={pov === 'main' && !isAnimating && !isNavMenuOpen && !showProjects && !infoPanelItem && !heldDistrictId}
            minDistance={20}
            maxDistance={400}
            maxPolarAngle={isCalibrationMode ? Math.PI / 2.05 : Math.PI / 2.2}
            target={[0, 5, 0]}
            autoRotate={isAutoRotating && !isCalibrationMode}
            autoRotateSpeed={0.5}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
        />
      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict} 
        onGoHome={handleGoHome}
        onToggleNavMenu={() => setIsNavMenuOpen(!isNavMenuOpen)}
        isDetailViewActive={isDetailViewActive}
        pov={pov}
        onSetPov={handleSetPov}
        isCalibrationMode={isCalibrationMode}
        onToggleCalibrationMode={handleToggleCalibrationMode}
        onExportLayout={handleExportLayout}
        heldDistrictId={heldDistrictId}
        onCancelMove={handleCancelMove}
      />
      <QuickNavMenu 
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={handleQuickNavSelect}
        districts={navDistricts}
      />
      <ProjectSelectionPanel 
        isOpen={showProjects && !!selectedDistrict}
        district={selectedDistrict}
        onClose={handleGoHome}
        onProjectSelect={handleProjectClick}
      />
      <ExportLayoutModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jsonData={exportedLayoutJson}
      />
    </>
  );
};
