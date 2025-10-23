/// <reference types="@react-three/fiber" />

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CityDistrict, PerformanceTier } from '../types';
import { portfolioData } from '../constants';
import { CameraRig } from '../CameraRig';
import { CityModel } from './scene/CityModel';
import { FlyingVehicles } from './scene/FlyingVehicles';
import { GroundPlane } from './scene/GroundPlane';
import FloatingParticles from './scene/FloatingParticles';
import Rain from './scene/Rain';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { HUD } from './ui/HUD';
import HolographicInfoPanel from './scene/HolographicInfoPanel';

interface Experience3DProps {
  performanceTier: PerformanceTier;
}

export const Experience3D: React.FC<Experience3DProps> = ({ performanceTier }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  
  // Example state for unlocked items
  const [unlockedItems] = useState<Set<string>>(new Set(['tech-1', 'tech-2', 'tech-3', 'proj-1', 'proj-2', 'proj-3']));

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    setSelectedDistrict(district);
  }, []);
  
  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
  }, []);

  const performanceSettings = useMemo(() => {
    switch (performanceTier) {
      case 'PERFORMANCE':
        return { vehicles: 5, particles: 500, rain: 1000, effects: false };
      case 'BALANCED':
        return { vehicles: 15, particles: 1000, rain: 3000, effects: true };
      case 'QUALITY':
        return { vehicles: 30, particles: 2000, rain: 5000, effects: true };
      default:
        return { vehicles: 15, particles: 1000, rain: 3000, effects: true };
    }
  }, [performanceTier]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 40, 80], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: 'linear-gradient(to bottom, #000010, #050810)' }}
      >
        <fog attach="fog" args={['#050810', 50, 250]} />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 50, 20]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <CameraRig selectedDistrict={selectedDistrict} />
        
        <CityModel />
        <GroundPlane onDeselect={handleGoHome} />
        <DistrictRenderer 
          districts={portfolioData}
          selectedDistrict={selectedDistrict}
          hoveredDistrictId={hoveredDistrictId}
          unlockedItems={unlockedItems}
          onDistrictSelect={handleDistrictSelect}
          onDistrictHover={setHoveredDistrictId}
          onProjectClick={(item) => console.log('Project clicked:', item)}
        />

        <FlyingVehicles count={performanceSettings.vehicles} />
        <FloatingParticles count={performanceSettings.particles} />
        <Rain count={performanceSettings.rain} />
        
        {selectedDistrict && (
          <HolographicInfoPanel district={selectedDistrict} onClose={handleGoHome} />
        )}
        
        {performanceSettings.effects && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} intensity={0.8} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        )}
      </Canvas>
      <HUD selectedDistrict={selectedDistrict} onGoHome={handleGoHome} />
    </>
  );
};
