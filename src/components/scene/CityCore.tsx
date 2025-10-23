// Added a triple-slash directive to include @react-three/fiber types, resolving TypeScript errors with unrecognized JSX elements.
/// <reference types="@react-three/fiber" />

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const CityCore: React.FC = React.memo(() => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/city_core.glb');
  const groupRef = useRef<THREE.Group>(null!);
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Animasi rotasi yang lambat dan berkelanjutan
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]} scale={1.5}>
      <primitive object={clonedScene} />
    </group>
  );
});

// Preload model untuk memastikan tersedia saat dibutuhkan
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/city_core.glb');

export default CityCore;