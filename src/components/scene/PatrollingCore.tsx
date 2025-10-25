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
  const volumetricLightRef = useRef<THREE.Mesh>(null!); // Ref untuk sinar volumetrik
  const { scene } = useGLTF(MODEL_URL);
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const spotLightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    return target;
  }, []);

  const previousPosition = useMemo(() => new THREE.Vector3(), []);
  
  useFrame(({ clock }) => {
    if (!groupRef.current || !spotLightRef.current || !volumetricLightRef.current) return;

    const elapsedTime = clock.getElapsedTime();
    const movementSpeed = 0.04; // Gerakan diperlambat secara signifikan

    const time = elapsedTime * movementSpeed;
    const horizontalRange = 80;
    const verticalRange = 25;
    const baseHeight = 35;

    const x = noise3D(time, 0, 0) * horizontalRange;
    const z = noise3D(0, time, 0) * horizontalRange;
    const heightNoise = (noise3D(0, 0, time) + 1) / 2;
    const y = baseHeight + heightNoise * verticalRange;

    previousPosition.copy(groupRef.current.position);
    groupRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.05);

    if (previousPosition.distanceTo(groupRef.current.position) > 0.01) {
       const lookAtTarget = new THREE.Vector3().copy(groupRef.current.position).add(
         new THREE.Vector3().subVectors(groupRef.current.position, previousPosition).normalize()
       );
       const tempObject = new THREE.Object3D();
       tempObject.position.copy(groupRef.current.position);
       tempObject.lookAt(lookAtTarget);
       groupRef.current.quaternion.slerp(tempObject.quaternion, 0.05);
    }

    // Gerakan memindai melingkar di tanah
    const scanRadius = 45; // Radius diperluas
    const scanSpeed = 0.3;
    const scanX = Math.sin(elapsedTime * scanSpeed) * scanRadius;
    const scanZ = Math.cos(elapsedTime * scanSpeed) * scanRadius;

    const groundTargetPos = new THREE.Vector3(
        groupRef.current.position.x + scanX,
        0, 
        groupRef.current.position.z + scanZ
    );

    spotLightTarget.position.copy(groundTargetPos);
    spotLightRef.current.target = spotLightTarget;
    
    // Sinkronkan sinar volumetrik dengan sorotan
    volumetricLightRef.current.lookAt(groundTargetPos);
    const distanceToGround = groupRef.current.position.distanceTo(groundTargetPos);
    volumetricLightRef.current.scale.z = distanceToGround;
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        scale={4} // Ukuran diperkecil 3x lipat
        position-y={0} 
      />
      
       {/* Posisi GodRays sekarang di bawah, di sumber cahaya */}
       <mesh ref={godRaysSourceRef} position={[0, -2, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="white" visible={false} />
      </mesh>

      <spotLight
        ref={spotLightRef}
        position={[0, -2, 0]} // Sumber cahaya disesuaikan dengan skala baru
        angle={Math.PI / 1.8} // Sudut diperlebar secara dramatis
        penumbra={0.4}
        intensity={400} // Intensitas ditingkatkan
        distance={200}
        castShadow
        color="#FF4500"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Sinar Volumetrik Palsu diposisikan di sumber cahaya */}
      <mesh ref={volumetricLightRef} position={[0, -2, 0]}>
        <coneGeometry args={[25, 1, 32, 1, true]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <primitive object={spotLightTarget} />
    </group>
  );
});

useGLTF.preload(MODEL_URL);