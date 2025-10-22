import React, { useMemo, useRef } from 'react';
// FIX: All JSX elements from react-three-fiber were causing TypeScript errors. Adding this side-effect import brings the necessary type definitions into scope.
import '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlyingVehicleProps {
  count: number;
}

const FlyingVehicles: React.FC<FlyingVehicleProps> = ({ count }) => {
  const groupRef = useRef<THREE.Group>(null!);

  const vehicles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 150;
      const y = Math.random() * 40 + 10; // Fly at various altitudes
      const z = (Math.random() - 0.5) * 150;
      const speed = Math.random() * 0.2 + 0.1;
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        0, // They fly horizontally
        (Math.random() - 0.5) * 2
      ).normalize();
      
      temp.push({
        position: new THREE.Vector3(x, y, z),
        speed,
        direction,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (groupRef.current) {
      vehicles.forEach((vehicle, i) => {
        vehicle.position.addScaledVector(vehicle.direction, vehicle.speed);

        // Simple boundary checks to reset vehicles
        if (Math.abs(vehicle.position.x) > 80 || Math.abs(vehicle.position.z) > 80) {
            vehicle.position.x = (Math.random() - 0.5) * 150;
            vehicle.position.z = (Math.random() - 0.5) * 150;
        }

        dummy.position.copy(vehicle.position);
        dummy.updateMatrix();
        (groupRef.current as any).setMatrixAt(i, dummy.matrix);
      });
      (groupRef.current as any).instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={groupRef as any} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 0.2, 0.4]} />
      <meshBasicMaterial color="#ff00ff" toneMapped={false} />
    </instancedMesh>
  );
};

export default FlyingVehicles;