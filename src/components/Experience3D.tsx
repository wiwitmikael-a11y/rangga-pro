
import React, { Suspense } from 'react';
import { Canvas } from '@react--three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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

// --- MAIN COMPONENT ---
const Experience3D: React.FC<Experience3DProps> = ({
  onSelectDistrict,
  onSelectSubItem,
  selectedDistrict,
}) => {
  return (
    <Canvas 
      orthographic
      camera={{ 
        position: [15, 15, 15], 
        zoom: 40,
        near: 1,
        far: 100
      }}
    >
      <color attach="background" args={['#05050c']} />
      <fog attach="fog" args={['#05050c', 20, 50]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      
      <Suspense fallback={null}>
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
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience3D;
