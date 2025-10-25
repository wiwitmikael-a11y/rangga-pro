import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { createNoise2D } from 'simplex-noise';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

// The original PBR atlas texture the user wanted.
const TERRAIN_TEXTURE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/terrain.jpeg';

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
    // Load the rock texture
    const terrainTexture = useTexture(TERRAIN_TEXTURE_URL);

    // Configure texture tiling
    useMemo(() => {
        terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
        terrainTexture.repeat.set(15, 15); // Adjust tiling for a good scale on a large surface
        terrainTexture.anisotropy = 16;
    }, [terrainTexture]);

    // Create the procedural geometry using simplex noise for vertex displacement
    const geometry = useMemo(() => {
        const planeGeo = new THREE.PlaneGeometry(500, 500, 200, 200);
        const noise = createNoise2D();
        const positions = planeGeo.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i); // This corresponds to the Z-axis in world space after rotation
            
            // Apply noise to the vertex's Z-axis (which becomes height)
            const noiseFactor = 0.015;
            const height = noise(x * noiseFactor, y * noiseFactor) * 5; // Adjust multiplier for ruggedness
            positions.setZ(i, height);
        }
        
        planeGeo.computeVertexNormals(); // Recalculate normals for correct lighting on the uneven surface
        return planeGeo;
    }, []);

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
                geometry={geometry} // Use the custom procedural geometry
            >
                <meshStandardMaterial
                    map={terrainTexture}
                    // Add a normal map for detail. Using the same texture can work for a simple bump map effect.
                    normalMap={terrainTexture} 
                    normalScale={new THREE.Vector2(0.5, 0.5)} // Control the intensity of the normal map
                    displacementMap={terrainTexture}
                    displacementScale={0.2} // Subtle displacement from texture
                    metalness={0.2} // Less metallic for a rock surface
                    roughness={0.8} // More rough for a rock surface
                />
            </mesh>
        </group>
    );
});

// Preload the texture for a smoother loading experience
useTexture.preload(TERRAIN_TEXTURE_URL);