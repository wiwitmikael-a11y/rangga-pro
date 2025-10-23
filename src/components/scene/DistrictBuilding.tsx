// FIX: Added the triple-slash directive to provide types for R3F's custom JSX elements, resolving "Property does not exist on type 'JSX.IntrinsicElements'" errors.
/// <reference types="@react-three/fiber" />
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../../types';
import { Text } from '@react-three/drei';

interface DistrictBuildingProps {
  district: CityDistrict;
  onSelect?: (district: CityDistrict) => void;
  onHover?: (id: string | null) => void;
  isSelected?: boolean;
  isUnlocked?: boolean;
}

const DistrictBuilding: React.FC<DistrictBuildingProps> = ({
  district,
  onSelect,
  onHover,
  isSelected,
  isUnlocked = true, // Default to unlocked for ambient buildings
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  
  const height = district.height || 20;
  const color = isSelected ? '#00ffff' : isHovered ? '#00aaff' : '#005577';
  const emissiveIntensityTarget = isSelected ? 1.5 : isHovered ? 1 : 0.5;
  const opacity = isUnlocked ? 0.7 : 0.3;

  useFrame((state, delta) => {
    if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        // Smoothly interpolate emissive intensity for a glowing effect
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, emissiveIntensityTarget, delta * 5);
        
        // Add a subtle bobbing animation when selected
        if (isSelected) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
        } else {
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, delta * 5);
        }
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (onHover && onSelect) { // Only trigger hover for interactive buildings
      setIsHovered(true);
      onHover(district.id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    if (onHover && onSelect) {
      setIsHovered(false);
      onHover(null);
      document.body.style.cursor = 'auto';
    }
  };
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(district);
    }
  };

  return (
    <group position={district.position}>
        <mesh
            ref={meshRef}
            castShadow
            receiveShadow
            onClick={onSelect ? handleClick : undefined}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <boxGeometry args={[8, height, 8]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                transparent
                opacity={opacity}
                wireframe={!isUnlocked}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
        {isUnlocked === false && (
            <Text
                position={[0, height / 2 + 2, 0]}
                fontSize={2}
                color="#ff4444"
                anchorX="center"
                anchorY="middle"
            >
                ?
            </Text>
        )}
    </group>
  );
};

export default DistrictBuilding;