import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { createNoise2D } from 'simplex-noise';
// FIX: Add import from '@react-three/fiber' to provide types for JSX primitives.
import { useThree } from '@react-three/fiber';

interface ProceduralTerrainProps {}

const TERRAIN_TEXTURE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/terrain.jpeg?v=2';

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(() => {
    // FIX: Call useThree hook to ensure R3F types are loaded for JSX.
    useThree();
    
    const terrainTexture = useTexture(TERRAIN_TEXTURE_URL);

    useMemo(() => {
        terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
        terrainTexture.repeat.set(25, 25);
        terrainTexture.anisotropy = 16;
    }, [terrainTexture]);

    const geometry = useMemo(() => {
        const planeGeo = new THREE.PlaneGeometry(500, 500, 200, 200);
        const noise = createNoise2D();
        const positions = planeGeo.attributes.position;

        // Define zones for the terrain shape
        const cityRadius = 90;
        const moatStartRadius = 100;
        const moatEndRadius = 120;
        const noisyTerrainStartRadius = 140;
        const moatDepth = 4;
        const noiseFactor = 0.015;

        // --- NEW: Constants for more dramatic, hilly terrain ---
        const noiseHeightMultiplier = 18; // Ditingkatkan untuk medan yang lebih dramatis
        const hillStartRadius = 150;      // Jarak di mana perbukitan mulai naik
        const maxRadius = 250;            // Tepi luar medan
        const hillRiseAmount = 50;        // Ketinggian maksimum tambahan untuk perbukitan

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getY(i); // In a plane, Y corresponds to the world Z-axis after rotation
            const distanceFromCenter = Math.sqrt(x * x + z * z);
            
            let height = 0;
            const rawNoiseHeight = noise(x * noiseFactor, z * noiseFactor) * noiseHeightMultiplier;

            if (distanceFromCenter <= cityRadius) {
                // Flat city center
                height = 0;
            } else if (distanceFromCenter <= moatStartRadius) {
                // Smoothstep from flat to start of moat dip
                const t = (distanceFromCenter - cityRadius) / (moatStartRadius - cityRadius);
                height = THREE.MathUtils.lerp(0, -moatDepth * 0.2, THREE.MathUtils.smoothstep(t, 0, 1));
            } else if (distanceFromCenter <= moatEndRadius) {
                // The main concave "moat"
                const t = (distanceFromCenter - moatStartRadius) / (moatEndRadius - moatStartRadius);
                height = THREE.MathUtils.lerp(-moatDepth * 0.2, -moatDepth, t * t); // Ease-in curve
            } else if (distanceFromCenter <= noisyTerrainStartRadius) {
                // Transition from moat bottom to the start of the noisy terrain
                const t = (distanceFromCenter - moatEndRadius) / (noisyTerrainStartRadius - moatEndRadius);
                height = THREE.MathUtils.lerp(-moatDepth, rawNoiseHeight, 1 - (1-t)*(1-t)); // Ease-out curve
            } else {
                // Fully noisy outer terrain
                height = rawNoiseHeight;
            }
            
            // --- NEW: Add the surrounding hill structure ---
            if (distanceFromCenter > hillStartRadius) {
                // Use an ease-out curve (1 - (1-t)^2) for a natural rise
                const t = (distanceFromCenter - hillStartRadius) / (maxRadius - hillStartRadius);
                const hillHeight = hillRiseAmount * (1 - Math.pow(1 - Math.min(t, 1), 2));
                height += hillHeight;
            }
            
            positions.setZ(i, height);
        }
        
        planeGeo.computeVertexNormals();
        return planeGeo;
    }, []);

    return (
        <group position={[0, -5.5, 0]}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
                geometry={geometry}
            >
                <meshStandardMaterial
                    map={terrainTexture}
                    normalMap={terrainTexture} 
                    normalScale={new THREE.Vector2(1.0, 1.0)}
                    displacementMap={terrainTexture}
                    displacementScale={0.4}
                    aoMap={terrainTexture}
                    aoMapIntensity={0.5}
                    metalness={0.2}
                    roughness={0.8}
                />
            </mesh>
        </group>
    );
});

useTexture.preload(TERRAIN_TEXTURE_URL);