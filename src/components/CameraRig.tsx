import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  onAnimationFinish: () => void;
  isAnimating: boolean;
  pov: 'main' | 'ship';
  targetShipRef: React.RefObject<THREE.Group> | null;
  isCalibrationMode: boolean;
  patrollingCoreRef: React.RefObject<THREE.Group> | null;
}

const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_POSITION = new THREE.Vector3(0, 100, 250);
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 0, 0);
const CALIBRATION_POSITION = new THREE.Vector3(0, 200, 1);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef, isCalibrationMode, patrollingCoreRef }) => {
  const { invalidate } = useThree();

  const shipCam = useMemo(() => ({
    offset: new THREE.Vector3(0, 12, -18),
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
        if (isCalibrationMode) {
            targetPosition.copy(CALIBRATION_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        } else if (selectedDistrict?.id === 'oracle-ai' && patrollingCoreRef?.current) {
            const corePos = patrollingCoreRef.current.position;
            targetPosition.set(corePos.x, corePos.y + 10, corePos.z + 25);
            targetLookAt.copy(corePos);
            hasTarget = true;
        } else if (selectedDistrict?.cameraFocus) {
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
            targetPosition.copy(OVERVIEW_POSITION);
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
      invalidate(); // Invalidate frame for smooth animation with frameloop="demand"
      
      if (isAnimatingRef.current) {
        const posReached = state.camera.position.distanceTo(targetPosition) < 0.2;
        const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.02;

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
