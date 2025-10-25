import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, useGLTF } from '@react-three/drei';
import { EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import Rain from './scene/Rain';
import { FlyingShips, shipsData } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData } from '../constants';
import type { CityDistrict, PortfolioSubItem } from '../types';
import { CameraRig } from './CameraRig';
import { HUD } from './ui/HUD';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import HolographicInfoPanel from './scene/H holographicInfoPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { PatrollingCore } from './scene/PatrollingCore';
import { CalibrationGrid } from './scene/CalibrationGrid';
import { BuildModeController } from './scene/BuildModeController';
import { ExportLayoutModal } from './ui/ExportLayoutModal';
import { InstagramVisitModal } from './ui/InstagramVisitModal';
import { ContactHubModal } from './ui/ContactHubModal';
import { AegisProtocolGame } from './game/AegisProtocolGame';
import { GameLobbyPanel } from './ui/GameLobbyPanel';

// Define the sun's position for a warmer, Mars/Venus-like daylight
const sunPosition: [number, number, number] = [100, 70, -80]; // Lower sun for more dramatic lighting
const sunColor = '#ffae78'; // Warm orange light
const backgroundColor = '#4a2a1e'; // A Mars-like dark red-brown for the background
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
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Game Mode State
  const [gameMode, setGameMode] = useState<'inactive' | 'lobby' | 'active'>('inactive');

  // Build Mode State
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
  const [originalHeldDistrictPosition, setOriginalHeldDistrictPosition] = useState<[number, number, number] | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportedLayoutJson, setExportedLayoutJson] = useState('');

  const isPaused = isCalibrationMode || gameMode === 'active';

  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [nexusCore, ...majorDistricts.filter(d => d.id !== 'nexus-core')]
      : majorDistricts;
  }, [districts]);

  const aegisDistrict = useMemo(() => districts.find(d => d.id === 'aegis-command'), [districts]);
  const playerSpawnPosition = useMemo(() => 
    aegisDistrict 
      ? new THREE.Vector3(aegisDistrict.position[0], 10, aegisDistrict.position[2] + 10) 
      : new THREE.Vector3(-60, 10, -50), // Fallback position
    [aegisDistrict]
  );
  
  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (isCalibrationMode || gameMode === 'active') return;
    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    setShowProjects(false);
    setInfoPanelItem(null);
    setIsAutoRotating(false);
    setIsContactHubOpen(false);
    if(gameMode === 'lobby') setGameMode('inactive');
    
    setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    setIsAnimating(true);
  }, [selectedDistrict, isAnimating, districts, isCalibrationMode, gameMode]);
  
  const isDetailViewActive = showProjects || !!infoPanelItem || !!selectedDistrict || isContactHubOpen || gameMode === 'lobby';

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !isDetailViewActive && !isCalibrationMode && gameMode === 'inactive') {
            setIsAutoRotating(true);
        }
    }, 5000);
  }, [pov, isDetailViewActive, isCalibrationMode, gameMode]);

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
    setIsContactHubOpen(false);
    setShowVisitModal(false);
    setTargetShipRef(null);
    if (gameMode !== 'inactive') setGameMode('inactive');
    resetIdleTimer();
  }, [resetIdleTimer, gameMode]);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict) {
      if (selectedDistrict.id === 'aegis-command') {
        setGameMode('lobby');
      } else if (selectedDistrict.id === 'nexus-core') {
        setShowVisitModal(true);
      } else if (selectedDistrict.id === 'contact') {
        setIsContactHubOpen(true);
      } else if (selectedDistrict.subItems && selectedDistrict.subItems.length > 0) {
        setShowProjects(true);
      } else {
        setInfoPanelItem(selectedDistrict);
      }
    } else if (pov === 'main' && !isCalibrationMode && gameMode === 'inactive') {
      resetIdleTimer();
    }
  }, [selectedDistrict, resetIdleTimer, pov, isCalibrationMode, gameMode]);

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
    if (isCalibrationMode || gameMode === 'active') return;

    if (newPov === 'ship' && pov === 'ship') {
      if (shipRefs.length > 1) {
        let newTargetIndex = -1;
        let currentTargetIndex = shipRefs.findIndex(ref => ref === targetShipRef);

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
      handleGoHome();
    } else {
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      if(selectedDistrict) {
        setSelectedDistrict(null);
        setShowProjects(false);
        setInfoPanelItem(null);
        setIsContactHubOpen(false);
      }
      
      if (shipRefs.length > 0) {
        const randomIndex = Math.floor(Math.random() * shipRefs.length);
        setTargetShipRef(shipRefs[randomIndex]);
      }
      setPov('ship');
      setIsAnimating(true);
    }
  };
  
  const handleToggleCalibrationMode = useCallback(() => {
    if (gameMode === 'active') return;
    setIsCalibrationMode(prev => {
      const newMode = !prev;
      if (newMode) {
        setIsAnimating(true);
        setIsAutoRotating(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (isDetailViewActive) handleGoHome();
        if (pov === 'ship') setPov('main');
      } else {
        if (heldDistrictId) {
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
  }, [handleGoHome, isDetailViewActive, pov, heldDistrictId, districts, originalHeldDistrictPosition, gameMode]);

  const handleLaunchGame = useCallback(() => {
    setGameMode('active');
  }, []);


  const handleExportLayout = () => {
    const layoutToExport = districts.map(d => {
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
          
          <Sky sunPosition={sunPosition} turbidity={8} rayleigh={1.5} mieCoefficient={0.01} mieDirectionalG={0.8} />
          <ambientLight intensity={1.5} />
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
          <Rain count={2500} />
          <FlyingShips setShipRefs={setShipRefs} isPaused={isPaused} />
          <PatrollingCore isPaused={isPaused} />
          <ProceduralTerrain onDeselect={handleGoHome} />
          
          {gameMode === 'active' ? (
            <AegisProtocolGame onExit={handleGoHome} playerSpawnPosition={playerSpawnPosition} />
          ) : (
            <>
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
            </>
          )}

          <CameraRig 
            selectedDistrict={selectedDistrict} 
            onAnimationFinish={onAnimationFinish} 
            isAnimating={isAnimating}
            pov={pov}
            targetShipRef={targetShipRef}
            isCalibrationMode={isCalibrationMode}
            isGameModeActive={gameMode === 'active'}
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

        {gameMode !== 'active' && (
          <OrbitControls
              enabled={pov === 'main' && !isAnimating && !isNavMenuOpen && !showProjects && !infoPanelItem && !heldDistrictId && gameMode !== 'lobby'}
              minDistance={20}
              maxDistance={400}
              maxPolarAngle={isCalibrationMode ? Math.PI / 2.05 : Math.PI / 2.2}
              target={[0, 5, 0]}
              autoRotate={isAutoRotating && !isCalibrationMode}
              autoRotateSpeed={0.5}
              onStart={handleInteractionStart}
              onEnd={handleInteractionEnd}
          />
        )}
      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict} 
        // FIX: Corrected a typo. The function is named 'handleGoHome', not 'onGoHome'.
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
        gameMode={gameMode}
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
      <InstagramVisitModal
        isOpen={showVisitModal}
        onClose={handleGoHome}
      />
      <ContactHubModal
        isOpen={isContactHubOpen}
        onClose={handleGoHome}
      />
      <GameLobbyPanel
        isOpen={gameMode === 'lobby'}
        onLaunch={handleLaunchGame}
        onClose={handleGoHome}
      />
    </>
  );
};

// Preload the Aegis Command model so it's ready when needed
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/aegis_hq.glb');