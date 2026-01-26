

import React, { Suspense, useLayoutEffect, useMemo, useRef, useCallback, useState } from 'react';
// FIX: Add explicit type augmentation for R3F elements
import { ThreeElements } from '@react-three/fiber'
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
import { useGLTF, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
// FIX: Add useThree to provide types for JSX primitives
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import { CityDistrict } from '../../types';
import HolographicDistrictLabel from './HolographicDistrictLabel';
import { useAudio } from '../../hooks/useAudio';
import { HolographicProjector } from './HolographicProjector';

interface InteractiveModelProps {
  district: CityDistrict;
  isSelected: boolean;
  onSelect: (district: CityDistrict) => void;
  isCalibrationMode: boolean;
  isHeld: boolean;
  onSetHeld: (id: string | null) => void;
}

interface ModelProps {
  url: string;
  scale: number;
  isHeld: boolean;
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
}

// Robust Error Boundary specifically for model loading
class ModelErrorBoundary extends React.Component<{ fallback: React.ReactNode, children?: React.ReactNode }, { hasError: boolean }> {
  public state: { hasError: boolean } = { hasError: false };
  public readonly props: { fallback: React.ReactNode, children?: React.ReactNode };

  constructor(props: { fallback: React.ReactNode, children?: React.ReactNode }) {
    super(props);
    this.props = props;
  }
  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, _info: any) {
    console.error("3D Model load error (handled silently):", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function Model({ url, scale, isHeld, onPointerOver, onPointerOut, onPointerDown, onPointerUp }: ModelProps) {
  // FIX: Call useThree to provide types for JSX primitives
  useThree();
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const originalEmissives = useRef<{ [uuid: string]: THREE.Color }>({});
  const hoverColor = useMemo(() => new THREE.Color('cyan'), []);
  const heldColor = useMemo(() => new THREE.Color('gold'), []);

  useLayoutEffect(() => {
    const emissives: { [uuid: string]: THREE.Color } = {};
    clonedScene.traverse((child: any) => {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        emissives[child.uuid] = child.material.emissive.clone();
      }
    });
    originalEmissives.current = emissives;
  }, [clonedScene]);
  
  const applyEmissive = useCallback((color: THREE.Color, intensity: number) => {
    clonedScene.traverse((child: any) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.emissive.copy(color);
            child.material.emissiveIntensity = intensity;
        }
    });
  }, [clonedScene]);

  const resetEmissive = useCallback(() => {
      clonedScene.traverse((child: any) => {
        if (child.isMesh && child.material.isMeshStandardMaterial && originalEmissives.current[child.uuid]) {
            child.material.emissive.copy(originalEmissives.current[child.uuid]);
            child.material.emissiveIntensity = 1; 
        }
    });
  }, [clonedScene]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    onPointerOver(e);
    if (!isHeld) applyEmissive(hoverColor, 0.5);
  };
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    onPointerOut(e);
    if (!isHeld) resetEmissive();
  };

  useFrame(() => {
      if(isHeld) {
        applyEmissive(heldColor, 1.2);
      } else {
         const isHovered = (document.body.style.cursor === 'pointer' || document.body.style.cursor === 'grab');
         if(!isHovered) {
             resetEmissive();
         }
      }
  });

  return (
    <group>
        {/* 
           Invisible Hitbox to capture clicks around the model 
        */}
        <mesh 
            position={[0, 10, 0]} 
            scale={scale * 1.0} 
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            <boxGeometry args={[18, 35, 18]} /> 
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <primitive
            object={clonedScene}
            scale={scale}
            // Keep events on the actual model mesh as well for precision
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        />
    </group>
  );
}

export const InteractiveModel: React.FC<InteractiveModelProps> = ({ district, isSelected, onSelect, isCalibrationMode, isHeld, onSetHeld }) => {
  useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const audio = useAudio();

  const [holdProgress, setHoldProgress] = useState(0);
  const isHoldingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const actionTriggeredRef = useRef(false);
  
  // FIX: Reduced hold duration for snappier interaction
  const HOLD_DURATION = 400; // 400ms

  const cancelHold = useCallback(() => {
    isHoldingRef.current = false;
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setHoldProgress(0);
    actionTriggeredRef.current = false;
    audio.stop('district_hold');
  }, [audio]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    audio.play('district_hover', { volume: 0.4, rate: 0.8 });
    if (isCalibrationMode) document.body.style.cursor = 'grab';
    else document.body.style.cursor = 'pointer';
  }, [isCalibrationMode, audio]);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    cancelHold();
    document.body.style.cursor = 'auto';
  }, [cancelHold]);

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
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

        // Trigger slightly before full completion for better feel
        if (progress >= 0.9 && !actionTriggeredRef.current) {
            actionTriggeredRef.current = true;
            onSelect(district);
        }

        if (progress >= 1) {
            cancelHold();
        } else {
            animationFrameRef.current = requestAnimationFrame(animateHold);
        }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateHold);
  }, [isCalibrationMode, onSetHeld, district, onSelect, audio, cancelHold]);

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    cancelHold();
  }, [cancelHold]);

  return (
    <group ref={groupRef} position={district.position}>
      <ModelErrorBoundary fallback={<HolographicProjector position={[0, -5, 0]} />}>
        <Suspense fallback={<HolographicProjector position={[0, -5, 0]} />}>
            <Model 
            url={district.modelUrl!}
            scale={district.modelScale || 1}
            isHeld={isHeld}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            />
        </Suspense>
      </ModelErrorBoundary>
      
      {/* 
          CRITICAL FIX: 
          Set `pointerEventsEnabled={true}`. 
          This ensures hitting the label also triggers the shared hold logic if customized in Label component, 
          OR allows it to bubble up if we wrap it correctly.
          Here we are passing the hold handlers directly to the label.
      */}
      <HolographicDistrictLabel 
        district={district}
        isSelected={isSelected}
        onSelect={onSelect}
        isCalibrationMode={isCalibrationMode}
        isHeld={isHeld}
        onSetHeld={onSetHeld}
        pointerEventsEnabled={true} 
      />
      
      {holdProgress > 0 && !isCalibrationMode && (
        <group position={[0, 15, 0]}>
            <Text
                position={[0, 10, 0]} 
                fontSize={3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                HOLD
                <meshStandardMaterial emissive={'white'} emissiveIntensity={2} toneMapped={false} />
            </Text>
            {/* Gauge Background */}
            <RoundedBox args={[28, 1.5, 0.2]} radius={0.5} position={[0, 7.5, 0]}>
                <meshStandardMaterial color="#000000" transparent opacity={0.5} />
            </RoundedBox>
            {/* Gauge Fill */}
            <RoundedBox
                args={[28, 1.5, 0.2]}
                radius={0.5}
                position={[-14 * (1 - holdProgress), 7.5, 0.1]}
                scale={[holdProgress, 1, 1]}
            >
                <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={2} toneMapped={false} />
            </RoundedBox>
        </group>
      )}
    </group>
  );
};