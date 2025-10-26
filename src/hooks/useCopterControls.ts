import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

export const useCopterControls = (targetRef: React.RefObject<THREE.Object3D>) => {
  const keys = useInput();
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3()).current;
  const rotation = useRef(new THREE.Euler()).current;

  const moveSpeed = 15;
  const rotationSpeed = 1.5;

  useFrame((_, delta) => {
    if (!targetRef.current) return;

    // --- Translation ---
    const forward = keys['KeyW'] || keys['ArrowUp'] ? 1 : 0;
    const backward = keys['KeyS'] || keys['ArrowDown'] ? 1 : 0;
    const left = keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0;
    const right = keys['KeyD'] || keys['ArrowRight'] ? 1 : 0;
    const up = keys['Space'] || keys['KeyE'] ? 1 : 0;
    const down = keys['ShiftLeft'] || keys['KeyQ'] ? 1 : 0;

    const direction = new THREE.Vector3(
      right - left,
      up - down,
      backward - forward
    ).normalize();

    // Calculate velocity based on direction and speed
    const targetVelocity = direction.multiplyScalar(moveSpeed);
    
    // Apply velocity relative to the object's rotation
    const rotatedVelocity = targetVelocity.clone().applyQuaternion(targetRef.current.quaternion);

    // Lerp for smooth acceleration/deceleration
    velocity.lerp(rotatedVelocity, 0.1);
    
    targetRef.current.position.add(velocity.clone().multiplyScalar(delta));

    // --- Rotation ---
    // The camera should be positioned behind and slightly above the ship
    const cameraOffset = new THREE.Vector3(0, 2, 8); 
    const targetCameraPosition = targetRef.current.position.clone().add(cameraOffset.applyQuaternion(targetRef.current.quaternion));
    
    camera.position.lerp(targetCameraPosition, delta * 3);
    
    // Make camera look at a point slightly in front of the ship for better leading
    const lookAtPoint = targetRef.current.position.clone().add(new THREE.Vector3(0, 1, -10).applyQuaternion(targetRef.current.quaternion));
    camera.lookAt(lookAtPoint);
    
    // Update ship rotation based on keys
    const yawLeft = keys['KeyJ'] ? 1 : 0;
    const yawRight = keys['KeyL'] ? 1 : 0;
    const pitchUp = keys['KeyI'] ? 1 : 0;
    const pitchDown = keys['KeyK'] ? 1 : 0;

    const yawDelta = (yawLeft - yawRight) * rotationSpeed * delta;
    const pitchDelta = (pitchDown - pitchUp) * rotationSpeed * delta;

    rotation.set(targetRef.current.rotation.x, targetRef.current.rotation.y, targetRef.current.rotation.z);
    
    // Create quaternions for pitch and yaw
    const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta);
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchDelta);
    
    // Apply yaw first, then pitch relative to the new orientation
    targetRef.current.quaternion.multiplyQuaternions(yawQuat, targetRef.current.quaternion);
    targetRef.current.quaternion.multiply(pitchQuat);
  });
};
