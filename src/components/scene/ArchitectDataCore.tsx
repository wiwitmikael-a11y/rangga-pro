/// <reference types="@react-three/fiber" />

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
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
  const { scene: arcadeMachine } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/arcade_machine.glb');
  const isSelected = selectedDistrict?.id === district.id;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      // Animate selection
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
        <primitive 
          object={arcadeMachine} 
          scale={0.5} 
          position-y={-3} 
          rotation-y={Math.PI * 0.25}
        />
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

export default ArchitectDataCore;
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/arcade_machine.glb');