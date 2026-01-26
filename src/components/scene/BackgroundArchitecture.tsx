

import React, { useMemo, useRef, useLayoutEffect } from 'react';
// FIX: Add explicit type augmentation for R3F elements
import { ThreeElements } from '@react-three/fiber'
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BLOCK_COUNT = 150;
const MIN_RADIUS = 200; // Far outside the main districts (approx 100-120 range)
const MAX_RADIUS = 450;
const COLOR_PALETTE = ['#00aaff', '#00ffff', '#0055aa'];

export const BackgroundArchitecture: React.FC = React.memo(() => {
  useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Store random data for each block to use in animation
  const particles = useMemo(() => {
    return new Array(BLOCK_COUNT).fill(0).map(() => ({
      speed: Math.random() * 0.2 + 0.1,
      offset: Math.random() * 100,
      baseY: Math.random() * 50 - 20, // Some below ground, some floating high
      x: 0,
      z: 0,
      height: 0,
    }));
  }, []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < BLOCK_COUNT; i++) {
      // Polar coordinates for distribution ring
      // Use Math.sqrt(Math.random()) for uniform distribution in a ring
      const r = Math.sqrt(Math.random()) * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
      const theta = Math.random() * 2 * Math.PI;

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      particles[i].x = x;
      particles[i].z = z;

      // Randomize Scale
      const width = Math.random() * 20 + 10;
      const depth = Math.random() * 20 + 10;
      const height = Math.random() * 120 + 30; // Tall skyscraper-like blocks
      particles[i].height = height;

      dummy.position.set(x, particles[i].baseY + height / 2, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = Math.random() * Math.PI; // Random rotation
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Randomize color slightly for each instance
      const color = new THREE.Color(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [dummy, particles]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime();

    for (let i = 0; i < BLOCK_COUNT; i++) {
        const p = particles[i];
        
        // Gentle floating animation
        // Using a sine wave based on time, unique speed, and random offset
        const floatingY = Math.sin(time * p.speed + p.offset) * 10;
        
        // Retrieve current transform (we only want to update Y position)
        meshRef.current.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        
        dummy.position.y = p.baseY + p.height / 2 + floatingY;
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BLOCK_COUNT]}>
      <boxGeometry args={[1, 1, 1]} /> {/* Base geometry 1x1x1, scaled via matrix */}
      <meshStandardMaterial
        color="#00aaff"
        transparent
        opacity={0.15} // Very transparent
        metalness={0.8}
        roughness={0.1}
        depthWrite={false} // Prevents z-fighting artifacts with transparency
        blending={THREE.AdditiveBlending} // Adds a nice holographic glow effect
      />
    </instancedMesh>
  );
});