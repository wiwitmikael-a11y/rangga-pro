import React, { useMemo, useRef, Suspense, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { portfolioData } from '../../constants';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

const FLIGHT_AREA_SIZE = 240;
const FLIGHT_ALTITUDE_MIN = 45;
const FLIGHT_ALTITUDE_MAX = 60;
const FLIGHT_SPEED = 12;
const TURN_SPEED = 1.5;

const CITY_CENTER_SPAWN = new THREE.Vector3(0, 25, 0);
const BREAKOUT_RADIUS = 60;

const ROOFTOP_LANDING_SPOTS: THREE.Vector3[] = [
  new THREE.Vector3(15, 28, -20),
  new THREE.Vector3(-30, 35, 10),
  new THREE.Vector3(5, 22, 45),
  new THREE.Vector3(40, 18, 30),
  new THREE.Vector3(-25, 25, -35),
  new THREE.Vector3(0, 42, 0),
];

const TERRAIN_LANDING_SPOTS: THREE.Vector3[] = [
    new THREE.Vector3(70, -5.0, -50),
    new THREE.Vector3(-75, -5.0, -30),
    new THREE.Vector3(20, -5.0, -80),
    new THREE.Vector3(-30, -5.0, 80),
    new THREE.Vector3(0, -5.0, 0),
    new THREE.Vector3(100, -5.0, 100),
    new THREE.Vector3(-100, -5.0, -100),
    new THREE.Vector3(100, -5.0, -100),
    new THREE.Vector3(-100, -5.0, 100),
];

const DISTRICT_LANDING_SPOTS: THREE.Vector3[] = portfolioData
    .filter(d => d.type === 'major')
    .map(d => new THREE.Vector3(d.position[0], -5.0, d.position[2]));

const ALL_LANDING_SPOTS = [...ROOFTOP_LANDING_SPOTS, ...TERRAIN_LANDING_SPOTS, ...DISTRICT_LANDING_SPOTS];

type ShipState = 'INITIAL_EMERGE' | 'FLYING' | 'DESCENDING' | 'LANDED' | 'ASCENDING';

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
  shipIndex: number;
  totalShips: number;
}

const Ship = forwardRef<THREE.Group, ShipProps>(({ url, scale, initialDelay, isPaused, shipIndex, totalShips }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const { invalidate } = useThree();
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const shipState = useRef({
    state: 'INITIAL_EMERGE' as ShipState,
    targetPosition: new THREE.Vector3(),
    finalLandingPosition: new THREE.Vector3().set(0, -1000, 0),
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
    invalidate(); // Keep rendering frames for ship animation
    
    if (!shipState.current.isInitialized && clock.elapsedTime > initialDelay) {
        groupRef.current.position.copy(CITY_CENTER_SPAWN);
        
        const angle = (shipIndex / totalShips) * Math.PI * 2;
        const breakoutTarget = new THREE.Vector3(
            Math.cos(angle) * BREAKOUT_RADIUS,
            FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
            Math.sin(angle) * BREAKOUT_RADIUS
        );
        shipState.current.targetPosition.copy(breakoutTarget);
        
        groupRef.current.lookAt(breakoutTarget);
        shipState.current.isInitialized = true;
        groupRef.current.visible = true;
    }

    if (!shipState.current.isInitialized) return;

    shipState.current.timer -= delta;
    const currentPos = groupRef.current.position;
    const targetPos = shipState.current.targetPosition;

    switch (shipState.current.state) {
      case 'INITIAL_EMERGE':
        if (currentPos.distanceTo(targetPos) < 5) {
            shipState.current.state = 'FLYING';
            shipState.current.targetPosition.copy(getNewFlightTarget());
            shipState.current.timer = Math.random() * 15 + 10;
        }
        break;
      
      case 'FLYING':
        if (currentPos.distanceTo(targetPos) < 5 || shipState.current.timer <= 0) {
          if (Math.random() < 0.5) {
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
        if (currentPos.distanceTo(targetPos) < 2) {
          shipState.current.targetPosition.copy(shipState.current.finalLandingPosition);
        }
        if (currentPos.distanceTo(shipState.current.finalLandingPosition) < 0.5) {
          shipState.current.state = 'LANDED';
          shipState.current.timer = Math.random() * 8 + 5;
          groupRef.current.position.copy(shipState.current.finalLandingPosition);
        }
        break;

      case 'LANDED':
        if (shipState.current.timer <= 0) {
          shipState.current.state = 'ASCENDING';
          shipState.current.targetPosition.set(currentPos.x, FLIGHT_ALTITUDE_MIN + 10, currentPos.z);
        } else {
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
          lookAtTarget.y = currentPos.y;
      }

      tempLookAtObject.position.copy(currentPos);
      tempLookAtObject.lookAt(lookAtTarget);
      
      const pitchAngle = THREE.MathUtils.clamp(direction.y * 0.4, -0.5, 0.5);
      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchAngle);

      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
      const side = direction.clone().cross(forward);
      const bankAngle = THREE.MathUtils.clamp(side.y * -2.5, -0.6, 0.6);
      const bankQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), bankAngle);
      
      tempQuaternion.copy(tempLookAtObject.quaternion);
      tempQuaternion.multiply(pitchQuat);
      tempQuaternion.multiply(bankQuat);

      groupRef.current.quaternion.slerp(tempQuaternion, delta * TURN_SPEED);
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
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.6, initialDelay: 0.2, shipType: 'transport' },
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.05, initialDelay: 0.4, shipType: 'copter' },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.055, initialDelay: 0.9, shipType: 'copter' },
];

interface FlyingShipsProps {
  setShipRefs: (refs: React.RefObject<THREE.Group>[]) => void;
  isPaused?: boolean;
}

export const FlyingShips: React.FC<FlyingShipsProps> = React.memo(({ setShipRefs, isPaused }) => {
  const localShipRefs = useMemo(() => 
    Array.from({ length: shipsData.length }, () => React.createRef<THREE.Group>()), 
    []
  );
  
  useEffect(() => {
    setShipRefs(localShipRefs);
  }, [localShipRefs, setShipRefs]);

  return (
    <Suspense fallback={null}>
      {shipsData.map((ship, i) => (
        <Ship 
          ref={localShipRefs[i]} 
          key={ship.id} 
          {...ship} 
          isPaused={isPaused}
          shipIndex={i}
          totalShips={shipsData.length}
        />
      ))}
    </Suspense>
  );
});

useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);
