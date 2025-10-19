// FIX: Implemented component to resolve placeholder errors and provide camera functionality.
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CityDistrict } from '../../types';

interface CameraRigProps {
  selectedDistrict: CityDistrict | null;
}

const CameraRig: React.FC<CameraRigProps> = ({ selectedDistrict }) => {
  const vec = new Vector3();

  useFrame((state) => {
    let targetPosition: [number, number, number];
    if (selectedDistrict) {
      targetPosition = [
        selectedDistrict.position3D[0],
        selectedDistrict.position3D[1] + 5,
        selectedDistrict.position3D[2] + 15,
      ];
    } else {
      targetPosition = [0, 15, 35];
    }

    state.camera.position.lerp(vec.set(...targetPosition), 0.025);
    state.camera.lookAt(0, 5, 0);
    state.camera.updateProjectionMatrix();
  });

  return null;
};

export default CameraRig;
