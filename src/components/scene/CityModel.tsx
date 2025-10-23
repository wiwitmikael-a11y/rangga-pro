// FIX: Added a triple-slash directive to include @react-three/fiber types, which resolves TypeScript errors related to unrecognized JSX elements.
/// <reference types="@react-three/fiber" />

import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const CityModel: React.FC = React.memo(() => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.4;
          // Aktifkan emisi pada material tertentu untuk cahaya kota
          if (child.material.name.includes('light') || child.material.name.includes('emissive')) {
            child.material.emissive = child.material.color;
            child.material.emissiveIntensity = 2;
          }
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} position={[0, -5, 0]} />;
});

// Preload model untuk memastikan tersedia saat dibutuhkan
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');