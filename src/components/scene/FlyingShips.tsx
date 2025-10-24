import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ThrustTrail } from './ThrustTrail';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

interface ShipProps {
  modelUrl: string;
  scale: number;
  flightPath: (time: number) => { position: THREE.Vector3, lookAt: THREE.Vector3 };
  trailConfig?: { width?: number; length?: number; opacity?: number; color?: string };
}

const Ship: React.FC<ShipProps> = ({ modelUrl, scale, flightPath, trailConfig }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { position, lookAt } = flightPath(clock.getElapsedTime());
    groupRef.current.position.copy(position);
    groupRef.current.lookAt(lookAt);
  });

  return (
    <group ref={groupRef} scale={scale} dispose={null}>
      <primitive object={clonedScene} />
      <ThrustTrail {...trailConfig} />
    </group>
  );
};

export const FlyingShips: React.FC = React.memo(() => {
  const ships = useMemo(() => [
    {
      url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`,
      scale: 0.9, // Increased scale 3x
      flightPath: (time: number) => {
        const angle = time * 0.2;
        return {
          position: new THREE.Vector3(Math.sin(angle) * 70, 25, Math.cos(angle) * 70),
          lookAt: new THREE.Vector3(Math.sin(angle + 0.1) * 70, 25, Math.cos(angle + 0.1) * 70),
        };
      },
      trailConfig: { color: '#00aaff', length: 100, opacity: 0.7 }, // Increased length 10x
    },
    {
      url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`,
      scale: 1.2, // Increased scale 3x
      flightPath: (time: number) => {
        const angle = time * 0.3;
        return {
          position: new THREE.Vector3(Math.cos(angle) * 50, 15, Math.sin(angle) * 80),
          lookAt: new THREE.Vector3(Math.cos(angle + 0.1) * 50, 15, Math.sin(angle + 0.1) * 80),
        };
      },
      trailConfig: { color: '#ffaa00', length: 120, opacity: 0.8 }, // Increased length 10x
    },
    {
      url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`,
      scale: 0.1, // Scale remains the same
      flightPath: (time: number) => {
        const angle = -time * 0.25;
        return {
          position: new THREE.Vector3(Math.sin(angle) * 60, 20 + Math.sin(time) * 5, Math.cos(angle) * 60),
          lookAt: new THREE.Vector3(Math.sin(angle - 0.1) * 60, 20, Math.cos(angle - 0.1) * 60),
        };
      },
      trailConfig: { color: '#00ffaa', width: 0.2, length: 80, opacity: 0.6 }, // Increased length 10x
    },
  ], []);

  return (
    <Suspense fallback={null}>
      {ships.map((ship, index) => (
        <Ship key={index} modelUrl={ship.url} scale={ship.scale} flightPath={ship.flightPath} trailConfig={ship.trailConfig} />
      ))}
    </Suspense>
  );
});

// Preload all ship models
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);