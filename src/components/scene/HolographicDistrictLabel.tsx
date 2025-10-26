/// <reference types="@react-three/fiber" />
import React, { useRef, useState, useMemo, useCallback } from 'react';
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

// --- Shader code for the animated borders ---

// Vertex Shader (simple pass-through for UVs)
const borderVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Original cyan border Fragment Shader - NO LONGER IN USE
// const borderFragmentShader = `...`;

// Danger Zone Fragment Shader for ALL labels
const dangerBorderFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    float innerWidthRatio = 28.0 / 28.5;
    float innerHeightRatio = 10.0 / 10.5;
    float normX = abs(vUv.x * 2.0 - 1.0);
    float normY = abs(vUv.y * 2.0 - 1.0);
    
    if (normX < innerWidthRatio && normY < innerHeightRatio) {
      discard;
    }

    float pattern = (vUv.x - vUv.y);
    pattern += time * 0.05; // Very slow animation
    
    float stripeFrequency = 10.0;
    float stripes = step(0.5, fract(pattern * stripeFrequency));
    
    vec3 orange = vec3(1.0, 0.6, 0.0); // #ff9900
    vec3 black = vec3(0.0, 0.0, 0.0);
    
    vec3 finalColor = mix(orange, black, stripes);
    
    // FIX: Tingkatkan kecerahan untuk membuatnya lebih menonjol dan cocok dengan UI
    gl_FragColor = vec4(finalColor * 1.5, 1.0);
  }
`;


// Define futuristic cyan color palette for high contrast
const DESC_CYAN = '#afeeee'; // Pale turquoise for description

const HolographicDistrictLabel: React.FC<HolographicDistrictLabelProps> = ({ district, onSelect, isSelected, isCalibrationMode, isHeld, onSetHeld }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const glowIntensityRef = useRef(1.0);
  
  // --- NEW: Logic for quick and intentional long press ---
  const longPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

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
    clearLongPress(); // Cancel press if user drags out
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    clearLongPress();

    if (isCalibrationMode) {
      onSetHeld(district.id);
      return;
    }
    
    // Start a timer for the long press action
    longPressTimeout.current = setTimeout(() => {
      onSelect(district);
    }, 250); // 250ms for a quick, intentional hold
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      clearLongPress(); // Cancel the timer if released before 250ms
  };
  
  return (
    <Billboard position={[0, 15, 0]}>
      <group
        ref={groupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Animated Border - uses danger zone shader for all labels */}
        <mesh position-z={-0.09}>
          <planeGeometry args={[28.5, 10.5]} />
          <shaderMaterial
            vertexShader={borderVertexShader}
            fragmentShader={dangerBorderFragmentShader}
            uniforms={borderUniforms}
            transparent={true}
            side={THREE.DoubleSide}
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