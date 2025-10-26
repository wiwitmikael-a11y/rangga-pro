import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface DistrictBuildingProps {
  district: CityDistrict;
  onSelect: ((district: CityDistrict) => void) | undefined;
  isSelected: boolean;
  isUnlocked: boolean;
}

const DistrictBuilding: React.FC<DistrictBuildingProps> = ({ district, onSelect, isSelected }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);

  const height = district.height || Math.random() * 40 + 20;

  const emissiveColor = useMemo(() => new THREE.Color(isSelected ? '#00ffff' : (isHovered ? '#ffffff' : '#0055aa')), [isSelected, isHovered]);

  useFrame(() => {
    if (meshRef.current) {
        // Simple pulsing effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, isSelected || isHovered ? 2 : 0.5, 0.1);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(district);
    }
  };
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    if(onSelect) document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={district.position}>
      <Box
        ref={meshRef}
        args={[10, height, 10]}
        position-y={height / 2}
        onClick={onSelect ? handleClick : undefined}
        onPointerOver={onSelect ? handlePointerOver : undefined}
        onPointerOut={onSelect ? handlePointerOut : undefined}
      >
        <meshStandardMaterial
          color="#050810"
          metalness={0.8}
          roughness={0.3}
          emissive={emissiveColor}
          toneMapped={false}
        />
      </Box>
       <Text
        position={[0, height + 5, 0]}
        fontSize={1.5}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={15}
        textAlign="center"
        visible={isHovered}
      >
        {district.title}
      </Text>
    </group>
  );
};

export default DistrictBuilding;
