import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { createNoise2D } from 'simplex-noise';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

const TERRAIN_TEXTURE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/terrain.jpeg?v=2';

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
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
        const cityRadius = 90; // The completely flat central area
        const moatStartRadius = 100; // Where the concave dip begins
        const moatEndRadius = 120;   // Where the dip reaches its lowest point
        const noisyTerrainStartRadius = 140; // Where the bumpy terrain begins to rise
        const moatDepth = 4;    // How deep the concave moat is
        const noiseFactor = 0.015;
        const noiseHeightMultiplier = 8;
        const globalCurvatureFactor = 0.0002;

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
            
            const curveOffset = distanceFromCenter * distanceFromCenter * globalCurvatureFactor;
            
            positions.setZ(i, height - curveOffset);
        }
        
        planeGeo.computeVertexNormals();
        return planeGeo;
    }, []);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onDeselect();
    };

    return (
        <group position={[0, -2.5, 0]}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={handleClick}
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