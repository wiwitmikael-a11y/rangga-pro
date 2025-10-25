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
  uniform vec3 uGridColor;
  uniform float uTime;
  varying vec3 vWorldPosition;

  // 2D Random function
  float random (vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D Noise function
  float noise (vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
  }
  
  float line(float val, float width) {
    return smoothstep(width, 0.0, abs(fract(val - 0.5) - 0.5));
  }

  void main() {
    // Scrolling grid layers
    float majorGrid = max(line(vWorldPosition.x * 0.05, 0.015), line(vWorldPosition.z * 0.05, 0.015));
    float minorGrid = max(line(vWorldPosition.x * 0.2 - uTime * 0.05, 0.005), line(vWorldPosition.z * 0.2 - uTime * 0.05, 0.005));
    
    // Add a subtle noise pattern for texture
    float terrainNoise = noise(vWorldPosition.xz * 0.1) * 0.2;

    // Combine grids and noise for a glowing, textured effect
    float glow = majorGrid * 1.0 + minorGrid * 0.4 + terrainNoise;
    
    // Mix base color with grid color. Clamp the glow to avoid overly bright spots.
    vec3 finalColor = mix(uColor, uGridColor, clamp(glow, 0.0, 1.0));
    
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
        uColor: { value: new THREE.Color('#03010f') }, // A very dark, deep blue/purple base
        uGridColor: { value: new THREE.Color('#00ffff') }, // Bright cyan grid
    }), []);

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
                <shaderMaterial
                    ref={materialRef}
                    uniforms={uniforms}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    fog={true}
                />
            </mesh>
        </group>
    );
});