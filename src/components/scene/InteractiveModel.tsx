import React, { useLayoutEffect, useRef, useState } from 'react';
import { useGLTF, Text, Billboard } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface InteractiveModelProps {
  district: CityDistrict;
  isSelected: boolean;
  onSelect: (district: CityDistrict) => void;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
}

export const InteractiveModel: React.FC<InteractiveModelProps> = ({
  district,
  isSelected,
  onSelect,
  isCalibrationMode,
  isHeld,
  onSetHeld,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { scene } = useGLTF(district.modelUrl!);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isHeld ? 1.15 : (isHovered || isSelected ? 1.1 : 1);
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = isCalibrationMode ? 'grab' : 'pointer';
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
      document.body.style.cursor = 'grabbing';
    } else {
      onSelect(district);
    }
  };
  
  const labelYOffset = district.id === 'nexus-core' ? 30 : 20;

  return (
    <group
      ref={groupRef}
      position={district.position}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={scene} scale={district.modelScale} />
       <Billboard position={[0, labelYOffset, 0]}>
         <Text
            fontSize={3}
            color={isSelected ? '#00ffff' : 'white'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
        >
            {district.title.toUpperCase()}
            <meshStandardMaterial
                emissive={isSelected ? '#00ffff' : '#ffffff'}
                emissiveIntensity={isSelected || isHovered ? 2 : 1}
                toneMapped={false}
            />
        </Text>
         <Text
            position={[0, -4, 0]}
            fontSize={1.2}
            color="#afeeee"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
        >
            {district.description}
        </Text>
      </Billboard>
    </group>
  );
};
