import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CityDistrict } from '../../types';
import * as THREE from 'three';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  const controlsRef = useRef<any>(null);

  const cameraTargetVec = new THREE.Vector3();
  const controlsTargetVec = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const isFocused = !!selectedDistrict;
    
    // Define camera and control targets
    const [dx, dy, dz] = selectedDistrict?.position || [0, 0, 0];
    const cameraTargetPosition = isFocused 
      ? cameraTargetVec.set(dx + 20, 20, dz + 20) 
      : cameraTargetVec.set(60, 60, 60);
      
    const controlsTargetPosition = isFocused 
      ? controlsTargetVec.set(dx, 5, dz) 
      : controlsTargetVec.set(0, 0, 0);

    // Smoothly interpolate camera position and controls target
    const speed = isFocused ? 0.08 : 0.02;
    state.camera.position.lerp(cameraTargetPosition, speed);
    controlsRef.current.target.lerp(controlsTargetPosition, speed);
    
    controlsRef.current.enabled = true; // Always allow rotation
    controlsRef.current.update(delta);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableRotate={true}
      minDistance={10}
      maxDistance={150}
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