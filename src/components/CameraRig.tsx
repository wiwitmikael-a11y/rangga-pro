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
  isEntering?: boolean;
  isWaitingToStart?: boolean; // NEW: Lock camera before entry
}

const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);
const CALIBRATION_POSITION = new THREE.Vector3(0, 200, 1);

// ENTRY SEQUENCE POINTS
// Start: Just outside the virtual gate (Start Screen)
const ENTRY_START_POSITION = new THREE.Vector3(0, 20, 220); 
// End: Overview position
const ENTRY_END_POSITION = new THREE.Vector3(0, 80, 200); 

const shipCamOffsets: { [key in ShipType | 'default']: THREE.Vector3 } = {
    fighter: new THREE.Vector3(0, 3, -4),
    transport: new THREE.Vector3(0, 3, -4),
    copter: new THREE.Vector3(0, 9, -8),
    default: new THREE.Vector3(0, 12, -8),
};

const ANIMATION_TIMEOUT = 3500; // 3.5-second failsafe timeout

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef, isCalibrationMode, isEntering, isWaitingToStart }) => {
  const shipCam = useMemo(() => ({
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3(),
    forwardVector: new THREE.Vector3(0, 0, 15),
  }), []);
  
  const isAnimatingRef = useRef(isAnimating);
  const animationStartRef = useRef<number | null>(null);

  // Effect to manage the animation timer
  useEffect(() => {
    if (isAnimating && !isAnimatingRef.current) {
        animationStartRef.current = performance.now();
    } else if (!isAnimating) {
        animationStartRef.current = null;
    }
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useFrame((state, delta) => {
    // 1. HARD LOCK: If waiting to start (Loading/Start Screen), keep camera fixed.
    // This ensures the scene is rendered exactly behind the shutter.
    if (isWaitingToStart) {
        state.camera.position.copy(ENTRY_START_POSITION);
        state.camera.lookAt(OVERVIEW_LOOK_AT);
        return; // Skip other logic
    }

    const controls = state.controls as OrbitControlsImpl;
    if (controls?.enabled) {
      controls.update();
    }
    
    let hasTarget = false;
    let dampingSpeed = 4.0;

    const isOneShotAnimation = isAnimating || isEntering;

    if (isOneShotAnimation) {
        if (isEntering) {
            // Move from "Outside Gate" to "Overview"
            targetPosition.copy(ENTRY_END_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
            // Increase damping speed for entry to make it feel deliberate but smooth
            dampingSpeed = 2.0; 
        } else if (isCalibrationMode) {
            targetPosition.copy(CALIBRATION_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        } else if (selectedDistrict?.cameraFocus) {
            targetPosition.set(...selectedDistrict.cameraFocus.pos);
            targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
            hasTarget = true;
        } else if (pov === 'ship' && targetShipRef?.current) {
            // Ship transition
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
        // Continuous ship following
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
      
      if (isOneShotAnimation) {
        const posReached = state.camera.position.distanceTo(targetPosition) < 0.5;
        const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.05;

        const timeElapsed = animationStartRef.current ? performance.now() - animationStartRef.current : 0;
        const isTimedOut = timeElapsed > ANIMATION_TIMEOUT;

        if ((posReached && rotReached) || isTimedOut) {
            // Snap to final position to finish animation cleanly
            state.camera.position.copy(targetPosition);
            state.camera.quaternion.copy(tempCamera.quaternion);
            
            // Only fire the finish callback if we were previously animating
            if (isAnimatingRef.current) {
              onAnimationFinish();
              isAnimatingRef.current = false;
              animationStartRef.current = null;
            }
        }
      }
    }
  });

  return null;
};