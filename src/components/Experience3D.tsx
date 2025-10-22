import React, { Suspense } from 'react';
import { portfolioData, ambientDistricts } from '../constants';
import { CityDistrict, PerformanceTier, PortfolioSubItem } from '../types';
import CameraRig from '../CameraRig';
import CityModel from './scene/CityModel';
import DistrictBuilding from './scene/DistrictBuilding';
import ArchitectDataCore from './scene/ArchitectDataCore';
import ContactTerminal from './scene/ContactTerminal';
import HolographicProjector from './scene/HolographicProjector';
import FlyingVehicles from './scene/FlyingVehicles';
import FloatingParticles from './scene/FloatingParticles';
import DataTrail from './scene/DataTrail';
import Rain from './scene/Rain';
import { GroundPlane } from './scene/GroundPlane';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onDistrictSelect: (district: CityDistrict) => void;
  hoveredDistrictId: string | null;
  onDistrictHover: (id: string | null) => void;
  projectedItem: PortfolioSubItem | null;
  onProjectClick: (item: PortfolioSubItem) => void;
  onCloseProjector: () => void;
  unlockedItems: Set<string>;
  performanceTier: PerformanceTier;
}

const Experience3D: React.FC<Experience3DProps> = ({
  selectedDistrict,
  onDistrictSelect,
  hoveredDistrictId,
  onDistrictHover,
  projectedItem,
  onProjectClick,
  onCloseProjector,
  unlockedItems,
  performanceTier,
}) => {

  const qualitySettings = {
    'PERFORMANCE': { vehicles: 20, particles: 200, rain: 500, bloom: false },
    'BALANCED': { vehicles: 50, particles: 500, rain: 2000, bloom: true },
    'QUALITY': { vehicles: 100, particles: 1000, rain: 5000, bloom: true },
  }[performanceTier];


  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 50, -50]} 
        intensity={0.5} 
        color="#00aaff" 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-20, 15, -20]} intensity={1} color="cyan" distance={100} />
      <pointLight position={[25, 15, -15]} intensity={1} color="magenta" distance={100} />
      <pointLight position={[0, 15, 30]} intensity={1} color="yellow" distance={100} />
      <fog attach="fog" args={['#000510', 50, 300]} />

      <CameraRig selectedDistrict={selectedDistrict} hoveredDistrictId={hoveredDistrictId} />

      <Suspense fallback={null}>
        <CityModel />
        <GroundPlane />

        {/* Major Districts */}
        {portfolioData.map((district) => {
          if (district.id === 'intro-architect') {
            return (
              <ArchitectDataCore
                key={district.id}
                district={district}
                selectedDistrict={selectedDistrict}
                onDistrictSelect={onDistrictSelect}
                onDistrictHover={onDistrictHover}
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
                onDistrictSelect={onDistrictSelect}
                onDistrictHover={onDistrictHover}
              />
             )
          }
          // For other major projects
          return (
            <DistrictBuilding
              key={district.id}
              district={district}
              onSelect={onDistrictSelect}
              onHover={onDistrictHover}
              isSelected={selectedDistrict?.id === district.id}
              isUnlocked={district.subItems ? district.subItems.every(si => unlockedItems.has(si.id)) : true}
            />
          );
        })}
        
        {/* Ambient Districts */}
        {ambientDistricts.map((district) => (
          <DistrictBuilding key={district.id} district={district} />
        ))}
        
        {/* Projector */}
        {projectedItem && <HolographicProjector item={projectedItem} onClose={onCloseProjector} />}

        {/* Ambient Effects */}
        <FlyingVehicles count={qualitySettings.vehicles} />
        <FloatingParticles count={qualitySettings.particles} />
        <Rain count={qualitySettings.rain} />
        {!selectedDistrict && <DataTrail />}

      </Suspense>
      
      {/* Post-processing */}
      {qualitySettings.bloom && (
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} intensity={0.8} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}
    </>
  );
};

export default Experience3D;
