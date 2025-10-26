import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CityModel } from './scene/CityModel';
import { FlyingShips } from './scene/FlyingShips';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import { PatrollingCore } from './scene/PatrollingCore';
import { CameraRig } from './CameraRig';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { HUD } from './ui/HUD';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { CityDistrict } from '../types';
import { portfolioData, OVERVIEW_CAMERA_POSITION } from '../constants';

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipIndex, setTargetShipIndex] = useState(0);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  const controlsRef = useRef<any>(null);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === selectedDistrict?.id) {
      setSelectedDistrict(null);
      setIsAnimating(true);
    } else {
      setSelectedDistrict(district);
      setIsAnimating(true);
    }
  }, [selectedDistrict]);

  const handleDeselect = useCallback(() => {
    setSelectedDistrict(null);
    setIsAnimating(true);
  }, []);

  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const handleSetPov = useCallback((newPov: 'main' | 'ship') => {
    if (newPov === 'ship') {
        setSelectedDistrict(null); // Deselect district when entering ship POV
        setTargetShipIndex(prev => (prev + 1) % shipRefs.length);
    }
    setPov(newPov);
    setIsAnimating(true);
  }, [shipRefs.length]);

  const handleToggleNavMenu = useCallback(() => {
    setIsNavMenuOpen(prev => !prev);
  }, []);

  const isDetailViewActive = !!selectedDistrict;
  const isPaused = isDetailViewActive || isNavMenuOpen;
  const targetShipRef = pov === 'ship' && shipRefs.length > 0 ? shipRefs[targetShipIndex] : null;
  const majorDistricts = portfolioData.filter(d => d.type === 'major');

  return (
    <>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={OVERVIEW_CAMERA_POSITION} fov={50} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={!isDetailViewActive && pov === 'main'}
          minDistance={30}
          maxDistance={250}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 10, 0]}
        />
        <fog attach="fog" args={['#05081a', 150, 400]} />
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <directionalLight
          castShadow
          position={[50, 80, 50]}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        
        <CameraRig
          selectedDistrict={selectedDistrict}
          onAnimationFinish={handleAnimationFinish}
          isAnimating={isAnimating || pov === 'ship'}
          pov={pov}
          targetShipRef={targetShipRef}
        />
        
        <group>
          <CityModel />
          <ProceduralTerrain onDeselect={handleDeselect} />
          <FlyingShips setShipRefs={setShipRefs} isPaused={isPaused} />
          <PatrollingCore isPaused={isPaused}/>
          <DistrictRenderer
            districts={portfolioData}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={handleDistrictSelect}
          />
        </group>
      </Canvas>
      
      {/* UI Components */}
      <HUD 
        selectedDistrict={selectedDistrict} 
        onToggleNavMenu={handleToggleNavMenu}
        isDetailViewActive={isDetailViewActive}
        pov={pov}
        onSetPov={handleSetPov}
      />
      <ProjectSelectionPanel 
        isOpen={isDetailViewActive}
        district={selectedDistrict}
        onClose={handleDeselect}
        onProjectSelect={() => {}}
      />
      <QuickNavMenu 
        isOpen={isNavMenuOpen}
        onClose={handleToggleNavMenu}
        districts={majorDistricts}
        onSelectDistrict={(district) => {
            handleDistrictSelect(district);
            setIsNavMenuOpen(false);
        }}
      />
    </>
  );
};
