/// <reference types="@react-three/fiber" />

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from './types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

// Using a helper vector to avoid creating new Vector3 instances in the render loop
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 0, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  useFrame((state, delta) => {
    if (selectedDistrict?.cameraFocus) {
      // Move to a unique, cinematic viewpoint for the selected district
      targetPosition.set(...selectedDistrict.cameraFocus.pos);
      targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
    } else {
      // Return to the default overview position, slowly orbiting
      const time = state.clock.getElapsedTime();
      const radius = 80;
      targetPosition.set(
        Math.sin(time * 0.1) * radius,
        40,
        Math.cos(time * 0.1) * radius
      );
      targetLookAt.copy(OVERVIEW_LOOK_AT);
    }
    
    // Smoothly interpolate camera position
    state.camera.position.lerp(targetPosition, delta * 2);
    
    // Smoothly interpolate camera lookAt target by updating the camera's quaternion
    const tempCamera = state.camera.clone();
    tempCamera.lookAt(targetLookAt);
    state.camera.quaternion.slerp(tempCamera.quaternion, delta * 2);
  });
  
  return null; // This component does not render anything itself
};
