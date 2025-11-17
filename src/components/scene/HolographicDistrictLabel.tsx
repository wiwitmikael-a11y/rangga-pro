import React, { useRef, useState, useMemo, useCallback } from 'react';
// FIX: Add side-effect import to ensure R3F's JSX types are globally available.
import '@react-three/fiber';
// FIX: Add useThree to provide types for JSX primitives
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import { Text, Billboard, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';
import { useAudio } from '../../hooks/useAudio';

interface HolographicDistrictLabelProps {
  district: CityDistrict;
  onSelect: (district: CityDistrict) => void;
  isSelected: boolean;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
  pointerEventsEnabled?: boolean;
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
const FONT_EXO2_REGULAR = 'https://raw.githubusercontent.com/google/fonts/main/ofl/exo2/Exo2-Regular.ttf';
const FONT_EXO2_BOLD = 'https://raw.githubusercontent.com/google/fonts/main/ofl/exo2/Exo2-Bold.ttf';

const HolographicDistrictLabel: React.FC<HolographicDistrictLabelProps> = ({ district, onSelect, isSelected, isCalibrationMode, isHeld, onSetHeld, pointerEventsEnabled = true }) => {
  // FIX: Call useThree to provide types for JSX primitives
  useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const glowIntensityRef = useRef(1.0);
  const audio = useAudio();
  
  // --- NEW: State and refs for hold-to-select interaction ---
  const [holdProgress, setHoldProgress] = useState(0);
  const isHoldingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const actionTriggeredRef = useRef(false); // New ref to track if action has been called
  const HOLD_DURATION = 1000; // ms

  // Uniforms for the shader material, memoized for performance
  const borderUniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);
  
  const cancelHold = useCallback(() => {
    isHoldingRef.current = false;
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setHoldProgress(0);
    actionTriggeredRef.current = false; // Reset the trigger
    audio.stop('district_hold');
  }, [audio]);

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
    audio.play('district_hover', { volume: 0.3, rate: 1.2 });
    if(isCalibrationMode) document.body.style.cursor = 'grab';
    else document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    cancelHold(); // Cancel press if user drags out
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (isCalibrationMode) {
      onSetHeld(district.id);
      return;
    }
    
    audio.playHoldSound('district_hold', { volume: 0.4 });
    isHoldingRef.current = true;
    actionTriggeredRef.current = false;
    const startTime = performance.now();
    
    const animateHold = (currentTime: number) => {
        if (!isHoldingRef.current) {
            cancelHold();
            return;
        }
        
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / HOLD_DURATION, 1);
        setHoldProgress(progress);

        // NEW LOGIC: Trigger action at 75% for a more responsive feel
        if (progress >= 0.75 && !actionTriggeredRef.current) {
            actionTriggeredRef.current = true; // Set flag to prevent multiple calls
            onSelect(district);
        }

        if (progress >= 1) {
            // Animation completes, now just cancel the hold
            cancelHold();
        } else {
            animationFrameRef.current = requestAnimationFrame(animateHold);
        }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateHold);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      cancelHold();
  };
  
  return (
    <Billboard position={[0, 15, 0]}>
      <group
        ref={groupRef}
        onPointerOver={pointerEventsEnabled ? handlePointerOver : undefined}
        onPointerOut={pointerEventsEnabled ? handlePointerOut : undefined}
        onPointerDown={pointerEventsEnabled ? handlePointerDown : undefined}
        onPointerUp={pointerEventsEnabled ? handlePointerUp : undefined}
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
          font={FONT_EXO2_BOLD}
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
          font={FONT_EXO2_REGULAR}
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
        
        {/* Hold-to-select Gauge */}
        {holdProgress > 0 && !isCalibrationMode && (
          <group position={[0, 7.5, 0.2]}>
            <Text
                font={FONT_EXO2_BOLD}
                position={[0, 2.5, 0]} // Positioned above the bar
                fontSize={2}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                HOLD
                <meshStandardMaterial emissive={'white'} emissiveIntensity={2} toneMapped={false} />
            </Text>
            {/* Gauge Background */}
            <RoundedBox args={[28, 1.5, 0.2]} radius={0.5}>
                <meshStandardMaterial
                    color="#000000"
                    transparent
                    opacity={0.5}
                />
            </RoundedBox>
            {/* Gauge Fill */}
            <RoundedBox
                args={[28, 1.5, 0.2]}
                radius={0.5}
                position={[-14 * (1 - holdProgress), 0, 0.1]}
                scale={[holdProgress, 1, 1]}
            >
                <meshStandardMaterial
                    color="#ff9900" // Orange
                    emissive="#ff9900"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </RoundedBox>
          </group>
        )}
      </group>
    </Billboard>
  );
};

export default HolographicDistrictLabel;
