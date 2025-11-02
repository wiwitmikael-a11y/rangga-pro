import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';
import { OVERVIEW_CAMERA_POSITION } from '../constants';
import type { ShipType } from './scene/FlyingShips';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

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
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);
const CALIBRATION_POSITION = new THREE.Vector3(0, 200, 1);

const shipCamOffsets: { [key in ShipType | 'default']: THREE.Vector3 } = {
    fighter: new THREE.Vector3(0, 3, -4),
    transport: new THREE.Vector3(0, 3, -4),
    copter: new THREE.Vector3(0, 9, -8),
    default: new THREE.Vector3(0, 12, -8),
};

const ANIMATION_TIMEOUT = 3500; // 3.5-second failsafe timeout

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef, isCalibrationMode }) => {
  const shipCam = useMemo(() => ({
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3(),
    forwardVector: new THREE.Vector3(0, 0, 15),
  }), []);
  
  const isAnimatingRef = useRef(isAnimating);
  const animationStartRef = useRef<number | null>(null);

  // Effect to manage the animation timer
  useEffect(() => {
    // isAnimating prop is the "source of truth" from the parent component.
    // isAnimatingRef is the "memory" of the previous frame within this component.
    if (isAnimating && !isAnimatingRef.current) {
        // Animation is starting on this render (transitioned from false to true)
        animationStartRef.current = performance.now();
    } else if (!isAnimating) {
        // Animation is not active, reset timer
        animationStartRef.current = null;
    }
    // Update the ref to match the prop for the next frame's comparison.
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useFrame((state, delta) => {
    const controls = state.controls as OrbitControlsImpl;
    if (controls?.enabled) {
      controls.update();
    }
    
    let hasTarget = false;
    let dampingSpeed = 4.0;

    if (isAnimating) {
        if (isCalibrationMode) {
            targetPosition.copy(CALIBRATION_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        } else if (selectedDistrict?.cameraFocus) {
            targetPosition.set(...selectedDistrict.cameraFocus.pos);
            targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
            hasTarget = true;
        } else if (pov === 'ship' && targetShipRef?.current) {
            const ship = targetShipRef.current;
            const shipType = (ship.userData.shipType as ShipType) || 'default';
            const offset = shipCamOffsets[shipType];
            shipCam.idealPosition.copy(offset).applyQuaternion(ship.quaternion).add(ship.position);
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
        dampingSpeed = 6.0;
        const ship = targetShipRef.current;
        const shipType = (ship.userData.shipType as ShipType) || 'default';
        const offset = shipCamOffsets[shipType];
        shipCam.idealPosition.copy(offset).applyQuaternion(ship.quaternion).add(ship.position);
        shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
        targetPosition.copy(shipCam.idealPosition);
        targetLookAt.copy(shipCam.idealLookAt);
        hasTarget = true;
    }

    if (hasTarget) {
      const dampFactor = 1.0 - Math.exp(-dampingSpeed * delta);
      state.camera.position.lerp(targetPosition, dampFactor);

      const tempCamera = state.camera.clone();
      tempCamera.lookAt(targetLookAt);
      state.camera.quaternion.slerp(tempCamera.quaternion, dampFactor);
      
      // Check if the one-shot animation has finished.
      if (isAnimating) {
        const posReached = state.camera.position.distanceTo(targetPosition) < 0.5;
        const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.05;

        const timeElapsed = animationStartRef.current ? performance.now() - animationStartRef.current : 0;
        const isTimedOut = timeElapsed > ANIMATION_TIMEOUT;

        if ((posReached && rotReached) || isTimedOut) {
            // Snap to the final position first to guarantee a stable end-state.
            state.camera.position.copy(targetPosition);
            state.camera.quaternion.copy(tempCamera.quaternion);
            
            // Check the ref to ensure we only call the finish handler once per animation cycle.
            if (isAnimatingRef.current) {
              onAnimationFinish();
              // CRITICAL FIX: Immediately update the ref to prevent multiple calls on subsequent frames
              // before the parent component has had a chance to re-render with isAnimating=false.
              isAnimatingRef.current = false;
              animationStartRef.current = null; // Also reset the timer for the next animation.
            }
        }
      }
    }
  });

  return null;
};