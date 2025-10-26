/// <reference types="@react-three/fiber" />
import React, { useMemo, useRef, Suspense, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { portfolioData, FLIGHT_RADIUS } from '../../constants';
import { ShipInputState } from '../../types';

const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

const FLIGHT_ALTITUDE_MIN = 45; // Raised to avoid all buildings
const FLIGHT_ALTITUDE_MAX = 60;
const FLIGHT_SPEED = 12;
const TURN_SPEED = 1.5;

// --- Physics Constants for Manual Control ---
const ACCELERATION = 20.0;
const MAX_SPEED = 40.0;
const TURN_RATE = 2.0;
const ROLL_RATE = 2.5;
const VERTICAL_SPEED = 10.0;
const DRAG = 0.97;
const CITY_CORE_RADIUS = 60; // Area with dense buildings for collision avoidance
const MIN_CITY_ALTITUDE = 40; // Minimum safe altitude over the city core
const TERRAIN_COLLISION_Y = -3.0; // Y-level for ground collision
const BORDER_PUSHBACK_FORCE = 0.1;
const COLLISION_BOUNCE_FORCE = 0.5;


// --- Recalibrated Landing Zones ---
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
    // More central spots, avoiding far map edges
    new THREE.Vector3(50, -5.0, 50),
    new THREE.Vector3(-60, -5.0, -60),
    new THREE.Vector3(80, -5.0, 20),
    new THREE.Vector3(-20, -5.0, -70),
];

// Create landing spots from major districts, normalizing their Y-position to ground level.
const DISTRICT_LANDING_SPOTS: THREE.Vector3[] = portfolioData
    .filter(d => d.type === 'major')
    .map(d => new THREE.Vector3(d.position[0], -5.0, d.position[2]));

// Combine all possible landing spots into one comprehensive list.
const ALL_LANDING_SPOTS = [...ROOFTOP_LANDING_SPOTS, ...TERRAIN_LANDING_SPOTS, ...DISTRICT_LANDING_SPOTS];

type ShipState = 'FLYING' | 'DESCENDING' | 'LANDED' | 'ASCENDING';

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
  isUnderManualControl?: boolean;
  manualInputs?: ShipInputState;
}

