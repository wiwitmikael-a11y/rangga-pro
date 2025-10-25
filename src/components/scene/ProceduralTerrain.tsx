import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { createNoise2D } from 'simplex-noise';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

const ROCK_TEXTURE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/terrain.jpeg';
const ROCK_NORMAL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/terrain-normal.jpg';


export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
    // Load the correct rock texture and its normal map for PBR rendering.
    const [rockTexture, rockNormalTexture] = useTexture([ROCK_TEXTURE_URL, ROCK_NORMAL_URL]);

    // Configure textures for tiling.
    useMemo(() => {
        [rockTexture, rockNormalTexture].forEach(texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(20, 20); // Tile the texture across the large plane.
            texture.anisotropy = 16;
        });
    }, [rockTexture, rockNormalTexture]);

    // Procedurally generate the terrain geometry using simplex noise.
    const geometry = useMemo(() => {
        const planeGeo = new THREE.PlaneGeometry(500, 500, 200, 200);
        const noise = createNoise2D();
        const positions = planeGeo.attributes.position;

        // Iterate over each vertex in the plane geometry.
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Calculate noise. Dividing x and z scales the noise features, creating larger hills/valleys.
            const noiseFactor = 0.5 * noise(x / 100, z / 100) + 0.3 * noise(x / 50, z / 50) + 0.2 * noise(x / 25, z / 25);
            
            // Apply the noise to the Y-coordinate to create elevation. Multiplying controls the height.
            positions.setY(i, noiseFactor * 5);
        }

        // IMPORTANT: Re-compute normals after displacing vertices for correct lighting.
        planeGeo.computeVertexNormals();
        return planeGeo;
    }, []);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        // Allow deselection by clicking on the terrain.
        e.stopPropagation();
        onDeselect();
    };

    return (
        <group position={[0, -5.5, 0]}>
            <mesh
                geometry={geometry}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={handleClick}
                receiveShadow
            >
                <meshStandardMaterial
                    map={rockTexture}
                    normalMap={rockNormalTexture}
                    metalness={0.2}
                    roughness={0.8}
                />
            </mesh>
        </group>
    );
});

// Preload textures for a smoother loading experience.
useTexture.preload(ROCK_TEXTURE_URL);
useTexture.preload(ROCK_NORMAL_URL);