// FIX: Add import for React to resolve 'React.FC' type.
import React from 'react';
// FIX: Remove the triple-slash directive for @react-three/fiber types.
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  onAnimationFinish: () => void;
}

// Menggunakan vektor helper di luar loop untuk optimasi performa
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish }) => {
  useFrame((state, delta) => {
    if (selectedDistrict?.cameraFocus) {
      // Pindah ke sudut pandang sinematik yang unik untuk distrik yang dipilih
      targetPosition.set(...selectedDistrict.cameraFocus.pos);
      targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
    } else {
      // Kembali ke posisi overview default, tanpa auto-rotate
      targetPosition.set(0, 60, 120);
      targetLookAt.copy(OVERVIEW_LOOK_AT);
    }

    // Interpolasi posisi kamera secara mulus untuk menghindari gerakan yang kaku
    state.camera.position.lerp(targetPosition, delta * 1.5);

    // Interpolasi target pandang kamera secara mulus dengan memperbarui quaternion
    const tempCamera = state.camera.clone();
    tempCamera.lookAt(targetLookAt);
    state.camera.quaternion.slerp(tempCamera.quaternion, delta * 1.5);
    
    // Periksa apakah animasi telah selesai
    const posReached = state.camera.position.distanceTo(targetPosition) < 0.5;
    const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.05;

    if (posReached && rotReached) {
        onAnimationFinish();
    }
  });

  return null; // Komponen ini tidak merender objek, hanya mengontrol kamera
};
