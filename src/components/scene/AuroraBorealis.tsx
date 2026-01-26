
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

// Realistic Aurora Shader
// Uses domain warping and high-frequency noise to simulate "curtains" of light
const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
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
  vec2 uv = vUv;
  float time = uTime * 0.1; // Slow, majestic movement
  
  // --- BAND 1 (Lower, Brighter) ---
  // Create a winding path using sin waves on X
  float warp1 = sin(uv.x * 5.0 + time * 0.5) * 0.15 + sin(uv.x * 12.0 - time) * 0.05;
  
  // Determine distance from this winding path
  // We center it around y=0.2 (low in the sky)
  float path1 = abs(uv.y - 0.2 - warp1);
  
  // Intensity falls off quickly from the center of the path
  float intensity1 = 1.0 - smoothstep(0.0, 0.25, path1);
  intensity1 = pow(intensity1, 2.0); // Sharpen
  
  // Add "Curtain" effect (Vertical Streaks)
  // High frequency noise on X, stretched along Y
  float streak1 = snoise(vec2(uv.x * 40.0 - time * 2.0, uv.y * 3.0));
  intensity1 *= (0.4 + 0.6 * streak1); // Modulate intensity by streaks

  // --- BAND 2 (Higher, Fainter, Different Phase) ---
  float warp2 = sin(uv.x * 4.0 - time * 0.3) * 0.1 + sin(uv.x * 8.0 + time * 0.8) * 0.05;
  float path2 = abs(uv.y - 0.35 - warp2); // Higher up at 0.35
  float intensity2 = 1.0 - smoothstep(0.0, 0.3, path2);
  intensity2 = pow(intensity2, 2.0);
  float streak2 = snoise(vec2(uv.x * 30.0 + time, uv.y * 2.0));
  intensity2 *= (0.3 + 0.7 * streak2);

  // --- COMBINE ---
  float finalIntensity = max(intensity1, intensity2 * 0.7); // Band 2 is slightly dimmer
  
  // --- COLORS ---
  // Mix color based on height.
  // Lower parts (y < 0.25) are Cyan/Greenish (uColor1)
  // Upper parts (y > 0.4) fade to Purple (uColor2)
  float colorMix = smoothstep(0.15, 0.5, uv.y);
  vec3 col = mix(uColor1, uColor2, colorMix);
  
  // --- FADING ---
  // Hard fade at horizon (0.0) to hide mesh edge
  // Soft fade at zenith (top of dome)
  float horizonFade = smoothstep(0.0, 0.1, uv.y);
  float zenithFade = 1.0 - smoothstep(0.6, 0.9, uv.y);
  
  float alpha = finalIntensity * horizonFade * zenithFade * 0.8; // 0.8 Max opacity
  
  gl_FragColor = vec4(col, alpha);
}
`;

export const AuroraBorealis: React.FC = React.memo(() => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    // Realistic Cyberpunk Palette:
    // Color 1: Electric Cyan (Base)
    uColor1: { value: new THREE.Color('#00ffe5') }, 
    // Color 2: Deep Neon Purple (Top tips)
    uColor2: { value: new THREE.Color('#9d00ff') },
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -20, 0]} scale={[1, 0.8, 1]}>
      {/* 
        Using a Sphere Cut (0 to PI*0.5) implies a hemisphere.
        We scale Y by 0.8 to flatten it slightly for a wider sky feel.
        Position moved up to -20 to bring the "horizon" of the dome closer to the city ground.
      */}
      <sphereGeometry args={[450, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide} // Render inside
        transparent={true}
        blending={THREE.AdditiveBlending} // Glow effect
        depthWrite={false}
      />
    </mesh>
  );
});
