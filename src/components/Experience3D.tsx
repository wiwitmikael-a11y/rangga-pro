import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CityDistrict, PortfolioSubItem } from '../types';
import { PORTFOLIO_DATA } from '../constants';
import { FloatingIsland } from './scene/FloatingIsland';
import { CentralCore } from './scene/CentralCore';
import { FlyingVehicles } from './scene/FlyingVehicles';
import { CameraRig } from './scene/CameraRig';

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
      style={{ position: 'fixed', top: 0, left: 0, background: '#000510' }}
      camera={{ position: [0, 2, 14], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#00aaff" />
      
      <fog attach="fog" args={['#000510', 10, 30]} />

      <CentralCore />

      {PORTFOLIO_DATA.map((district) => (
        <FloatingIsland
          key={district.id}
          district={district}
          onSelectDistrict={onSelectDistrict}
          onSelectSubItem={onSelectSubItem}
          isSelected={selectedDistrict?.id === district.id}
        />
      ))}
      
      <FlyingVehicles count={50} />

      <CameraRig selectedDistrict={selectedDistrict} />
    </Canvas>
  );
};

export default Experience3D;
