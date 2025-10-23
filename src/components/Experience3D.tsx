import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import { CameraRig } from '../CameraRig';
import { CityModel } from './scene/CityModel';
import { GroundPlane } from './scene/GroundPlane';
import FloatingParticles from './scene/FloatingParticles';
import Rain from './scene/Rain';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { HUD } from './ui/HUD';
import { FlyingVehicles } from './scene/FlyingVehicles';
import { ProjectDisplay } from './scene/ProjectDisplay';
import DataTrail from './scene/DataTrail';

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [activeSubItems, setActiveSubItems] = useState<PortfolioSubItem[]>([]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    setSelectedDistrict(district);
    setActiveSubItems(district.subItems || []);
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setActiveSubItems([]);
  }, []);
  
  const handleProjectClick = (projectId: string) => {
    // Di masa depan, ini bisa membuka detail lebih lanjut
    console.log(`Navigating to project: ${projectId}`);
  };

  // Hardcoded balanced settings for stability
  const performanceSettings = {
    vehicles: 15,
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
        <GroundPlane onDeselect={handleGoHome} />
        <DataTrail />

        <DistrictRenderer
          districts={portfolioData}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
        />
        
        {/* Render sub-items when a district is selected */}
        {selectedDistrict && (
            <group position={selectedDistrict.position}>
                 {activeSubItems.map(item => (
                    <ProjectDisplay 
                        key={item.id} 
                        item={item}
                        isLocked={false} // Logika unlocking bisa ditambahkan di sini
                        onClick={() => handleProjectClick(item.id)}
                    />
                 ))}
            </group>
        )}

        <FlyingVehicles count={performanceSettings.vehicles} />
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