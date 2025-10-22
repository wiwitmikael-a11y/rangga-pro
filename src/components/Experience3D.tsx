import React, { lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CityDistrict, PortfolioSubItem, PerformanceTier } from '../types';

// Lazy load components for performance
const CityModel = lazy(() => import('./scene/CityModel').then(m => ({ default: m.CityModel })));
const GroundPlane = lazy(() => import('./scene/GroundPlane').then(m => ({ default: m.GroundPlane })));
const FlyingVehicles = lazy(() => import('./scene/FlyingVehicles'));
const FloatingParticles = lazy(() => import('./scene/FloatingParticles'));
const Rain = lazy(() => import('./scene/Rain'));
const DistrictRenderer = lazy(() => import('./scene/DistrictRenderer'));
const HolographicProjector = lazy(() => import('./scene/HolographicProjector'));
const NexusProtocolGame = lazy(() => import('../game/NexusProtocolGame'));
const CameraRig = lazy(() => import('../CameraRig'));


interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict | null) => void;
  hoveredDistrictId: string | null;
  onHoverDistrict: (id: string | null) => void;
  selectedProject: PortfolioSubItem | null;
  onCloseProject: () => void;
  isGameActive: boolean;
  onGameComplete: () => void;
  unlockedItems: Set<string>;
  onProjectClick: (item: PortfolioSubItem) => void;
  performanceTier: PerformanceTier;
}

const performanceSettings = {
  PERFORMANCE: { vehicles: 20, particles: 50, rain: 200, effects: false },
  BALANCED: { vehicles: 40, particles: 150, rain: 1000, effects: true },
  QUALITY: { vehicles: 60, particles: 300, rain: 3000, effects: true },
};

export const Experience3D: React.FC<Experience3DProps> = ({
  selectedDistrict,
  onSelectDistrict,
  hoveredDistrictId,
  onHoverDistrict,
  selectedProject,
  onCloseProject,
  isGameActive,
  onGameComplete,
  unlockedItems,
  onProjectClick,
  performanceTier,
}) => {
  const settings = performanceSettings[performanceTier];

  return (
    <Canvas
      shadows
      camera={{ position: [80, 40, 120], fov: 50 }}
      dpr={[1, 2]} // Pixel ratio for performance
    >
      <fog attach="fog" args={['#050810', 50, 250]} />
      <color attach="background" args={['#050810']} />
      
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 50, -50]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-20, 20, -20]} intensity={0.5} color="#00ffff" />
      <pointLight position={[25, 20, -15]} intensity={0.5} color="#00ffff" />
      <pointLight position={[0, 20, 30]} intensity={0.5} color="#00ffff" />

      <Suspense fallback={null}>
        <CameraRig selectedDistrict={selectedDistrict} hoveredDistrictId={hoveredDistrictId} isGameActive={isGameActive} />
        
        <CityModel />
        <GroundPlane />
        <FlyingVehicles count={settings.vehicles} />
        <FloatingParticles count={settings.particles} />
        <Rain count={settings.rain} />
        
        <DistrictRenderer
          selectedDistrict={selectedDistrict}
          onSelectDistrict={onSelectDistrict}
          onHoverDistrict={onHoverDistrict}
          unlockedItems={unlockedItems}
          onProjectClick={onProjectClick}
        />
        
        {selectedProject && (
          <HolographicProjector item={selectedProject} onClose={onCloseProject} />
        )}

        {isGameActive && <NexusProtocolGame onGameComplete={onGameComplete} />}
      </Suspense>
      
      {settings.effects && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.8} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}

      <Preload all />
    </Canvas>
  );
};
