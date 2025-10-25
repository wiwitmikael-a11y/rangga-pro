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
        terrainTexture.repeat.set(25, 25); // Increased tiling to better showcase the detailed texture
        terrainTexture.anisotropy = 16;
    }, [terrainTexture]);

    // Create the procedural geometry using simplex noise for vertex displacement
    const geometry = useMemo(() => {
        const planeGeo = new THREE.PlaneGeometry(500, 500, 200, 200);
        const noise = createNoise2D();
        const positions = planeGeo.attributes.position;
        const curvatureFactor = 0.0003; // Controls how much the terrain curves down at the edges

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i); // This corresponds to the Z-axis in world space after rotation
            
            // Apply noise to the vertex's Z-axis (which becomes height)
            const noiseFactor = 0.015;
            const height = noise(x * noiseFactor, y * noiseFactor) * 5; // Adjust multiplier for ruggedness

            // Apply a downward curve based on distance from the center to create a rounded effect
            const distanceFromCenterSq = x * x + y * y;
            const curveOffset = distanceFromCenterSq * curvatureFactor;
            
            positions.setZ(i, height - curveOffset);
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
                    // Use the detailed texture for multiple PBR channels to enhance realism
                    normalMap={terrainTexture} 
                    normalScale={new THREE.Vector2(1.0, 1.0)} // Increased intensity for more pronounced bumps
                    displacementMap={terrainTexture}
                    displacementScale={0.4} // Increased displacement for more physical depth
                    aoMap={terrainTexture} // Add ambient occlusion for more realistic self-shadowing
                    aoMapIntensity={0.5}
                    metalness={0.2} // Less metallic for a rock surface
                    roughness={0.8} // More rough for a rock surface
                />
            </mesh>
        </group>
    );
});

// Preload the texture for a smoother loading experience
useTexture.preload(TERRAIN_TEXTURE_URL);