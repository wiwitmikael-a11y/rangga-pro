import React, { useMemo, useRef, Suspense, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { portfolioData, FLIGHT_AREA_SIZE } from '../../constants';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

const FLIGHT_ALTITUDE_MIN = 45;
const FLIGHT_ALTITUDE_MAX = 60;
const FLIGHT_SPEED = 12;
const VTOL_SPEED = 8; // Kecepatan untuk pergerakan vertikal
const TURN_SPEED = 1.5;

// Tentukan beberapa titik pendaratan spesifik di tengah kota untuk spawn awal
const CITY_CENTER_SPAWN_SPOTS: THREE.Vector3[] = [
  new THREE.Vector3(15, 28, -20),
  new THREE.Vector3(-30, 35, 10),
  new THREE.Vector3(5, 22, 45),
  new THREE.Vector3(0, 42, 0), // Nexus Core
  ...portfolioData.filter(d => d.type === 'major').map(d => new THREE.Vector3(d.position[0], -5.0, d.position[2]))
];

// Gabungkan semua kemungkinan titik pendaratan untuk patroli normal
const ALL_LANDING_SPOTS = [
  ...CITY_CENTER_SPAWN_SPOTS,
  new THREE.Vector3(70, -5.0, -50),
  new THREE.Vector3(-75, -5.0, -30),
  new THREE.Vector3(20, -5.0, -80),
  new THREE.Vector3(-30, -5.0, 80),
  new THREE.Vector3(100, -5.0, 100),
  new THREE.Vector3(-100, -5.0, -100),
  new THREE.Vector3(100, -5.0, -100),
  new THREE.Vector3(-100, -5.0, 100),
  new THREE.Vector3(40, 18, 30),
  new THREE.Vector3(-25, 25, -35),
];

// State machine yang lebih detail untuk VTOL
type ShipState = 'SPAWNING' | 'ASCENDING_TAKEOFF' | 'FLYING_TO_TARGET' | 'DESCENDING_LANDING' | 'LANDED';

export type ShipType = 'transport' | 'fighter' | 'copter';

export interface ShipData {
    id: string;
    url: string;
    scale: number;
    initialDelay: number;
    shipType: ShipType;
}

interface ShipProps extends ShipData {
  isPaused?: boolean;
}

const Ship = forwardRef<THREE.Group, ShipProps>(({ url, scale, initialDelay, isPaused }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const shipState = useRef({
    state: 'SPAWNING' as ShipState,
    targetPosition: new THREE.Vector3(), // Target pergerakan saat ini
    finalLandingPosition: new THREE.Vector3(), // Titik pendaratan akhir
    timer: 3 + initialDelay, // Waktu tunggu awal saat spawn
    isInitialized: false,
  });
  
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempLookAtObject = useMemo(() => new THREE.Object3D(), []);

  const getNewLandingTarget = () => {
    return ALL_LANDING_SPOTS[Math.floor(Math.random() * ALL_LANDING_SPOTS.length)];
  };
  
  useFrame((_, delta) => {
    if (!groupRef.current || isPaused) return;
    
    if (!shipState.current.isInitialized) {
        // Tentukan posisi spawn awal di pusat kota
        const startPos = CITY_CENTER_SPAWN_SPOTS[Math.floor(Math.random() * CITY_CENTER_SPAWN_SPOTS.length)];
        groupRef.current.position.copy(startPos);
        shipState.current.finalLandingPosition.copy(startPos); // Simpan posisi pendaratan
        shipState.current.isInitialized = true;
        groupRef.current.visible = true;
    }

    shipState.current.timer -= delta;
    const currentPos = groupRef.current.position;
    const targetPos = shipState.current.targetPosition;

    switch (shipState.current.state) {
      case 'SPAWNING':
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING_TAKEOFF';
          const takeoffAltitude = currentPos.y + FLIGHT_ALTITUDE_MIN + Math.random() * 10;
          shipState.current.targetPosition.set(currentPos.x, takeoffAltitude, currentPos.z);
        }
        break;

      case 'ASCENDING_TAKEOFF':
        if (currentPos.distanceTo(targetPos) < 1) {
          shipState.current.state = 'FLYING_TO_TARGET';
          // Tentukan tujuan pendaratan berikutnya
          const nextLandingSpot = getNewLandingTarget();
          shipState.current.finalLandingPosition.copy(nextLandingSpot);
          // Target terbang adalah titik di atas landasan
          const hoverPosition = nextLandingSpot.clone();
          hoverPosition.y = FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN);
          shipState.current.targetPosition.copy(hoverPosition);
        }
        break;

      case 'FLYING_TO_TARGET':
        const boundary = FLIGHT_AREA_SIZE / 2;
        const isOutOfBounds = Math.abs(currentPos.x) > boundary || Math.abs(currentPos.z) > boundary;

        if (isOutOfBounds) {
            // Logika geofencing yang tegas: paksa kembali ke tengah
            const returnTarget = new THREE.Vector3(0, targetPos.y, 0);
            shipState.current.targetPosition.copy(returnTarget);
        } else if (currentPos.distanceTo(targetPos) < 10) {
            // Cukup dekat dengan titik hover, mulai pendaratan
            shipState.current.state = 'DESCENDING_LANDING';
            // Target sekarang adalah titik pendaratan di darat
            shipState.current.targetPosition.copy(shipState.current.finalLandingPosition);
        }
        break;

      case 'DESCENDING_LANDING':
        if (currentPos.distanceTo(targetPos) < 0.5) {
          shipState.current.state = 'LANDED';
          shipState.current.timer = Math.random() * 8 + 5; // Waktu "bongkar muat"
          groupRef.current.position.copy(shipState.current.finalLandingPosition); // Snap ke posisi akhir
        }
        break;

      case 'LANDED':
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING_TAKEOFF'; // Mulai siklus baru
          const takeoffAltitude = currentPos.y + FLIGHT_ALTITUDE_MIN + Math.random() * 10;
          shipState.current.targetPosition.set(currentPos.x, takeoffAltitude, currentPos.z);
        }
        break;
    }

    // --- LOGIKA PERGERAKAN & ROTASI ---
    if (shipState.current.state !== 'LANDED' && shipState.current.state !== 'SPAWNING') {
        let speed = FLIGHT_SPEED;
        let lookAtTarget = targetPos.clone();

        if (shipState.current.state === 'ASCENDING_TAKEOFF' || shipState.current.state === 'DESCENDING_LANDING') {
            speed = VTOL_SPEED;
            // Saat bergerak vertikal, jangan lihat lurus ke atas/bawah.
            // Lihat ke arah posisi horizontal target pendaratan berikutnya untuk transisi yang mulus.
            lookAtTarget = shipState.current.finalLandingPosition.clone();
            lookAtTarget.y = currentPos.y; // Jaga agar tetap horizontal
        }

        const direction = targetPos.clone().sub(currentPos).normalize();
        currentPos.add(direction.multiplyScalar(delta * speed));
      
        if (currentPos.distanceTo(lookAtTarget) > 0.1) {
            tempLookAtObject.position.copy(currentPos);
            tempLookAtObject.lookAt(lookAtTarget);
            tempQuaternion.copy(tempLookAtObject.quaternion);
            groupRef.current.quaternion.slerp(tempQuaternion, delta * TURN_SPEED);
        }
    }
  });

  return (
    <group ref={groupRef} scale={scale} dispose={null} visible={false}>
      <primitive object={clonedScene} />
    </group>
  );
});


export const shipsData: ShipData[] = [
    { id: 'space_1', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.45, initialDelay: 0, shipType: 'fighter' },
    { id: 'space_2', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.47, initialDelay: 5, shipType: 'fighter' },
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.6, initialDelay: 2, shipType: 'transport' },
    { id: 'delorean_2', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.55, initialDelay: 7, shipType: 'transport' },
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.05, initialDelay: 4, shipType: 'copter' },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.055, initialDelay: 9, shipType: 'copter' },
];

interface FlyingShipsProps {
  setShipRefs: (refs: React.RefObject<THREE.Group>[]) => void;
  isPaused?: boolean;
}

export const FlyingShips: React.FC<FlyingShipsProps> = React.memo(({ setShipRefs, isPaused }) => {
  
  const shipRefs = useMemo(() => 
    Array.from({ length: shipsData.length }, () => React.createRef<THREE.Group>()), 
    []
  );
  
  useEffect(() => {
    setShipRefs(shipRefs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={null}>
      {shipsData.map((ship, i) => (
        <Ship ref={shipRefs[i]} key={ship.id} {...ship} isPaused={isPaused} />
      ))}
    </Suspense>
  );
});

useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);