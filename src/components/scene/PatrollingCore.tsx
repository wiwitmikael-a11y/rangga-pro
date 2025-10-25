import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/city_core.glb';

export const PatrollingCore: React.FC = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null!);
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  const { scene } = useGLTF(MODEL_URL);
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Set up a target for the spotlight to look at.
  // This object will be positioned on the ground, directly below the core.
  const spotLightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, 0); // Start at origin, will be updated in useFrame
    return target;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current || !spotLightRef.current) return;

    const elapsedTime = clock.getElapsedTime();
    
    // 1. Orbiting animation
    const orbitRadius = 65; // Increased radius to orbit outside the city
    const orbitSpeed = 0.3;
    const patrolHeight = 45; // Increased height to fly above buildings
    const x = Math.sin(elapsedTime * orbitSpeed) * orbitRadius;
    const z = Math.cos(elapsedTime * orbitSpeed) * orbitRadius;
    groupRef.current.position.set(x, patrolHeight, z);

    // 2. Self-rotation
    groupRef.current.rotation.y += 0.01;

    // 3. Update spotlight target position to be directly below the orbiting core
    // This ensures the light always points straight down towards the city.
    spotLightTarget.position.set(x, 0, z);
    spotLightRef.current.target = spotLightTarget;
  });

  return (
    <group ref={groupRef}>
      {/* The 3D model, scaled down as requested */}
      <primitive 
        object={clonedScene} 
        scale={0.4} // Significantly reduced scale
        position-y={-2} // Adjust vertical position relative to the group center
      />

      {/* The spotlight attached to the patrolling core */}
      <spotLight
        ref={spotLightRef}
        position={[0, 5, 0]} // Positioned above the model, pointing down
        angle={Math.PI / 6} // The cone angle of the light
        penumbra={0.3} // Softens the edge of the spotlight
        intensity={15} // Brightness
        distance={100} // How far the light reaches
        castShadow
        color="#00ffff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Add the spotlight target to the scene so the spotlight can reference it */}
      <primitive object={spotLightTarget} />
    </group>
  );
});

// Preload the model for faster loading
useGLTF.preload(MODEL_URL);
