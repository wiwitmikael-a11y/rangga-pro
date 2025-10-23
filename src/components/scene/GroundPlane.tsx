// FIX: Remove the triple-slash directive for @react-three/fiber types.

import React from 'react';
import { ThreeEvent } from '@react-three/fiber';

interface GroundPlaneProps {
    onDeselect: () => void;
}

export const GroundPlane: React.FC<GroundPlaneProps> = React.memo(({ onDeselect }) => {
    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        // Stop propagation to prevent clicks from "passing through" to other objects
        // that might be behind the ground from the camera's perspective.
        e.stopPropagation();
        onDeselect();
    };

    return (
        <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -5.1, 0]} 
            receiveShadow
            onClick={handleClick}
        >
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial 
                color="#0a0a0a" // Warna gelap untuk aspal
                metalness={0.8} // Efek metalik untuk pantulan seperti genangan air
                roughness={0.4} // Sedikit kasar agar tidak seperti cermin sempurna
                envMapIntensity={0.5}
            />
        </mesh>
    );
});