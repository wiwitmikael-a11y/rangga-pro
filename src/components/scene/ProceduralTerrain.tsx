
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const TERRAIN_SIZE = 300;
const TERRAIN_SEGMENTS = 100;
const TERRAIN_HEIGHT_SCALE = 8;
const NOISE_SCALE = 0.03;

const noise2D = createNoise2D();

export const ProceduralTerrain: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Use multiple layers of noise for more detail (fractal noise)
      let elevation = 0;
      let frequency = 1;
      let amplitude = 1;
      for (let j = 0; j < 4; j++) {
        elevation += noise2D(x * NOISE_SCALE * frequency, z * NOISE_SCALE * frequency) * amplitude;
        frequency *= 2;
        amplitude *= 0.5;
      }
      
      positions.setY(i, elevation * TERRAIN_HEIGHT_SCALE);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -5, 0]}>
      <meshStandardMaterial
        color="#081426"
        metalness={0.7}
        roughness={0.5}
        wireframe={true}
      />
    </mesh>
  );
};
