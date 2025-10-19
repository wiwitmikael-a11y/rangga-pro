// FIX: Implemented the DistrictNode component to resolve placeholder errors.
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh } from 'three';
import { CityDistrict } from '../../types';

interface DistrictNodeProps {
  district: CityDistrict;
  onSelect: () => void;
}

const DistrictNode: React.FC<DistrictNodeProps> = ({ district, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={district.position3D}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? 1.2 : 1}
      >
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color={district.color}
          emissive={district.color}
          emissiveIntensity={hovered ? 0.7 : 0.3}
          wireframe
        />
      </mesh>
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {district.title}
      </Text>
    </group>
  );
};

export default DistrictNode;
