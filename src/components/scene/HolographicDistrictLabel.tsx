// FIX: Remove the triple-slash directive for @react-three/fiber types.
import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface HolographicDistrictLabelProps {
  district: CityDistrict;
  onSelect: (district: CityDistrict) => void;
  isSelected: boolean;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
}

const HolographicDistrictLabel: React.FC<HolographicDistrictLabelProps> = ({ district, onSelect, isSelected, isCalibrationMode, isHeld, onSetHeld }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Animasi hover
    const targetScale = isHovered || isSelected ? 1.2 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
  });
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    if(isCalibrationMode) document.body.style.cursor = 'grab';
    else document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isCalibrationMode) {
      onSetHeld(district.id);
    } else {
      onSelect(district);
    }
  };
  
  const textColor = isHeld ? '#FFD700' : isSelected ? '#ffffff' : isHovered ? '#00ffff' : '#00aaff';
  const emissiveIntensity = isHeld ? 2.5 : isHovered || isSelected ? 2 : 1;

  return (
    <Billboard position={[0, 10, 0]}>
      <group
        ref={groupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
      >
        <Text
          fontSize={4}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.1}
        >
          {district.title.toUpperCase()}
          <meshStandardMaterial
            emissive={textColor}
            emissiveIntensity={emissiveIntensity}
            toneMapped={false}
          />
        </Text>
        <Text
          position={[0, -3, 0]}
          fontSize={1.5}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          {district.description}
        </Text>
      </group>
    </Billboard>
  );
};

export default HolographicDistrictLabel;
