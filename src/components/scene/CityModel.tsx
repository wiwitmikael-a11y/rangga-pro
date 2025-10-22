import React, { useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_downtown_loop.glb';

export default function CityModel() {
  const { scene } = useGLTF(MODEL_PATH);

  // Load PBR textures for the city buildings
  const [map, metalnessMap, normalMap, roughnessMap, emissiveMap] = useTexture([
      'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/Sci-fi_Panel_002_basecolor.jpg',
      'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/Sci-fi_Panel_002_metallic.jpg',
      'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/Sci-fi_Panel_002_normal.jpg',
      'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/Sci-fi_Panel_002_roughness.jpg',
      'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/Sci-fi_Panel_002_emissive.jpg',
  ]);

  const newMaterial = useMemo(() => {
      const material = new THREE.MeshStandardMaterial({
          map: map,
          metalnessMap: metalnessMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          emissiveMap: emissiveMap,
          emissive: '#00ffff', // A cyan glow for the emissive parts
          emissiveIntensity: 2.0,
      });

      // Configure texture tiling
      for (const texture of [map, metalnessMap, normalMap, roughnessMap, emissiveMap]) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(2, 2); 
      }

      return material;
  }, [map, metalnessMap, normalMap, roughnessMap, emissiveMap]);

  const clonedScene = useMemo(() => {
      const clone = scene.clone();
      clone.traverse((child) => {
          if (child instanceof THREE.Mesh) {
              // Replace material of all meshes in the model
              child.material = newMaterial;
          }
      });
      return clone;
  }, [scene, newMaterial]);

  return (
    <primitive 
      object={clonedScene} 
      scale={8} 
      position={[0, -5, 0]} 
      rotation={[0, 0, 0]} 
      receiveShadow
    />
  );
}

// Preload the model for a faster initial render
useGLTF.preload(MODEL_PATH);