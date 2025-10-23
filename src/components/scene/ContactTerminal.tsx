/// <reference types="@react-three/fiber" />

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import type { CityDistrict } from '../../types';

interface ContactTerminalProps {
  district: CityDistrict;
  onSelect: (district: CityDistrict) => void;
  onHover: (id: string | null) => void;
  isSelected: boolean;
}

interface InteractiveButtonProps {
  position: [number, number, number];
  text: string;
  onClick: () => void;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({ position, text, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const scaleTarget = hovered ? 1.2 : 1;
    const groupRef = useRef<THREE.Group>(null!);
    
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 8);
        }
    });

    return (
        <group 
            ref={groupRef}
            position={position} 
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }} 
            onClick={onClick}
        >
            <Box args={[2, 0.8, 0.2]}>
                <meshStandardMaterial color={hovered ? '#00ffff' : '#005577'} emissive={hovered ? '#00ffff' : '#005577'} emissiveIntensity={1.5} />
            </Box>
            <Text position={[0, 0, 0.15]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
                {text}
            </Text>
        </group>
    )
}

const ContactTerminal: React.FC<ContactTerminalProps> = ({ district, onSelect, onHover, isSelected }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  
  const color = isSelected ? '#00ffff' : isHovered ? '#00aaff' : '#005577';
  const emissiveIntensityTarget = isSelected ? 2 : isHovered ? 1.5 : 0.8;

  useFrame((state, delta) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, emissiveIntensityTarget, delta * 5);
      
      if (isSelected) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, delta * 5);
      }
    }
  });

  const handleContactClick = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <group position={district.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(district); }}
        onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); onHover(district.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
      >
        <cylinderGeometry args={[5, 5, 1, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {isSelected && (
        <>
            <Text position={[0, 3, 0]} fontSize={0.8} color="white" anchorX="center">
                Contact Me
            </Text>
            <InteractiveButton
                position={[-3, 1.5, 3]}
                text="LinkedIn"
                onClick={() => handleContactClick('https://www.linkedin.com')}
            />
            <InteractiveButton
                position={[0, 1.5, 4.5]}
                text="GitHub"
                onClick={() => handleContactClick('https://www.github.com')}
            />
            <InteractiveButton
                position={[3, 1.5, 3]}
                text="Email"
                onClick={() => (window.location.href = 'mailto:example@example.com')}
            />
        </>
      )}
    </group>
  );
};

export default ContactTerminal;