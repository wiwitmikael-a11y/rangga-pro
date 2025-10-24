import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { Grid } from '@react-three/drei';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

const noise2D = createNoise2D();

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
    const geometry = useMemo(() => {
        // Optimasi: Kurangi jumlah segmen secara signifikan untuk performa
        const size = 500;
        const segments = 64; 
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        const positions = geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positions.count; i++) {
            vertex.fromBufferAttribute(positions, i);
            const noise = noise2D(vertex.x * 0.01, vertex.y * 0.01);
            positions.setZ(i, noise * 5); // Terapkan noise pada sumbu Z dari PlaneGeometry
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
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
                    color="#201040"
                    wireframe={true}
                    metalness={0.2}
                    roughness={0.8}
                />
            </mesh>
            <Grid
                args={[500, 500]}
                cellSize={20}
                cellColor="#00ffff"
                sectionSize={100}
                sectionColor="#00ffff"
                sectionThickness={1.5}
                fadeDistance={250}
                fadeStrength={1}
                infiniteGrid
            />
        </group>
    );
});