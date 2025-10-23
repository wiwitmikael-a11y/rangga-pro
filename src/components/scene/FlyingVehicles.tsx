/// <reference types="@react-three/fiber" />

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface FlyingVehiclesProps {
  count: number;
}

export const FlyingVehicles: React.FC<FlyingVehiclesProps> = React.memo(({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { nodes } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sci-fi_flying_car.glb');
  
  // Safely access geometry
  const carGeometry = useMemo(() => {
    const carNode = nodes.Car as THREE.Mesh;
    return carNode ? carNode.geometry : new THREE.BoxGeometry();
  }, [nodes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const vehicles = useMemo(() => {
    const temp = [];
    const pathRadius = 60;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * 20 + 10;
      const speed = Math.random() * 0.2 + 0.1;
      temp.push({ angle, y, speed, pathRadius: pathRadius + (Math.random() - 0.5) * 30 });
    }
    return temp;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    vehicles.forEach((vehicle, i) => {
      vehicle.angle += vehicle.speed * delta;
      
      const x = Math.cos(vehicle.angle) * vehicle.pathRadius;
      const z = Math.sin(vehicle.angle) * vehicle.pathRadius;
      
      dummy.position.set(x, vehicle.y, z);

      // Look at the next point on the path
      const nextX = Math.cos(vehicle.angle + 0.1) * vehicle.pathRadius;
      const nextZ = Math.sin(vehicle.angle + 0.1) * vehicle.pathRadius;
      dummy.lookAt(nextX, vehicle.y, nextZ);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[carGeometry, undefined, count]} scale={0.5}>
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.3} />
    </instancedMesh>
  );
});

useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sci-fi_flying_car.glb');
