import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import { ThrustTrail } from './ThrustTrail';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

interface ShipProps {
  modelUrl: string;
  scale: number;
  flightPath: (time: number) => { position: THREE.Vector3, lookAt: THREE.Vector3 };
  trailConfig?: { width?: number; length?: number; opacity?: number; color?: string };
  trailOffset?: [number, number, number];
}

const Ship: React.FC<ShipProps> = ({ modelUrl, scale, flightPath, trailConfig, trailOffset }) => {
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
      <ThrustTrail {...trailConfig} position={trailOffset} />
       <PositionalAudio
        url={`${GHC_AUDIO_URL_BASE}ship-engine.mp3`}
        autoplay
        loop
        distance={25}
      />
    </group>
  );
};

const GHC_AUDIO_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sounds/';


export const FlyingShips: React.FC = React.memo(() => {
  const ships = useMemo(() => [
    {
      url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`,
      scale: 0.9,
      flightPath: (time: number) => {
        const angle = time * 0.2;
        const height = 25 + Math.sin(time * 0.7) * 5; // Dynamic height
        return {
          position: new THREE.Vector3(Math.sin(angle) * 70, height, Math.cos(angle) * 70),
          lookAt: new THREE.Vector3(Math.sin(angle + 0.1) * 70, height, Math.cos(angle + 0.1) * 70),
        };
      },
      trailConfig: { color: '#00aaff', width: 0.5, length: 8, opacity: 0.7 },
      trailOffset: [0, -0.2, -4.0] as [number, number, number],
    },
    {
      url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`,
      scale: 1.2,
      flightPath: (time: number) => {
        const angle = time * 0.3;
        const height = 15 + Math.cos(time * 0.5) * 4; // Dynamic height
        return {
          position: new THREE.Vector3(Math.cos(angle) * 50, height, Math.sin(angle) * 80),
          lookAt: new THREE.Vector3(Math.cos(angle + 0.1) * 50, height, Math.sin(angle + 0.1) * 80),
        };
      },
      trailConfig: { color: '#ffaa00', width: 0.4, length: 7, opacity: 0.8 },
      trailOffset: [0, 0.2, -3.5] as [number, number, number],
    },
    {
      url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`,
      scale: 0.1,
      flightPath: (time: number) => {
        const angle = -time * 0.25;
        const height = 20 + Math.sin(time * 1.5) * 5; // More agile height changes
        return {
          position: new THREE.Vector3(Math.sin(angle) * 60, height, Math.cos(angle) * 60),
          lookAt: new THREE.Vector3(Math.sin(angle - 0.1) * 60, height, Math.cos(angle - 0.1) * 60),
        };
      },
      trailConfig: { color: '#00ffaa', width: 0.15, length: 5, opacity: 0.6 },
      trailOffset: [0, -0.1, -1.5] as [number, number, number],
    },
  ], []);

  return (
    <Suspense fallback={null}>
      {ships.map((ship, index) => (
        <Ship key={index} modelUrl={ship.url} scale={ship.scale} flightPath={ship.flightPath} trailConfig={ship.trailConfig} trailOffset={ship.trailOffset}/>
      ))}
    </Suspense>
  );
});

// Preload all ship models
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);