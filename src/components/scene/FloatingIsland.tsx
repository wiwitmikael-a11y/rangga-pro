import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface FloatingIslandProps {
  district: CityDistrict;
  onSelectDistrict: (district: CityDistrict) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
}

const SubItemBanner: React.FC<{ item: PortfolioSubItem; onSelect: () => void }> = ({ item, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if(meshRef.current) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.1 : 1, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, hovered ? 1.1 : 1, 0.1);
    }
  });

  return (
    <group position={item.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#000" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[0, 0.1, 0.01]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {item.title}
      </Text>
      <Text
        position={[0, -0.1, 0.01]}
        fontSize={0.08}
        color="#ccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {item.description}
      </Text>
    </group>
  );
};

export const FloatingIsland: React.FC<FloatingIslandProps> = ({ district, onSelectDistrict, onSelectSubItem, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = district.position3D[1] + Math.sin(clock.getElapsedTime() + district.position3D[0]) * 0.2;
    }
  });
  
  const handleIslandClick = () => {
    if (!isSelected) {
        onSelectDistrict(district);
    }
  };

  return (
    <group
      ref={groupRef}
      position={district.position3D}
      onClick={handleIslandClick}
    >
      <mesh>
        <cylinderGeometry args={[2, 2.5, 0.5, 16]} />
        <meshStandardMaterial color={district.color} emissive={district.color} emissiveIntensity={0.2} />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {district.title}
      </Text>
      
      {isSelected && district.subItems.map(item => (
        <SubItemBanner key={item.id} item={item} onSelect={() => onSelectSubItem(item)} />
      ))}
    </group>
  );
};