const Ship = forwardRef<THREE.Group, ShipProps>(({ url, scale, initialDelay, isPaused, shipType, isUnderManualControl, manualInputs }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.shipType = shipType;
    }
  }, [shipType]);

  const wasManual = useRef(false);
  const velocity = useRef(new THREE.Vector3());
  
  const shipState = useRef({
    state: 'LANDED' as ShipState,
    targetPosition: new THREE.Vector3(),
    finalLandingPosition: new THREE.Vector3().set(0, -1000, 0), // Initialized out of bounds
    timer: initialDelay, // Use initialDelay for the first wait on the ground
    isInitialized: false,
  });
  
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempLookAtObject = useMemo(() => new THREE.Object3D(), []);

  const getNewFlightTarget = () => {
    // Bias distribution towards the center for more activity over the city
    const radius = Math.sqrt(Math.random()) * FLIGHT_RADIUS;
    const angle = Math.random() * 2 * Math.PI;

    return new THREE.Vector3(
      Math.cos(angle) * radius,
      FLIGHT_ALTITUDE_MIN + Math.random() * (FLIGHT_ALTITUDE_MAX - FLIGHT_ALTITUDE_MIN),
      Math.sin(angle) * radius
    );
  };
  
  useFrame(({ clock }, delta) => {
    if (!groupRef.current || isPaused) return;

    // --- Manual Control Logic ---
    if (isUnderManualControl && manualInputs) {
        const ship = groupRef.current;
        
        // 1. Acceleration
        const forwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(ship.quaternion);
        const acceleration = forwardVector.multiplyScalar(manualInputs.forward * ACCELERATION * delta);
        velocity.current.add(acceleration);

        // 2. Vertical movement (applied directly to position)
        ship.position.y += manualInputs.ascend * VERTICAL_SPEED * delta;
        
        // 3. Drag
        velocity.current.multiplyScalar(DRAG);
        
        // 4. Clamp speed
        if (velocity.current.length() > MAX_SPEED) {
            velocity.current.normalize().multiplyScalar(MAX_SPEED);
        }

        // 5. Update position based on velocity
        ship.position.add(velocity.current.clone().multiplyScalar(delta));

        // --- NEW: Boundary and Collision Handling for Manual Flight ---
        const pos = ship.position;
        const vel = velocity.current;
        const distanceFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z);

        // A. Map Boundary (Soft Wall)
        if (distanceFromCenter > FLIGHT_RADIUS) {
            const pushbackFactor = (distanceFromCenter - FLIGHT_RADIUS) * BORDER_PUSHBACK_FORCE;
            vel.x -= pos.x / distanceFromCenter * pushbackFactor;
            vel.z -= pos.z / distanceFromCenter * pushbackFactor;
            // Also clamp position to prevent extreme overshoot
            pos.x = (pos.x / distanceFromCenter) * FLIGHT_RADIUS;
            pos.z = (pos.z / distanceFromCenter) * FLIGHT_RADIUS;
        }

        // B. Terrain Collision (Floor)
        if (pos.y < TERRAIN_COLLISION_Y) {
            pos.y = TERRAIN_COLLISION_Y;
            if (vel.y < 0) vel.y *= -COLLISION_BOUNCE_FORCE; // Bounce
        }
        
        // C. City Building Collision (Simplified No-Fly Zone)
        if (distanceFromCenter < CITY_CORE_RADIUS && pos.y < MIN_CITY_ALTITUDE) {
            pos.y = MIN_CITY_ALTITUDE;
            if (vel.y < 0) vel.y *= -COLLISION_BOUNCE_FORCE; // Bounce up
        }
        
        // 6. Turning (Yaw) & Rolling
        const yaw = manualInputs.turn * TURN_RATE * delta;
        const roll = manualInputs.roll * ROLL_RATE * delta;
        
        const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw);
        const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -roll);
        
        ship.quaternion.multiply(yawQuat).multiply(rollQuat).normalize();
        
        wasManual.current = true;
        return;
    }

    // --- Autonomous AI Logic ---
    if (wasManual.current) {
        // This is the first frame after manual control ended.
        // Reset AI state to seamlessly transition.
        shipState.current.state = 'FLYING';
        shipState.current.targetPosition.copy(getNewFlightTarget());
        shipState.current.timer = Math.random() * 10 + 5;
        velocity.current.set(0, 0, 0); // Reset velocity
        wasManual.current = false;
    }
    
    if (!shipState.current.isInitialized) {
        // Find a random landing spot to start at.
        const startPos = TERRAIN_LANDING_SPOTS[Math.floor(Math.random() * TERRAIN_LANDING_SPOTS.length)];
        groupRef.current.position.copy(startPos);
        shipState.current.finalLandingPosition.copy(startPos);
        shipState.current.isInitialized = true;
        groupRef.current.visible = true; // Make it visible once positioned
    }

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


export const shipsData: ShipData[] = [
    { id: 'space_1', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.45, initialDelay: 0, shipType: 'fighter' },
    { id: 'space_2', url: `${GITHUB_MODEL_URL_BASE}ship_space.glb`, scale: 0.47, initialDelay: 5, shipType: 'fighter' },
    { id: 'delorean_1', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.72, initialDelay: 2, shipType: 'transport' },
    { id: 'delorean_2', url: `${GITHUB_MODEL_URL_BASE}ship_delorean.glb`, scale: 0.66, initialDelay: 7, shipType: 'transport' },
    { id: 'copter_1', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.05, initialDelay: 4, shipType: 'copter' },
    { id: 'copter_2', url: `${GITHUB_MODEL_URL_BASE}ship_copter.glb`, scale: 0.055, initialDelay: 9, shipType: 'copter' },
];

interface FlyingShipsProps {
  setShipRefs: (refs: React.RefObject<THREE.Group>[]) => void;
  isPaused?: boolean;
  controlledShipId: string | null;
  shipInputs: ShipInputState;
}

export const FlyingShips: React.FC<FlyingShipsProps> = React.memo(({ setShipRefs, isPaused, controlledShipId, shipInputs }) => {
  
  const shipRefs = useMemo(() => 
    Array.from({ length: shipsData.length }, () => React.createRef<THREE.Group>()), 
    []
  );
  
  useEffect(() => {
    // Pass the entire array of refs up to the parent component.
    setShipRefs(shipRefs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={null}>
      {shipsData.map((ship, i) => (
        <Ship 
            ref={shipRefs[i]} 
            key={ship.id} 
            {...ship} 
            isPaused={isPaused} 
            isUnderManualControl={controlledShipId === ship.id}
            manualInputs={shipInputs}
        />
      ))}
    </Suspense>
  );
});

useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_space.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_delorean.glb`);
useGLTF.preload(`${GITHUB_MODEL_URL_BASE}ship_copter.glb`);