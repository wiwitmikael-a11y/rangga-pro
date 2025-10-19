import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
// Fix: Add PortfolioSubItem to imports to be used in the props interface.
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import CameraRig from './scene/CameraRig';
import PCBFloor from './scene/PCBFloor';
import DistrictBuilding from './scene/DistrictBuilding';
import HolographicPanel from './scene/HolographicPanel';
import DataBridge from './scene/DataBridge';

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  selectedDistrict: CityDistrict | null;
  // Fix: Add onSelectSubItem to the component's props interface.
  onSelectSubItem: (item: PortfolioSubItem) => void;
}

const Experience3D: React.FC<Experience3DProps> = ({ onSelectDistrict, selectedDistrict }) => {
  const districtMap = new Map(portfolioData.map(d => [d.id, d]));

  return (
    <Canvas
      orthographic
      camera={{ position: [50, 50, 50], zoom: 20, up: [0, 1, 0] }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#050810' }}
    >
      <ambientLight intensity={0.1} />
      <hemisphereLight intensity={0.2} color="#ffffff" groundColor="#ff00ff" />
      
      <CameraRig selectedDistrict={selectedDistrict} />

      <group>
        <PCBFloor />
        
        {portfolioData.map(district => (
          <React.Fragment key={district.id}>
            <DistrictBuilding
              district={district}
              onSelect={() => onSelectDistrict(district)}
              isSelected={selectedDistrict?.id === district.id}
            />
            <HolographicPanel district={district} />
            {district.connections?.map(connId => {
              const targetDistrict = districtMap.get(connId);
              if (targetDistrict) {
                return <DataBridge key={`${district.id}-${connId}`} start={district.position3D} end={targetDistrict.position3D} />
              }
              return null;
            })}
          </React.Fragment>
        ))}
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience3D;