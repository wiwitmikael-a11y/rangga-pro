
// Fix: Add a type-only import to explicitly load TypeScript definitions for react-three-fiber,
// which extends the JSX namespace and allows using R3F elements like <primitive>.
import type { ThreeElements } from '@react-three/fiber';
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_downtown_loop.glb';

export default function CityModel() {
  const { scene } = useGLTF(MODEL_PATH);

  const processedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // Enable shadows for all meshes in the city
            child.castShadow = true;
            child.receiveShadow = true;

            // This function enhances an existing material instead of replacing it
            const enhanceMaterial = (material: THREE.Material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                    // Make surfaces more reflective and "wet" looking
                    material.metalness = Math.min(1.0, material.metalness + 0.2);
                    material.roughness = Math.max(0.1, material.roughness - 0.3);

                    // If the original material has an emissive map, boost its intensity
                    if (material.emissiveMap) {
                        material.emissiveIntensity = 2.5;
                    }
                    material.needsUpdate = true;
                }
            };

            // Safely handle both single material and arrays of materials
            if (Array.isArray(child.material)) {
                child.material.forEach(enhanceMaterial);
            } else {
                enhanceMaterial(child.material);
            }
        }
    });
    return clone;
  }, [scene]);

  return (
    <primitive 
      object={processedScene} 
      scale={8} 
      position={[0, -5, 0]} 
      rotation={[0, 0, 0]} 
    />
  );
}

// Preload the model for a faster initial render
useGLTF.preload(MODEL_PATH);