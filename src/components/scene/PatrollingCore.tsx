import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/PatrollingCore.glb';
const SCALE = 4; 

const noise3D = createNoise3D();

interface PatrollingCoreProps {
  isPaused?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const PatrollingCore = forwardRef<THREE.Group, PatrollingCoreProps>(({ isPaused, isSelected, onSelect }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const { scene } = useGLTF(MODEL_URL);
  const { camera } = useThree();
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const previousPosition = useMemo(() => new THREE.Vector3(), []);
  
  const originalEmissive = useMemo(() => new THREE.Color(0, 0, 0), []);
  const hoverEmissive = useMemo(() => new THREE.Color('#00ffff'), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (isSelected) {
      // When selected, stop patrolling and turn to face the camera.
      const lookAtTarget = new THREE.Vector3(camera.position.x, groupRef.current.position.y, camera.position.z);
      const tempObject = new THREE.Object3D();
      tempObject.position.copy(groupRef.current.position);
      tempObject.lookAt(lookAtTarget);
      groupRef.current.quaternion.slerp(tempObject.quaternion, 0.05);
      return;
    }
    
    if (isPaused) return;

    const elapsedTime = clock.getElapsedTime();
    const movementSpeed = 0.04;
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
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.emissive.copy(hoverEmissive);
        child.material.emissiveIntensity = 0.5;
      }
    });
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.emissive.copy(originalEmissive);
        child.material.emissiveIntensity = 1;
      }
    });
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  }

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        scale={SCALE}
        position-y={0}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
});

useGLTF.preload(MODEL_URL);