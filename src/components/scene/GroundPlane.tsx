// FIX: The triple-slash directive must be at the top of the file to correctly load TypeScript types for @react-three/fiber.
/// <reference types="@react-three/fiber" />

import React from 'react';
import * as THREE from 'three';

export const GroundPlane: React.FC = React.memo(() => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.1, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial 
        color="#0a0a0a" // Warna gelap untuk aspal
        metalness={0.8} // Efek metalik untuk pantulan seperti genangan air
        roughness={0.4} // Sedikit kasar agar tidak seperti cermin sempurna
        envMapIntensity={0.5}
      />
    </mesh>
  );
});