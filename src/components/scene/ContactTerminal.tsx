// Fix: Add a type-only import to explicitly load TypeScript definitions for react-three-fiber,
// which extends the JSX namespace and allows using R3F elements like <group> and <mesh>.
import type { ThreeElements } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface ContactTerminalProps {
  district: CityDistrict;
  onDistrictSelect: (district: CityDistrict) => void;
  onDistrictHover: (id: string | null) => void;
}

const ContactTerminal: React.FC<ContactTerminalProps> = ({ district, onDistrictSelect, onDistrictHover }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
    }
  });
  
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
    onDistrictHover(district.id);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
    onDistrictHover(null);
  };
  
  return (
    <group
      ref={groupRef}
      position={district.position}
      onClick={() => onDistrictSelect(district)}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color="#002233" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#00aaff" emissive="#00ffff" emissiveIntensity={isHovered ? 2 : 1} toneMapped={false} />
      </mesh>
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        CONTACT
      </Text>
    </group>
  );
};

export default ContactTerminal;