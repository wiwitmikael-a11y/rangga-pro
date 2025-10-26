import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SHIP_MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/Spaceship.glb';

// A single ship that follows a curve
const Ship: React.FC<{ curve: THREE.CatmullRomCurve3 }> = ({ curve }) => {
  const { scene } = useGLTF(SHIP_MODEL_URL);
  const shipRef = useRef<THREE.Group>(null!);
  const [phase, setPhase] = useState<'spawning' | 'patrolling'>('spawning');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const timeOffset = useMemo(() => Math.random() * 100, []);
  const spawnTargetY = useMemo(() => 20 + Math.random() * 15, []); // Target altitude between 20 and 35

  useEffect(() => {
    if (shipRef.current) {
        // Initial position near city center, on the ground
        const startRadius = 15;
        shipRef.current.position.set(
            (Math.random() - 0.5) * startRadius,
            0,
            (Math.random() - 0.5) * startRadius
        );
        // Point upwards for take-off
        shipRef.current.lookAt(0, 1, 0);
    }
  }, []);

  useFrame(({ clock }, delta) => {
    if (!shipRef.current) return;

    if (phase === 'spawning') {
        // --- Spawning Phase: Fly straight up ---
        const takeOffSpeed = 10;
        shipRef.current.position.y += takeOffSpeed * delta;
        
        // Tilt forward as it ascends
        const tiltProgress = shipRef.current.position.y / spawnTargetY;
        const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 * (1 - tiltProgress), 0, 0));
        shipRef.current.quaternion.slerp(targetQuaternion, delta * 2);

        if (shipRef.current.position.y >= spawnTargetY) {
            setPhase('patrolling'); // Transition to patrolling
        }

    } else {
        // --- Patrolling Phase: Follow the curve ---
        const time = clock.getElapsedTime() + timeOffset;
        const loopTime = 25; // Time in seconds to complete a loop
        const t = (time % loopTime) / loopTime;

        const position = curve.getPointAt(t);
        shipRef.current.position.lerp(position, delta * 2); // Smoothly move towards the path

        // Make the ship look ahead along the curve's tangent
        const tangent = curve.getTangentAt(t).normalize();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), tangent);
        shipRef.current.quaternion.slerp(quaternion, delta * 2); // Use slerp for smoother rotation
    }
  });

  return <primitive ref={shipRef} object={clonedScene} scale={0.5} />;
};

// The main component that creates multiple ships and their paths
export const FlyingShips: React.FC = React.memo(() => {
  const curves = useMemo(() => {
    // Define a few interesting paths for the ships to follow
    return [
      // Path 1: Wide, high arc
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-100, 20, -50),
        new THREE.Vector3(-50, 30, 50),
        new THREE.Vector3(50, 25, 50),
        new THREE.Vector3(100, 20, -50),
      ], true),
      // Path 2: Lower, faster loop around the center
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 15, -80),
        new THREE.Vector3(70, 18, 0),
        new THREE.Vector3(0, 15, 80),
        new THREE.Vector3(-70, 12, 0),
      ], true),
      // Path 3: A weaving path through the districts
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-60, 25, 80),
        new THREE.Vector3(0, 30, 0),
        new THREE.Vector3(60, 25, 80),
        new THREE.Vector3(0, 20, 20),
      ], true),
    ];
  }, []);

  return (
    <group>
      {curves.map((curve, index) => (
        <Ship key={index} curve={curve} />
      ))}
    </group>
  );
});

// Preload the model for faster instantiation
useGLTF.preload(SHIP_MODEL_URL);