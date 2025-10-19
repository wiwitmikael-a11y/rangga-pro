// FIX: Implemented a central visual element for the scene to resolve placeholder issues.
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const CentralCore = () => {
  const coreRef = useRef<Mesh>(null!);
  const outerRef = useRef<Mesh>(null!);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.3;
    if (outerRef.current) outerRef.current.rotation.y -= delta * 0.1;
  });

  return (
    <group position={[0, 8, 0]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00aaff"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={outerRef}>
        <torusGeometry args={[5, 0.2, 16, 100]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default CentralCore;
