import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';
import { OVERVIEW_CAMERA_POSITION } from '../constants';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  onAnimationFinish: () => void;
  isAnimating: boolean;
  pov: 'main' | 'ship';
  targetShipRef: React.RefObject<THREE.Group> | null;
}

const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 0, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef }) => {
  const shipCam = useMemo(() => ({
    offset: new THREE.Vector3(0, 1.5, -4.5), // Posisi kamera di 'punggung' kapal, lebih dekat dan imersif
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3(),
    forwardVector: new THREE.Vector3(0, 0, 15),
  }), []);
  
  const isAnimatingRef = React.useRef(isAnimating);
  isAnimatingRef.current = isAnimating;

  useFrame((state, delta) => {
    let hasTarget = false;
    let lerpSpeed = 3.0;

    if (isAnimating) {
        if (selectedDistrict?.cameraFocus) {
            targetPosition.set(...selectedDistrict.cameraFocus.pos);
            targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
            hasTarget = true;
        } else if (pov === 'ship' && targetShipRef?.current) {
            const ship = targetShipRef.current;
            shipCam.idealPosition.copy(shipCam.offset).applyQuaternion(ship.quaternion).add(ship.position);
            shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
            targetPosition.copy(shipCam.idealPosition);
            targetLookAt.copy(shipCam.idealLookAt);
            hasTarget = true;
        } else {
            targetPosition.copy(OVERVIEW_CAMERA_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        }
    } else if (pov === 'ship' && targetShipRef?.current) {
        lerpSpeed = 4.0;
        const ship = targetShipRef.current;
        shipCam.idealPosition.copy(shipCam.offset).applyQuaternion(ship.quaternion).add(ship.position);
        shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
        targetPosition.copy(shipCam.idealPosition);
        targetLookAt.copy(shipCam.idealLookAt);
        hasTarget = true;
    }

    if (hasTarget) {
      const lerpFactor = Math.min(delta * lerpSpeed, 1);
      state.camera.position.lerp(targetPosition, lerpFactor);

      const tempCamera = state.camera.clone();
      tempCamera.lookAt(targetLookAt);
      state.camera.quaternion.slerp(tempCamera.quaternion, lerpFactor);
      
      if (isAnimatingRef.current) {
        // BUG FIX: Relaxation of animation completion thresholds.
        // The previous values (0.1 for pos, 0.01 for rot) were too strict,
        // causing the animation to get stuck in an infinite loop, which
        // locked user controls and prevented content panels from appearing.
        const posReached = state.camera.position.distanceTo(targetPosition) < 0.5;
        const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.05;

        if (posReached && rotReached) {
            state.camera.position.copy(targetPosition);
            state.camera.quaternion.copy(tempCamera.quaternion);
            onAnimationFinish();
        }
      }
    }
  });

  return null;
};