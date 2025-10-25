import React, { useMemo, useRef, Suspense, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { portfolioData } from '../../constants';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

const FLIGHT_AREA_SIZE = 240; // Use a square area for better corner coverage
const FLIGHT_ALTITUDE_MIN = 45; // Raised to avoid all buildings
const FLIGHT_ALTITUDE_MAX = 60;
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
    new THREE.Vector3(100, -3.5, 100), // Add corner spots
    new THREE.Vector3(-100, -3.5, -100),
    new THREE.Vector3(100, -3.5, -100),
    new THREE.Vector3(-100, -3.5, 100),
];

// Create landing spots from major districts, normalizing their Y-position to ground level.
const DISTRICT_LANDING_SPOTS: THREE.Vector3[] = portfolioData
    .filter(d => d.type === 'major')
    .map(d => new THREE.Vector3(d.position[0], -3.5, d.position[2]));

// Combine all possible landing spots into one comprehensive list.
const ALL_LANDING_SPOTS = [...ROOFTOP_LANDING_SPOTS, ...TERRAIN_LANDING_SPOTS, ...DISTRICT_LANDING_SPOTS];

type ShipState = 'FLYING' | 'DESCENDING' | 'LANDED' | 'ASCENDING';

interface ShipProps {
  modelUrl: string;
  scale: number;
  initialDelay: number;
  isPaused?: boolean;
}

const Ship = forwardRef<THREE.Group, ShipProps>(({ modelUrl, scale, initialDelay, isPaused }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const shipState = useRef({
    state: 'FLYING' as ShipState,
    targetPosition: new THREE.Vector3(),
    finalLandingPosition: new THREE.Vector3().set(0, -1000, 0), // Initialized out of bounds
    timer: Math.random() * 10 + 5,
    isInitialized: false,
  });
  
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempLookAtObject = useMemo(() => new THREE.Object3D(), []);

  const getNewFlightTarget = () => {
    return new THREE.Vector3(
      (Math.random() - 0.5) * FLIGHT_AREA_SIZE,
      FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
      (Math.random() - 0.5) * FLIGHT_AREA_SIZE
    );
  };
  
  useFrame(({ clock }, delta) => {
    if (!groupRef.current || isPaused) return;
    
    if (!shipState.current.isInitialized && clock.elapsedTime > initialDelay) {
        const initialPos = getNewFlightTarget();
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
          if (Math.random() < 0.5) { // Increased chance to land and visit a spot
            shipState.current.state = 'DESCENDING';
            const targetZone = ALL_LANDING_SPOTS[Math.floor(Math.random() * ALL_LANDING_SPOTS.length)];
            const landingOffset = new THREE.Vector3((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);
            
            shipState.current.finalLandingPosition.copy(targetZone.clone().add(landingOffset));
            
            const hoverPosition = shipState.current.finalLandingPosition.clone();
            hoverPosition.y = FLIGHT_ALTITUDE_MIN + 15;
            shipState.current.targetPosition.copy(hoverPosition);
          } else {
            shipState.current.targetPosition.copy(getNewFlightTarget());
            shipState.current.timer = Math.random() * 15 + 10;
            shipState.current.finalLandingPosition.set(0, -1000, 0);
          }
        }
        break;

      case 'DESCENDING':
        // The target is initially the hover position.
        if (currentPos.distanceTo(targetPos) < 2) {
          // Once we reach the hover spot, change the target to the final ground spot to initiate vertical descent.
          shipState.current.targetPosition.copy(shipState.current.finalLandingPosition);
        }
        // This check now becomes the primary landing trigger.
        if (currentPos.distanceTo(shipState.current.finalLandingPosition) < 0.5) {
          shipState.current.state = 'LANDED';
          shipState.current.timer = Math.random() * 8 + 5;
          groupRef.current.position.copy(shipState.current.finalLandingPosition); // Snap to ground
        }
        break;

      case 'LANDED':
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING';
          shipState.current.targetPosition.set(currentPos.x, FLIGHT_ALTITUDE_MIN + 10, currentPos.z);
        } else {
          // Bobble while landed
          const bobble = Math.sin(clock.getElapsedTime() * 2) * 0.05;
          groupRef.current.position.y = shipState.current.finalLandingPosition.y + bobble;
        }
        break;

      case 'ASCENDING':
        if (currentPos.distanceTo(targetPos) < 1) {
          shipState.current.state = 'FLYING';
          shipState.current.targetPosition.copy(getNewFlightTarget());
          shipState.current.timer = Math.random() * 15 + 10;
          shipState.current.finalLandingPosition.set(0, -1000, 0); 
        }
        break;
    }

    if (shipState.current.state !== 'LANDED') {
      const speed = shipState.current.state === 'DESCENDING' ? FLIGHT_SPEED * 0.5 : FLIGHT_SPEED;
      const direction = targetPos.clone().sub(currentPos).normalize();
      currentPos.add(direction.multiplyScalar(delta * speed));
      
      const lookAtTarget = targetPos.clone();
      if (shipState.current.state === 'ASCENDING' || shipState.current.state === 'DESCENDING') {
          // Keep the ship level during vertical movement
          lookAtTarget.y = currentPos.y;
      }

      tempLookAtObject.position.copy(currentPos);
      tempLookAtObject.lookAt(lookAtTarget);
      tempQuaternion.copy(tempLookAtObject.quaternion);
      groupRef.current.quaternion.slerp(tempQuaternion, delta * TURN_SPEED);
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
  isPaused?: boolean;
}

export const FlyingShips: React.FC<FlyingShipsProps> = React.memo(({ setShipRefs, isPaused }) => {
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
        <Ship ref={shipRefs[i]} key={ship.id} modelUrl={ship.url} scale={ship.scale} initialDelay={ship.initialDelay} isPaused={isPaused} />
      ))}
    </Suspense>
  );
});

useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);