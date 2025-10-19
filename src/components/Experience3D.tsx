import React from 'react';
import { Canvas } from '@react-three-fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import CameraRig from './scene/CameraRig';
import Skyscraper from './scene/Skyscraper';
import GroundGrid from './scene/GroundGrid';
import FloatingParticles from './scene/FloatingParticles';

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  selectedDistrict: CityDistrict | null;
  onSelectSubItem: (item: PortfolioSubItem) => void;
}

const Experience3D: React.FC<Experience3DProps> = ({ onSelectDistrict, selectedDistrict, onSelectSubItem }) => {
  return (
    <Canvas
      camera={{ position: [60, 60, 60], fov: 50 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#050810' }}
    >
      <fog attach="fog" args={['#050810', 50, 200]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 50, 0]} intensity={0.5} color="#ff00ff" />
      
      <CameraRig selectedDistrict={selectedDistrict} />

      <group>
        <GroundGrid />
        <FloatingParticles count={5000} />
        
        {portfolioData.map(district => (
          <Skyscraper
            key={district.id}
            district={district}
            onSelect={() => onSelectDistrict(district)}
            onSelectSubItem={onSelectSubItem}
            isSelected={selectedDistrict?.id === district.id}
          />
        ))}
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.5} height={400} intensity={1.8} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience3D;