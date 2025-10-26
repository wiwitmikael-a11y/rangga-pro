import React, { useMemo, useEffect, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import type { ShipInputState } from '../../types';
import { ThrustTrail } from './ThrustTrail';
import { FLIGHT_AREA_SIZE } from '../../constants';

// Type definitions
export type ShipType = 'fighter' | 'transport' | 'copter';

export interface ShipData {
  id: string;
  type: ShipType;
  modelUrl: string;
  scale: number;
  initialPosition: [number, number, number];
}

// Data for all ships in the scene
export const shipsData: ShipData[] = [
  {
    id: 'ship-01',
    type: 'fighter',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/FighterShip.glb',
    scale: 1,
    initialPosition: [-50, 25, -30],
  },
  {
    id: 'ship-02',
    type: 'transport',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/TransportShip.glb',
    scale: 2,
    initialPosition: [60, 30, 0],
  },
  {
    id: 'ship-03',
    type: 'copter',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/CopterShip.glb',
    scale: 1.5,
    initialPosition: [0, 40, 70],
  },
  {
    id: 'ship-04',
    type: 'fighter',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/FighterShip.glb',
    scale: 1,
    initialPosition: [20, 20, -60],
  },
];

const noise3D = createNoise3D();
const MAX_SPEED = 20;
const TURN_SPEED = 1.5;
const ROLL_SPEED = 1.8;

interface ShipProps {
  data: ShipData;
  isPaused?: boolean;
  isControlled: boolean;
  inputs: ShipInputState;
}

const Ship = forwardRef<THREE.Group, ShipProps>(({ data, isPaused, isControlled, inputs }, ref) => {
  const { scene } = useGLTF(data.modelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const velocity = useMemo(() => new THREE.Vector3(), []);
  const acceleration = useMemo(() => new THREE.Vector3(), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const steering = useMemo(() => new THREE.Vector3(), []);
  const previousPosition = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
        ref.current.userData.shipType = data.type;
        ref.current.position.set(...data.initialPosition);
        previousPosition.copy(ref.current.position);
    }
  }, [data, ref, previousPosition]);

  useFrame(({ clock }, delta) => {
    if (!ref || !('current' in ref) || !ref.current || isPaused) return;

    const ship = ref.current;
    
    if (isControlled) {
      // Manual arcade-style flight controls
      const turnRate = TURN_SPEED * delta;
      const rollRate = ROLL_SPEED * delta;

      // Apply rotations based on input
      if (Math.abs(inputs.turn) > 0.1) ship.rotateY(-inputs.turn * turnRate);
      if (Math.abs(inputs.roll) > 0.1) ship.rotateZ(-inputs.roll * rollRate);
      
      // Auto-level roll when not actively rolling
      if (Math.abs(inputs.roll) < 0.1) {
        const euler = new THREE.Euler().setFromQuaternion(ship.quaternion, 'YXZ');
        euler.z = THREE.MathUtils.lerp(euler.z, 0, delta * 2.0);
        ship.quaternion.setFromEuler(euler);
      }

      // Apply forward movement based on ship's direction
      const forwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(ship.quaternion);
      ship.position.addScaledVector(forwardVector, inputs.forward * MAX_SPEED * delta);
      
      // Apply vertical movement
      ship.position.y += inputs.ascend * MAX_SPEED * 0.75 * delta;

    } else {
      // AI patrolling logic using simplex noise
      const elapsedTime = clock.getElapsedTime() + data.id.charCodeAt(5);
      const movementSpeed = 0.1;

      const time = elapsedTime * movementSpeed;
      const range = FLIGHT_AREA_SIZE / 2;
      
      targetPosition.x = noise3D(time, 0, 0) * range;
      targetPosition.z = noise3D(0, time, 0) * range;
      targetPosition.y = 20 + (noise3D(0, 0, time) + 1) / 2 * 30;

      steering.subVectors(targetPosition, ship.position).normalize().multiplyScalar(MAX_SPEED * 0.5);
      acceleration.subVectors(steering, velocity);
      velocity.add(acceleration.multiplyScalar(delta));
      
      if (velocity.length() > MAX_SPEED) velocity.normalize().multiplyScalar(MAX_SPEED);
      
      previousPosition.copy(ship.position);
      ship.position.add(velocity.clone().multiplyScalar(delta));
      
      if (previousPosition.distanceTo(ship.position) > 0.01) {
         const tempObject = new THREE.Object3D();
         tempObject.position.copy(ship.position);
         tempObject.lookAt(ship.position.clone().add(velocity));
         ship.quaternion.slerp(tempObject.quaternion, 0.05);
      }
    }
    
    // Boundary checks to keep ships within a spherical flight area
    const boundary = FLIGHT_AREA_SIZE;
    if (ship.position.length() > boundary) {
        ship.position.negate();
    }
  });

  return (
    <group ref={ref}>
      <primitive object={clonedScene} scale={data.scale} />
      <ThrustTrail opacity={isControlled ? Math.max(0, inputs.forward) * 0.8 : 0.5} />
    </group>
  );
});

Ship.displayName = 'Ship';

interface FlyingShipsProps {
  setShipRefs: React.Dispatch<React.SetStateAction<React.RefObject<THREE.Group>[]>>;
  isPaused?: boolean;
  controlledShipId: string | null;
  shipInputs: ShipInputState;
}

export const FlyingShips: React.FC<FlyingShipsProps> = ({ setShipRefs, isPaused, controlledShipId, shipInputs }) => {
  const shipRefs = useMemo(() =>
    Array(shipsData.length).fill(0).map(() => React.createRef<THREE.Group>()),
    []
  );

  useEffect(() => {
    setShipRefs(shipRefs);
  }, [shipRefs, setShipRefs]);

  return (
    <group>
      {shipsData.map((data, i) => (
        <Ship 
          key={data.id} 
          ref={shipRefs[i]}
          data={data}
          isPaused={isPaused}
          isControlled={controlledShipId === data.id}
          inputs={shipInputs}
        />
      ))}
    </group>
  );
};

// Preload models for faster startup
shipsData.forEach(ship => useGLTF.preload(ship.modelUrl));
