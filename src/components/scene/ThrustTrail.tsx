import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

interface ThrustTrailProps {
    width?: number;
    length?: number;
    opacity?: number;
    color?: string;
    position?: [number, number, number];
}

export const ThrustTrail: React.FC<ThrustTrailProps> = ({ width = 0.3, length = 3, opacity = 0.5, color = '#00ffff', position = [0, 0, 0] }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    // This component renders a cone pointing towards -Z (backwards).
    // We offset it by half its length so its base starts at the provided `position`.
    const trailPosition: [number, number, number] = [position[0], position[1], position[2] - length / 2];

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const time = clock.getElapsedTime();
            const material = meshRef.current.material as THREE.MeshStandardMaterial;

            // Use noise to create a more chaotic, fiery flicker effect
            const baseFrequency = 15;
            
            // Flicker both length and width slightly differently and chaotically
            const lengthFlicker = 1.0 + (noise2D(time * baseFrequency, 0) + 1) / 2 * 0.3; // Range [1.0, 1.3]
            const widthFlicker = 1.0 + (noise2D(0, time * (baseFrequency + 2)) + 1) / 2 * 0.2; // Range [1.0, 1.2]
            
            // Y-axis on the mesh corresponds to the cone's height/length
            meshRef.current.scale.set(widthFlicker, lengthFlicker, widthFlicker);

            // Flicker opacity for a more dynamic feel
            material.opacity = opacity * (0.7 + (noise2D(time * 5, time * 5) + 1) / 2 * 0.3); // Range [0.7, 1.0] * base opacity
        }
    });

    return (
        <mesh ref={meshRef} position={trailPosition} rotation-x={Math.PI / 2}>
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