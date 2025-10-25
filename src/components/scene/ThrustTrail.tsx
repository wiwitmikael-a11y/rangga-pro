import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThrustTrailProps {
    width?: number;
    length?: number;
    opacity?: number;
    color?: string;
    position?: [number, number, number];
}

export const ThrustTrail: React.FC<ThrustTrailProps> = ({ width = 0.3, length = 3, opacity = 0.5, color = '#00ffff', position = [0, 0, 0] }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    // The cone points towards +Z after rotation. We offset it by half its length
    // so its base starts at the provided `position`.
    const trailPosition: [number, number, number] = [position[0], position[1], position[2] + length / 2];

    useFrame(({ clock }) => {
        if (meshRef.current) {
            // Create a flickering effect for the engine thrust
            const scale = 1 + Math.sin(clock.getElapsedTime() * 50) * 0.2;
            meshRef.current.scale.set(1, scale, 1);
        }
    });

    return (
        <mesh ref={meshRef} position={trailPosition} rotation-x={-Math.PI / 2}>
            <coneGeometry args={[width, length, 8]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={4}
                transparent
                opacity={opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
};
