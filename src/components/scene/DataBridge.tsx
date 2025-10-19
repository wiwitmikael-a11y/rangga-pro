import React from 'react';
import * as THREE from 'three';

interface DataBridgeProps {
  start: [number, number, number];
  end: [number, number, number];
}

const DataBridge: React.FC<DataBridgeProps> = ({ start, end }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);

  const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const distance = startVec.distanceTo(endVec);
  
  const orientation = new THREE.Matrix4();
  orientation.lookAt(startVec, endVec, new THREE.Object3D().up);
  orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));

  return (
    <mesh
      position={position}
      quaternion={new THREE.Quaternion().setFromRotationMatrix(orientation)}
    >
      <cylinderGeometry args={[0.5, 0.5, distance, 8]} />
      <meshStandardMaterial
        color="#00ffff"
        transparent
        opacity={0.3}
        metalness={0.5}
        roughness={0.1}
      />
    </mesh>
  );
};

export default DataBridge;
