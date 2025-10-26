import React, { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
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

interface ModelProps {
  url: string;
  scale: number;
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

function Model({ url, scale, onPointerOver, onPointerOut, onPointerDown }: ModelProps) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const originalEmissives = useRef<{ [uuid: string]: THREE.Color }>({});
  const hoverColor = useMemo(() => new THREE.Color('cyan'), []);

  useLayoutEffect(() => {
    const emissives: { [uuid: string]: THREE.Color } = {};
    clonedScene.traverse((child: any) => {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        emissives[child.uuid] = child.material.emissive.clone();
      }
    });
    originalEmissives.current = emissives;
  }, [clonedScene]);
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    onPointerOver(e);
    clonedScene.traverse((child: any) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.emissive.copy(hoverColor);
            child.material.emissiveIntensity = 0.5;
        }
    });
  };
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    onPointerOut(e);
    clonedScene.traverse((child: any) => {
        if (child.isMesh && child.material.isMeshStandardMaterial && originalEmissives.current[child.uuid]) {
            child.material.emissive.copy(originalEmissives.current[child.uuid]);
            child.material.emissiveIntensity = 1; 
        }
    });
  };

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={onPointerDown}
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
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect(district);
  };

  useFrame((_, delta) => {
      if (groupRef.current) {
        const targetY = isSelected ? Math.sin(Date.now() * 0.001) * 0.5 : 0;
        const finalPos = new THREE.Vector3(...district.position);
        finalPos.y += targetY;
        groupRef.current.position.lerp(finalPos, delta * 4);
      }
  });

  return (
    <group ref={groupRef} position={district.position}>
        <Suspense fallback={
            <Text color="cyan" anchorX="center" anchorY="middle">Loading...</Text>
        }>
            <Model 
                url={district.modelUrl!} 
                scale={district.modelScale || 1}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerDown={handlePointerDown}
            />
        </Suspense>
        <HolographicDistrictLabel 
            district={district} 
            isSelected={isSelected} 
            onSelect={onSelect} 
        />
    </group>
  );
};
