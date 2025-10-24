// FIX: Add import for React to resolve 'React.FC' type.
import React from 'react';
// FIX: Remove the triple-slash directive for @react-three/fiber types.
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

// Menggunakan vektor helper di luar loop untuk optimasi performa
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const OVERVIEW_LOOK_AT = new THREE.Vector3(0, 5, 0);

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  useFrame((state, delta) => {
    if (selectedDistrict?.cameraFocus) {
      // Pindah ke sudut pandang sinematik yang unik untuk distrik yang dipilih
      targetPosition.set(...selectedDistrict.cameraFocus.pos);
      targetLookAt.set(...selectedDistrict.cameraFocus.lookAt);
    } else {
      // Kembali ke posisi overview default, mengorbit kota secara perlahan
      const time = state.clock.getElapsedTime();
      const radius = 90; // Jarak kamera dari pusat
      targetPosition.set(
        Math.sin(time * 0.08) * radius,
        45, // Ketinggian kamera
        Math.cos(time * 0.08) * radius
      );
      targetLookAt.copy(OVERVIEW_LOOK_AT);
    }

    // Interpolasi posisi kamera secara mulus untuk menghindari gerakan yang kaku
    state.camera.position.lerp(targetPosition, delta * 1.5);

    // Interpolasi target pandang kamera secara mulus dengan memperbarui quaternion
    const tempCamera = state.camera.clone();
    tempCamera.lookAt(targetLookAt);
    state.camera.quaternion.slerp(tempCamera.quaternion, delta * 1.5);
  });

  return null; // Komponen ini tidak merender objek, hanya mengontrol kamera
};
