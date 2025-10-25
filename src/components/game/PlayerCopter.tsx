import React, { useMemo, forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGLTF } from '@react-three/drei';
import { useTouchControls } from '../../hooks/useTouchControls';

const MAX_SPEED = 20;
const ACCELERATION = 80;
const DAMPING = 5;

// We forward the ref to allow the parent game component to access the group
export const PlayerCopter = forwardRef<THREE.Group>((props, ref) => {
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

  // Auto-fire state
  const fireCooldown = useRef(0);

  useFrame((state, delta) => {
    if (!player.current) return;

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
    worldForce.normalize().multiplyScalar(ACCELERATION * delta);
    
    physics.velocity.add(worldForce);
    physics.velocity.multiplyScalar(1 - DAMPING * delta);

    if (physics.velocity.length() > MAX_SPEED) {
        physics.velocity.normalize().multiplyScalar(MAX_SPEED);
    }

    player.current.position.add(physics.velocity.clone().multiplyScalar(delta));

    // --- Handle Rotation (Aiming) ---
    const aimTarget = new THREE.Vector3(touchControls.aim.x, touchControls.aim.y, -1).unproject(state.camera);
    const finalTarget = player.current.position.clone().add(aimTarget.sub(player.current.position).normalize().multiplyScalar(50));
    finalTarget.y = player.current.position.y;

    const tempObject = new THREE.Object3D();
    tempObject.position.copy(player.current.position);
    tempObject.lookAt(finalTarget);
    
    player.current.quaternion.slerp(tempObject.quaternion, delta * 4);

    // --- Automatic Firing ---
    if (fireCooldown.current > 0) {
        fireCooldown.current -= delta;
    } else if (touchControls.joystick.x === 0 && touchControls.joystick.y === 0) { // Fire when joystick is released
        console.log("FIRE!"); // Placeholder for projectile logic
        fireCooldown.current = 0.2; // 5 shots per second
    }
  });

  return (
    <group ref={player} scale={0.05} position={[0, 10, 0]}>
        <primitive object={clonedScene} />
    </group>
  );
});

useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb');