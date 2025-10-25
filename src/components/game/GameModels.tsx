import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

// A visual effect for the auto-cannon firing.
export const MuzzleFlash: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);
    const isFiring = useRef(false);

    // This simulates rapid, short bursts of fire.
    useFrame(({ clock }) => {
        const shouldFireNow = Math.random() > 0.95; // Fire randomly but frequently
        
        if (shouldFireNow && !isFiring.current) {
            isFiring.current = true;
            if (meshRef.current) {
                meshRef.current.visible = true;
                meshRef.current.scale.set(1, 1, 1).multiplyScalar(0.2 + Math.random() * 0.2);
                meshRef.current.rotation.z = Math.random() * Math.PI * 2;
            }
            if (lightRef.current) {
                lightRef.current.visible = true;
                lightRef.current.intensity = 20 + Math.random() * 20;
            }
        } else if (isFiring.current) {
            isFiring.current = false;
            if (meshRef.current) meshRef.current.visible = false;
            if (lightRef.current) lightRef.current.visible = false;
        }
    });

    return (
        <group position={[0, 0.2, -1.8]}>
            <mesh ref={meshRef} visible={false}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="yellow"
                    emissive="yellow"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
            <pointLight ref={lightRef} color="yellow" distance={5} visible={false} />
        </group>
    );
};

// Placeholder for enemy drone model
export const EnemyDrone: React.FC<{position: [number, number, number]}> = ({position}) => {
    const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/enemy_drone.glb');
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} position={position} scale={4} />;
};

useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/enemy_drone.glb');
