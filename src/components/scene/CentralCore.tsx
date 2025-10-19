import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CentralCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      const scale = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2, 0]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#00aaff"
        emissive="#00aaff"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
};
