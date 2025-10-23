/// <reference types="@react-three/fiber" />

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CityCoreProps {
  castShadow: boolean;
}

export const CityCore: React.FC<CityCoreProps> = React.memo(({ castShadow }) => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/city_core.glb');
  const groupRef = useRef<THREE.Group>(null!);
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const lightTarget = useMemo(() => new THREE.Object3D(), []);

  // FIX: Destructure delta time from the useFrame hook's second argument.
  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      // Animasi rotasi yang lambat dan berkelanjutan
      groupRef.current.rotation.y += delta * 0.05;
      // Sedikit gerakan naik-turun
      groupRef.current.position.y = 60 + Math.sin(clock.getElapsedTime() * 0.5) * 3;
    }
  });

  return (
    <>
      <primitive object={lightTarget} position={[0, 0, 0]} />
      <group ref={groupRef} position={[0, 60, 0]} scale={2.5}>
        <primitive object={clonedScene} />
        <spotLight 
          ref={spotLightRef}
          target={lightTarget}
          position={[0, -10, 0]}
          color="#00ffff"
          intensity={500}
          angle={Math.PI / 6}
          penumbra={0.3}
          distance={300}
          castShadow={castShadow}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.001}
        />
      </group>
    </>
  );
});

// Preload model untuk memastikan tersedia saat dibutuhkan
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/city_core.glb');

export default CityCore;