
import React, { Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { CityDistrict } from '../../types';
import HolographicDistrictLabel from './HolographicDistrictLabel';

interface InteractiveModelProps {
  district: CityDistrict;
  isSelected: boolean;
  onSelect: (district: CityDistrict) => void;
}

function Model({ url, scale, onPointerOver, onPointerOut, onClick }: any) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  );
}

export const InteractiveModel: React.FC<InteractiveModelProps> = ({ district, isSelected, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(district);
  };

  useFrame((_, delta) => {
      if (groupRef.current) {
          const targetY = isSelected ? Math.sin(Date.now() * 0.001) * 0.5 : 0;
          groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, district.position[1] + targetY, delta * 2);
      }
  });


  return (
    <group ref={groupRef} position={district.position}>
        <Suspense fallback={
            <Text color="cyan" anchorX="center" anchorY="middle">Loading...</Text>
        }>
            <Model 
                url={district.modelUrl} 
                scale={district.modelScale || 1}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
            />
        </Suspense>
        <HolographicDistrictLabel district={district} isSelected={isSelected} onSelect={onSelect} />
    </group>
  );
};

// Preload models defined in portfolioData for faster loading
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/arcade_machine.glb');