import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CityDistrict } from '../../types';
import * as THREE from 'three';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  // Fix: The error "Expected 1 arguments, but got 0" likely refers to this useRef call.
  // Providing a `null` initial value is best practice for refs that will hold component instances.
  const controlsRef = useRef<any>(null);

  // Fix: The original code had a logic bug by reusing a single Vector3 instance for both camera and controls targets.
  // This caused both targets to point to the same, last-updated coordinates.
  // We now use two separate vectors to maintain distinct targets and have cleaned up the redundant 'three' imports.
  const cameraTargetVec = new THREE.Vector3();
  const controlsTargetVec = new THREE.Vector3();

  useFrame((state) => {
    if (!controlsRef.current) return;

    const camera = state.camera as any;
    const isFocused = !!selectedDistrict;
    
    // Define camera and control targets
    const cameraTargetPosition = isFocused 
      ? cameraTargetVec.set(selectedDistrict.position3D[0] + 15, 15, selectedDistrict.position3D[2] + 15) 
      : cameraTargetVec.set(40, 40, 40);
      
    const controlsTargetPosition = isFocused 
      ? controlsTargetVec.set(...selectedDistrict.position3D) 
      : controlsTargetVec.set(0, 0, 0);

    const targetZoom = isFocused ? 80 : 25;

    // Smoothly interpolate camera position and controls target
    camera.position.lerp(cameraTargetPosition, 0.04);
    controlsRef.current.target.lerp(controlsTargetPosition, 0.04);
    
    // Smoothly interpolate zoom
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.04);
    
    controlsRef.current.enabled = isFocused;
    controlsRef.current.update();
    camera.updateProjectionMatrix();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableRotate={true}
      minZoom={40}
      maxZoom={120}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE, // Allow right-click rotation
      }}
    />
  );
};

export default CameraRig;
