
import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';
import { portfolioData as initialPortfolioData } from '../../constants';

interface InteractiveModelProps {
  district: CityDistrict;
  onSelect: (district: CityDistrict) => void;
  isSelected: boolean;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
}

export const InteractiveModel: React.FC<InteractiveModelProps> = ({ district, onSelect, isSelected, isCalibrationMode, isHeld, onSetHeld }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { scene } = useGLTF(district.modelUrl!);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const emissiveMaterials = useRef<THREE.MeshStandardMaterial[]>([]);

  useLayoutEffect(() => {
    const materials: THREE.MeshStandardMaterial[] = [];
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        if (child.material.emissive && child.material.emissive.getHex() > 0) {
           materials.push(child.material);
        }
      }
    });
    emissiveMaterials.current = materials;
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetScale = isHeld ? district.modelScale! * 1.1 : district.modelScale!;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    
    const targetIntensity = isSelected || isHovered ? 2.5 : 1.0;
    emissiveMaterials.current.forEach(mat => {
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, delta * 5);
    });
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

  return (
    <group
      ref={groupRef}
      position={district.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    >
      <primitive object={clonedScene} scale={district.modelScale} />
    </group>
  );
};

// Preload all major district models
initialPortfolioData.forEach(district => {
  if (district.type === 'major' && district.modelUrl) {
    useGLTF.preload(district.modelUrl);
  }
});
