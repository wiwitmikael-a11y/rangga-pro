// FIX: Remove the triple-slash directive for @react-three/fiber types.
import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Billboard, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

// --- Shader code for the animated borders ---

// Vertex Shader (simple pass-through for UVs)
const borderVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// New, simplified, and performant cyan glow border shader
const borderFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    float border_width = 0.05; // 5% of the edge is border
    vec2 uv = abs(vUv * 2.0 - 1.0); // Remap UVs to be 0 at center, 1 at edge
    
    // Create a smooth-edged border mask
    float border_mask = smoothstep(1.0 - border_width, 1.0 - border_width + 0.02, max(uv.x, uv.y));
    
    // Discard fragments that are not part of the border to improve performance
    if (border_mask < 0.1) {
      discard;
    }
    
    // Create a slow, subtle scanning line effect
    float scan_line = sin((vUv.y + time * 0.2) * 20.0) * 0.5 + 0.5;
    scan_line = pow(scan_line, 2.0); // Sharpen the line to make it crisper
    
    // Create a slow pulse for the whole border
    float pulse = sin(time * 1.5) * 0.4 + 0.6; // oscillates between 0.6 and 1.0
    
    vec3 color = vec3(0.0, 1.0, 1.0); // Cyan
    
    // Combine effects for the final color
    gl_FragColor = vec4(color, border_mask * (scan_line * 0.5 + 0.5) * pulse);
  }
`;


// Define futuristic cyan color palette for high contrast
const DESC_CYAN = '#afeeee'; // Pale turquoise for description

// FIX: Define the props interface for the component.
interface HolographicDistrictLabelProps {
  district: CityDistrict;
  onSelect: (district: CityDistrict) => void;
  isSelected: boolean;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
}

const HolographicDistrictLabel: React.FC<HolographicDistrictLabelProps> = ({ district, onSelect, isSelected, isCalibrationMode, isHeld, onSetHeld }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const glowIntensityRef = useRef(1.0);

  // Uniforms for the shader material, memoized for performance
  const borderUniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // Hover scale animation, with a larger scale when held
    const targetScale = isHeld ? 1.3 : (isHovered || isSelected ? 1.2 : 1);
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

    // Update time uniform to animate the border shader
    borderUniforms.time.value = clock.getElapsedTime();

    // Apply pulsing white glow for all labels
    glowIntensityRef.current = 1.5 + Math.sin(clock.getElapsedTime() * 0.8) * 1.0; // Slow, strong pulse
  });
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    if(isCalibrationMode) document.body.style.cursor = 'grab';
    else document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isCalibrationMode) {
      onSetHeld(district.id);
    } else {
      onSelect(district);
    }
  };
  
  return (
    <Billboard position={[0, 15, 0]}>
      <group
        ref={groupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
      >
        {/* Animated Border - uses the new clean shader */}
        <mesh position-z={-0.09}>
          <planeGeometry args={[28.5, 10.5]} />
          <shaderMaterial
            vertexShader={borderVertexShader}
            fragmentShader={borderFragmentShader}
            uniforms={borderUniforms}
            transparent={true}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        
        {/* Rounded rectangle background */}
        <RoundedBox args={[28, 10, 0.2]} radius={0.5} position-z={-0.2}>
          <meshStandardMaterial
            color="white"
            transparent
            opacity={0.15}
            metalness={0.6}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </RoundedBox>

        {/* District Title */}
        <Text
          fontSize={3.0}
          color={'#000000'}
          anchorX="center"
          anchorY="middle"
          position-y={2.0} // Position text inside the box
          maxWidth={26}
          textAlign="center"
        >
          {district.title.toUpperCase()}
          <meshStandardMaterial
            emissive={'#ffffff'}
            emissiveIntensity={glowIntensityRef.current}
            toneMapped={false}
          />
        </Text>

        {/* District Description */}
        <Text
          position={[0, -2.0, 0]} // Position text inside the box
          fontSize={1.2}
          color={DESC_CYAN}
          anchorX="center"
          anchorY="middle"
          maxWidth={26}
          textAlign="center"
        >
          {district.description}
        </Text>
      </group>
    </Billboard>
  );
};

export default HolographicDistrictLabel;