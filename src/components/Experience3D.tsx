import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CityDistrict } from '../types';
import { portfolioData } from '../constants';
import { CameraRig } from '../CameraRig';
import { CityModel } from './scene/CityModel';
import { GroundPlane } from './scene/GroundPlane';
import FloatingParticles from './scene/FloatingParticles';
import Rain from './scene/Rain';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { HUD } from './ui/HUD';
import { FlyingShips } from './scene/FlyingShips'; // Import the new ships component
import DataTrail from './scene/DataTrail';
import { PatrollingCore } from './scene/PatrollingCore'; // Import the new patrolling core

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    setSelectedDistrict(district);
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
  }, []);

  // Hardcoded balanced settings for stability
  const performanceSettings = {
    particles: 1000,
    rain: 3000,
    effects: true,
  };

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
        <PatrollingCore /> 
        <GroundPlane onDeselect={handleGoHome} />
        <DataTrail />

        <DistrictRenderer
          districts={portfolioData}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
        />
        
        {/* The new dynamic fleet of ships */}
        <FlyingShips />

        <FloatingParticles count={performanceSettings.particles} />
        <Rain count={performanceSettings.rain} />

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