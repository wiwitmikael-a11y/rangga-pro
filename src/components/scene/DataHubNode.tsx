// FIX: Implemented the DataHubNode component to resolve placeholder errors.
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { Mesh } from 'three';
import { PortfolioSubItem, CityDistrict } from '../../types';

interface DataHubNodeProps {
  item: PortfolioSubItem;
  district: CityDistrict;
  onSelect: () => void;
}

const DataHubNode: React.FC<DataHubNodeProps> = ({ item, district, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.2;
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

  const position: [number, number, number] = [
      district.position3D[0] + item.position[0],
      district.position3D[1] + item.position[1],
      district.position3D[2] + item.position[2],
  ];

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? 1.5 : 1}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={district.color}
          emissive={district.color}
          emissiveIntensity={hovered ? 1 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Billboard>
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {item.title}
        </Text>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.25}
          color="#ccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
        >
          {item.description}
        </Text>
      </Billboard>
    </group>
  );
};

export default DataHubNode;
