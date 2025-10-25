import React, { useMemo, forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGLTF } from '@react-three/drei';
import { useTouchControls } from '../../hooks/useTouchControls';
import { MuzzleFlash, ShieldEffect } from './GameModels';

const MAX_SPEED = 20;
const ACCELERATION = 80;
const DAMPING = 5;
const FIRE_RATE = 0.1; // Time between shots in a burst
const RELOAD_TIME = 1.5; // Time after a burst
const BURST_SIZE = 5;

interface PlayerCopterProps {
    onFireAutoGun: (position: THREE.Vector3, quaternion: THREE.Quaternion) => void;
    initialPosition: THREE.Vector3;
    isShieldActive: boolean;
    muzzleFlash: { active: boolean, key: number };
    isControllable: boolean;
}

// We forward the ref to allow the parent game component to access the group
export const PlayerCopter = forwardRef<THREE.Group, PlayerCopterProps>(({ onFireAutoGun, initialPosition, isShieldActive, muzzleFlash, isControllable }, ref) => {
  const keyboardControls = usePlayerControls();
  const touchControls = useTouchControls();
  const player = ref as React.RefObject<THREE.Group>;

  // Use the actual copter model for the player
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const physics = useMemo(() => ({
    velocity: new THREE.Vector3(),
    rotation: new THREE.Quaternion(),
  }), []);

  // Auto-gun state
  const fireState = useRef({
    cooldown: 0,
    burstCount: BURST_SIZE,
    isReloading: false,
  });

  useFrame((state, delta) => {
    if (!player.current) return;

    // Only process controls and firing if the player has control
    if (isControllable) {
        // --- Combine Keyboard and Touch Controls ---
        const controls = {
            forward: keyboardControls.forward || touchControls.joystick.y > 0.5,
            backward: keyboardControls.backward || touchControls.joystick.y < -0.5,
            left: keyboardControls.left || touchControls.joystick.x < -0.5,
            right: keyboardControls.right || touchControls.joystick.x > 0.5,
            up: keyboardControls.up || touchControls.altitude === 'up',
            down: keyboardControls.down || touchControls.altitude === 'down',
        };

        // --- Calculate forces from controls ---
        const force = new THREE.Vector3();
        if (controls.forward) force.z -= 1;
        if (controls.backward) force.z += 1;
        if (controls.right) force.x += 1;
        if (controls.left) force.x -= 1;
        
        // Apply movement relative to the copter's current direction
        const worldForce = force.clone().applyQuaternion(player.current.quaternion);
        
        // Handle vertical movement separately
        const verticalForce = new THREE.Vector3(0, 0, 0);
        if (controls.up) verticalForce.y += 1;
        if (controls.down) verticalForce.y -= 1;

        worldForce.add(verticalForce);
        if(worldForce.lengthSq() > 0) worldForce.normalize().multiplyScalar(ACCELERATION * delta);
        
        physics.velocity.add(worldForce);
        
        // --- Automatic Burst Firing Logic ---
        fireState.current.cooldown -= delta;
        if (fireState.current.cooldown <= 0) {
            if (fireState.current.isReloading) {
                fireState.current.isReloading = false;
                fireState.current.burstCount = BURST_SIZE;
            }

            if (fireState.current.burstCount > 0) {
                onFireAutoGun(player.current.position, player.current.quaternion);
                fireState.current.burstCount--;
                fireState.current.cooldown = FIRE_RATE;

                if (fireState.current.burstCount === 0) {
                    fireState.current.cooldown = RELOAD_TIME;
                    fireState.current.isReloading = true;
                }
            }
        }
    }
    
    // Physics and rotation happen regardless of control state for cinematic movement
    physics.velocity.multiplyScalar(1 - DAMPING * delta);

    if (physics.velocity.length() > MAX_SPEED) {
        physics.velocity.normalize().multiplyScalar(MAX_SPEED);
    }

    player.current.position.add(physics.velocity.clone().multiplyScalar(delta));

    // --- Handle Rotation (Aiming) ---
    const aimTarget = new THREE.Vector3(state.mouse.x, state.mouse.y, -1).unproject(state.camera);
    const aimDirection = aimTarget.sub(player.current.position);

    // BUG FIX: Safeguard to prevent normalizing a zero vector, which results in NaN values and crashes the renderer.
    if (aimDirection.lengthSq() > 0.0001) {
        aimDirection.normalize();
        const finalTarget = player.current.position.clone().add(aimDirection.multiplyScalar(50));
        finalTarget.y = player.current.position.y;
    
        const tempObject = new THREE.Object3D();
        tempObject.position.copy(player.current.position);
        tempObject.lookAt(finalTarget);
        
        player.current.quaternion.slerp(tempObject.quaternion, delta * 4);
    }
  });

  return (
    <group ref={player} scale={0.05} position={initialPosition}>
        <primitive object={clonedScene} />
        {isControllable && muzzleFlash.active && <MuzzleFlash key={muzzleFlash.key} />}
        {isShieldActive && <ShieldEffect />}
    </group>
  );
});

useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb');
