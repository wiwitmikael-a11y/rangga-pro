import React, { useMemo, useRef } from 'react';
import { useGLTF, Cylinder, Torus, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BASE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

// --- Model-based Components ---

export const PlayerMissileModel = React.forwardRef<THREE.Group, { [key: string]: any }>((props, ref) => {
  const { scene } = useGLTF(BASE_URL + 'player_missile.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive ref={ref} object={clonedScene} {...props} />;
});

export const EnemyBattleshipModel = React.forwardRef<THREE.Group, { [key: string]: any }>((props, ref) => {
  const { scene } = useGLTF(BASE_URL + 'enemy_battleship.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive ref={ref} object={clonedScene} scale={0.1} {...props} />;
});

export const EnemyFighterModel = React.forwardRef<THREE.Group, { [key: string]: any }>((props, ref) => {
  const { scene } = useGLTF(BASE_URL + 'enemy_fighter.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive ref={ref} object={clonedScene} scale={0.8} {...props} />;
});

// --- Procedural Components ---

interface LaserBeamProps {
    start: THREE.Vector3;
    end: THREE.Vector3;
}

export const LaserBeam: React.FC<LaserBeamProps> = ({ start, end }) => {
    const ref = useRef<THREE.Mesh>(null!);
    
    const { position, quaternion, height } = useMemo(() => {
        const direction = end.clone().sub(start);
        const height = direction.length();
        const position = start.clone().add(direction.clone().multiplyScalar(0.5));
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        return { position, quaternion, height };
    }, [start, end]);

    return (
        <Cylinder ref={ref} args={[0.3, 0.3, height, 8]} position={position} quaternion={quaternion}>
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={10} toneMapped={false} />
        </Cylinder>
    );
};

interface TargetReticuleProps {
    position: THREE.Vector3;
}

export const TargetReticule: React.FC<TargetReticuleProps> = ({ position }) => {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.z += delta * 2;
        }
    });

    return (
        <group position={position}>
            <Billboard>
                <Torus ref={ref} args={[4, 0.15, 2, 12]}>
                    <meshStandardMaterial color="red" emissive="red" emissiveIntensity={5} toneMapped={false} />
                </Torus>
            </Billboard>
        </group>
    );
};


// Preload all models for a smoother experience
useGLTF.preload(BASE_URL + 'player_missile.glb');
useGLTF.preload(BASE_URL + 'enemy_battleship.glb');
useGLTF.preload(BASE_URL + 'enemy_fighter.glb');
useGLTF.preload(BASE_URL + 'aegis_hq.glb');
