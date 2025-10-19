import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CityDistrict } from '../../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  const vec = new Vector3();

  useFrame((state) => {
    const camera = state.camera as any; // Using "any" to access orthographic properties like zoom
    let targetPosition: [number, number, number];
    let targetZoom: number;

    if (selectedDistrict) {
      const [x, _, z] = selectedDistrict.position3D;
      targetPosition = [x + 20, 20, z + 20];
      targetZoom = 60;
    } else {
      targetPosition = [40, 40, 40];
      targetZoom = 25;
    }

    // Smoothly interpolate camera position
    camera.position.lerp(vec.set(...targetPosition), 0.04);
    
    // Smoothly interpolate camera zoom
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.04);

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
};

// Import THREE globally if it's not automatically available
import * as THREE from 'three';

export default CameraRig;
