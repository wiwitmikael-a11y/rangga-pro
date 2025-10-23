
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CityDistrict, PortfolioSubItem } from '../../types';
import { ProjectDisplay } from './ProjectDisplay';

interface ArchitectDataCoreProps {
  district: CityDistrict;
  selectedDistrict: CityDistrict | null;
  onDistrictSelect: (district: CityDistrict) => void;
  onDistrictHover: (id: string | null) => void;
  unlockedItems: Set<string>;
  onProjectClick: (item: PortfolioSubItem) => void;
}

const ArchitectDataCore: React.FC<ArchitectDataCoreProps> = ({
  district,
  selectedDistrict,
  onDistrictSelect,
  onDistrictHover,
  unlockedItems,
  onProjectClick
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const isSelected = selectedDistrict?.id === district.id;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group position={district.position}>
      <mesh
        onClick={() => onDistrictSelect(district)}
        onPointerOver={(e) => { e.stopPropagation(); onDistrictHover(district.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); onDistrictHover(null); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color={isSelected ? "#00ffff" : "#00aaff"}
          emissive={isSelected ? "#00ffff" : "#00aaff"}
          emissiveIntensity={isSelected ? 3 : 1}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {isSelected && district.subItems && (
        <group ref={groupRef}>
          {district.subItems.map(item => (
            <ProjectDisplay
              key={item.id}
              item={item}
              isLocked={!unlockedItems.has(item.id)}
              onClick={() => onProjectClick(item)}
            />
          ))}
        </group>
      )}
    </group>
  );
};

export default ArchitectDataCore;
