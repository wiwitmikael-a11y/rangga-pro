import React, { useMemo, useRef, Suspense, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

const CITY_RADIUS = 85;
const FLIGHT_ALTITUDE_MIN = 20;
const FLIGHT_ALTITUDE_MAX = 40;
const FLIGHT_SPEED = 12;
const TURN_SPEED = 1.5;

const ROOFTOP_LANDING_SPOTS: THREE.Vector3[] = [
  new THREE.Vector3(15, 28, -20),
  new THREE.Vector3(-30, 35, 10),
  new THREE.Vector3(5, 22, 45),
  new THREE.Vector3(40, 18, 30),
  new THREE.Vector3(-25, 25, -35),
  new THREE.Vector3(0, 42, 0),
];

const TERRAIN_LANDING_SPOTS: THREE.Vector3[] = [
    new THREE.Vector3(70, -3.5, -50),
    new THREE.Vector3(-75, -3.5, -30),
    new THREE.Vector3(20, -3.5, -80),
    new THREE.Vector3(-30, -3.5, 80),
    new THREE.Vector3(0, -3.5, 0),
];

type ShipState = 'FLYING' | 'DESCENDING' | 'LANDED' | 'ASCENDING';

interface ShipProps {
  modelUrl: string;
  scale: number;
  initialDelay: number;
}

const Ship = forwardRef<THREE.Group, ShipProps>(({ modelUrl, scale, initialDelay }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

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
          if (Math.random() < 0.4) {
            shipState.current.state = 'DESCENDING';
            const landingZones = Math.random() < 0.7 ? ROOFTOP_LANDING_SPOTS : TERRAIN_LANDING_SPOTS;
            const targetZone = landingZones[Math.floor(Math.random() * landingZones.length)];
            const landingOffset = new THREE.Vector3((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);
            const finalLandingTarget = targetZone.clone().add(landingOffset);
            const hoverPosition = finalLandingTarget.clone();
            hoverPosition.y = Math.max(hoverPosition.y, FLIGHT_ALTITUDE_MIN) + 15;
            shipState.current.targetPosition.copy(hoverPosition);
          } else {
            shipState.current.targetPosition.copy(getNewFlightTarget());
            shipState.current.timer = Math.random() * 15 + 10;
          }
        }
        break;

      case 'DESCENDING':
        if (currentPos.distanceTo(targetPos) < 2) {
            const landingZones = ROOFTOP_LANDING_SPOTS.concat(TERRAIN_LANDING_SPOTS);
            const targetZone = landingZones.find(p => p.x.toFixed(0) === targetPos.x.toFixed(0) && p.z.toFixed(0) === targetPos.z.toFixed(0)) || targetPos;
            const finalTarget = targetZone.clone();
            if (currentPos.y > finalTarget.y + 1) {
                shipState.current.targetPosition.y = finalTarget.y;
            } else {
                shipState.current.state = 'LANDED';
                shipState.current.timer = Math.random() * 8 + 5;
            }
        }
        if (Math.abs(currentPos.y - targetPos.y) < 0.5 && currentPos.distanceTo(new THREE.Vector3(targetPos.x, currentPos.y, targetPos.z)) < 1) {
            shipState.current.state = 'LANDED';
            shipState.current.timer = Math.random() * 8 + 5;
        }
        break;

      case 'LANDED':
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING';
          shipState.current.targetPosition.set(currentPos.x, FLIGHT_ALTITUDE_MIN + 10, currentPos.z);
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
      const speed = shipState.current.state === 'DESCENDING' ? FLIGHT_SPEED * 0.5 : FLIGHT_SPEED;
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

  return (
    <group ref={groupRef} scale={scale} dispose={null} visible={false}>
      <primitive object={clonedScene} />
    </group>
  );
});


interface FlyingShipsProps {
  setShipRefs: (refs: React.RefObject<THREE.Group>[]) => void;
}

export const FlyingShips: React.FC<FlyingShipsProps> = React.memo(({ setShipRefs }) => {
  const ships = useMemo(() => [
    { id: 'space_1', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.45, initialDelay: 0 },
    { id: 'space_2', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.47, initialDelay: 5 },
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.6, initialDelay: 2 },
    { id: 'delorean_2', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.55, initialDelay: 7 },
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.05, initialDelay: 4 },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.055, initialDelay: 9 },
  ], []);

  const shipRefs = useMemo(() => 
    Array.from({ length: ships.length }, () => React.createRef<THREE.Group>()), 
    [ships.length]
  );
  
  useEffect(() => {
    // Pass the entire array of refs up to the parent component.
    setShipRefs(shipRefs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={null}>
      {ships.map((ship, i) => (
        <Ship ref={shipRefs[i]} key={ship.id} modelUrl={ship.url} scale={ship.scale} initialDelay={ship.initialDelay} />
      ))}
    </Suspense>
  );
});

useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);