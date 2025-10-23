/// <reference types="@react-three/fiber" />

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Menghapus 'flying_car.glb' yang tidak ada dan hanya menggunakan model yang tersedia.
const modelUrls = [
  'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_space.glb',
  'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_delorean.glb',
  'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb'
];

interface FlyingVehiclesProps {
  count: number;
}

const FlyingVehicles: React.FC<FlyingVehiclesProps> = ({ count }) => {
  const models = useGLTF(modelUrls);
  // Sesuaikan jumlah ref agar cocok dengan jumlah model.
  const meshRefs = [
      useRef<THREE.InstancedMesh>(null!),
      useRef<THREE.InstancedMesh>(null!),
      useRef<THREE.InstancedMesh>(null!)
  ];
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const vehicles = useMemo(() => Array.from({ length: count }, () => {
    const t = Math.random() * 100;
    const factor = 40 + Math.random() * 150;
    const speed = 0.005 + Math.random() * 0.01;
    const xFactor = -250 + Math.random() * 500;
    const yFactor = 20 + Math.random() * 50; // Terbang lebih tinggi
    const zFactor = -250 + Math.random() * 500;
    const modelIndex = Math.floor(Math.random() * modelUrls.length);
    return { t, factor, speed, xFactor, yFactor, zFactor, modelIndex };
  }), [count]);

  const clonedPrimitives = useMemo(() => models.map(m => m.scene.clone()), [models]);

  useFrame((_, delta) => {
    // Sesuaikan jumlah hitungan agar cocok dengan jumlah model.
    const counts = [0, 0, 0];
    
    vehicles.forEach((vehicle) => {
      let { factor, speed, xFactor, yFactor, zFactor, modelIndex } = vehicle;
      vehicle.t += speed;
      const { t } = vehicle;

      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      const pos = new THREE.Vector3(
        xFactor + Math.cos(a) * factor,
        yFactor + Math.sin(b) * 20,
        zFactor + Math.sin(a) * factor
      );

      const nextPos = new THREE.Vector3(
        xFactor + Math.cos(a + speed * 10) * factor,
        yFactor + Math.sin(b + speed * 10) * 20,
        zFactor + Math.sin(a + speed * 10) * factor
      );

      dummy.position.lerp(pos, delta * 5);
      dummy.lookAt(nextPos);
      dummy.updateMatrix();

      const ref = meshRefs[modelIndex]?.current;
      if (ref) {
        ref.setMatrixAt(counts[modelIndex]++, dummy.matrix);
      }
    });
    
    // Setelah semua matriks diperbarui, tandai untuk pembaruan render.
    meshRefs.forEach(ref => {
        if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <>
      {clonedPrimitives.map((primitive, i) => (
        <instancedMesh 
            key={i} 
            ref={meshRefs[i]} 
            args={[undefined, undefined, vehicles.filter(v => v.modelIndex === i).length]} 
            // Perbarui logika penskalaan: Skala diperkecil drastis
            scale={i === 1 ? 0.2 : 0.03} 
        >
          <primitive object={primitive} />
        </instancedMesh>
      ))}
    </>
  );
};

export default FlyingVehicles;
// Preload semua model yang valid
modelUrls.forEach(url => useGLTF.preload(url));