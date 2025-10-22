/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export const GroundPlane: React.FC = () => {
  const [map, roughnessMap, normalMap] = useTexture([
    'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/wet_asphalt_albedo.jpg',
    'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/wet_asphalt_roughness.jpg',
    'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/wet_asphalt_normal.jpg'
  ]);

  // Configure texture tiling to cover the large plane
  [map, roughnessMap, normalMap].forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
  });
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.1, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial 
        map={map}
        roughnessMap={roughnessMap}
        normalMap={normalMap}
        metalness={0.8} // High metalness on puddles reflects light well
        roughness={0.5} // Base roughness for the asphalt
      />
    </mesh>
  );
};