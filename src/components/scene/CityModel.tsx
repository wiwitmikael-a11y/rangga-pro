import React, { useLayoutEffect, useMemo, useRef } from 'react';
// FIX: Add side-effect import to ensure R3F's JSX types are globally available.
import '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// FIX: Add useThree to provide types for JSX primitives
import { useFrame, useThree } from '@react-three/fiber';

export const CityModel: React.FC = React.memo(() => {
  // FIX: Call useThree to provide types for JSX primitives
  useThree();
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const emissiveMaterials = useRef<THREE.MeshStandardMaterial[]>([]);

  useLayoutEffect(() => {
    const materials: THREE.MeshStandardMaterial[] = [];
    // --- FIX: Cache for cloned materials to prevent cross-contamination ---
    // This ensures that modifying the city's materials doesn't affect other models
    // that might share materials from the cache (like the DeLorean).
    const materialCache: { [uuid: string]: THREE.Material } = {};

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof THREE.MeshStandardMaterial) {
          
          // --- FIX: Clone material if we haven't already ---
          if (!materialCache[child.material.uuid]) {
              materialCache[child.material.uuid] = child.material.clone();
          }
          child.material = materialCache[child.material.uuid] as THREE.MeshStandardMaterial;

          // Now, modify the unique, cloned material
          child.material.metalness = 0.7;
          child.material.roughness = 0.4;

          // Aktifkan emisi pada material tertentu untuk cahaya kota
          if (child.material.name.includes('light') || child.material.name.includes('emissive')) {
            child.material.emissive = child.material.color;
            child.material.emissiveIntensity = 2;
            materials.push(child.material);
          }
        }
      }
    });
    emissiveMaterials.current = materials;
  }, [clonedScene]);
  
  useFrame(({ clock }) => {
    const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.5 + 0.5; // Varies between 0 and 1
    emissiveMaterials.current.forEach(material => {
      // Modulate intensity for a living city effect
      material.emissiveIntensity = 1.5 + pulse * 2;
    });
  });

  return <primitive object={clonedScene} position={[0, -5, 0]} scale={15} />;
});

// Preload model untuk memastikan tersedia saat dibutuhkan
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');
