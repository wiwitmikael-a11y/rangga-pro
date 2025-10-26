
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import { portfolioData as initialPortfolioData } from '../constants';
import type { CityDistrict } from '../types';

// UI Components
import { HUD } from './ui/HUD';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ContactHubModal } from './ui/ContactHubModal';
import { OracleModal } from './ui/OracleModal';
import { ExportLayoutModal } from './ui/ExportLayoutModal';
import { GameLobbyPanel } from './ui/GameLobbyPanel';

// Scene Components
import { CameraRig } from './CameraRig';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { FlyingShips } from './scene/FlyingShips';
import { PatrollingCore } from './scene/PatrollingCore';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import { CalibrationGrid } from './scene/CalibrationGrid';
import { BuildModeController } from './scene/BuildModeController';

// Game Components
import { AegisProtocolGame } from './game/AegisProtocolGame';

export const Experience3D: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [districts, setDistricts] = useState<CityDistrict[]>(initialPortfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimatingCamera, setIsAnimatingCamera] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);

  // UI States
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOracleModalOpen, setIsOracleModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGameLobbyOpen, setIsGameLobbyOpen] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [exportedJson, setExportedJson] = useState('');

  // Scene Refs
  const shipRefs = useRef<React.RefObject<THREE.Group>[]>([]);
  const patrollingCoreRef = useRef<THREE.Group>(null);
  const playerShipRef = pov === 'ship' ? shipRefs.current[2] : null;

  // --- SIDE EFFECTS ---
  useEffect(() => {
    // When entering calibration mode, reset camera to a top-down view.
    if (isCalibrationMode) {
      setSelectedDistrict(null);
      setIsDetailView(false);
      setPov('main');
      setIsAnimatingCamera(true);
    }
  }, [isCalibrationMode]);

  // --- EVENT HANDLERS ---
  const handleDistrictSelect = useCallback((district: CityDistrict | null) => {
    if (isCalibrationMode || isGameActive) return;

    setSelectedDistrict(district);
    setIsAnimatingCamera(true);
    
    if (district) {
      if (district.id === 'contact-hub') {
        setIsContactModalOpen(true);
      } else if (district.id === 'oracle-ai') {
        // Just focus, don't open a detail panel
        setIsDetailView(true);
      } else if (district.id === 'aegis-command') {
        setIsGameLobbyOpen(true);
      } else {
        setIsDetailView(true);
        setIsProjectPanelOpen(true);
      }
    }
  }, [isCalibrationMode, isGameActive]);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setIsAnimatingCamera(true);
    setIsDetailView(false);
    setIsProjectPanelOpen(false);
    setIsGameLobbyOpen(false);
    setPov('main');
  }, []);

  const handleClosePanels = useCallback(() => {
    setIsProjectPanelOpen(false);
    // Don't go home automatically, just close the panel. The camera remains focused.
  }, []);
  
  const handleToggleCalibration = () => {
    setIsCalibrationMode(prev => !prev);
  };
  
  const handleExportLayout = () => {
    const updatedLayout = districts
      .filter(d => d.isDirty)
      .map(({ id, position }) => ({ id, position }));
    
    if (updatedLayout.length === 0) {
      alert("No changes to export. Move a district in Architect Mode first.");
      return;
    }
    
    setExportedJson(JSON.stringify(updatedLayout, null, 2));
    setIsExportModalOpen(true);
  };

  const handleSetHeldDistrict = useCallback((id: string | null) => {
    if (isCalibrationMode) {
      setHeldDistrictId(id);
      document.body.style.cursor = id ? 'grabbing' : 'grab';
    }
  }, [isCalibrationMode]);

  // --- RENDER LOGIC ---
  const orbitControlsEnabled = !isAnimatingCamera && !isDetailView && !isCalibrationMode && pov === 'main' && !isGameActive;

  if (isGameActive) {
    return <AegisProtocolGame onExit={() => setIsGameActive(false)} />;
  }

  return (
    <>
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={60} position={[0, 100, 250]} />
        <color attach="background" args={['#050810']} />
        <fog attach="fog" args={['#050810', 150, 400]} />

        {/* --- LIGHTING --- */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 50, -50]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 40, 0]} intensity={2} color="#00ffff" distance={100} />

        {/* --- ENVIRONMENT --- */}
        <Stars radius={150} depth={50} count={5000} factor={6} saturation={0} fade speed={1} />
        <Sparkles count={100} scale={8} size={2} speed={0.5} color="#00ffff" />
        <ProceduralTerrain />

        {/* --- SCENE OBJECTS --- */}
        <DistrictRenderer
          districts={districts}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
          isCalibrationMode={isCalibrationMode}
          heldDistrictId={heldDistrictId}
          onSetHeldDistrict={handleSetHeldDistrict}
        />
        <FlyingShips setShipRefs={(refs) => (shipRefs.current = refs)} isPaused={isDetailView} />
        <PatrollingCore
          ref={patrollingCoreRef}
          isSelected={selectedDistrict?.id === 'oracle-ai'}
          onSelect={() => handleDistrictSelect(districts.find(d => d.id === 'oracle-ai') || null)}
          isFocused={isDetailView && selectedDistrict?.id === 'oracle-ai'}
          onAccessChat={() => setIsOracleModalOpen(true)}
        />
        
        {/* --- CONTROLS & HELPERS --- */}
        <CameraRig
          selectedDistrict={selectedDistrict}
          isAnimating={isAnimatingCamera}
          onAnimationFinish={() => setIsAnimatingCamera(false)}
          pov={pov}
          targetShipRef={playerShipRef}
          isCalibrationMode={isCalibrationMode}
          patrollingCoreRef={patrollingCoreRef}
        />
        <OrbitControls
          enabled={orbitControlsEnabled}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={30}
          maxDistance={300}
        />
        {isCalibrationMode && (
          <>
            <CalibrationGrid />
            <BuildModeController
              districts={districts}
              setDistricts={setDistricts}
              heldDistrictId={heldDistrictId}
              onPlaceDistrict={() => handleSetHeldDistrict(null)}
              gridSize={250}
              gridDivisions={25}
            />
          </>
        )}
        
        {/* --- POST-PROCESSING --- */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} intensity={0.6} levels={9} mipmapBlur />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      
      {/* --- UI OVERLAYS --- */}
      <HUD
        selectedDistrict={selectedDistrict}
        onGoHome={handleGoHome}
        onToggleNavMenu={() => setIsNavMenuOpen(true)}
        isDetailViewActive={isDetailView}
        pov={pov}
        onSetPov={setPov}
        isCalibrationMode={isCalibrationMode}
        onToggleCalibrationMode={handleToggleCalibration}
        onExportLayout={handleExportLayout}
        heldDistrictId={heldDistrictId}
        onCancelMove={() => handleSetHeldDistrict(null)}
        onSelectOracle={() => handleDistrictSelect(districts.find(d => d.id === 'oracle-ai') || null)}
      />
      <QuickNavMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={(d) => {
          handleDistrictSelect(d);
          setIsNavMenuOpen(false);
        }}
        districts={districts.filter(d => d.type === 'major')}
      />
      <ProjectSelectionPanel
        isOpen={isProjectPanelOpen}
        onClose={handleClosePanels}
        district={selectedDistrict}
      />
      <ContactHubModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <OracleModal
        isOpen={isOracleModalOpen}
        onClose={() => setIsOracleModalOpen(false)}
        onActionTriggered={(action) => {
          const target = districts.find(d => d.id === action.targetId);
          if (target) handleDistrictSelect(target);
          setIsOracleModalOpen(false);
        }}
      />
      <ExportLayoutModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jsonData={exportedJson}
      />
      <GameLobbyPanel
        isOpen={isGameLobbyOpen}
        onLaunch={() => {
          setIsGameLobbyOpen(false);
          setIsGameActive(true);
        }}
        onClose={() => setIsGameLobbyOpen(false)}
      />
    </>
  );
};
