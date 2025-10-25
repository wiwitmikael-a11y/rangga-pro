import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

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
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel'; // Impor panel baru

// Define the sun's position to be used by the light, sky, and mesh
const sunPosition: [number, number, number] = [-100, 70, -100];
const sunColor = '#FFFFF0'; // A warm, sun-like white

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === selectedDistrict?.id) return;
    
    // For districts with sub-items, zoom in. For others, show info panel directly.
    if (district.subItems && district.subItems.length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null); // Go to overview if clicking a non-interactive major district
      setInfoPanelItem(district);
    }
    setIsAnimating(true);
    setShowProjects(false); // Hide old projects immediately
    if (district.type === 'major' && (!district.subItems || district.subItems.length === 0)) {
        setInfoPanelItem(district);
    }
  }, [selectedDistrict]);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowProjects(false);
    setInfoPanelItem(null);
  }, []);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict) {
      setShowProjects(true); // Show new projects after animation
    }
  }, [selectedDistrict]);

  const handleProjectClick = (item: PortfolioSubItem) => {
    // In a real app, you'd show project details.
    // Here we can just log it or show a generic panel.
    console.log('Project clicked:', item.title);
    if(selectedDistrict){
       // For simplicity, we can close the main panel and show a more detailed one in the future.
       // For now, let's just log it.
    }
  };
  
  const handlePanelClose = () => {
      setInfoPanelItem(null);
  };

  const handleQuickNavSelect = (district: CityDistrict) => {
    handleDistrictSelect(district);
    setIsNavMenuOpen(false);
  };

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 60, 120], fov: 50, near: 0.1, far: 1000 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false, // Antialiasing is handled by post-processing (FXAA/SMAA) if needed
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          {/* --- NEW NATURAL LIGHTING SETUP --- */}
          {/* A procedural sky that creates a natural background */}
          <Sky sunPosition={sunPosition} />
          {/* A low-intensity ambient light to soften shadows */}
          <ambientLight intensity={0.3} />
          {/* The main directional light source (our "sun") */}
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
          {/* A visible mesh for the sun object */}
          <mesh position={sunPosition}>
            <sphereGeometry args={[15, 32, 32]} />
            <meshStandardMaterial
                color={sunColor}
                emissive={sunColor}
                emissiveIntensity={5}
                toneMapped={false} // Ensures the sun glows brightly
            />
          </mesh>

          {/* --- SCENE OBJECTS --- */}
          <CityModel />
          <Rain count={2500} />
          <FlyingShips />
          <ProceduralTerrain onDeselect={handleGoHome} />

          <group position={[0, 5, 0]}>
            <DistrictRenderer
              districts={portfolioData}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
            />
            {/* ProjectDisplay 3D items have been removed from here */}
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
              offset={new Vector2(0.001, 0.001)}
              radialModulation={false}
              modulationOffset={0.15}
            />
          </EffectComposer>

        </Suspense>

        <OrbitControls
            enabled={!isAnimating && !isNavMenuOpen && !showProjects}
            minDistance={20}
            maxDistance={200}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
        />
      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict} 
        onGoHome={handleGoHome}
        onToggleNavMenu={() => setIsNavMenuOpen(!isNavMenuOpen)}
      />
      <QuickNavMenu 
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={handleQuickNavSelect}
        districts={portfolioData.filter(d => d.type === 'major')}
      />
      {/* --- RENDER THE NEW PROJECT PANEL --- */}
      <ProjectSelectionPanel 
        isOpen={showProjects && !!selectedDistrict}
        district={selectedDistrict}
        onClose={handleGoHome}
        onProjectSelect={handleProjectClick}
      />
    </>
  );
};
