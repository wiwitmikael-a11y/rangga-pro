import React, { useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { useGLTF } from '@react-three/drei';
import { useTouchControls } from '../../hooks/useTouchControls';

const MAX_SPEED = 20;
const ACCELERATION = 80;
const DAMPING = 5;

interface PlayerCopterProps {
    initialPosition: THREE.Vector3;
}

export const PlayerCopter = forwardRef<THREE.Group, PlayerCopterProps>(({ initialPosition }, ref) => {
  const keyboardControls = usePlayerControls();
  const touchControls = useTouchControls();
  const player = ref as React.RefObject<THREE.Group>;

  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const physics = useMemo(() => ({
    velocity: new THREE.Vector3(),
    rotation: new THREE.Quaternion(),
  }), []);

  useFrame((_, delta) => {
    if (!player.current) return;

    const controls = {
        forward: keyboardControls.forward || touchControls.joystick.y > 0.5,
        backward: keyboardControls.backward || touchControls.joystick.y < -0.5,
        left: keyboardControls.left || touchControls.joystick.x < -0.5,
        right: keyboardControls.right || touchControls.joystick.x > 0.5,
        up: keyboardControls.up || touchControls.altitude === 'up',
        down: keyboardControls.down || touchControls.altitude === 'down',
    };

    const force = new THREE.Vector3();
    if (controls.forward) force.z -= 1;
    if (controls.backward) force.z += 1;
    if (controls.right) force.x += 1;
    if (controls.left) force.x -= 1;
    
    const worldForce = force.clone().applyQuaternion(player.current.quaternion);
    
    const verticalForce = new THREE.Vector3(0, 0, 0);
    if (controls.up) verticalForce.y += 1;
    if (controls.down) verticalForce.y -= 1;

    worldForce.add(verticalForce);
    if(worldForce.lengthSq() > 0) worldForce.normalize().multiplyScalar(ACCELERATION * delta);
    
    physics.velocity.add(worldForce);
    
    physics.velocity.multiplyScalar(1 - DAMPING * delta);

    if (physics.velocity.length() > MAX_SPEED) {
        physics.velocity.normalize().multiplyScalar(MAX_SPEED);
    }

    player.current.position.add(physics.velocity.clone().multiplyScalar(delta));

    // --- New Rotation Logic ---
    // Automatically orient the copter in the direction of its velocity.
    if (physics.velocity.lengthSq() > 0.01) { // Only rotate if there's significant movement.
        const lookDirection = physics.velocity.clone();
        lookDirection.y = 0; // Keep the copter level, don't pitch up/down with vertical velocity.

        // Ensure there is a horizontal direction before trying to look at it.
        if (lookDirection.lengthSq() > 0.0001) {
            const targetPosition = player.current.position.clone().add(lookDirection);

            const tempObject = new THREE.Object3D();
            tempObject.position.copy(player.current.position);
            tempObject.lookAt(targetPosition);
            
            // Smoothly rotate the copter towards the direction of movement.
            player.current.quaternion.slerp(tempObject.quaternion, delta * 4);
        }
    }
  });

  return (
    <group ref={player} scale={0.05} position={initialPosition}>
        <primitive object={clonedScene} />
    </group>
  );
});

useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb');