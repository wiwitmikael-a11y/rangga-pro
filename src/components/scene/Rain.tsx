// FIX: The triple-slash directive must be at the top of the file to correctly load TypeScript types for @react-three/fiber.
/// <reference types="@react-three/fiber" />

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainProps {
    count: number;
}

const Rain: React.FC<RainProps> = ({ count }) => {
    const pointsRef = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 300;
            pos[i * 3 + 1] = Math.random() * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
        }
        return pos;
    }, [count]);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < count; i++) {
                positions[i * 3 + 1] -= 30 * delta; // Kecepatan hujan yang konsisten
                if (positions[i * 3 + 1] < -5) {
                    positions[i * 3 + 1] = 100;
                }
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#00aaff"
                transparent
                opacity={0.3}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
            />
        </points>
    );
};

export default Rain;