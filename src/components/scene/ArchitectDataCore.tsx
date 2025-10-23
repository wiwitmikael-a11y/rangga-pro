// FIX: Corrected the reference path for @react-three/fiber types. The '/patch' subpath is obsolete.
/// <reference types="@react-three/fiber" />
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';
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

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  const isSelected = selectedDistrict?.id === district.id;

  return (
    <group position={district.position}>
      {/* Central floating orb */}
      <mesh
        onClick={() => onDistrictSelect(district)}
        onPointerOver={() => onDistrictHover(district.id)}
        onPointerOut={() => onDistrictHover(null)}
      >
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00ffff"
          emissiveIntensity={isSelected ? 3 : 1}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Display project sub-items when district is selected */}
      {isSelected && (
        <group ref={groupRef}>
          {district.subItems?.map(item => (
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