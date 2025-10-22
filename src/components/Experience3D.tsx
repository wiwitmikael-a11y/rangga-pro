import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CityDistrict, PortfolioSubItem, PerformanceTier } from '../types';
import { portfolioData, ambientDistricts } from '../constants';
import CameraRig from '../CameraRig';
import { CityModel } from './scene/CityModel';
import DistrictBuilding from './scene/DistrictBuilding';
import ArchitectDataCore from './scene/ArchitectDataCore';
import ContactTerminal from './scene/ContactTerminal';
import HolographicProjector from './scene/HolographicProjector';
import { GroundPlane } from './scene/GroundPlane';
import Rain from './scene/Rain';
import FloatingParticles from './scene/FloatingParticles';
import FlyingVehicles from './scene/FlyingVehicles';
import NexusProtocolGame from './game/NexusProtocolGame';

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

const performanceConfig = {
    PERFORMANCE: { rain: 500, particles: 100, vehicles: 5, postProcessing: false },
    BALANCED: { rain: 2000, particles: 200, vehicles: 10, postProcessing: true },
    QUALITY: { rain: 5000, particles: 500, vehicles: 20, postProcessing: true },
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
    const config = performanceConfig[performanceTier];

  return (
    <Canvas
      shadows
      camera={{ position: [80, 40, 120], fov: 50 }}
      dpr={[1, 2]}
    >
      <fog attach="fog" args={['#030710', 50, 300]} />
      <color attach="background" args={['#030710']} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 50, 20]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <CameraRig selectedDistrict={selectedDistrict} hoveredDistrictId={hoveredDistrictId} isGameActive={isGameActive} />

      <CityModel />
      <GroundPlane />

      {portfolioData.map((district) => {
        if (district.id === 'intro-architect' || district.id === 'project-nexus') {
            return (
                <ArchitectDataCore
                    key={district.id}
                    district={district}
                    selectedDistrict={selectedDistrict}
                    onDistrictSelect={onSelectDistrict}
                    onDistrictHover={onHoverDistrict}
                    unlockedItems={unlockedItems}
                    onProjectClick={onProjectClick}
                />
            );
        }
        if (district.id === 'contact-terminal') {
            return (
                <ContactTerminal 
                    key={district.id}
                    district={district}
                    onDistrictSelect={onSelectDistrict}
                    onDistrictHover={onHoverDistrict}
                />
            );
        }
        return (
            <DistrictBuilding
                key={district.id}
                district={district}
                onSelect={onSelectDistrict}
                onHover={onHoverDistrict}
                isSelected={selectedDistrict?.id === district.id}
            />
        );
      })}
      {ambientDistricts.map((district) => (
        <DistrictBuilding key={district.id} district={district} isUnlocked={false} />
      ))}
      
      {selectedProject && (
        <HolographicProjector item={selectedProject} onClose={onCloseProject} />
      )}

      {isGameActive && <NexusProtocolGame onGameComplete={onGameComplete} />}
      
      {/* Environment Effects */}
      <Rain count={config.rain} />
      <FloatingParticles count={config.particles} />
      <FlyingVehicles count={config.vehicles} />
      
      {config.postProcessing && (
        <EffectComposer>
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}

    </Canvas>
  );
};
