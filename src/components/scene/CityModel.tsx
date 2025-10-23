// FIX: Corrected the reference path for @react-three/fiber types. The '/patch' subpath is obsolete.
/// <reference types="@react-three/fiber" />
import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const CityModel: React.FC = () => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Optional: Tweak materials for a more sci-fi look
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.4;
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} position={[0, -5, 0]} />;
};

// Preload the model
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city.glb');