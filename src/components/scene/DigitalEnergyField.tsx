import React, { useMemo, useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface DigitalEnergyFieldProps {
    onDeselect: () => void;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    // Radial gradient to fade out at the edges
    float dist = distance(vUv, vec2(0.5));
    float strength = 1.0 - smoothstep(0.4, 0.5, dist);

    // Create a grid pattern
    vec2 grid = abs(fract(vUv * 20.0) - 0.5);
    float gridLines = 1.0 - min(grid.x, grid.y);
    
    // Make grid lines thinner
    gridLines = pow(gridLines, 20.0);

    // Add a pulsing effect to the grid
    float pulse = 0.5 + 0.5 * sin(time * 2.0 + vUv.x * 10.0);
    gridLines *= pulse;

    gl_FragColor = vec4(0.0, 0.8, 1.0, gridLines * strength * 0.5);
  }
`;

export const DigitalEnergyField: React.FC<DigitalEnergyFieldProps> = React.memo(({ onDeselect }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });
    
    const uniforms = useMemo(() => ({
        time: { value: 0.0 },
    }), []);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onDeselect();
    };

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -5.5, 0]}
            onClick={handleClick}
            receiveShadow
        >
            <circleGeometry args={[250, 48]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
});