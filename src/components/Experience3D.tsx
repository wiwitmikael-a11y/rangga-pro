import React, { useState, useCallback, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
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

// Define the sun's position to be used by the light, sky, and mesh
const sunPosition: [number, number, number] = [100, 15, -150];
const sunColor = '#FFFFF0'; // A warm, sun-like white
const backgroundColor = '#a38c6d'; // Dusty sand color for background

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const navDistricts = useMemo(() => {
    const majorDistricts = portfolioData.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [...majorDistricts.filter(d => d.id !== 'nexus-core'), nexusCore]
      : majorDistricts;
  }, []);
  
  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    // Special handling for the central @rangga.p.h core
    if (district.id === 'nexus-core') {
      window.open('https://www.instagram.com/rangga.p.h/', '_blank');
      // Set as selected to trigger glow effect, but don't start camera animation
      setSelectedDistrict(district); 
      // Ensure other panels are closed
      setShowProjects(false);
      setInfoPanelItem(null);
      return;
    }

    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    // For other districts, proceed with the standard animation logic
    if (district.subItems && district.subItems.length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null); 
      setInfoPanelItem(district);
    }
    setIsAnimating(true);
    setShowProjects(false); // Hide old projects immediately
  }, [selectedDistrict, isAnimating]);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowProjects(false);
    setInfoPanelItem(null);
  }, []);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    // Show projects panel only if the selected district is not the central core
    if (selectedDistrict && selectedDistrict.id !== 'nexus-core') {
      setShowProjects(true);
    }
  }, [selectedDistrict]);

  const handleProjectClick = (item: PortfolioSubItem) => {
    console.log('Project clicked:', item.title);
  };
  
  const handlePanelClose = () => {
      setInfoPanelItem(null);
  };

  const handleQuickNavSelect = (district: CityDistrict) => {
    handleDistrictSelect(district);
    setIsNavMenuOpen(false);
  };
  
  const isDetailViewActive = showProjects || !!infoPanelItem || selectedDistrict?.id === 'nexus-core';

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 60, 140], fov: 50, near: 0.1, far: 1000 }} // Increased Z for wider initial view
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
          
          <Sky sunPosition={sunPosition} turbidity={10} rayleigh={3} mieCoefficient={0.005} mieDirectionalG={0.8} />
          <ambientLight intensity={0.3} />
          <directionalLight
            position={sunPosition}
            intensity={5}
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
          <FlyingShips />
          <PatrollingCore />
          <ProceduralTerrain onDeselect={handleGoHome} />

          <group position={[0, 5, 0]}>
            <DistrictRenderer
              districts={portfolioData}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
            />
            {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={handlePanelClose} />}
          </group>
          
          <CameraRig selectedDistrict={selectedDistrict} onAnimationFinish={onAnimationFinish} isAnimating={isAnimating} />

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
            enabled={!isAnimating && !isNavMenuOpen && !showProjects && !infoPanelItem}
            minDistance={20}
            maxDistance={250} // Increased max distance
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
        />
      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict} 
        onGoHome={handleGoHome}
        onToggleNavMenu={() => setIsNavMenuOpen(!isNavMenuOpen)}
        isDetailViewActive={isDetailViewActive}
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
    </>
  );
};