import React, { useMemo, useRef } from 'react';
// FIX: This side-effect import extends the JSX namespace to include react-three-fiber elements, resolving TypeScript errors.
import '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlyingVehicleProps {
  count: number;
}

const FlyingVehicles: React.FC<FlyingVehicleProps> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

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
    if (meshRef.current) {
      vehicles.forEach((vehicle, i) => {
        vehicle.position.addScaledVector(vehicle.direction, vehicle.speed);

        // Simple boundary checks to reset vehicles
        if (Math.abs(vehicle.position.x) > 80 || Math.abs(vehicle.position.z) > 80) {
            vehicle.position.x = (Math.random() - 0.5) * 150;
            vehicle.position.z = (Math.random() - 0.5) * 150;
        }

        dummy.position.copy(vehicle.position);
        // Make vehicle look towards its direction
        dummy.lookAt(vehicle.position.clone().add(vehicle.direction));
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
      <meshStandardMaterial color="#ffffff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  );
};

export default FlyingVehicles;