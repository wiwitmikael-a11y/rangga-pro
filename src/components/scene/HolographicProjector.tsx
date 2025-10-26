import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cone, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface HolographicProjectorProps {
  position: [number, number, number];
}

export const HolographicProjector: React.FC<HolographicProjectorProps> = ({ position }) => {
  const holoRef = useRef<THREE.Group>(null!);
  const coneRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (holoRef.current) {
      holoRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
    if (coneRef.current) {
        (coneRef.current.material as THREE.ShaderMaterial).uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00aaff) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        float line = step(0.01, abs(sin((vUv.y + time * 0.1) * 20.0)));
        float opacity = (1.0 - vUv.y) * 0.5;
        gl_FragColor = vec4(color, line * opacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  }), []);

  return (
    <group position={position}>
      <Cylinder args={[1, 1, 0.5, 32]} position-y={0.25}>
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
      </Cylinder>
      <group ref={holoRef} position-y={4}>
        <Torus args={[2, 0.1, 16, 100]} rotation-x={Math.PI / 2}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
        </Torus>
      </group>
      <Cone ref={coneRef} args={[2.5, 4, 32]} position-y={2.5}>
        <primitive object={shaderMaterial} attach="material" />
      </Cone>
    </group>
  );
};