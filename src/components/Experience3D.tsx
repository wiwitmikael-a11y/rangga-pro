import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './scene/CameraRig';
import { FloatingIsland } from './scene/FloatingIsland';
import { FlyingVehicles } from './scene/FlyingVehicles';
import { PORTFOLIO_DATA } from '../constants';
import { CityDistrict, PortfolioSubItem } from '../types';

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

const Experience3D: React.FC<Experience3DProps> = ({ onSelectDistrict, onSelectSubItem, selectedDistrict }) => {
  return (
    <Canvas
      orthographic
      camera={{ position: [15, 15, 15], zoom: 40, near: 0.1, far: 1000 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#050505' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <CameraRig selectedDistrict={selectedDistrict} />

      {PORTFOLIO_DATA.map((district) => (
        <FloatingIsland
          key={district.id}
          district={district}
          onSelectDistrict={onSelectDistrict}
          onSelectSubItem={onSelectSubItem}
          isSelected={selectedDistrict?.id === district.id}
        />
      ))}

      <FlyingVehicles />
      
      <fog attach="fog" args={['#050505', 20, 50]} />
    </Canvas>
  );
};

export default Experience3D;
