// FIX: Remove the triple-slash directive for @react-three/fiber types.
import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Billboard, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface HolographicDistrictLabelProps {
  district: CityDistrict;
  onSelect: (district: CityDistrict) => void;
  isSelected: boolean;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
}

// --- Shader code for the animated danger stripe border ---

// Vertex Shader (simple pass-through for UVs)
const borderVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader (creates stripes with a transparent hole in the middle)
const borderFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    // These ratios define the inner "hole" of the frame, matching the RoundedBox dimensions
    float innerWidthRatio = 24.0 / 24.5;
    float innerHeightRatio = 9.0 / 9.5;
    
    // Normalized coordinates from center (from 0 to 1 on each axis)
    float normX = abs(vUv.x * 2.0 - 1.0);
    float normY = abs(vUv.y * 2.0 - 1.0);
    
    // Discard the fragment if it's inside the transparent hole
    if (normX < innerWidthRatio && normY < innerHeightRatio) {
      discard;
    }

    // Stripe pattern logic for the visible border
    float pattern = (vUv.x + vUv.y); // Creates a 45-degree angle
    pattern += time * 0.2; // Controls animation speed
    
    float stripeFrequency = 15.0; // Controls the number/thickness of stripes
    float stripes = step(0.5, fract(pattern * stripeFrequency));
    
    vec3 orange = vec3(1.0, 0.6, 0.0); // #ff9900
    vec3 black = vec3(0.0, 0.0, 0.0);
    
    vec3 finalColor = mix(orange, black, stripes);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Define futuristic orange color palette
const BASE_ORANGE = '#ff9900';
const HOVER_ORANGE = '#ffb84d';
const SELECTED_ORANGE = '#ffdd4d';
const DESC_ORANGE = '#ffbe66';

const HolographicDistrictLabel: React.FC<HolographicDistrictLabelProps> = ({ district, onSelect, isSelected, isCalibrationMode, isHeld, onSetHeld }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);

  // Uniforms for the shader material, memoized for performance
  const borderUniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // Hover scale animation
    const targetScale = isHovered || isSelected ? 1.2 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

    // Update time uniform to animate the border shader
    borderUniforms.time.value = clock.getElapsedTime();
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
  
  const titleTextColor = isHeld ? SELECTED_ORANGE : isSelected ? SELECTED_ORANGE : isHovered ? HOVER_ORANGE : BASE_ORANGE;
  const emissiveIntensity = isHeld ? 2.5 : isHovered || isSelected ? 2 : 1;

  return (
    <Billboard position={[0, 15, 0]}>
      <group
        ref={groupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
      >
        {/* Animated Danger Stripe Border - placed slightly in front of the main panel */}
        <mesh position-z={-0.09}>
          <planeGeometry args={[24.5, 9.5]} />
          <shaderMaterial
            vertexShader={borderVertexShader}
            fragmentShader={borderFragmentShader}
            uniforms={borderUniforms}
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Rounded rectangle background */}
        <RoundedBox args={[24, 9, 0.2]} radius={0.5} position-z={-0.2}>
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
          fontSize={3.5}
          color={titleTextColor}
          anchorX="center"
          anchorY="middle"
          position-y={1.5} // Position text inside the box
          maxWidth={22}
          textAlign="center"
        >
          {district.title.toUpperCase()}
          <meshStandardMaterial
            emissive={titleTextColor}
            emissiveIntensity={emissiveIntensity}
            toneMapped={false}
          />
        </Text>

        {/* District Description */}
        <Text
          position={[0, -1.5, 0]} // Position text inside the box
          fontSize={1.5}
          color={DESC_ORANGE}
          anchorX="center"
          anchorY="middle"
          maxWidth={22}
          textAlign="center"
        >
          {district.description}
        </Text>
      </group>
    </Billboard>
  );
};

export default HolographicDistrictLabel;