import React, { Suspense, useLayoutEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGLTF, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { CityDistrict } from '../../types';
import HolographicDistrictLabel from './HolographicDistrictLabel';

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
  const groupRef = useRef<THREE.Group>(null!);
  
  // --- NEW: State and refs for hold-to-select interaction ---
  const [holdProgress, setHoldProgress] = useState(0);
  const isHoldingRef = useRef(false);
  // FIX: Initialize useRef with null to fix invalid call. This was likely causing misleading type errors.
  const animationFrameRef = useRef<number | null>(null);
  const actionTriggeredRef = useRef(false); // New ref
  const HOLD_DURATION = 1000;
  
  const cancelHold = useCallback(() => {
    isHoldingRef.current = false;
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setHoldProgress(0);
    actionTriggeredRef.current = false; // Reset
  }, []);
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isCalibrationMode) document.body.style.cursor = 'grab';
    else document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    cancelHold(); // Cancel press if user drags out
    document.body.style.cursor = 'auto';
  };
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (isCalibrationMode) {
      onSetHeld(district.id);
      return;
    }
    
    isHoldingRef.current = true;
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
            actionTriggeredRef.current = true;
            onSelect(district);
        }

        if (progress >= 1) {
            // Animation completes
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


  useFrame((_, delta) => {
      if (groupRef.current) {
          if (isHeld) {
            // If held, the position is controlled by BuildModeController, so we just add a visual lift
            const targetY = district.position[1] + 5;
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 8);
            groupRef.current.position.x = district.position[0];
            groupRef.current.position.z = district.position[2];

          } else {
            // Normal behavior: hover bobbing or returning to base position
            const targetY = isSelected ? Math.sin(Date.now() * 0.001) * 0.5 : 0;
            const finalPos = new THREE.Vector3(...district.position);
            finalPos.y += targetY;
            groupRef.current.position.lerp(finalPos, delta * 4);
          }
      }
  });


  return (
    <group ref={groupRef} position={district.position}>
        <Suspense fallback={
            <Text color="cyan" anchorX="center" anchorY="middle">Loading...</Text>
        }>
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
        {/* The label is wrapped to disable its pointer events in normal mode, preventing conflicting interactions. */}
        <HolographicDistrictLabel 
            district={district} 
            isSelected={isSelected} 
            onSelect={onSelect} 
            isCalibrationMode={isCalibrationMode}
            isHeld={isHeld}
            onSetHeld={onSetHeld}
            pointerEventsEnabled={isCalibrationMode}
        />
        {/* Render the gauge here, controlled by this component's state, positioned over the label */}
        {holdProgress > 0 && !isCalibrationMode && (
             <group position={[0, 22.5, 0.2]}> {/* Positioned above the holographic label */}
                <Text
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
  );
};