import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  onAnimationFinish: () => void;
  isAnimating: boolean;
  pov: 'main' | 'ship';
  targetShipRef: React.RefObject<THREE.Group> | null;
}

const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_POSITION = new THREE.Vector3(0, 80, 180);
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef }) => {
  const shipCam = useMemo(() => ({
    // Increased offset for a better third-person view
    offset: new THREE.Vector3(0, 4, -12),
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3(),
    forwardVector: new THREE.Vector3(0, 0, 15),
  }), []);

  useFrame((state, delta) => {
    const isAnimatingHome = isAnimating && !selectedDistrict;

    // --- State-driven Camera Logic ---

    // 1. Determine the camera's target state based on priority
    if (isAnimating && selectedDistrict && selectedDistrict.cameraFocus) {
      // PRIORITY 1: Animate to a selected district.
      targetPosition.set(...selectedDistrict.cameraFocus.pos);
      targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
    } else if (isAnimatingHome) {
      // PRIORITY 2: Animate "home".
      if (pov === 'ship' && targetShipRef?.current) {
        // "Home" in ship POV is back to the ship.
        const ship = targetShipRef.current;
        shipCam.idealPosition.copy(shipCam.offset).applyQuaternion(ship.quaternion).add(ship.position);
        shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
        targetPosition.copy(shipCam.idealPosition);
        targetLookAt.copy(shipCam.idealLookAt);
      } else {
        // "Home" in main POV is the city overview.
        targetPosition.copy(OVERVIEW_POSITION);
        targetLookAt.copy(OVERVIEW_LOOK_AT);
      }
    } else if (pov === 'ship' && targetShipRef?.current) {
      // PRIORITY 3: Not animating, but in ship POV, so continuously follow the ship.
      const ship = targetShipRef.current;
      
      shipCam.idealPosition.copy(shipCam.offset).applyQuaternion(ship.quaternion).add(ship.position);
      shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);

      state.camera.position.lerp(shipCam.idealPosition, delta * 2);
      const tempCamera = state.camera.clone();
      tempCamera.lookAt(shipCam.idealLookAt);
      state.camera.quaternion.slerp(tempCamera.quaternion, delta * 2.5);
      return; // Exit here for continuous following
    } else {
       // PRIORITY 4: Not animating, not in ship view. Let OrbitControls handle it.
       // Special idle case for nexus-core to keep it centered.
       if (selectedDistrict?.id === 'nexus-core') {
         const tempCamera = state.camera.clone();
         tempCamera.lookAt(0, 5, 0);
         state.camera.quaternion.slerp(tempCamera.quaternion, delta * 2.5);
      }
      return; // Exit here for manual control
    }

    // 2. If we reach here, it means we must be animating. Perform the animation.
    const lerpFactor = delta * 2.5;
    state.camera.position.lerp(targetPosition, lerpFactor);

    const tempCamera = state.camera.clone();
    tempCamera.lookAt(targetLookAt);
    state.camera.quaternion.slerp(tempCamera.quaternion, lerpFactor);
    
    // 3. Check if the animation is finished.
    const posReached = state.camera.position.distanceTo(targetPosition) < 0.1;
    const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.01;

    if (posReached && rotReached) {
        state.camera.position.copy(targetPosition);
        state.camera.quaternion.copy(tempCamera.quaternion);
        onAnimationFinish();
    }
  });

  return null;
};