import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

// --- Konfigurasi Perilaku AI Kapal ---
const CITY_RADIUS = 85; // Batas area terbang kapal
const FLIGHT_ALTITUDE_MIN = 20;
const FLIGHT_ALTITUDE_MAX = 40;
const FLIGHT_SPEED = 12;
const TURN_SPEED = 1.5;

// Titik pendaratan di atap gedung-gedung tertinggi (Helipads)
const ROOFTOP_LANDING_SPOTS: THREE.Vector3[] = [
  new THREE.Vector3(15, 28, -20),   // Atap gedung tinggi di kanan-tengah
  new THREE.Vector3(-30, 35, 10),   // Atap gedung tertinggi di kiri
  new THREE.Vector3(5, 22, 45),    // Atap gedung di depan
  new THREE.Vector3(40, 18, 30),    // Atap gedung lebih rendah di kanan-depan
  new THREE.Vector3(-25, 25, -35),  // Atap gedung di kiri-belakang
  new THREE.Vector3(0, 42, 0),      // Atap gedung pusat (paling tinggi)
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
  initialDelay: number;
}

const Ship: React.FC<ShipProps> = ({ modelUrl, scale, initialDelay }) => {
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
    // Target terbang bebas di udara
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * CITY_RADIUS;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
      Math.sin(angle) * radius
    );
  };
  
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    
    // Inisialisasi posisi setelah delay awal
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
        // Jika sudah dekat dengan target terbang atau timer habis, cari target baru
        if (currentPos.distanceTo(targetPos) < 5 || shipState.current.timer <= 0) {
          // 40% kemungkinan akan mencoba mendarat
          if (Math.random() < 0.4) {
            shipState.current.state = 'DESCENDING';
            // Pilih secara acak antara mendarat di atap atau di tanah
            const landingZones = Math.random() < 0.7 ? ROOFTOP_LANDING_SPOTS : TERRAIN_LANDING_SPOTS;
            const targetZone = landingZones[Math.floor(Math.random() * landingZones.length)];
            
            // Tambahkan offset acak kecil untuk pendaratan yang lebih natural
            const landingOffset = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                0,
                (Math.random() - 0.5) * 5
            );
            const finalLandingTarget = targetZone.clone().add(landingOffset);
            
            // Saat menuju pendaratan, pertama-tama terbang ke posisi di atasnya
            const hoverPosition = finalLandingTarget.clone();
            hoverPosition.y = Math.max(hoverPosition.y, FLIGHT_ALTITUDE_MIN) + 15; // Terbang di atas helipad
            shipState.current.targetPosition.copy(hoverPosition);

          } else {
            // Jika tidak mendarat, cari titik terbang acak baru
            shipState.current.targetPosition.copy(getNewFlightTarget());
            shipState.current.timer = Math.random() * 15 + 10;
          }
        }
        break;

      case 'DESCENDING':
         // Saat tiba di posisi 'hover' di atas helipad, mulai turun
        if (currentPos.distanceTo(targetPos) < 2) {
            // Target sebenarnya adalah di permukaan helipad/tanah
            const landingZones = Math.random() < 0.7 ? ROOFTOP_LANDING_SPOTS : TERRAIN_LANDING_SPOTS;
            const targetZone = landingZones.find(p => p.x === targetPos.x && p.z === targetPos.z) || targetPos;
            const finalTarget = targetZone.clone();
             if (currentPos.y > finalTarget.y + 1) { // Jika masih di atas, lanjutkan turun
                 shipState.current.targetPosition.y = finalTarget.y;
             } else { // Jika sudah sangat dekat, anggap mendarat
                shipState.current.state = 'LANDED';
                shipState.current.timer = Math.random() * 8 + 5;
             }
        }
        // Jika sudah sangat dekat dengan permukaan, anggap mendarat
        if (Math.abs(currentPos.y - targetPos.y) < 0.5 && currentPos.distanceTo(new THREE.Vector3(targetPos.x, currentPos.y, targetPos.z)) < 1) {
            shipState.current.state = 'LANDED';
            shipState.current.timer = Math.random() * 8 + 5;
        }
        break;

      case 'LANDED':
        // Setelah timer habis, mulai lepas landas
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING';
          // Target lepas landas adalah lurus ke atas ke ketinggian jelajah
          shipState.current.targetPosition.set(currentPos.x, FLIGHT_ALTITUDE_MIN + 10, currentPos.z);
        }
        break;

      case 'ASCENDING':
        // Saat mencapai ketinggian jelajah, cari target terbang baru
        if (currentPos.distanceTo(targetPos) < 1) {
          shipState.current.state = 'FLYING';
          shipState.current.targetPosition.copy(getNewFlightTarget());
          shipState.current.timer = Math.random() * 15 + 10;
        }
        break;
    }

    // Logika pergerakan dan rotasi (hanya jika tidak mendarat)
    if (shipState.current.state !== 'LANDED') {
      const speed = shipState.current.state === 'DESCENDING' ? FLIGHT_SPEED * 0.5 : FLIGHT_SPEED;
      const direction = targetPos.clone().sub(currentPos).normalize();
      currentPos.add(direction.multiplyScalar(delta * speed));
      
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

  return (
    <group ref={groupRef} scale={scale} dispose={null} visible={false}>
      <primitive object={clonedScene} />
    </group>
  );
};


export const FlyingShips: React.FC = React.memo(() => {
  const ships = useMemo(() => [
    // Ukuran diperkecil setengahnya
    { id: 'space_1', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.45, initialDelay: 0 },
    { id: 'space_2', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.47, initialDelay: 5 },
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.6, initialDelay: 2 },
    { id: 'delorean_2', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.55, initialDelay: 7 },
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.05, initialDelay: 4 },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.055, initialDelay: 9 },
  ], []);

  return (
    <Suspense fallback={null}>
      {ships.map((ship) => (
        <Ship key={ship.id} modelUrl={ship.url} scale={ship.scale} initialDelay={ship.initialDelay} />
      ))}
    </Suspense>
  );
});

// Preload all ship models
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);