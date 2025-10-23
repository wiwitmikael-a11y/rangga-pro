/// <reference types="@react-three/fiber" />
import React, { useState, useRef, useEffect, useMemo } from 'react';
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

const UNLOCKED_COLOR = new THREE.Color('#005577');
const HOVER_COLOR = new THREE.Color('#00aaff');
const SELECTED_COLOR = new THREE.Color('#00ffff');
const LOCKED_COLOR = new THREE.Color('#333333');

const DistrictBuilding: React.FC<DistrictBuildingProps> = ({
  district,
  onSelect,
  onHover,
  isSelected,
  isUnlocked = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  
  const height = district.height || 20;

  const targetColor = useMemo(() => {
    if (!isUnlocked) return LOCKED_COLOR;
    if (isSelected) return SELECTED_COLOR;
    if (isHovered) return HOVER_COLOR;
    return UNLOCKED_COLOR;
  }, [isSelected, isHovered, isUnlocked]);

  const emissiveIntensityTarget = isSelected ? 1.5 : isHovered ? 1 : 0.5;
  const targetY = isSelected ? Math.sin(Date.now() * 0.002) * 0.5 : 0;

  useFrame((_, delta) => {
    if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, emissiveIntensityTarget, delta * 5);
        material.color.lerp(targetColor, delta * 8);
        material.emissive.copy(material.color);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 5);
    }
  });

  const handlePointerOver = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (onHover && onSelect) {
      setIsHovered(true);
      onHover(district.id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (onHover && onSelect) {
      setIsHovered(false);
      onHover(null);
      document.body.style.cursor = 'auto';
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
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
                transparent
                opacity={isUnlocked ? 0.7 : 0.3}
                wireframe={!isUnlocked}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
        {!isUnlocked && (
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