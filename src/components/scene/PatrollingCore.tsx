import React, { useRef, useMemo } from 'react';
import { useGLTF, PositionalAudio } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/PatrollingCore.glb';

interface PatrollingCoreProps {
  godRaysSourceRef: React.RefObject<THREE.Mesh>;
}

export const PatrollingCore: React.FC<PatrollingCoreProps> = React.memo(({ godRaysSourceRef }) => {
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
      {/* The 3D model, scaled up significantly */}
      <primitive 
        object={clonedScene} 
        scale={4.5} // Increased scale for dominance
        position-y={-2} // Adjust vertical position relative to the group center
      />

      {/* A mesh to act as the source for the GodRays effect. It's invisible. */}
      {/* The GodRays effect in the main component will use this mesh's position. */}
       <mesh ref={godRaysSourceRef} position={[0, 5, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="white" visible={false} />
      </mesh>

      {/* The spotlight attached to the patrolling core, now more powerful */}
      <spotLight
        ref={spotLightRef}
        position={[0, 5, 0]} // Positioned above the model, pointing down
        angle={Math.PI / 4.5} // Wider cone angle
        penumbra={0.3} // Softens the edge of the spotlight
        intensity={35} // Increased brightness
        distance={120} // Increased range
        castShadow
        color="#00ffff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
       <PositionalAudio
        url="https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sounds/ship-engine.mp3"
        autoplay
        loop
        distance={40}
        />

      {/* Add the spotlight target to the scene so the spotlight can reference it */}
      <primitive object={spotLightTarget} />
    </group>
  );
});

// Preload the model for faster loading
useGLTF.preload(MODEL_URL);