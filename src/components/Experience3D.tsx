// FIX: Implemented the main 3D scene component to resolve placeholder errors.
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import DistrictNode from './scene/DistrictNode';
import DataHubNode from './scene/DataHubNode';
import CameraRig from './scene/CameraRig';
import CentralCore from './scene/CentralCore';
import FlyingVehicles from './scene/FlyingVehicles';
import DataStream from './scene/DataStream';
import FloatingIsland from './scene/FloatingIsland';

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

const Experience3D: React.FC<Experience3DProps> = ({ onSelectDistrict, onSelectSubItem, selectedDistrict }) => {
  return (
    <Canvas
      camera={{ position: [0, 20, 40], fov: 60 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000510' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 20, 0]} intensity={1.5} color="#00aaff" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <CameraRig selectedDistrict={selectedDistrict} />

      <group>
        <FloatingIsland />
        <CentralCore />
        <DataStream />
        <FlyingVehicles />

        {!selectedDistrict && portfolioData.map(district => (
          <DistrictNode key={district.id} district={district} onSelect={() => onSelectDistrict(district)} />
        ))}

        {selectedDistrict && selectedDistrict.subItems.map(item => (
           <DataHubNode key={item.id} item={item} district={selectedDistrict} onSelect={() => onSelectSubItem(item)} />
        ))}
      </group>
      
    </Canvas>
  );
};

export default Experience3D;
