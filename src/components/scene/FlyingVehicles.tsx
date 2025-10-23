/// <reference types="@react-three/fiber" />
import { useRef, useMemo } from 'react';
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

  const vehicles = useMemo(() => Array.from({ length: count }, () => {
    const t = Math.random() * 100;
    const factor = 20 + Math.random() * 80;
    const speed = 0.005 + Math.random() * 0.01;
    const xFactor = -100 + Math.random() * 200;
    const yFactor = 10 + Math.random() * 20;
    const zFactor = -100 + Math.random() * 200;
    return { t, factor, speed, xFactor, yFactor, zFactor };
  }), [count]);

  const clonedPrimitive = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    vehicles.forEach((vehicle, i) => {
      let { factor, speed, xFactor, yFactor, zFactor } = vehicle;
      vehicle.t += speed;
      const { t } = vehicle;

      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      const pos = new THREE.Vector3(
        xFactor + Math.cos(a) * factor,
        yFactor + Math.sin(b) * 10,
        zFactor + Math.sin(a) * factor
      );

      const nextPos = new THREE.Vector3(
        xFactor + Math.cos(a + speed * 10) * factor,
        yFactor + Math.sin(b + speed * 10) * 10,
        zFactor + Math.sin(a + speed * 10) * factor
      );

      dummy.position.lerp(pos, delta * 5); // lerp for smoother movement
      dummy.lookAt(nextPos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} scale={0.5}>
       <primitive object={clonedPrimitive} />
    </instancedMesh>
  );
};

export default FlyingVehicles;
// Preload model untuk pengalaman yang lebih lancar
useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/flying_car.glb');