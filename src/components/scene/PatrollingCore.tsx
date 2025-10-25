import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/PatrollingCore.glb';

// Inisialisasi fungsi noise di luar komponen untuk performa
const noise3D = createNoise3D();

interface PatrollingCoreProps {
  godRaysSourceRef: React.RefObject<THREE.Mesh>;
}

export const PatrollingCore: React.FC<PatrollingCoreProps> = React.memo(({ godRaysSourceRef }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  const { scene } = useGLTF(MODEL_URL);
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const spotLightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    return target;
  }, []);

  // Simpan posisi sebelumnya untuk menghitung arah pergerakan
  const previousPosition = useMemo(() => new THREE.Vector3(), []);
  
  useFrame(({ clock }) => {
    if (!groupRef.current || !spotLightRef.current) return;

    const elapsedTime = clock.getElapsedTime();
    const movementSpeed = 0.1; // Mengontrol kecepatan patroli keseluruhan

    // 1. Buat jalur 3D menggunakan Simplex noise untuk pergerakan yang lebih alami dan eksploratif
    const time = elapsedTime * movementSpeed;
    const horizontalRange = 80; // Seberapa jauh ia bisa bergerak secara horizontal
    const verticalRange = 25;   // Rentang pergerakan vertikalnya
    const baseHeight = 35;      // Ketinggian minimum

    // Gunakan noise untuk koordinat x dan z
    const x = noise3D(time, 0, 0) * horizontalRange;
    const z = noise3D(0, time, 0) * horizontalRange;
    
    // Gunakan dimensi noise ketiga untuk variasi ketinggian yang mulus
    const heightNoise = (noise3D(0, 0, time) + 1) / 2; // Map noise dari [-1, 1] ke [0, 1]
    const y = baseHeight + heightNoise * verticalRange;

    // Simpan posisi saat ini sebelum diperbarui
    previousPosition.copy(groupRef.current.position);

    // Interpolasi ke posisi baru secara mulus untuk menghindari gerakan patah-patah
    groupRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.05);

    // 2. Buat core melihat ke arah tujuannya, kecuali jika sedang diam
    if (previousPosition.distanceTo(groupRef.current.position) > 0.01) {
       const lookAtTarget = new THREE.Vector3().copy(groupRef.current.position).add(
         new THREE.Vector3().subVectors(groupRef.current.position, previousPosition).normalize()
       );
       const tempObject = new THREE.Object3D();
       tempObject.position.copy(groupRef.current.position);
       tempObject.lookAt(lookAtTarget);
       groupRef.current.quaternion.slerp(tempObject.quaternion, 0.05);
    }

    // 3. Perbarui target sorotan agar berada tepat di bawah core
    spotLightTarget.position.set(groupRef.current.position.x, 0, groupRef.current.position.z);
    spotLightRef.current.target = spotLightTarget;
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        scale={4.5} 
        position-y={-2} 
      />
      
       <mesh ref={godRaysSourceRef} position={[0, 5, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="white" visible={false} />
      </mesh>

      {/* Sorotan diperbarui menjadi sinar pemindai oranye yang lebar */}
      <spotLight
        ref={spotLightRef}
        position={[0, 5, 0]} 
        angle={Math.PI / 3} // Kerucut cahaya dibuat jauh lebih lebar
        penumbra={0.4} // Melembutkan tepi untuk efek pemindaian
        intensity={50} // Kecerahan ditingkatkan untuk kerucut yang lebih lebar
        distance={150} // Jangkauan ditingkatkan untuk memastikan cahaya mencapai tanah dari ketinggian maks
        castShadow
        color="#FF9900" // Diubah menjadi oranye
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <primitive object={spotLightTarget} />
    </group>
  );
});

useGLTF.preload(MODEL_URL);