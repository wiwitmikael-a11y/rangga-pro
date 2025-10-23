// FIX: Removed obsolete triple-slash directive for @react-three/fiber types, which was causing JSX type errors.
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface FlyingVehiclesProps {
  count: number;
}

const FlyingVehicles: React.FC<FlyingVehiclesProps> = ({ count }) => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/flying_car.glb');
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const vehicles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 10 + Math.random() * 50;
      const speed = 0.005 + Math.random() * 0.01;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = 10 + Math.random() * 20;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    vehicles.forEach((vehicle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = vehicle;
      t = vehicle.t += speed;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      const pos = new THREE.Vector3(
        xFactor + Math.cos(a) * factor,
        yFactor + Math.sin(b) * 10,
        zFactor + Math.sin(a) * factor
      );

      dummy.position.copy(pos);
      
      const nextPos = new THREE.Vector3(
        xFactor + Math.cos(a + speed) * factor,
        yFactor + Math.sin(b + speed) * 10,
        zFactor + Math.sin(a + speed) * factor
      );
      dummy.lookAt(nextPos);

      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} scale={0.5}>
       <primitive object={scene.clone()} />
    </instancedMesh>
  );
};

export default FlyingVehicles;
// Preload the model
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/flying_car.glb');