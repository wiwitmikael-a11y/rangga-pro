import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import { CityDistrict } from '../types';
import { portfolioData } from '../constants';
import { CameraRig } from '../CameraRig';
import { CityModel } from './scene/CityModel';
import { GroundPlane } from './scene/GroundPlane';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { HUD } from './ui/HUD';
import Rain from './scene/Rain';
import FloatingParticles from './scene/FloatingParticles';
import { FlyingShips } from './scene/FlyingShips';
import DataTrail from './scene/DataTrail';
import { PatrollingCore } from './scene/PatrollingCore';
import HolographicInfoPanel from './scene/HolographicInfoPanel';

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [infoPanelDistrict, setInfoPanelDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const handleAnimationFinish = useCallback(() => {
    // Only enable orbit controls when the camera has settled
    if (isAnimating) {
      setIsAnimating(false);
    }
  }, [isAnimating]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    setIsAnimating(true);
    setSelectedDistrict(district);
    // Open the info panel after a short delay to allow the camera to move
    setTimeout(() => setInfoPanelDistrict(district), 1000);
  }, []);

  const handleGoHome = useCallback(() => {
    setIsAnimating(true);
    setSelectedDistrict(null);
    setInfoPanelDistrict(null);
  }, []);

  const handleClosePanel = useCallback(() => {
    setInfoPanelDistrict(null);
    // Optionally, go home when the panel is closed for a cleaner UX
    setIsAnimating(true);
    setSelectedDistrict(null);
  }, []);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 40, 80], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: '#050810' }}
      >
        <fog attach="fog" args={['#050810', 50, 250]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 50, 20]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <CameraRig
          selectedDistrict={selectedDistrict}
          onAnimationFinish={handleAnimationFinish}
          isAnimating={isAnimating}
        />

        {/* User controls are enabled only when no cinematic animation is active */}
        <OrbitControls
          enabled={!isAnimating}
          enablePan={false}
          enableZoom={true}
          minDistance={40}
          maxDistance={250}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 5, 0]}
        />

        {/* --- Ambient Effects --- */}
        <Rain count={5000} />
        <FloatingParticles count={200} />
        <FlyingShips />
        <DataTrail />
        <PatrollingCore />

        {/* --- Core Scene --- */}
        <CityModel />
        <GroundPlane onDeselect={handleGoHome} />

        <DistrictRenderer
          districts={portfolioData}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={handleDistrictSelect}
        />

        {infoPanelDistrict && (
          <HolographicInfoPanel
            district={infoPanelDistrict}
            onClose={handleClosePanel}
          />
        )}

        {/* --- Post-processing Effects --- */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.8}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      <HUD selectedDistrict={selectedDistrict} onGoHome={handleGoHome} />
    </>
  );
};