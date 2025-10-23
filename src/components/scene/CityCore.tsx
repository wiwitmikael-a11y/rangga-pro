/// <reference types="@react-three/fiber" />

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CityDistrict, PortfolioSubItem } from '../../types';
import { ProjectDisplay } from './ProjectDisplay';
import { Text } from '@react-three/drei';

interface CityCoreProps {
  district: CityDistrict;
  selectedDistrict: CityDistrict | null;
  onDistrictSelect: (district: CityDistrict) => void;
  onDistrictHover: (id: string | null) => void;
  unlockedItems: Set<string>;
  onProjectClick: (item: PortfolioSubItem) => void;
}

const CityCore: React.FC<CityCoreProps> = ({
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
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      const targetScale = isSelected ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={district.position}>
      <group 
        ref={groupRef}
        onClick={() => onDistrictSelect(district)}
        onPointerOver={(e) => { e.stopPropagation(); onDistrictHover(district.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); onDistrictHover(null); document.body.style.cursor = 'auto'; }}
      >
        <mesh>
          <icosahedronGeometry args={[5, 1]} />
          <meshStandardMaterial 
            color={isSelected ? '#00ffff' : '#0077aa'} 
            emissive={isSelected ? '#00ffff' : '#0077aa'}
            emissiveIntensity={isSelected ? 1.5 : 0.5}
            wireframe 
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[4.8, 1]} />
          <meshStandardMaterial 
            color="#002244" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
        <Text
            position={[0, 7, 0]}
            fontSize={1.5}
            color="white"
            anchorX="center"
        >
            {district.title}
        </Text>
      </group>
      
      {isSelected && district.subItems && (
        <group>
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

export default CityCore;
