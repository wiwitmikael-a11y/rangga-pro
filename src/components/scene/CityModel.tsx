import React from 'react';
// FIX: This side-effect import extends the JSX namespace to include react-three-fiber elements, resolving TypeScript errors.
import '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const MODEL_PATH = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/cyberpunk_city_-_1.glb';

export default function CityModel() {
  const { scene } = useGLTF(MODEL_PATH);

  // The model is cloned to ensure it can be manipulated without affecting the cached version.
  // It receives shadows for realism but doesn't cast them itself for performance.
  return (
    <primitive 
      object={scene.clone()} 
      scale={15} 
      position={[0, 0, 0]} 
      rotation={[0, -Math.PI / 2, 0]} 
      receiveShadow
    />
  );
}

// Preload the model for a faster initial render
useGLTF.preload(MODEL_PATH);
