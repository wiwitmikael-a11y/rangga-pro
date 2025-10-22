import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CityDistrict } from '../../types';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { portfolioData } from '../../constants';


interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
  hoveredDistrictId: string | null;
  isGameActive: boolean;
}

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict, hoveredDistrictId, isGameActive }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const [isIntroDone, setIsIntroDone] = useState(false);

  const cameraTargetVec = new THREE.Vector3();
  const controlsTargetVec = new THREE.Vector3();

  useEffect(() => {
    // The intro animation will happen on the first render via useFrame
    const timer = setTimeout(() => setIsIntroDone(true), 3000); // Duration of the intro fly-through
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const isFocused = !!selectedDistrict || isGameActive;
    
    // Define camera and control targets
    const [dx, dy, dz] = selectedDistrict?.position || [0, 0, 0];
    
    // Initial fly-through animation
    const introTargetPosition = cameraTargetVec.set(80, 40, 120);

    let cameraTargetPosition;
    let controlsTargetPosition;

    if(isGameActive) {
      cameraTargetPosition = cameraTargetVec.set(0, 20, 25);
      controlsTargetPosition = controlsTargetVec.set(0, 0, 0);
    } else if (selectedDistrict) {
      cameraTargetPosition = cameraTargetVec.set(dx + 25, 20, dz + 25) 
    } else {
      cameraTargetPosition = introTargetPosition;
    }
    

    const hoveredDistrict = portfolioData.find(d => d.id === hoveredDistrictId);
    const [hx, hy, hz] = hoveredDistrict?.position || [0, 0, 0];
      
    // Default target is the center, but if hovering, subtly shift towards the hovered district
    const defaultControlsTarget = controlsTargetVec.set(0, 0, 0);
    if (!isFocused && hoveredDistrictId && isIntroDone) {
        defaultControlsTarget.lerp(new THREE.Vector3(hx, 0, hz), 0.1);
    }
    
    if(!isGameActive && selectedDistrict) {
        controlsTargetPosition = controlsTargetVec.set(dx, 10, dz) 
    } else if (!isGameActive && !selectedDistrict) {
        controlsTargetPosition = defaultControlsTarget;
    }


    // Smoothly interpolate camera position and controls target
    let speed = delta * 1.5;
    if (isFocused) speed *= 2;
    if (!isIntroDone) speed = delta * 0.5;

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
      maxDistance={250} // Increased max distance for intro
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