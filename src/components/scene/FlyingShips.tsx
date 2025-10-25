import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react--three/fiber';
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

// Titik pendaratan yang telah ditentukan di dalam kota
const LANDING_SPOTS: THREE.Vector3[] = [
  new THREE.Vector3(30, -2, 40),
  new THREE.Vector3(-25, -2, 50),
  new THREE.Vector3(50, -1, -30),
  new THREE.Vector3(-40, 0, -60),
  new THREE.Vector3(0, -1, -55),
  new THREE.Vector3(60, -2, 10),
  new THREE.Vector3(-55, -1, 15),
  new THREE.Vector3(10, 0, 70),
];

type ShipState = 'FLYING' | 'DESCENDING' | 'LANDED' | 'ASCENDING';

interface ShipProps {
  modelUrl: string;
  scale: number;
  trailConfig?: { width?: number; length?: number; opacity?: number; color?: string };
  trailOffset?: [number, number, number];
  initialDelay: number; // Tambahkan delay agar tidak semua kapal start bersamaan
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

  // Fungsi untuk mendapatkan target terbang baru yang lebih "bertujuan"
  const getNewFlightTarget = (currentPosition: THREE.Vector3) => {
    const shouldTravelToSpot = Math.random() < 0.6; // 60% kemungkinan terbang ke landing spot lain

    if (shouldTravelToSpot) {
      // Pilih landing spot yang berbeda dari yang terdekat
      const sortedSpots = [...LANDING_SPOTS].sort((a, b) => a.distanceTo(currentPosition) - b.distanceTo(currentPosition));
      const targetSpot = sortedSpots[Math.floor(Math.random() * (sortedSpots.length - 1)) + 1]; // Hindari spot terdekat
      // Targetnya bukan di spot itu, tapi di atasnya
      return new THREE.Vector3(targetSpot.x, FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN), targetSpot.z);
    } else {
      // 40% kemungkinan terbang ke titik patroli acak
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * CITY_RADIUS;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
        Math.sin(angle) * radius
      );
    }
  };
  
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    
    // Inisialisasi posisi setelah delay
    if (!shipState.current.isInitialized && clock.elapsedTime > initialDelay) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * CITY_RADIUS;
        const initialPos = new THREE.Vector3(
          Math.cos(angle) * radius,
          FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
          Math.sin(angle) * radius
        );
        groupRef.current.position.copy(initialPos);
        shipState.current.targetPosition.copy(getNewFlightTarget(initialPos));
        shipState.current.isInitialized = true;
        groupRef.current.visible = true; // Jadikan terlihat setelah inisialisasi
    }

    if (!shipState.current.isInitialized) return;


    shipState.current.timer -= delta;
    const currentPos = groupRef.current.position;
    const targetPos = shipState.current.targetPosition;

    // --- State Machine Logic ---
    switch (shipState.current.state) {
      case 'FLYING':
        if (currentPos.distanceTo(targetPos) < 8 || shipState.current.timer <= 0) {
          // 25% kemungkinan akan mencoba mendarat setelah timer habis
          if (shipState.current.timer <= 0 && Math.random() < 0.25) {
            shipState.current.state = 'DESCENDING';
            const closestSpot = [...LANDING_SPOTS].sort((a, b) => a.distanceTo(currentPos) - b.distanceTo(currentPos))[0];
            shipState.current.targetPosition.copy(closestSpot);
          } else {
            shipState.current.targetPosition.copy(getNewFlightTarget(currentPos));
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
          shipState.current.targetPosition.copy(getNewFlightTarget(currentPos));
          shipState.current.timer = Math.random() * 15 + 10;
        }
        break;
    }

    // --- Movement and Rotation Logic ---
    if (shipState.current.state !== 'LANDED') {
      const speed = shipState.current.state === 'DESCENDING' ? FLIGHT_SPEED * 0.7 : FLIGHT_SPEED;
      // Pergerakan lerp yang lebih konsisten
      const direction = targetPos.clone().sub(currentPos).normalize();
      currentPos.add(direction.multiplyScalar(delta * speed));
      
      // Rotasi yang lebih mulus
      tempLookAtObject.position.copy(currentPos);
      tempLookAtObject.lookAt(targetPos);
      tempQuaternion.copy(tempLookAtObject.quaternion);
      groupRef.current.quaternion.slerp(tempQuaternion, delta * TURN_SPEED);
    } else {
        // Efek mengambang sedikit saat mendarat
        const bobble = Math.sin(clock.getElapsedTime() * 2) * 0.05;
        groupRef.current.position.y = targetPos.y + bobble;
    }
  });

  const isLanded = shipState.current.state === 'LANDED';

  return (
    <group ref={groupRef} scale={scale} dispose={null} visible={false}>
      <primitive object={clonedScene} />
      <Suspense fallback={null}>
          <ThrustTrail {...trailConfig} position={trailOffset} opacity={isLanded ? 0 : (trailConfig?.opacity ?? 0.5)} />
      </Suspense>
    </group>
  );
};


export const FlyingShips: React.FC = React.memo(() => {
  const ships = useMemo(() => [
    // Kapal 1 & 2 (Space Ship)
    { id: 'space_1', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.9, trailConfig: { color: '#00aaff', width: 0.5, length: 8, opacity: 0.7 }, trailOffset: [0, -0.2, -4.0] as [number, number, number], initialDelay: 0 },
    { id: 'space_2', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.95, trailConfig: { color: '#00ccff', width: 0.5, length: 8, opacity: 0.7 }, trailOffset: [0, -0.2, -4.0] as [number, number, number], initialDelay: 5 },
    // Kapal 3 & 4 (DeLorean)
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 1.2, trailConfig: { color: '#ffaa00', width: 0.4, length: 7, opacity: 0.8 }, trailOffset: [0, 0.2, -3.5] as [number, number, number], initialDelay: 2 },
    { id: 'delorean_2', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 1.1, trailConfig: { color: '#ffcc00', width: 0.4, length: 7, opacity: 0.8 }, trailOffset: [0, 0.2, -3.5] as [number, number, number], initialDelay: 7 },
    // Kapal 5 & 6 (Copter)
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.1, trailConfig: { color: '#00ffaa', width: 0.15, length: 5, opacity: 0.6 }, trailOffset: [0, -0.1, -1.5] as [number, number, number], initialDelay: 4 },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.11, trailConfig: { color: '#55ffcc', width: 0.15, length: 5, opacity: 0.6 }, trailOffset: [0, -0.1, -1.5] as [number, number, number], initialDelay: 9 },
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