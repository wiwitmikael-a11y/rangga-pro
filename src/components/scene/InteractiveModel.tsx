import React, { Suspense, useLayoutEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGLTF, Text, Torus } from '@react-three/drei';
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
  const animationFrameRef = useRef<number>();
  const HOLD_DURATION = 750;
  
  const cancelHold = useCallback(() => {
    isHoldingRef.current = false;
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setHoldProgress(0);
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

        if (progress >= 1) {
            onSelect(district);
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
        <group pointerEvents={isCalibrationMode ? 'auto' : 'none'}>
            <HolographicDistrictLabel 
                district={district} 
                isSelected={isSelected} 
                onSelect={onSelect} 
                isCalibrationMode={isCalibrationMode}
                isHeld={isHeld}
                onSetHeld={onSetHeld}
            />
        </group>
        {/* Render the gauge here, controlled by this component's state, positioned over the label */}
        {holdProgress > 0 && !isCalibrationMode && (
            <group position={[0, 15, 0.2]}>
                <Torus args={[16, 0.5, 16, 100, Math.PI * 2 * holdProgress]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={3} toneMapped={false} side={THREE.DoubleSide}/>
                </Torus>
                <Text fontSize={2} color="white" anchorX="center" anchorY="middle">
                    HOLD
                    <meshStandardMaterial emissive={'white'} emissiveIntensity={2} toneMapped={false} />
                </Text>
            </group>
        )}
    </group>
  );
};