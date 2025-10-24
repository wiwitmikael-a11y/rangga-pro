import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GITHUB_MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/city_core.glb';

export const PatrollingCore: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(GITHUB_MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Create a stable object to be the spotlight's target
  const lightTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  // Add the target to the scene once, so the spotlight can find it.
  useEffect(() => {
    const scene = groupRef.current?.parent;
    if (scene) {
      scene.add(lightTargetRef.current);
    }
    return () => {
      if (scene) {
        scene.remove(lightTargetRef.current);
      }
    };
  }, []);


  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    const radius = 40;
    const height = 30;
    const angle = time * 0.15;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    // Animate the core's position in an orbit
    groupRef.current.position.set(x, height, z);
    // Slowly rotate the core for a more dynamic look
    groupRef.current.rotation.y = time * 0.2;

    // Update the spotlight's target to be directly below the core on the ground plane
    lightTargetRef.current.position.set(x, 0, z);
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={1.1} />
      <spotLight
        target={lightTargetRef.current}
        position={[0, -3, 0]} // Position relative to the orbiting group, moved to the "tip"
        color="#00aaff"
        intensity={20} // Increased intensity for a more visible beam
        distance={80}
        angle={Math.PI / 8}
        penumbra={0.5}
        decay={2}
        castShadow
      />
    </group>
  );
};

useGLTF.preload(GITHUB_MODEL_URL);