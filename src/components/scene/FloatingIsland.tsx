import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface FloatingIslandProps {
  district: CityDistrict;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
}

const SubItem: React.FC<{ item: PortfolioSubItem; onSelect: (item: PortfolioSubItem) => void; districtColor: string }> = ({ item, onSelect, districtColor }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if(meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      const targetScale = hovered ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  return (
    <group position={item.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={hovered ? 'white' : districtColor} emissive={districtColor} emissiveIntensity={hovered ? 0.8 : 0.3} />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {item.title}
      </Text>
    </group>
  );
};


export const FloatingIsland: React.FC<FloatingIslandProps> = ({ district, onSelectDistrict, onSelectSubItem, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const baseMeshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    if (baseMeshRef.current) {
        const targetScale = isSelected ? 1.2 : 1;
        baseMeshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
    }
  });
  
  const handleDistrictClick = () => {
    if (isSelected) {
      // Already selected, do nothing. Deselection is handled by the HUD's "City Overview" button.
    } else {
      onSelectDistrict(district);
    }
  };

  return (
    <group ref={groupRef} position={district.position3D}>
      <mesh
        ref={baseMeshRef}
        onClick={handleDistrictClick}
      >
        <cylinderGeometry args={[2, 2.5, 0.5, 8]} />
        <meshStandardMaterial color={district.color} emissive={district.color} emissiveIntensity={isSelected ? 0.5 : 0.1} />
      </mesh>
      {isSelected && district.subItems.map(item => (
        <SubItem 
          key={item.id} 
          item={item} 
          onSelect={onSelectSubItem} 
          districtColor={district.color}
        />
      ))}
       <Text
        position={[0, 1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {district.title}
      </Text>
    </group>
  );
};

export default FloatingIsland;
