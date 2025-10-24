import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ThrustTrail: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            // Create a flickering effect for the engine thrust
            const scale = 1 + Math.sin(clock.getElapsedTime() * 50) * 0.2;
            meshRef.current.scale.set(1, scale, 1);
        }
    });

    return (
        <mesh ref={meshRef} position-z={-2} rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.3, 3, 8]} />
            <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={4}
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
};
