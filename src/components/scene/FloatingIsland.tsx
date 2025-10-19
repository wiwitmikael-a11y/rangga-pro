import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface FloatingIslandProps {
  district: CityDistrict;
  onSelect: () => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
  isFaded: boolean;
}

const SubItem: React.FC<{ item: PortfolioSubItem; onSelect: () => void; districtColor: string; isVisible: boolean }> = ({ item, onSelect, districtColor, isVisible }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={item.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        visible={isVisible}
      >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={hovered ? 'white' : districtColor} emissive={districtColor} emissiveIntensity={hovered ? 2 : 0.5} toneMapped={false} />
      </mesh>
      <Html 
        position={[0, 0.4, 0]} 
        center 
        style={{
          color: 'white',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          fontFamily: 'monospace',
          transition: 'opacity 0.3s',
          opacity: hovered && isVisible ? 1 : 0,
          pointerEvents: 'none',
          textShadow: `0 0 5px ${districtColor}`,
        }}
      >
        {item.title}
      </Html>
    </group>
  );
};

export const FloatingIsland: React.FC<FloatingIslandProps> = ({ district, onSelect, onSelectSubItem, isSelected, isFaded }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
        const t = state.clock.getElapsedTime();
        groupRef.current.position.y = district.position3D[1] + Math.sin(t * 0.5 + district.position3D[0]) * 0.2;
        groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={district.position3D}>
      <mesh
        onClick={onSelect}
        onPointerOver={() => !isSelected && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={!isFaded}
      >
        <cylinderGeometry args={[2, 2.5, 0.5, 16]} />
        <meshStandardMaterial 
          color={district.color} 
          emissive={district.color} 
          emissiveIntensity={hovered || isSelected ? 1 : 0.3} 
          toneMapped={false} 
          transparent 
          opacity={isFaded ? 0.1 : (hovered || isSelected ? 0.8 : 0.5)}
        />
      </mesh>
      
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={!isFaded && !isSelected}
      >
        {district.title}
      </Text>
      
      {district.subItems.map(item => (
        <SubItem 
          key={item.id} 
          item={item} 
          onSelect={() => onSelectSubItem(item)} 
          districtColor={district.color}
          isVisible={isSelected}
        />
      ))}
    </group>
  );
};
