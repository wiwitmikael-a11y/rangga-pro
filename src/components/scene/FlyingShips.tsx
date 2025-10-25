import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ThrustTrail } from './ThrustTrail';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

// --- Konfigurasi Perilaku AI Kapal ---
const CITY_RADIUS = 85; // Batas area terbang kapal
const FLIGHT_ALTITUDE_MIN = 20;
const FLIGHT_ALTITUDE_MAX = 40;
const FLIGHT_SPEED = 12;
const TURN_SPEED = 1.5;

// Titik pendaratan yang telah ditentukan di dekat bangunan
const BUILDING_LANDING_SPOTS: THREE.Vector3[] = [
  new THREE.Vector3(30, -2, 40),
  new THREE.Vector3(-25, -2, 50),
  new THREE.Vector3(50, -1, -30),
  new THREE.Vector3(-40, 0, -60),
  new THREE.Vector3(0, -1, -55),
  new THREE.Vector3(60, -2, 10),
  new THREE.Vector3(-55, -1, 15),
  new THREE.Vector3(10, 0, 70),
];

// Titik pendaratan di area medan kosong (terrain)
const TERRAIN_LANDING_SPOTS: THREE.Vector3[] = [
    new THREE.Vector3(70, -3.5, -50),
    new THREE.Vector3(-75, -3.5, -30),
    new THREE.Vector3(20, -3.5, -80),
    new THREE.Vector3(-30, -3.5, 80),
    new THREE.Vector3(0, -3.5, 0), // Near center but on ground
];


type ShipState = 'FLYING' | 'DESCENDING' | 'LANDED' | 'ASCENDING';

interface ShipProps {
  modelUrl: string;
  scale: number;
  trailConfig?: { width?: number; length?: number; opacity?: number; color?: string };
  trailOffset?: [number, number, number];
  initialDelay: number;
}

