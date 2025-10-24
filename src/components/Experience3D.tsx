import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { CityDistrict } from '../types';
import { portfolioData } from '../constants';
import { CameraRig } from '../CameraRig';
import { CityModel } from './scene/CityModel';
import { GroundPlane } from './scene/GroundPlane';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { HUD } from './ui/HUD';

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    setSelectedDistrict(district);
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
  }, []);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 40, 80], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: '#050810' }}
      >
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 50, 20]}
          intensity={0.8}
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
          onDistrictSelect={handleDistrictSelect}
        />
        
      </Canvas>
      <HUD selectedDistrict={selectedDistrict} onGoHome={handleGoHome} />
    </>
  );
};
