import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Stars } from '@react-three/drei';
import { PORTFOLIO_DATA } from '../../constants';
import { FloatingIsland } from './scene/FloatingIsland';
import { FlyingVehicles } from './scene/FlyingVehicles';
import { CameraRig } from './scene/CameraRig';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

const Experience3D: React.FC<Experience3DProps> = ({ onSelectDistrict, onSelectSubItem, selectedDistrict }) => {
  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#050515' }}>
      <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={40} />
      <CameraRig selectedDistrict={selectedDistrict} />

      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00aaff" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {PORTFOLIO_DATA.map((district) => (
        <FloatingIsland
          key={district.id}
          district={district}
          onSelectDistrict={onSelectDistrict}
          onSelectSubItem={onSelectSubItem}
          isSelected={selectedDistrict?.id === district.id}
        />
      ))}

      <FlyingVehicles count={20} />
    </Canvas>
  );
};

export default Experience3D;
