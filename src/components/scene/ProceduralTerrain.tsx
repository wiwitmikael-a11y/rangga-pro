import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

// Mengganti tekstur ke yang lebih sesuai tema sci-fi/cyberpunk
const SCI_FI_TEXTURE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/scifi-floor.png';

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
    // Memuat tekstur baru
    const sciFiTexture = useTexture(SCI_FI_TEXTURE_URL);

    // Konfigurasi tekstur agar berulang (tiling) di seluruh permukaan
    useMemo(() => {
        sciFiTexture.wrapS = sciFiTexture.wrapT = THREE.RepeatWrapping;
        sciFiTexture.repeat.set(25, 25); // Mengurangi pengulangan agar pola tidak terlalu kecil
        sciFiTexture.anisotropy = 16;
    }, [sciFiTexture]);

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
                {/* Mengganti CircleGeometry dengan PlaneGeometry untuk permukaan yang lebih seragam */}
                <planeGeometry args={[500, 500, 200, 200]} />
                <meshStandardMaterial
                    map={sciFiTexture}
                    // Menggunakan tekstur yang sama untuk displacement dan emissive map
                    displacementMap={sciFiTexture}
                    displacementScale={0.5} // Mengurangi skala displacement agar tidak terlalu berlebihan
                    metalness={0.8}
                    roughness={0.4}
                    // Menambahkan emissive map untuk membuat garis-garis sirkuit bersinar
                    emissiveMap={sciFiTexture}
                    emissive={new THREE.Color('#00ffff')} // Warna cahaya (cyan)
                    emissiveIntensity={1.5}
                    toneMapped={false} // Menonaktifkan tone mapping pada emisi untuk cahaya yang lebih murni
                />
            </mesh>
        </group>
    );
});

// Preload tekstur untuk pengalaman memuat yang lebih lancar
useTexture.preload(SCI_FI_TEXTURE_URL);