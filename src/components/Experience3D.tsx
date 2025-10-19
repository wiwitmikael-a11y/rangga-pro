import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../types';
import { PORTFOLIO_DATA } from '../constants';

import { CameraRig } from './scene/CameraRig';
import { FloatingIsland } from './scene/FloatingIsland';
import { FlyingVehicles } from './scene/FlyingVehicles';

// --- PROPS ---
interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

// --- Scene Elements ---
const CentralSpire: React.FC = () => (
  <mesh position={[0, 0, 0]}>
    <cylinderGeometry args={[0.2, 1, 30, 8]} />
    <meshStandardMaterial 
      color="#00ffff" 
      emissive="#00ffff" 
      emissiveIntensity={1}
      toneMapped={false} 
      transparent 
      opacity={0.3} 
    />
  </mesh>
);

// --- MAIN COMPONENT ---
const Experience3D: React.FC<Experience3DProps> = ({
  onSelectDistrict,
  onSelectSubItem,
  selectedDistrict,
}) => {
  return (
    <Canvas camera={{ position: [0, 2, 14], fov: 75 }}>
      <color attach="background" args={['#05050c']} />
      <fog attach="fog" args={['#05050c', 15, 40]} />
      <ambientLight intensity={0.2} />
      
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      
      <Suspense fallback={null}>
        <CentralSpire />
        <FlyingVehicles />
        {PORTFOLIO_DATA.map(district => (
          <FloatingIsland
            key={district.id}
            district={district}
            onSelect={() => onSelectDistrict(district)}
            onSelectSubItem={onSelectSubItem}
            isSelected={selectedDistrict?.id === district.id}
            isFaded={selectedDistrict !== null && selectedDistrict.id !== district.id}
          />
        ))}
      </Suspense>

      <CameraRig selectedDistrict={selectedDistrict} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience3D;
