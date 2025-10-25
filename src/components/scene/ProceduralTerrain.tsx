import React, { useMemo, useRef } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

const noise2D = createNoise2D();

const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vWorldPosition;

  // 2D Noise function for texturing
  float noise(vec2 st) {
      // Simple pseudo-random generator
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    // Animated, subtle noise pattern for a shimmering texture
    float terrainNoise = noise(vWorldPosition.xz * 0.1 + uTime * 0.03) * 0.2;
    
    // Just the base color and the noise shimmer
    vec3 finalColor = uColor + vec3(terrainNoise * 0.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {
    
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    const geometry = useMemo(() => {
        const size = 500;
        const segments = 128;
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        const positions = geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positions.count; i++) {
            vertex.fromBufferAttribute(positions, i);
            const noise = noise2D(vertex.x * 0.01, vertex.y * 0.01);
            // Apply noise to Z-axis (which becomes Y-axis after rotation)
            positions.setZ(i, noise * 5);
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color('#c2b280') }, // A sandy desert base color
    }), []);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onDeselect();
    };

    return (
        <group position={[0, -4.5, 0]}>
            <mesh
                geometry={geometry}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={handleClick}
                receiveShadow
            >
                <shaderMaterial
                    ref={materialRef}
                    uniforms={uniforms}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                />
            </mesh>
        </group>
    );
});