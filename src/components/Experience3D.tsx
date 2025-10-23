// FIX: The triple-slash directive must be at the top of the file to correctly load TypeScript types for @react-three/fiber.
/// <reference types="@react-three/fiber" />

import { lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import type { CityDistrict, PortfolioSubItem, PerformanceTier } from '../types';

// Lazy load komponen untuk kinerja
const CityModel = lazy(() => import('./scene/CityModel').then(m => ({ default: m.CityModel })));
const CityCore = lazy(() => import('./scene/CityCore'));
const GroundPlane = lazy(() => import('./scene/GroundPlane').then(m => ({ default: m.GroundPlane })));
const FlyingVehicles = lazy(() => import('./scene/FlyingVehicles'));
const FloatingParticles = lazy(() => import('./scene/FloatingParticles'));
const Rain = lazy(() => import('./scene/Rain'));
const DistrictRenderer = lazy(() => import('./scene/DistrictRenderer'));
const HolographicProjector = lazy(() => import('./scene/HolographicProjector'));
const CameraRig = lazy(() => import('../CameraRig'));

interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onHoverDistrict: (id: string | null) => void;
  selectedProject: PortfolioSubItem | null;
  onCloseProject: () => void;
  unlockedItems: Set<string>;
  onProjectClick: (item: PortfolioSubItem) => void;
  performanceTier: PerformanceTier;
}

const performanceSettings = {
  PERFORMANCE: { vehicles: 15, particles: 50, rain: 200, effects: false, shadows: false },
  BALANCED: { vehicles: 30, particles: 150, rain: 1000, effects: true, shadows: true },
  QUALITY: { vehicles: 50, particles: 300, rain: 3000, effects: true, shadows: true },
};

export const Experience3D: React.FC<Experience3DProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onHoverDistrict,
  selectedProject,
  onCloseProject,
  unlockedItems,
  onProjectClick,
  performanceTier,
}) => {
  const settings = performanceSettings[performanceTier];

  return (
    <Canvas
      shadows={settings.shadows}
      camera={{ position: [80, 40, 120], fov: 50, near: 0.1, far: 500 }}
      dpr={[1, 1.5]} // Clamp pixel ratio for performance
    >
      <fog attach="fog" args={['#050810', 80, 300]} />
      <color attach="background" args={['#050810']} />
      
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 50, -50]}
        intensity={1.5}
        castShadow={settings.shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      <Suspense fallback={null}>
        <CameraRig selectedDistrict={selectedDistrict} />
        
        <CityModel />
        <CityCore />
        <GroundPlane />
        <FlyingVehicles count={settings.vehicles} />
        <FloatingParticles count={settings.particles} />
        {performanceTier !== 'PERFORMANCE' && <Rain count={settings.rain} />}
        
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

      </Suspense>
      
      {settings.effects && (
        <EffectComposer enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} intensity={0.8} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}

      <Preload all />
    </Canvas>
  );
};