// FIX: Import React to make the 'React' namespace available for types like React.RefObject.
import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Helper to manage keyboard state
const useInput = () => {
  const keys = useRef<{ [key: string]: boolean }>({}).current;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => (keys[e.code] = true);
    const onKeyUp = (e: KeyboardEvent) => (keys[e.code] = false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [keys]);
  return keys;
};

export const useCopterControls = (shipRef: React.RefObject<THREE.Group>, enabled: boolean) => {
  const keys = useInput();
  const { camera, gl } = useThree();

  const velocity = useRef(new THREE.Vector3(0, 0, 0)).current;
  const rotationVelocity = useRef(new THREE.Euler(0, 0, 0, 'YXZ')).current;

  // Pointer Lock and Mouse Controls
  useEffect(() => {
    if (!enabled) {
      if(document.pointerLockElement) document.exitPointerLock();
      return;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        if (document.pointerLockElement === gl.domElement) {
            const sensitivity = 0.002;
            rotationVelocity.y -= e.movementX * sensitivity;
            rotationVelocity.x -= e.movementY * sensitivity;
            rotationVelocity.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotationVelocity.x)); // Clamp pitch
        }
    };
    
    const handleClick = () => {
        gl.domElement.requestPointerLock().catch(err => console.error("Pointer lock failed:", err));
    };

    document.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        gl.domElement.removeEventListener('click', handleClick);
        if(document.pointerLockElement === gl.domElement) {
          document.exitPointerLock();
        }
    }
  }, [enabled, gl.domElement, rotationVelocity]);


  useFrame((_state, delta) => {
    if (!shipRef.current || !enabled) {
      // Smoothly stop the ship when controls are disabled
      velocity.lerp(new THREE.Vector3(0,0,0), delta * 5);
      return;
    };

    // --- CONFIG ---
    const thrust = 30.0;
    const verticalThrust = 20.0;
    const drag = 2.0;
    const rotationDrag = 3.0;

    // --- KEYBOARD INPUT ---
    const forward = keys['KeyW'] || keys['ArrowUp'] ? 1 : 0;
    const backward = keys['KeyS'] || keys['ArrowDown'] ? 1 : 0;
    const up = keys['Space'] ? 1 : 0;
    const down = keys['ShiftLeft'] || keys['ControlLeft'] ? 1 : 0;
    // A/D now control roll
    const rollLeft = keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0;
    const rollRight = keys['KeyD'] || keys['ArrowRight'] ? 1 : 0;

    // --- FORCES ---
    const thrustVector = new THREE.Vector3(0, 0, backward - forward).multiplyScalar(thrust * delta);
    const verticalVector = new THREE.Vector3(0, up - down, 0).multiplyScalar(verticalThrust * delta);
    
    // Update roll from keyboard
    rotationVelocity.z += (rollLeft - rollRight) * 0.1;


    // --- APPLY FORCES & ROTATION ---
    const worldThrust = thrustVector.clone().applyQuaternion(shipRef.current.quaternion);
    velocity.add(worldThrust);
    velocity.add(verticalVector);

    // Apply drag
    velocity.multiplyScalar(1 - delta * drag);
    rotationVelocity.x *= (1 - delta * rotationDrag);
    rotationVelocity.y *= (1 - delta * rotationDrag);
    rotationVelocity.z *= (1 - delta * rotationDrag);

    // Update position
    shipRef.current.position.add(velocity.clone().multiplyScalar(delta));

    // Update rotation
    const rotationDelta = new THREE.Quaternion().setFromEuler(rotationVelocity);
    shipRef.current.quaternion.multiply(rotationDelta);
    
    // --- CAMERA FOLLOW ---
    const cameraOffset = new THREE.Vector3(0, 5, 12);
    const worldOffset = cameraOffset.applyQuaternion(shipRef.current.quaternion);
    const cameraTargetPosition = shipRef.current.position.clone().add(worldOffset);

    camera.position.lerp(cameraTargetPosition, delta * 3.0);
    
    const lookAtTarget = shipRef.current.position.clone();
    camera.lookAt(lookAtTarget);
  });
};