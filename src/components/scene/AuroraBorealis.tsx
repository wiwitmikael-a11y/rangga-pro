
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec3 vWorldPosition;
varying vec2 vUv;

// Simplex 2D noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Normalize height for the dome
  float height = normalize(vWorldPosition).y;
  
  // Create waving curtain effect
  float time = uTime * 0.2;
  float noise1 = snoise(vec2(vUv.x * 5.0 + time, vUv.y * 2.0));
  float noise2 = snoise(vec2(vUv.x * 12.0 - time * 0.5, vUv.y * 5.0));
  
  // Combine noise to create streaks
  float combinedNoise = (noise1 + noise2 * 0.5);
  
  // Intense bands logic
  float intensity = smoothstep(0.3, 0.8, combinedNoise);
  
  // Fade out at horizon (bottom) and zenith (very top)
  float horizonFade = smoothstep(0.0, 0.3, height);
  float zenithFade = 1.0 - smoothstep(0.7, 1.0, height);
  
  // Color mixing
  vec3 color = mix(uColor1, uColor2, vUv.y + noise1 * 0.2);
  
  // Final Alpha
  float alpha = intensity * horizonFade * zenithFade * 0.4; // 0.4 max opacity
  
  gl_FragColor = vec4(color, alpha);
}
`;

export const AuroraBorealis: React.FC = React.memo(() => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    // Cyan to Purple Gradient matching the theme
    uColor1: { value: new THREE.Color('#00ffff') }, 
    uColor2: { value: new THREE.Color('#bd00ff') },
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -50, 0]} scale={[1, 0.6, 1]}>
      {/* Huge dome surrounding the city */}
      <sphereGeometry args={[480, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide} // Render on the inside of the sphere
        transparent={true}
        blending={THREE.AdditiveBlending} // Adds light to existing sky without blocking stars
        depthWrite={false} // Don't block other transparent objects
      />
    </mesh>
  );
});
