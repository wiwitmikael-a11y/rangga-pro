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
  isCalibrationMode: boolean;
}

const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_POSITION = new THREE.Vector3(0, 100, 250);
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);
const CALIBRATION_POSITION = new THREE.Vector3(0, 200, 1); // High top-down view

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef, isCalibrationMode }) => {
  const shipCam = useMemo(() => ({
    // Higher, more cinematic "over-the-shoulder" offset looking down
    offset: new THREE.Vector3(0, 7, -10),
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3(),
    forwardVector: new THREE.Vector3(0, 0, 15),
  }), []);
  
  const isAnimatingRef = React.useRef(isAnimating);
  isAnimatingRef.current = isAnimating;

  useFrame((state, delta) => {
    let hasTarget = false;
    let lerpSpeed = 2.5;

    // --- State-driven Target Determination ---
    if (isAnimating) {
        // We are in a defined transition animation
        lerpSpeed = 3.5; // Use a faster speed for transitions

        if (isCalibrationMode) { // Priority for calibration view
            targetPosition.copy(CALIBRATION_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        } else if (selectedDistrict?.cameraFocus) { // To District
            targetPosition.set(...selectedDistrict.cameraFocus.pos);
            targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
            hasTarget = true;
        } else if (pov === 'ship' && targetShipRef?.current) { // To Ship
            const ship = targetShipRef.current;
            shipCam.idealPosition.copy(shipCam.offset).applyQuaternion(ship.quaternion).add(ship.position);
            shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
            targetPosition.copy(shipCam.idealPosition);
            targetLookAt.copy(shipCam.idealLookAt);
            hasTarget = true;
        } else { // To Overview
            targetPosition.copy(OVERVIEW_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        }
    } else if (pov === 'ship' && targetShipRef?.current) {
        // We are in continuous follow mode (not a one-off animation)
        lerpSpeed = 5.0; // Responsive follow speed
        const ship = targetShipRef.current;
        shipCam.idealPosition.copy(shipCam.offset).applyQuaternion(ship.quaternion).add(ship.position);
        shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
        targetPosition.copy(shipCam.idealPosition);
        targetLookAt.copy(shipCam.idealLookAt);
        hasTarget = true;
    }
    // If no target, OrbitControls takes over

    // --- Animation Logic ---
    if (hasTarget) {
      const lerpFactor = Math.min(delta * lerpSpeed, 1); // Clamp to prevent overshooting on slow frames
      state.camera.position.lerp(targetPosition, lerpFactor);

      const tempCamera = state.camera.clone();
      tempCamera.lookAt(targetLookAt);
      state.camera.quaternion.slerp(tempCamera.quaternion, lerpFactor);
      
      // Check if a one-time animation is finished.
      if (isAnimatingRef.current) {
        // Looser tolerance to prevent getting stuck
        const posReached = state.camera.position.distanceTo(targetPosition) < 0.5;
        const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.05;

        if (posReached && rotReached) {
            // Snap to final position ONLY if not going to ship mode, to avoid a jump before continuous follow starts
            if (pov !== 'ship') {
              state.camera.position.copy(targetPosition);
              state.camera.quaternion.copy(tempCamera.quaternion);
            }
            onAnimationFinish();
        }
      }
    }
  });

  return null;
};