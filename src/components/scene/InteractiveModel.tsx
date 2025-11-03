import React, { Suspense, useLayoutEffect, useMemo, useRef, useCallback, useState } from 'react';
// FIX: Add side-effect import to ensure R3F's JSX types are globally available.
import '@react-three/fiber';
import { useGLTF, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
// FIX: Add useThree to provide types for JSX primitives
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import { CityDistrict } from '../../types';
import HolographicDistrictLabel from './HolographicDistrictLabel';
import { useAudio } from '../../hooks/useAudio';

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
         // If not held, reset emissive. This ensures it reverts correctly after being released.
         // This check prevents conflicting with the hover effect.
         const isHovered = (document.body.style.cursor === 'pointer' || document.body.style.cursor === 'grab');
         if(!isHovered) {
             resetEmissive();
         }
      }
  });


  return (
    <primitive
      object={clonedScene}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    />
  );
}

export const InteractiveModel: React.FC<InteractiveModelProps> = ({ district, isSelected, onSelect, isCalibrationMode, isHeld, onSetHeld }) => {
  // FIX: Call useThree to provide types for JSX primitives
  useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const audio = useAudio();

  const [holdProgress, setHoldProgress] = useState(0);
  const isHoldingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const actionTriggeredRef = useRef(false);
  const HOLD_DURATION = 1000;

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

        if (progress >= 0.75 && !actionTriggeredRef.current) {
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
      <Suspense fallback={null}>
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
      <HolographicDistrictLabel 
        district={district}
        isSelected={isSelected}
        onSelect={onSelect}
        isCalibrationMode={isCalibrationMode}
        isHeld={isHeld}
        onSetHeld={onSetHeld}
        pointerEventsEnabled={false} // Disable label interaction to prevent duplicate sounds
      />
      {/* Replicating the hold gauge from HolographicDistrictLabel here */}
      {holdProgress > 0 && !isCalibrationMode && (
        <group position={[0, 15, 0]}>
            <Text
                position={[0, 10, 0]} // Positioned above the model
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
