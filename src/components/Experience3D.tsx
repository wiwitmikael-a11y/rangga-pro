
import React, { useState, useCallback, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Effects } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, OracleActionLink } from '../types';
import { portfolioData } from '../constants';
import { CameraRig } from '../components/CameraRig';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { FlyingShips, ShipData, shipsData } from './scene/FlyingShips';
import { PatrollingCore } from './scene/PatrollingCore';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import { HUD } from './ui/HUD';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { OracleModal } from './ui/OracleModal';
import { ContactHubModal } from './ui/ContactHubModal';
import { ExportLayoutModal } from './ui/ExportLayoutModal';
import { CalibrationGrid } from './scene/CalibrationGrid';
import { BuildModeController } from './scene/BuildModeController';

export const Experience3D: React.FC = () => {
    const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
    const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDetailView, setIsDetailView] = useState(false);
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
    const [isOracleModalOpen, setIsOracleModalOpen] = useState(false);
    const [isOracleFocused, setIsOracleFocused] = useState(false);
    const [isContactHubOpen, setIsContactHubOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [pov, setPov] = useState<'main' | 'ship'>('main');
    const [isCalibrationMode, setIsCalibrationMode] = useState(false);
    const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
    const [exportedJson, setExportedJson] = useState('');

    const shipRefs = useRef<React.RefObject<THREE.Group>[]>([]);
    const patrollingCoreRef = useRef<THREE.Group>(null);
    const targetShipForPov = shipRefs.current[2] || null;

    const handleDistrictSelect = useCallback((district: CityDistrict) => {
        if (isCalibrationMode || isAnimating) return;
        
        if (district.id === 'contact-hub') {
            setIsContactHubOpen(true);
            return;
        }

        if (district.id === 'oracle-ai') {
            setSelectedDistrict(district);
            setIsAnimating(true);
            setIsDetailView(true);
            return;
        }

        if (selectedDistrict?.id === district.id) {
            setIsProjectPanelOpen(true);
        } else {
            setSelectedDistrict(district);
            setIsAnimating(true);
            setIsDetailView(true);
        }
        setIsNavMenuOpen(false);
    }, [selectedDistrict, isCalibrationMode, isAnimating]);

    const handleGoHome = useCallback(() => {
        if (isAnimating) return;
        setSelectedDistrict(null);
        setIsAnimating(true);
        setIsDetailView(false);
        setIsProjectPanelOpen(false);
        setIsOracleFocused(false);
        if (pov === 'ship') setPov('main');
    }, [isAnimating, pov]);

    const handleAnimationFinish = useCallback(() => {
        setIsAnimating(false);
        if (selectedDistrict && !isProjectPanelOpen && selectedDistrict.id !== 'oracle-ai') {
            setIsProjectPanelOpen(true);
        }
        if (selectedDistrict?.id === 'oracle-ai') {
            setIsOracleFocused(true);
        }
    }, [selectedDistrict, isProjectPanelOpen]);

    const handleDeselect = useCallback(() => {
        if (!isProjectPanelOpen && !isContactHubOpen && !isNavMenuOpen && !isOracleModalOpen) {
            handleGoHome();
        }
    }, [isProjectPanelOpen, isContactHubOpen, isNavMenuOpen, isOracleModalOpen, handleGoHome]);
    
    const handleToggleCalibrationMode = useCallback(() => {
        if (isAnimating || isDetailView) return;
        const willBeCalibrating = !isCalibrationMode;
        setIsCalibrationMode(willBeCalibrating);
        setIsAnimating(true); // Trigger camera move
    }, [isCalibrationMode, isAnimating, isDetailView]);

    const handlePlaceDistrict = useCallback(() => {
        setHeldDistrictId(null);
        document.body.style.cursor = 'auto';
    }, []);

    const handleExportLayout = useCallback(() => {
        const dirtyDistricts = districts.map(({isDirty, ...rest}) => rest);
        setExportedJson(JSON.stringify(dirtyDistricts, null, 2));
        setIsExportModalOpen(true);
    }, [districts]);
    
    const handleAccessOracleChat = useCallback(() => {
        setIsOracleModalOpen(true);
    }, []);

    const handleOracleAction = useCallback((action: OracleActionLink) => {
        if (action.type === 'navigate') {
            const targetDistrict = districts.find(d => d.id === action.targetId);
            if (targetDistrict) {
                setIsOracleModalOpen(false);
                // A small delay to allow the modal to fade out before camera moves
                setTimeout(() => {
                    handleDistrictSelect(targetDistrict);
                }, 300);
            }
        }
    }, [districts, handleDistrictSelect]);

    const architectGridSize = 250;

    return (
        <>
            <Canvas
                shadows
                camera={{ position: [0, 100, 250], fov: 50 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
                <Suspense fallback={null}>
                    <CameraRig
                        selectedDistrict={selectedDistrict}
                        onAnimationFinish={handleAnimationFinish}
                        isAnimating={isAnimating}
                        pov={pov}
                        targetShipRef={targetShipForPov}
                        isCalibrationMode={isCalibrationMode}
                        patrollingCoreRef={patrollingCoreRef}
                    />
                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[50, 80, 50]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <Stars radius={200} depth={50} count={5000} factor={8} saturation={1} fade speed={1} />
                    
                    <DistrictRenderer
                        districts={districts}
                        selectedDistrict={selectedDistrict}
                        onDistrictSelect={handleDistrictSelect}
                        isCalibrationMode={isCalibrationMode}
                        heldDistrictId={heldDistrictId}
                        onSetHeldDistrict={setHeldDistrictId}
                    />

                    <PatrollingCore 
                        ref={patrollingCoreRef}
                        isPaused={isCalibrationMode}
                        isSelected={selectedDistrict?.id === 'oracle-ai'}
                        onSelect={() => handleDistrictSelect({ id: 'oracle-ai', title: 'Oracle AI', description: 'Patrolling AI Assistant', position: [0,35,0], type: 'major' })}
                        isFocused={isOracleFocused}
                        onAccessChat={handleAccessOracleChat}
                    />

                    <FlyingShips setShipRefs={(refs) => { shipRefs.current = refs; }} isPaused={isCalibrationMode}/>
                    <ProceduralTerrain onDeselect={handleDeselect} />
                    
                    {isCalibrationMode && (
                        <>
                            <CalibrationGrid size={architectGridSize} />
                            <BuildModeController 
                                districts={districts}
                                setDistricts={setDistricts}
                                heldDistrictId={heldDistrictId}
                                onPlaceDistrict={handlePlaceDistrict}
                                gridSize={architectGridSize}
                                gridDivisions={25}
                            />
                        </>
                    )}
                    
                    <Effects disableGamma>
                        <unrealBloomPass threshold={0.5} strength={0.3} radius={0.5} />
                    </Effects>
                </Suspense>
                <OrbitControls
                    enablePan={!isDetailView}
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2.1}
                    minDistance={30}
                    maxDistance={300}
                />
            </Canvas>

            {/* --- UI Overlays --- */}
            <HUD
                selectedDistrict={selectedDistrict}
                onGoHome={handleGoHome}
                onToggleNavMenu={() => setIsNavMenuOpen(true)}
                isDetailViewActive={isDetailView}
                pov={pov}
                onSetPov={setPov}
                isCalibrationMode={isCalibrationMode}
                onToggleCalibrationMode={handleToggleCalibrationMode}
                onExportLayout={handleExportLayout}
                heldDistrictId={heldDistrictId}
                onCancelMove={handlePlaceDistrict}
                onSelectOracle={() => setIsOracleModalOpen(true)}
            />
            <QuickNavMenu
                isOpen={isNavMenuOpen}
                onClose={() => setIsNavMenuOpen(false)}
                onSelectDistrict={handleDistrictSelect}
                districts={portfolioData.filter(d => d.type === 'major' && d.id !== 'oracle-ai')}
            />
            <ProjectSelectionPanel
                isOpen={isProjectPanelOpen}
                district={selectedDistrict}
                onClose={() => {
                    setIsProjectPanelOpen(false);
                    handleGoHome();
                }}
            />
            <OracleModal
                isOpen={isOracleModalOpen}
                onClose={() => setIsOracleModalOpen(false)}
                onActionTriggered={handleOracleAction}
            />
            <ContactHubModal
                isOpen={isContactHubOpen}
                onClose={() => setIsContactHubOpen(false)}
            />
            <ExportLayoutModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                jsonData={exportedJson}
            />
            {isCalibrationMode && (
                 <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    animation: 'fadeInGrid 0.5s ease forwards',
                    zIndex: 1,
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,255,255,0.1) 100%), repeating-linear-gradient(rgba(0,255,255,0.1) 0, rgba(0,255,255,0.1) 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, rgba(0,255,255,0.1) 0, rgba(0,255,255,0.1) 1px, transparent 1px, transparent 50px)',
                 }}/>
            )}
        </>
    );
};
