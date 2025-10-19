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
    // Enable damping for smoother camera movements
    if (controlsRef.current) {
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
    }
  }, []);

  useFrame((_, delta) => {
    if (selectedDistrict) {
      const [x, y, z] = selectedDistrict.position3D;
      targetPosition.set(x, y + 1.5, z + 6); // Zoom in on the island
      lookAtTarget.set(x, y, z);
    } else {
      targetPosition.set(0, 2, 14); // City overview
      lookAtTarget.set(0, 0, 0);
    }

    // Smoothly move camera and orbit controls target
    camera.position.lerp(targetPosition, delta * 2);
    controlsRef.current.target.lerp(lookAtTarget, delta * 2);
    controlsRef.current.update();
  });

  return (
      <OrbitControls 
        ref={controlsRef} 
        minDistance={3} 
        maxDistance={30} 
        enablePan={false}
      />
  );
};
