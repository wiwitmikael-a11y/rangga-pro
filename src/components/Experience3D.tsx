import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { CityDistrict, PortfolioSubItem } from '../types';
import { PORTFOLIO_DATA } from '../constants';
import { FlyingVehicles } from './scene/FlyingVehicles';
import { CameraRig } from './scene/CameraRig';
import { DistrictNode } from './scene/DistrictNode'; // New component

interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
}

const Experience3D: React.FC<Experience3DProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onSelectSubItem,
}) => {
  return (
    <Canvas
      shadows
      style={{ position: 'fixed', top: 0, left: 0, background: '#05050a' }}
      camera={{ position: [0, 2, 14], fov: 50 }}
    >
      {/* Enhanced Lighting Setup */}
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <fog attach="fog" args={['#05050a', 15, 35]} />

      {PORTFOLIO_DATA.map((district) => (
        <DistrictNode
          key={district.id}
          district={district}
          onSelectDistrict={onSelectDistrict}
          onSelectSubItem={onSelectSubItem}
          isSelected={selectedDistrict?.id === district.id}
          isActive={!!selectedDistrict}
        />
      ))}
      
      <FlyingVehicles count={20} />

      <CameraRig selectedDistrict={selectedDistrict} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} intensity={0.8} levels={8} mipmapBlur />
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience3D;
