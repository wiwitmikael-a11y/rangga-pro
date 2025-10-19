import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80; // Spread particles across a large area
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
        pointsRef.current.rotation.y = t * 0.02;
        pointsRef.current.rotation.x = t * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00ffff"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

export default FloatingParticles;