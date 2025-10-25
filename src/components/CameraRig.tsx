// FIX: Add import for React to resolve 'React.FC' type.
import React from 'react';
// FIX: Remove the triple-slash directive for @react-three/fiber types.
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  onAnimationFinish: () => void;
  isAnimating: boolean;
}

// Menggunakan vektor helper di luar loop untuk optimasi performa
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_POSITION = new THREE.Vector3(0, 60, 120);
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, onAnimationFinish, isAnimating }) => {
  useFrame((state, delta) => {
    // Hanya jalankan logika animasi jika isAnimating bernilai true.
    // Ini mencegah rig bertabrakan dengan kontrol pengguna.
    if (!isAnimating) {
      return;
    }

    if (selectedDistrict?.cameraFocus) {
      // Pindah ke sudut pandang sinematik yang unik untuk distrik yang dipilih
      targetPosition.set(...selectedDistrict.cameraFocus.pos);
      targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
    } else {
      // Kembali ke posisi overview default
      targetPosition.copy(OVERVIEW_POSITION);
      targetLookAt.copy(OVERVIEW_LOOK_AT);
    }

    // Interpolasi posisi kamera secara mulus untuk menghindari gerakan yang kaku
    const lerpFactor = delta * 2.5; // Ditingkatkan untuk transisi yang lebih cepat namun tetap mulus
    state.camera.position.lerp(targetPosition, lerpFactor);

    // Interpolasi target pandang kamera secara mulus dengan memperbarui quaternion
    const tempCamera = state.camera.clone();
    tempCamera.lookAt(targetLookAt);
    state.camera.quaternion.slerp(tempCamera.quaternion, lerpFactor);
    
    // Periksa apakah animasi telah selesai dengan threshold yang lebih toleran
    const posReached = state.camera.position.distanceTo(targetPosition) < 0.1;
    const rotReached = state.camera.quaternion.angleTo(tempCamera.quaternion) < 0.01;

    if (posReached && rotReached) {
        // BUG FIX: Pindahkan kamera secara paksa ke posisi dan rotasi akhir
        // untuk menjamin terminasi dan mencegah overshoot atau osilasi di sekitar target.
        state.camera.position.copy(targetPosition);
        state.camera.quaternion.copy(tempCamera.quaternion);
        onAnimationFinish();
    }
  });

  return null; // Komponen ini tidak merender objek, hanya mengontrol kamera
};