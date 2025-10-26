import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { ThrustTrail } from './ThrustTrail';

const SHIP_MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/SciFi_Fighter-MK6-/_Final.glb';
const noise3D = createNoise3D();

interface ShipProps {
  seed: number;
}

const Ship: React.FC<ShipProps> = ({ seed }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(SHIP_MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const previousPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsedTime = clock.getElapsedTime() + seed * 1000;
    const speed = 0.1 + (seed % 0.1); // Vary speed per ship
    
    const time = elapsedTime * speed;
    const range = 100;

    // Use simplex noise for smooth, pseudo-random flight paths
    const x = noise3D(time, seed, 0) * range;
    const z = noise3D(seed, time, 0) * range;
    const y = 30 + noise3D(0, seed, time) * 15;

    previousPosition.copy(groupRef.current.position);
    groupRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.02);

    // Make the ship look in the direction of movement
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
      <primitive object={clonedScene} scale={0.5} rotation-y={-Math.PI / 2} />
      <ThrustTrail position={[-0.05, 0.1, -0.6]} color="#ff9900" width={0.1} length={2.5} />
      <ThrustTrail position={[0.05, 0.1, -0.6]} color="#ff9900" width={0.1} length={2.5} />
    </group>
  );
};

export const FlyingShips: React.FC = () => {
  const shipCount = 5;
  const ships = useMemo(() => 
    Array.from({ length: shipCount }).map((_, i) => <Ship key={i} seed={Math.random()} />),
    [shipCount]
  );
  return <>{ships}</>;
};

useGLTF.preload(SHIP_MODEL_URL);