const Ship: React.FC<ShipProps> = ({ modelUrl, scale, trailConfig, trailOffset, initialDelay }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const shipState = useRef({
    state: 'FLYING' as ShipState,
    targetPosition: new THREE.Vector3(),
    timer: Math.random() * 10 + 5,
    isInitialized: false,
  });
  
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempLookAtObject = useMemo(() => new THREE.Object3D(), []);

  const getNewFlightTarget = () => {
    if (Math.random() < 0.7) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * CITY_RADIUS;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
        Math.sin(angle) * radius
      );
    } else {
      const allSpots = [...BUILDING_LANDING_SPOTS, ...TERRAIN_LANDING_SPOTS];
      const targetSpot = allSpots[Math.floor(Math.random() * allSpots.length)];
      return new THREE.Vector3(targetSpot.x, FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN), targetSpot.z);
    }
  };
  
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    
    if (!shipState.current.isInitialized && clock.elapsedTime > initialDelay) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * CITY_RADIUS;
        const initialPos = new THREE.Vector3(
          Math.cos(angle) * radius,
          FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
          Math.sin(angle) * radius
        );
        groupRef.current.position.copy(initialPos);
        shipState.current.targetPosition.copy(getNewFlightTarget());
        shipState.current.isInitialized = true;
        groupRef.current.visible = true;
    }

    if (!shipState.current.isInitialized) return;

    shipState.current.timer -= delta;
    const currentPos = groupRef.current.position;
    const targetPos = shipState.current.targetPosition;

    switch (shipState.current.state) {
      case 'FLYING':
        if (currentPos.distanceTo(targetPos) < 5 || shipState.current.timer <= 0) {
          if (shipState.current.timer <= 0 && Math.random() < 0.3) {
            shipState.current.state = 'DESCENDING';
            const landingZones = Math.random() < 0.5 ? BUILDING_LANDING_SPOTS : TERRAIN_LANDING_SPOTS;
            const targetZone = landingZones[Math.floor(Math.random() * landingZones.length)];
            
            // Tambahkan offset acak untuk pendaratan yang lebih natural
            const landingOffset = new THREE.Vector3(
                (Math.random() - 0.5) * 15,
                0,
                (Math.random() - 0.5) * 15
            );
            const finalLandingTarget = targetZone.clone().add(landingOffset);
            shipState.current.targetPosition.copy(finalLandingTarget);
          } else {
            shipState.current.targetPosition.copy(getNewFlightTarget());
            shipState.current.timer = Math.random() * 15 + 10;
          }
        }
        break;

      case 'DESCENDING':
        if (currentPos.distanceTo(targetPos) < 1) {
          shipState.current.state = 'LANDED';
          shipState.current.timer = Math.random() * 8 + 5;
        }
        break;

      case 'LANDED':
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING';
          shipState.current.targetPosition.set(currentPos.x, FLIGHT_ALTITUDE_MAX - 5, currentPos.z);
        }
        break;

      case 'ASCENDING':
        if (currentPos.distanceTo(targetPos) < 1) {
          shipState.current.state = 'FLYING';
          shipState.current.targetPosition.copy(getNewFlightTarget());
          shipState.current.timer = Math.random() * 15 + 10;
        }
        break;
    }

    if (shipState.current.state !== 'LANDED') {
      const speed = shipState.current.state === 'DESCENDING' ? FLIGHT_SPEED * 0.7 : FLIGHT_SPEED;
      const direction = targetPos.clone().sub(currentPos).normalize();
      currentPos.add(direction.multiplyScalar(delta * speed));
      
      tempLookAtObject.position.copy(currentPos);
      tempLookAtObject.lookAt(targetPos);
      tempQuaternion.copy(tempLookAtObject.quaternion);
      groupRef.current.quaternion.slerp(tempQuaternion, delta * TURN_SPEED);
    } else {
        const bobble = Math.sin(clock.getElapsedTime() * 2) * 0.05;
        groupRef.current.position.y = targetPos.y + bobble;
    }
  });

  const isLanded = shipState.current.state === 'LANDED';

  return (
    <group ref={groupRef} scale={scale} dispose={null} visible={false}>
      <primitive object={clonedScene} />
      <Suspense fallback={null}>
          <ThrustTrail {...trailConfig} opacity={isLanded ? 0 : (trailConfig?.opacity ?? 0.5)} position={trailOffset} />
      </Suspense>
    </group>
  );
};


export const FlyingShips: React.FC = React.memo(() => {
  const ships = useMemo(() => [
    // Ukuran diperkecil setengahnya
    { id: 'space_1', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.45, trailConfig: { color: '#00aaff', width: 0.5, length: 8, opacity: 0.7 }, trailOffset: [0, -0.2, -4.0] as [number, number, number], initialDelay: 0 },
    { id: 'space_2', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.47, trailConfig: { color: '#00ccff', width: 0.5, length: 8, opacity: 0.7 }, trailOffset: [0, -0.2, -4.0] as [number, number, number], initialDelay: 5 },
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.6, trailConfig: { color: '#ffaa00', width: 0.4, length: 7, opacity: 0.8 }, trailOffset: [0, 0.2, -3.5] as [number, number, number], initialDelay: 2 },
    { id: 'delorean_2', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.55, trailConfig: { color: '#ffcc00', width: 0.4, length: 7, opacity: 0.8 }, trailOffset: [0, 0.2, -3.5] as [number, number, number], initialDelay: 7 },
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.05, trailConfig: { color: '#00ffaa', width: 0.15, length: 5, opacity: 0.6 }, trailOffset: [0, -0.1, -1.5] as [number, number, number], initialDelay: 4 },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.055, trailConfig: { color: '#55ffcc', width: 0.15, length: 5, opacity: 0.6 }, trailOffset: [0, -0.1, -1.5] as [number, number, number], initialDelay: 9 },
  ], []);

  return (
    <Suspense fallback={null}>
      {ships.map((ship) => (
        <Ship key={ship.id} modelUrl={ship.url} scale={ship.scale} trailConfig={ship.trailConfig} trailOffset={ship.trailOffset} initialDelay={ship.initialDelay} />
      ))}
    </Suspense>
  );
});

// Preload all ship models
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);