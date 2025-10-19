import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

export const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    if (selectedDistrict) {
      const targetPosition = new THREE.Vector3(
        selectedDistrict.position3D[0],
        selectedDistrict.position3D[1] + 2,
        selectedDistrict.position3D[2] + 5 
      );
      camera.position.lerp(targetPosition, 0.05);
      
      const lookAtTarget = new THREE.Vector3(
          selectedDistrict.position3D[0],
          selectedDistrict.position3D[1] + 1,
          selectedDistrict.position3D[2]
      );
      // Fix: The camera should look at the target vector, not be assigned to it.
      camera.lookAt(lookAtTarget);
      
    } else {
      camera.position.lerp(vec.set(mouse.x * 2, 2 + mouse.y * 1, 14), 0.05);
      camera.lookAt(0, 1, 0);
    }
    camera.updateProjectionMatrix();
  });

  return null;
};
