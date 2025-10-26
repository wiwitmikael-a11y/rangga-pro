import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

const terrainVertexShader = `
  uniform float time;
  varying float vHeight;
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    vec3 pos = position;
    
    // Animate the terrain slightly
    float pulse = sin(time * 0.1 + pos.x * 0.1) * 0.1;
    pos.z += pulse;
    vHeight = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const terrainFragmentShader = `
  uniform float time;
  varying float vHeight;
  varying vec3 vPosition;

  void main() {
    vec3 color = vec3(0.01, 0.02, 0.05); // Dark blue base
    
    // Grid lines
    float grid = 0.0;
    grid += step(0.98, sin(vPosition.x * 0.5));
    grid += step(0.98, sin(vPosition.y * 0.5));
    grid = clamp(grid, 0.0, 1.0);
    
    color = mix(color, vec3(0.0, 0.5, 0.8), grid * 0.2); // Faint grid lines

    // Energy pulse from center
    float dist = length(vPosition.xy);
    float pulse = sin(dist * 0.1 - time * 0.5);
    pulse = smoothstep(0.9, 1.0, pulse);
    color += vec3(0.0, 0.2, 0.3) * pulse;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const ProceduralTerrain: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    const planeSize = 300;
    const segments = 100;
    const geom = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const noise1 = noise2D(x * 0.01, y * 0.01) * 3; // Large scale features
      const noise2 = noise2D(x * 0.05, y * 0.05) * 1; // Medium scale features
      const noise3 = noise2D(x * 0.2, y * 0.2) * 0.2; // Small details
      
      const height = noise1 + noise2 + noise3;
      pos.setZ(i, height - 5); // Center the terrain lower
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        wireframe={false}
      />
    </mesh>
  );
};
