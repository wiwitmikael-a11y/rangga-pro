// FIX: Import React to resolve 'Cannot find namespace 'React'' error for React.FC type.
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CityDistrict } from '../../types';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  const cameraTargetVec = new THREE.Vector3();
  const controlsTargetVec = new THREE.Vector3();

  useFrame((state) => {
    if (!controlsRef.current) return;

    const isFocused = !!selectedDistrict;
    
    // Define camera and control targets
    const [dx, dy, dz] = selectedDistrict?.position || [0, 0, 0];
    const cameraTargetPosition = isFocused 
      ? cameraTargetVec.set(dx + 25, 20, dz + 25) 
      : cameraTargetVec.set(80, 40, 120);
      
    const controlsTargetPosition = isFocused 
      ? controlsTargetVec.set(dx, 10, dz) 
      : controlsTargetVec.set(0, 0, 0);

    // Smoothly interpolate camera position and controls target
    const speed = isFocused ? 0.08 : 0.02;
    state.camera.position.lerp(cameraTargetPosition, speed);
    controlsRef.current.target.lerp(controlsTargetPosition, speed);
    
    // Disable panning when focused on a district for better stability
    controlsRef.current.enablePan = !isFocused;
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      minDistance={10}
      maxDistance={200}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.2}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
};

export default CameraRig;