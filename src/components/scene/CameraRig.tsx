
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

export const CameraRig: React.FC<{ selectedDistrict: CityDistrict | null }> = ({ selectedDistrict }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null!);
  
  const targetPosition = new THREE.Vector3();
  const lookAtTarget = new THREE.Vector3();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      // For orthographic, zoom is controlled by zoom property, not distance
      controlsRef.current.minZoom = 30;
      controlsRef.current.maxZoom = 100;
    }
  }, []);

  useFrame((_, delta) => {
    let targetZoom = 40; // Default zoom for overview

    if (selectedDistrict) {
      const [x, y, z] = selectedDistrict.position3D;
      targetPosition.set(x + 5, y + 5, z + 5); 
      lookAtTarget.set(x, y, z);
      targetZoom = 80; // Zoom in on the island
    } else {
      targetPosition.set(15, 15, 15); // City overview position
      lookAtTarget.set(0, 0, 0);
    }

    // Smoothly move camera, orbit controls target, and zoom
    camera.position.lerp(targetPosition, delta * 2);
    if ('zoom' in camera) {
       (camera as THREE.OrthographicCamera).zoom = THREE.MathUtils.lerp((camera as THREE.OrthographicCamera).zoom, targetZoom, delta * 2);
       camera.updateProjectionMatrix();
    }
    controlsRef.current.target.lerp(lookAtTarget, delta * 2);
    controlsRef.current.update();
  });

  return (
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false}
      />
  );
};
