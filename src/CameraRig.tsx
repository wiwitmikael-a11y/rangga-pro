import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from './types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  onAnimationFinish: () => void;
  isAnimating: boolean;
}

// Using helper vectors outside the loop for performance optimization
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating }) => {
  useFrame((state, delta) => {
    // Only run the animation logic if isAnimating is true.
    // This prevents the rig from fighting with user controls.
    if (!isAnimating) {
      return;
    }

    if (selectedDistrict?.cameraFocus) {
      // Move to the unique cinematic viewpoint for the selected district
      targetPosition.set(...selectedDistrict.cameraFocus.pos);
      targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
    } else {
      // Return to the default overview position, without auto-rotate
      targetPosition.set(0, 60, 120);
      targetLookAt.copy(OVERVIEW_LOOK_AT);
    }

    // Smoothly interpolate the camera position to avoid jerky movements
    state.camera.position.lerp(targetPosition, delta * 1.5);

    // Smoothly interpolate the camera look-at target by updating the quaternion
    const tempCamera = state.camera.clone();
    tempCamera.lookAt(targetLookAt);
    state.camera.quaternion.slerp(tempCamera.quaternion, delta * 1.5);
    
    // Check if the animation has finished
    const posReached = state.camera.position.distanceTo(targetPosition) < 0.5;
    const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.05;

    if (posReached && rotReached) {
        // BUG FIX: Snap to the final position and rotation to guarantee termination
        // and prevent overshooting or oscillation around the target.
        state.camera.position.copy(targetPosition);
        state.camera.quaternion.copy(tempCamera.quaternion);
        onAnimationFinish();
    }
  });

  return null; // This component doesn't render an object, it just controls the camera
};