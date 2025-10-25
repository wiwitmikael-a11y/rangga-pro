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
    // Pass world position to fragment shader
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uGridColor;
  uniform float uTime;
  varying vec3 vWorldPosition;

  // Function to create a smooth grid line
  float line(float val, float width) {
    return smoothstep(width, 0.0, abs(fract(val - 0.5) - 0.5));
  }

  void main() {
    // Create two scrolling grid layers
    float majorGrid = max(line(vWorldPosition.x * 0.05, 0.01), line(vWorldPosition.z * 0.05, 0.01));
    float minorGrid = max(line(vWorldPosition.x * 0.2 + uTime * 0.05, 0.005), line(vWorldPosition.z * 0.2 + uTime * 0.05, 0.005));
    
    // Combine grids for a glowing effect
    float glow = majorGrid * 0.8 + minorGrid * 0.3;
    
    // Mix base color with grid color
    vec3 finalColor = mix(uColor, uGridColor, glow);
    
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
        const segments = 128; // Increased segments for smoother noise
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        const positions = geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positions.count; i++) {
            vertex.fromBufferAttribute(positions, i);
            const noise = noise2D(vertex.x * 0.01, vertex.y * 0.01);
            positions.setZ(i, noise * 5);
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color('#080418') }, // Dark base color
        uGridColor: { value: new THREE.Color('#00ffff') }, // Cyan grid color
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
                    fog={true} // Enable scene fog for this material
                />
            </mesh>
        </group>
    );
});
