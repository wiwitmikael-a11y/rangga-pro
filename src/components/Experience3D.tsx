
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { CityDistrict, PerformanceTier, PortfolioSubItem } from '../types';
import CameraRig from '../CameraRig';
import CityModel from './scene/CityModel';
import { GroundPlane } from './scene/GroundPlane';
import { portfolioData, ambientDistricts } from '../constants';
import DistrictBuilding from './scene/DistrictBuilding';
import FloatingParticles from './scene/FloatingParticles';
import FlyingVehicles from './scene/FlyingVehicles';
import Rain from './scene/Rain';
import DataTrail from './scene/DataTrail';
import ArchitectDataCore from './scene/ArchitectDataCore';
import ContactTerminal from './scene/ContactTerminal';

// Performance-based settings
const performanceSettings = {
  PERFORMANCE: { fov: 60, particles: 200, vehicles: 5, effects: false, rain: false },
  BALANCED: { fov: 50, particles: 500, vehicles: 10, effects: true, rain: true },
  QUALITY: { fov: 45, particles: 1000, vehicles: 20, effects: true, rain: true },
};

interface Experience3DProps {
  onDistrictSelect: (district: CityDistrict | null) => void;
  onDistrictHover: (id: string | null) => void;
  selectedDistrict: CityDistrict | null;
  hoveredDistrictId: string | null;
  performanceTier: PerformanceTier;
  unlockedItems: Set<string>;
  onProjectClick: (item: PortfolioSubItem) => void;
}

const Experience3D: React.FC<Experience3DProps> = ({
  onDistrictSelect,
  onDistrictHover,
  selectedDistrict,
  hoveredDistrictId,
  performanceTier,
  unlockedItems,
  onProjectClick,
}) => {
  const settings = performanceSettings[performanceTier];

  return (
    <Canvas
      shadows
      camera={{ position: [0, 150, 200], fov: settings.fov }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#050510',
      }}
    >
      <fog attach="fog" args={['#050510', 50, 300]} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 50, -50]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-20, 20, -20]} intensity={1} color="#00ffff" distance={100} />
      <pointLight position={[25, 20, -15]} intensity={1} color="#ff00ff" distance={100} />

      <CameraRig selectedDistrict={selectedDistrict} hoveredDistrictId={hoveredDistrictId} />

      <Suspense fallback={null}>
        <CityModel />
        <GroundPlane />

        {/* Major Portfolio Districts */}
        {portfolioData.map((district) => {
          if (district.id === 'intro-architect') {
            return <ArchitectDataCore 
              key={district.id}
              district={district}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={onDistrictSelect}
              onDistrictHover={onDistrictHover}
              unlockedItems={unlockedItems}
              onProjectClick={onProjectClick}
            />;
          }
          if (district.id === 'contact-terminal') {
            return <ContactTerminal
              key={district.id}
              district={district}
              onDistrictSelect={onDistrictSelect}
              onDistrictHover={onDistrictHover}
            />
          }
          return (
            <DistrictBuilding
              key={district.id}
              district={district}
              onSelect={onDistrictSelect}
              onHover={onDistrictHover}
              isSelected={selectedDistrict?.id === district.id}
              isUnlocked={unlockedItems.has(district.id)}
            />
          );
        })}
        
        {/* Ambient Minor Districts */}
        {ambientDistricts.map((district) => (
          <DistrictBuilding key={district.id} district={district} />
        ))}
        
        {settings.particles > 0 && <FloatingParticles count={settings.particles} />}
        {settings.vehicles > 0 && <FlyingVehicles count={settings.vehicles} />}
        {settings.rain && <Rain />}

        <DataTrail />

        <Preload all />
      </Suspense>

    </Canvas>
  );
};

export default React.memo(Experience3D);