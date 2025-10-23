
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { CityDistrict } from './types';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

const OVERVIEW_CAM_POS = new THREE.Vector3(80, 40, 120);
const OVERVIEW_TARGET_POS = new THREE.Vector3(0, 0, 0);

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const { camera } = useThree();

  // Efek ini menyetel posisi awal kamera secara instan.
  useEffect(() => {
    camera.position.set(150, 80, 200);
  }, [camera]);

  const cameraTargetPos = useRef(new THREE.Vector3()).current;
  const controlsTargetPos = useRef(new THREE.Vector3()).current;

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const isFocused = !!selectedDistrict;

    if (selectedDistrict) {
        const [dx, dy, dz] = selectedDistrict.position;
        cameraTargetPos.set(dx + 25, dy + 20, dz + 25);
        controlsTargetPos.set(dx, dy + 10, dz);
    } else { // Mode gambaran umum
        cameraTargetPos.copy(OVERVIEW_CAM_POS);
        controlsTargetPos.copy(OVERVIEW_TARGET_POS);
    }

    // Menginterpolasi posisi kamera dan target kontrol dengan mulus
    const speed = delta * (isFocused ? 2.5 : 1.5);
    state.camera.position.lerp(cameraTargetPos, speed);
    controlsRef.current.target.lerp(controlsTargetPos, speed);
    
    // Nonaktifkan panning saat fokus pada distrik untuk stabilitas yang lebih baik
    controlsRef.current.enablePan = !isFocused;
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      minDistance={10}
      maxDistance={250}
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
