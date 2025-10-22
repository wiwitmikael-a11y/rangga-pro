
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlyingVehicleProps {
  count: number;
}

const FlyingVehicles: React.FC<FlyingVehicleProps> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const vehicles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = Math.random() * 40 + 10;
      const z = (Math.random() - 0.5) * 200;
      const speed = Math.random() * 0.5 + 0.2;
      temp.push({
        position: new THREE.Vector3(x, y, z),
        direction: new THREE.Vector3((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1).normalize(),
        speed,
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    vehicles.forEach((vehicle, i) => {
      vehicle.position.add(vehicle.direction.clone().multiplyScalar(vehicle.speed * delta * 50));

      if (vehicle.position.x > 100) vehicle.position.x = -100;
      if (vehicle.position.x < -100) vehicle.position.x = 100;
      if (vehicle.position.z > 100) vehicle.position.z = -100;
      if (vehicle.position.z < -100) vehicle.position.z = 100;
      
      dummy.position.copy(vehicle.position);
      dummy.lookAt(vehicle.position.clone().add(vehicle.direction));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[2, 0.2, 0.5]} />
      <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={3} toneMapped={false} />
    </instancedMesh>
  );
};

export default FlyingVehicles;