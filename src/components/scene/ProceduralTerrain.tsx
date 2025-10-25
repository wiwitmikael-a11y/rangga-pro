import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

const TEXTURE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/terrain.jpeg';

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
    const texture = useTexture(TEXTURE_URL);

    // Konfigurasi tekstur agar berulang (tiling) di seluruh permukaan
    useMemo(() => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(50, 50);
        texture.anisotropy = 16;
    }, [texture]);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onDeselect();
    };

    return (
        <group position={[0, -5.5, 0]}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={handleClick}
                receiveShadow
            >
                {/* Menggunakan CircleGeometry untuk cakrawala yang mulus dan membulat */}
                <circleGeometry args={[250, 128]} />
                <meshStandardMaterial
                    map={texture}
                    // Gunakan tekstur yang sama sebagai displacement map untuk detail ketinggian
                    displacementMap={texture}
                    displacementScale={2.5} // Seberapa kuat efek displacement
                    metalness={0.1}
                    roughness={0.8}
                />
            </mesh>
        </group>
    );
});

// Preload tekstur untuk pengalaman memuat yang lebih lancar
useTexture.preload(TEXTURE_URL);