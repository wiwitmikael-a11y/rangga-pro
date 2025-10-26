import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import Rain from './scene/Rain';
import { FlyingShips, shipsData } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData } from '../constants';
import type { CityDistrict } from '../types';
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
import { InstagramVisitModal } from './ui/InstagramVisitModal';
import { ContactHubModal } from './ui/ContactHubModal';
import { GameLobbyPanel } from './ui/GameLobbyPanel';
import { AegisProtocolGame } from './game/AegisProtocolGame';
import { OracleModal } from './ui/OracleModal';


// Define the sun's position for a sunset glow near the horizon
const sunPosition: [number, number, number] = [100, 2, -100]; // Lower sun for a more dramatic sunset
const sunColor = '#ffd0b3'; // Warmer light
const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 100, 250];

export const Experience3D: React.FC = () => {
  const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [isContactHubOpen, setIsContactHubOpen] = useState(false);
  const [isOracleModalOpen, setIsOracleModalOpen] = useState(false);
  const [isOracleFocused, setIsOracleFocused] = useState(false);
  
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

  // Game State
  const [isGameLobbyOpen, setIsGameLobbyOpen] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const playerSpawnPosition = useRef(new THREE.Vector3());
  
  const patrollingCoreRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isPaused = isCalibrationMode || isGameActive;

  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [nexusCore, ...majorDistricts.filter(d => d.id !== 'nexus-core')]
      : majorDistricts;
  }, [districts]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isCalibrationMode) return;
    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    setShowProjects(false);
    setInfoPanelItem(null);
    setIsAutoRotating(false);
    setIsContactHubOpen(false);
    setIsGameLobbyOpen(false);
    setIsOracleModalOpen(false);
    setIsOracleFocused(false);
    
    setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    setIsAnimating(true);
  }, [selectedDistrict, isAnimating, districts, isCalibrationMode]);
  
  const isDetailViewActive = showProjects || !!infoPanelItem || !!selectedDistrict || isContactHubOpen || isGameLobbyOpen || isOracleModalOpen;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !isDetailViewActive && !isCalibrationMode) {
            setIsAutoRotating(true);
        }
    }, 5000);
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
  
  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false);

    if (!selectedDistrict) {
        setIsAutoRotating(true);
        return;
    }

    if (selectedDistrict.id === 'oracle-ai') {
        setIsOracleFocused(true);
    } else if (selectedDistrict.subItems) {
        setShowProjects(true);
    } else if (selectedDistrict.id === 'nexus-core') {
        setShowVisitModal(true);
    } else if (selectedDistrict.id === 'contact') {
        setIsContactHubOpen(true);
    } else if (selectedDistrict.id === 'aegis-command') {
        setIsGameLobbyOpen(true);
    } else {
        setInfoPanelItem(selectedDistrict);
    }
    resetIdleTimer();
  }, [selectedDistrict, resetIdleTimer]);

  const handleGoHome = useCallback(() => {
    if (isCalibrationMode) return;
    setSelectedDistrict(null);
    setShowProjects(false);
    setInfoPanelItem(null);
    setIsAnimating(true);
    setPov('main');
    setIsContactHubOpen(false);
    setShowVisitModal(false);
    setIsGameLobbyOpen(false);
    setIsOracleModalOpen(false);
    setIsOracleFocused(false);
  }, [isCalibrationMode]);

  const handleOpenNavMenu = useCallback(() => setIsNavMenuOpen(true), []);
  const handleCloseNavMenu = useCallback(() => setIsNavMenuOpen(false), []);
  const handleNavMenuSelect = useCallback((district: CityDistrict) => {
      setIsNavMenuOpen(false);
      setTimeout(() => handleDistrictSelect(district), 300);
  }, [handleDistrictSelect]);

  const handleTogglePov = useCallback(() => {
    if (isCalibrationMode) return;
    const newPov = pov === 'main' ? 'ship' : 'main';
    if (newPov === 'ship') {
      const nonCopterShips = shipRefs.filter(ref => {
          const shipData = shipsData.find(s => s.id === (ref.current as any)?.userData?.id);
          return shipData && shipData.shipType !== 'copter';
      });

      if (nonCopterShips.length > 0) {
        const randomShip = nonCopterShips[Math.floor(Math.random() * nonCopterShips.length)];
        setTargetShipRef(randomShip);
      } else {
        setTargetShipRef(null);
      }
    } else {
        handleGoHome();
    }
    setPov(newPov);
    setIsAnimating(true);
  }, [pov, shipRefs, handleGoHome, isCalibrationMode]);
  
  const handleSetPov = (newPov: 'main' | 'ship') => {
    if (isCalibrationMode || pov === newPov) return;
    handleTogglePov();
  };

  const handleToggleCalibrationMode = useCallback(() => {
    const newMode = !isCalibrationMode;
    if (newMode) {
      handleGoHome();
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    } else {
      if (heldDistrictId) {
        const originalPos = originalHeldDistrictPosition;
        if(originalPos) {
          setDistricts(prev => prev.map(d => d.id === heldDistrictId ? {...d, position: originalPos} : d));
        }
        setHeldDistrictId(null);
        setOriginalHeldDistrictPosition(null);
      }
      resetIdleTimer();
    }
    setIsCalibrationMode(newMode);
    setIsAnimating(true);
  }, [isCalibrationMode, handleGoHome, resetIdleTimer, heldDistrictId, originalHeldDistrictPosition]);
  
  const handleSetHeldDistrict = useCallback((id: string | null) => {
    if (id) {
        const dist = districts.find(d => d.id === id);
        if (dist) {
            setOriginalHeldDistrictPosition(dist.position);
            setHeldDistrictId(id);
        }
    }
  }, [districts]);

  const handlePlaceDistrict = useCallback(() => {
    setHeldDistrictId(null);
    setOriginalHeldDistrictPosition(null);
    document.body.style.cursor = 'auto';
  }, []);
  
  const handleCancelMove = useCallback(() => {
    if (heldDistrictId && originalHeldDistrictPosition) {
        setDistricts(prev => prev.map(d => d.id === heldDistrictId ? { ...d, position: originalHeldDistrictPosition } : d));
    }
    setHeldDistrictId(null);
    setOriginalHeldDistrictPosition(null);
    document.body.style.cursor = 'auto';
  }, [heldDistrictId, originalHeldDistrictPosition]);

  const handleExportLayout = useCallback(() => {
    const dirtyDistricts = districts.filter(d => d.isDirty);
    if (dirtyDistricts.length === 0) {
      alert("No layout changes detected to export.");
      return;
    }
    const simplifiedData = districts.map(({ isDirty, ...rest }) => rest);
    const jsonString = JSON.stringify(simplifiedData, null, 2);
    setExportedLayoutJson(jsonString);
    setIsExportModalOpen(true);
  }, [districts]);

  const handleLaunchGame = useCallback(() => {
      setIsGameLobbyOpen(false);
      const aegisDistrict = districts.find(d => d.id === 'aegis-command');
      if (aegisDistrict) {
          const [x, y, z] = aegisDistrict.position;
          playerSpawnPosition.current.set(x, y + 20, z);
      } else {
          playerSpawnPosition.current.set(-50, 40, -50);
      }
      setIsGameActive(true);
  }, [districts]);

  const handleExitGame = useCallback(() => {
      setIsGameActive(false);
      handleGoHome();
  }, [handleGoHome]);
  
  const handleAccessOracleChat = useCallback(() => {
    setIsOracleFocused(false);
    setIsOracleModalOpen(true);
  }, []);


  return (
    <>
      <Canvas
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 50, near: 0.5, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onWheel={handleInteractionStart}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} color={sunColor} />
          <directionalLight
            position={sunPosition}
            intensity={1.5}
            color={sunColor}
          />
          <Sky sunPosition={sunPosition} distance={1000} />
          <CityModel />
          <ProceduralTerrain onDeselect={handleGoHome} />
          <Rain count={5000} />
          <FlyingShips setShipRefs={setShipRefs} isPaused={isPaused} />
          <DistrictRenderer
            districts={districts}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={handleDistrictSelect}
            isCalibrationMode={isCalibrationMode}
            heldDistrictId={heldDistrictId}
            onSetHeldDistrict={handleSetHeldDistrict}
          />
           <PatrollingCore
            ref={patrollingCoreRef}
            isPaused={isPaused}
            isSelected={selectedDistrict?.id === 'oracle-ai'}
            onSelect={() => handleDistrictSelect(portfolioData.find(d => d.id === 'oracle-ai')!)}
            isFocused={isOracleFocused}
            onAccessChat={handleAccessOracleChat}
          />

          {isCalibrationMode && (
            <>
              <CalibrationGrid size={250} />
              <BuildModeController
                districts={districts}
                setDistricts={setDistricts}
                heldDistrictId={heldDistrictId}
                onPlaceDistrict={handlePlaceDistrict}
                gridSize={250}
                gridDivisions={25}
              />
            </>
          )}

          {isGameActive && <AegisProtocolGame onExit={handleExitGame} playerSpawnPosition={playerSpawnPosition.current} />}
          
          <CameraRig
            selectedDistrict={selectedDistrict}
            onAnimationFinish={handleAnimationFinish}
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
                maxPolarAngle={Math.PI / 2.1} // Prevent looking straight down or below ground
                autoRotate={isAutoRotating}
                autoRotateSpeed={0.3}
                enablePan={!isCalibrationMode} // Allow panning unless in build mode
                enabled={pov === 'main' && !isAnimating && !isCalibrationMode}
                onStart={handleInteractionStart}
                onEnd={handleInteractionEnd}
                onChange={handleControlsChange}
            />
          )}

        </Suspense>
      </Canvas>
      
      {/* --- Overlays --- */}
      {!isGameActive && (
        <HUD
          selectedDistrict={selectedDistrict}
          onGoHome={handleGoHome}
          onToggleNavMenu={handleOpenNavMenu}
          isDetailViewActive={isDetailViewActive}
          pov={pov}
          onSetPov={handleSetPov}
          isCalibrationMode={isCalibrationMode}
          onToggleCalibrationMode={handleToggleCalibrationMode}
          onExportLayout={handleExportLayout}
          heldDistrictId={heldDistrictId}
          onCancelMove={handleCancelMove}
          onSelectOracle={() => handleDistrictSelect(portfolioData.find(d => d.id === 'oracle-ai')!)}
        />
      )}

      {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={handleGoHome} />}
      <ProjectSelectionPanel isOpen={showProjects} district={selectedDistrict} onClose={handleGoHome} />
      <QuickNavMenu isOpen={isNavMenuOpen} onClose={handleCloseNavMenu} onSelectDistrict={handleNavMenuSelect} districts={navDistricts} />
      <InstagramVisitModal isOpen={showVisitModal} onClose={handleGoHome} />
      <ContactHubModal isOpen={isContactHubOpen} onClose={handleGoHome} />
      <GameLobbyPanel isOpen={isGameLobbyOpen} onLaunch={handleLaunchGame} onClose={handleGoHome} />
      <OracleModal isOpen={isOracleModalOpen} onClose={handleGoHome} />
      
      {isCalibrationMode && (
          <ExportLayoutModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} jsonData={exportedLayoutJson} />
      )}
    </>
  );
};