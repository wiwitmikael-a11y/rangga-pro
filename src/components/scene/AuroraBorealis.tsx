
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
  float time = uTime * 0.05; // Even slower movement for realism
  
  // --- AZIMUTH MASK (Arc restriction) ---
  // Restrict aurora to only show in the middle 40% of the UV x-axis
  // This prevents the "ring" effect.
  float azimuthCenter = 0.5;
  float azimuthWidth = 0.25; 
  float azimuthMask = smoothstep(azimuthCenter - azimuthWidth, azimuthCenter, uv.x) * 
                      (1.0 - smoothstep(azimuthCenter, azimuthCenter + azimuthWidth, uv.x));
  
  // If we are outside the arc, discard early for performance
  if (azimuthMask < 0.01) discard;

  // --- BAND 1 (Main Curtain) ---
  // Warp path: Complex sin waves
  float warp1 = sin(uv.x * 3.0 + time) * 0.1 + sin(uv.x * 7.0 - time * 0.5) * 0.05;
  
  // Path definition: centered lower in the sky
  float path1 = abs(uv.y - 0.25 - warp1);
  
  // Intensity: Higher power (4.0) makes the band much thinner/sharper
  float intensity1 = 1.0 - smoothstep(0.0, 0.15, path1);
  intensity1 = pow(intensity1, 4.0); 
  
  // Fibrous Streaks: Very high frequency noise on X (150.0)
  float streak1 = snoise(vec2(uv.x * 150.0, uv.y * 8.0 - time * 2.0));
  // Stretch contrast of streaks
  streak1 = smoothstep(0.2, 0.8, streak1);
  intensity1 *= (0.2 + 0.8 * streak1); 

  // --- BAND 2 (Secondary, Fainter) ---
  float warp2 = sin(uv.x * 4.0 - time * 0.2) * 0.08;
  float path2 = abs(uv.y - 0.35 - warp2);
  float intensity2 = 1.0 - smoothstep(0.0, 0.2, path2);
  intensity2 = pow(intensity2, 3.0); // Slightly softer than band 1
  float streak2 = snoise(vec2(uv.x * 100.0 + time, uv.y * 5.0));
  intensity2 *= (0.1 + 0.9 * streak2);

  // --- COMBINE ---
  float finalIntensity = max(intensity1, intensity2 * 0.5);
  
  // Apply Azimuth Mask to cut the edges smoothly
  finalIntensity *= azimuthMask;

  // --- COLORS ---
  // Realistic Gradient: Cyan at bottom, fading to deep purple/void at top
  vec3 col = mix(uColor1, uColor2, smoothstep(0.1, 0.6, uv.y));
  
  // --- FINAL FADE ---
  // Fade bottom (horizon) and top (zenith)
  float horizonFade = smoothstep(0.05, 0.15, uv.y);
  float zenithFade = 1.0 - smoothstep(0.5, 0.8, uv.y);
  
  float alpha = finalIntensity * horizonFade * zenithFade * 0.7; // 0.7 Max opacity
  
  gl_FragColor = vec4(col, alpha);
}
`;

export const AuroraBorealis: React.FC = React.memo(() => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    // Crisp Electric Cyan
    uColor1: { value: new THREE.Color('#00ffe5') }, 
    // Deep Neon Violet
    uColor2: { value: new THREE.Color('#7000ff') },
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh 
        ref={meshRef} 
        position={[0, -20, 0]} 
        scale={[1, 0.7, 1]}
        // Rotate 225 deg (5 * PI / 4) to face South-West (Opposite Sun at North-East)
        // Adjusting rotation so the "center" of the UVs (0.5) aligns with South-West
        rotation={[0, Math.PI * 1.25, 0]} 
    >
      <sphereGeometry args={[450, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
});
