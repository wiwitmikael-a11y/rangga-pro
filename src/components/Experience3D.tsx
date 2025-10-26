import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Effects, Stars } from '@react-three/drei';
import * as THREE from 'three';

import type { CityDistrict, OracleActionLink } from '../types';
import { portfolioData } from '../constants';

import { DistrictRenderer } from './scene/DistrictRenderer';
import { CameraRig } from './CameraRig';
import { FlyingShips } from './scene/FlyingShips';
import { PatrollingCore } from './scene/PatrollingCore';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import { CalibrationGrid } from './scene/CalibrationGrid';
import { BuildModeController } from './scene/BuildModeController';
import Rain from './scene/Rain';
import FloatingParticles from './scene/FloatingParticles';

import { HUD } from './ui/HUD';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { OracleModal } from './ui/OracleModal';
import { ContactHubModal } from './ui/ContactHubModal';
import { ExportLayoutModal } from './ui/ExportLayoutModal';
import { AegisProtocolGame } from './game/AegisProtocolGame';
import { GameLobbyPanel } from './ui/GameLobbyPanel';

const GRID_SIZE = 250;
const GRID_DIVISIONS = 25;

export const Experience3D: React.FC = () => {
    // --- State Management ---
    const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
    const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDetailViewActive, setIsDetailViewActive] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isOracleModalOpen, setIsOracleModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isLobbyOpen, setIsLobbyOpen] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [pov, setPov] = useState<'main' | 'ship'>('main');
    const [isCalibrationMode, setIsCalibrationMode] = useState(false);
    const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
    const [exportedLayout, setExportedLayout] = useState('');
    
    // --- Refs ---
    const controlsRef = useRef<any>(null!);
    const shipRefs = useRef<React.RefObject<THREE.Group>[]>([]);
    const patrollingCoreRef = useRef<THREE.Group>(null);
    
    const targetShipRef = pov === 'ship' ? shipRefs.current[0] : null;
    
    // --- Handlers ---
    const handleSelectDistrict = useCallback((district: CityDistrict) => {
        if (isCalibrationMode || isGameActive) return;
        
        if (district.id === 'oracle-ai') {
          setIsOracleModalOpen(true);
        } else {
          setSelectedDistrict(district);
          setIsAnimating(true);
          setIsDetailViewActive(true);
          if (district.id === 'contact-hub') {
              setIsContactModalOpen(true);
          } else if(district.id === 'aegis-command') {
              setIsLobbyOpen(true);
          } else {
              setIsPanelOpen(true);
          }
        }
    }, [isCalibrationMode, isGameActive]);

    const handleGoHome = useCallback(() => {
        setSelectedDistrict(null);
        setIsAnimating(true);
        setIsDetailViewActive(false);
        setIsPanelOpen(false);
        setIsLobbyOpen(false);
        setIsContactModalOpen(false);
        setPov('main');
    }, []);

    const handleAnimationFinish = useCallback(() => setIsAnimating(false), []);

    const handleToggleCalibrationMode = useCallback(() => {
        setIsCalibrationMode(prev => !prev);
        handleGoHome();
    }, [handleGoHome]);
    
    const handlePlaceDistrict = useCallback(() => {
        setHeldDistrictId(null);
        if (controlsRef.current) {
            controlsRef.current.enabled = true;
        }
        document.body.style.cursor = 'auto';
    }, []);

    const handleExportLayout = () => {
        const layout = districts.map(({ id, position, isDirty }) => ({ id, position, isDirty }));
        setExportedLayout(JSON.stringify(layout, null, 2));
        setIsExportModalOpen(true);
    };

    const handleOracleAction = (action: OracleActionLink) => {
        const targetDistrict = districts.find(d => d.id === action.targetId);
        if (targetDistrict) {
            setIsOracleModalOpen(false);
            // Wait for modal to close before starting animation
            setTimeout(() => handleSelectDistrict(targetDistrict), 300);
        }
    };
    
    // --- Effects ---
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = !isAnimating && !isCalibrationMode && pov === 'main';
        }
    }, [isAnimating, isCalibrationMode, pov]);

    useEffect(() => {
      if (heldDistrictId && controlsRef.current) {
          controlsRef.current.enabled = false;
      }
    }, [heldDistrictId]);

    if (isGameActive) {
        return (
            <Canvas shadows>
                <AegisProtocolGame onExitGame={() => setIsGameActive(false)} />
            </Canvas>
        );
    }

    return (
        <>
            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 100, 250]} fov={50} />
                    {!isCalibrationMode && (
                        <OrbitControls 
                            ref={controlsRef}
                            enablePan={false}
                            enableZoom={true}
                            minDistance={20}
                            maxDistance={300}
                            maxPolarAngle={Math.PI / 2 - 0.05}
                        />
                    )}
                    
                    <fog attach="fog" args={['#050810', 150, 450]} />
                    <color attach="background" args={['#050810']} />

                    <ambientLight intensity={0.2} />
                    <directionalLight position={[100, 100, 50]} intensity={1.5} color="#5e3a1f" castShadow />
                    <pointLight position={[0, 50, 0]} intensity={2} color="#00aaff" distance={300} />

                    <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ProceduralTerrain />
                    <Rain count={5000} />
                    <FloatingParticles count={200} />

                    <DistrictRenderer
                        districts={districts}
                        selectedDistrict={selectedDistrict}
                        onDistrictSelect={handleSelectDistrict}
                        isCalibrationMode={isCalibrationMode}
                        heldDistrictId={heldDistrictId}
                        onSetHeldDistrict={setHeldDistrictId}
                    />
                    
                    <FlyingShips setShipRefs={(refs) => (shipRefs.current = refs)} isPaused={isPanelOpen || isNavMenuOpen} />

                    <PatrollingCore
                      ref={patrollingCoreRef}
                      isPaused={isPanelOpen || isNavMenuOpen}
                      isSelected={selectedDistrict?.id === 'oracle-ai'}
                      onSelect={() => handleSelectDistrict({ id: 'oracle-ai', title: 'Oracle AI', description: 'Patrolling AI Assistant', position: [0,35,0], type: 'major' })}
                      isFocused={selectedDistrict?.id === 'oracle-ai'}
                      onAccessChat={() => setIsOracleModalOpen(true)}
                    />

                    {isCalibrationMode && (
                        <>
                            <CalibrationGrid size={GRID_SIZE} />
                            <BuildModeController
                                districts={districts}
                                setDistricts={setDistricts}
                                heldDistrictId={heldDistrictId}
                                onPlaceDistrict={handlePlaceDistrict}
                                gridSize={GRID_SIZE}
                                gridDivisions={GRID_DIVISIONS}
                            />
                        </>
                    )}

                    <CameraRig 
                        selectedDistrict={selectedDistrict} 
                        onAnimationFinish={handleAnimationFinish}
                        isAnimating={isAnimating}
                        pov={pov}
                        targetShipRef={targetShipRef}
                        isCalibrationMode={isCalibrationMode}
                        patrollingCoreRef={patrollingCoreRef}
                    />

                    <Effects>
                        <unrealBloomPass threshold={0.8} strength={0.3} radius={1} />
                    </Effects>
                </Suspense>
            </Canvas>

            {/* --- UI Overlays --- */}
            <HUD
                selectedDistrict={selectedDistrict}
                onGoHome={handleGoHome}
                onToggleNavMenu={() => setIsNavMenuOpen(prev => !prev)}
                isDetailViewActive={isDetailViewActive}
                pov={pov}
                onSetPov={setPov}
                isCalibrationMode={isCalibrationMode}
                onToggleCalibrationMode={handleToggleCalibrationMode}
                onExportLayout={handleExportLayout}
                heldDistrictId={heldDistrictId}
                onCancelMove={handlePlaceDistrict}
                onSelectOracle={() => handleSelectDistrict({ id: 'oracle-ai', title: 'Oracle AI', description: 'Patrolling AI Assistant', position: [0,35,0], type: 'major' })}
            />
            <ProjectSelectionPanel
                isOpen={isPanelOpen}
                district={selectedDistrict}
                onClose={handleGoHome}
            />
            <QuickNavMenu
                isOpen={isNavMenuOpen}
                onClose={() => setIsNavMenuOpen(false)}
                districts={districts.filter(d => d.type === 'major')}
                onSelectDistrict={(d) => {
                    setIsNavMenuOpen(false);
                    handleSelectDistrict(d);
                }}
            />
             <OracleModal
                isOpen={isOracleModalOpen}
                onClose={() => setIsOracleModalOpen(false)}
                onActionTriggered={handleOracleAction}
            />
            <ContactHubModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
            <ExportLayoutModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                jsonData={exportedLayout}
            />
             <GameLobbyPanel 
                isOpen={isLobbyOpen}
                onClose={() => setIsLobbyOpen(false)}
                onLaunch={() => {
                    setIsLobbyOpen(false);
                    setIsGameActive(true);
                }}
            />
        </>
    );
};
