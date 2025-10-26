import React, { useMemo } from 'react';
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
// FIX: Menyesuaikan target look-at agar konsisten dengan target OrbitControls untuk transisi yang mulus.
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);
const CALIBRATION_POSITION = new THREE.Vector3(0, 200, 1); // Tampilan top-down yang tinggi

// Pengaturan offset kamera yang berbeda untuk setiap jenis kapal
const shipCamOffsets: { [key in ShipType | 'default']: THREE.Vector3 } = {
    fighter: new THREE.Vector3(0, 3, -4),   // Naik 3, mundur 4
    transport: new THREE.Vector3(0, 3, -4), // Naik 3, mundur 4
    copter: new THREE.Vector3(0, 9, -8),  // Turun 3 dari 12
    default: new THREE.Vector3(0, 12, -8), // Fallback
};

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating, pov, targetShipRef, isCalibrationMode }) => {
  const shipCam = useMemo(() => ({
    idealPosition: new THREE.Vector3(),
    idealLookAt: new THREE.Vector3(),
    forwardVector: new THREE.Vector3(0, 0, 15),
  }), []);
  
  const isAnimatingRef = React.useRef(isAnimating);
  isAnimatingRef.current = isAnimating;

  useFrame((state, delta) => {
    // --- NEW: Smooth OrbitControls Damping ---
    // Diperlukan agar prop `enableDamping` pada OrbitControls berfungsi.
    // Ini menghaluskan gerakan kamera yang dikontrol pengguna.
    const controls = state.controls as OrbitControlsImpl;
    if (controls?.enabled) {
      controls.update();
    }
    
    let hasTarget = false;
    let dampingSpeed = 4.0; // Kecepatan damping default untuk animasi

    // --- Penentuan Target Berbasis State ---
    if (isAnimating) {
        // Kita berada dalam animasi transisi yang ditentukan

        if (isCalibrationMode) { // Prioritas untuk tampilan kalibrasi
            targetPosition.copy(CALIBRATION_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        } else if (selectedDistrict?.cameraFocus) { // Ke Distrik
            targetPosition.set(...selectedDistrict.cameraFocus.pos);
            targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
            hasTarget = true;
        } else if (pov === 'ship' && targetShipRef?.current) { // Ke Kapal
            const ship = targetShipRef.current;
            const shipType = (ship.userData.shipType as ShipType) || 'default';
            const offset = shipCamOffsets[shipType];
            shipCam.idealPosition.copy(offset).applyQuaternion(ship.quaternion).add(ship.position);
            shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
            targetPosition.copy(shipCam.idealPosition);
            targetLookAt.copy(shipCam.idealLookAt);
            hasTarget = true;
        } else { // Ke Tinjauan Umum
            targetPosition.copy(OVERVIEW_CAMERA_POSITION);
            targetLookAt.copy(OVERVIEW_LOOK_AT);
            hasTarget = true;
        }
    } else if (pov === 'ship' && targetShipRef?.current) {
        // Kita dalam mode mengikuti terus-menerus (bukan animasi sekali jalan)
        dampingSpeed = 6.0; // Kecepatan mengikuti yang lebih responsif
        const ship = targetShipRef.current;
        const shipType = (ship.userData.shipType as ShipType) || 'default';
        const offset = shipCamOffsets[shipType];
        shipCam.idealPosition.copy(offset).applyQuaternion(ship.quaternion).add(ship.position);
        shipCam.idealLookAt.copy(shipCam.forwardVector).applyQuaternion(ship.quaternion).add(ship.position);
        targetPosition.copy(shipCam.idealPosition);
        targetLookAt.copy(shipCam.idealLookAt);
        hasTarget = true;
    }
    // Jika tidak ada target, OrbitControls mengambil alih

    // --- Logika Animasi ---
    if (hasTarget) {
      // --- NEW: Peredaman eksponensial yang tidak bergantung pada frame-rate ---
      // Ini menciptakan efek ease-in dan ease-out yang halus untuk gerakan kamera.
      const dampFactor = 1.0 - Math.exp(-dampingSpeed * delta);
      state.camera.position.lerp(targetPosition, dampFactor);

      const tempCamera = state.camera.clone();
      tempCamera.lookAt(targetLookAt);
      state.camera.quaternion.slerp(tempCamera.quaternion, dampFactor);
      
      // Periksa apakah animasi sekali jalan telah selesai.
      if (isAnimatingRef.current) {
        // Toleransi yang lebih ketat untuk memastikan akurasi sebelum snap
        const posReached = state.camera.position.distanceTo(targetPosition) < 0.2;
        const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.02;

        if (posReached && rotReached) {
            // Snap ke posisi akhir untuk pembingkaian yang sempurna dan untuk menghentikan state animasi.
            state.camera.position.copy(targetPosition);
            state.camera.quaternion.copy(tempCamera.quaternion);
            onAnimationFinish();
        }
      }
    }
  });

  return null;
};
