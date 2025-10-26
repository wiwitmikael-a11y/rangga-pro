
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const CityModel: React.FC = React.memo(() => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const emissiveMaterials = useRef<THREE.MeshStandardMaterial[]>([]);

  useLayoutEffect(() => {
    const materials: THREE.MeshStandardMaterial[] = [];
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.4;
          // Enable emission on specific materials for city lights
          if (child.material.name.includes('light') || child.material.name.includes('emissive')) {
            child.material.emissive = child.material.color;
            materials.push(child.material);
          }
        }
      }
    });
    emissiveMaterials.current = materials;
  }, [clonedScene]);
  
  // Animate the pulse of the city lights
  useFrame(({ clock }) => {
    const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.5 + 1.5; // Creates a value that oscillates between 1 and 2
    emissiveMaterials.current.forEach(material => {
      material.emissiveIntensity = pulse;
    });
  });

  return <primitive object={clonedScene} position={[0, -5, 0]} scale={15} />;
});

// Preload model to ensure it's available when needed
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');
