import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/PatrollingCore.glb';
const SCALE = 4; 

// Inisialisasi fungsi noise di luar komponen untuk performa
const noise3D = createNoise3D();

interface PatrollingCoreProps {
  isPaused?: boolean;
}

export const PatrollingCore: React.FC<PatrollingCoreProps> = React.memo(({ isPaused }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(MODEL_URL);
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const previousPosition = useMemo(() => new THREE.Vector3(), []);
  
  useFrame(({ clock }) => {
    if (!groupRef.current || isPaused) return;

    const elapsedTime = clock.getElapsedTime();
    const movementSpeed = 0.04;

    const time = elapsedTime * movementSpeed;
    const horizontalRange = 80;
    const verticalRange = 25;
    const baseHeight = 35;

    const x = noise3D(time, 0, 0) * horizontalRange;
    const z = noise3D(0, time, 0) * horizontalRange;
    const heightNoise = (noise3D(0, 0, time) + 1) / 2;
    const y = baseHeight + heightNoise * verticalRange;

    previousPosition.copy(groupRef.current.position);
    groupRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.05);

    if (previousPosition.distanceTo(groupRef.current.position) > 0.01) {
       const lookAtTarget = new THREE.Vector3().copy(groupRef.current.position).add(
         new THREE.Vector3().subVectors(groupRef.current.position, previousPosition).normalize()
       );
       const tempObject = new THREE.Object3D();
       tempObject.position.copy(groupRef.current.position);
       tempObject.lookAt(lookAtTarget);
       groupRef.current.quaternion.slerp(tempObject.quaternion, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        scale={SCALE}
        position-y={0} 
      />
    </group>
  );
});

useGLTF.preload(MODEL_URL);
