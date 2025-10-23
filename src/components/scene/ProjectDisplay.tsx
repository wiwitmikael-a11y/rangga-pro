// FIX: Added the triple-slash directive to provide types for R3F's custom JSX elements, resolving "Property does not exist on type 'JSX.IntrinsicElements'" errors.
/// <reference types="@react-three/fiber" />
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Image, Text } from '@react-three/drei';
import { PortfolioSubItem } from '../../types';

interface ProjectDisplayProps {
  item: PortfolioSubItem;
  isLocked: boolean;
  onClick: (e: any) => void;
}

const LockIcon: React.FC = () => (
    <Text
        position={[0, 0, 0.2]}
        fontSize={2}
        anchorX="center"
        anchorY="middle"
    >
        ?
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={2} toneMapped={false} />
    </Text>
);

const AccessDeniedMessage: React.FC = () => (
    <Text
        position={[0, 1, 0.2]}
        fontSize={0.25}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
    >
        ACCESS DENIED. ROUTE DATASTREAM VIA NEXUS PROTOCOL TO DECRYPT.
    </Text>
);

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ item, isLocked, onClick }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const imageMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDeniedMsg, setShowDeniedMsg] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 500 + 100);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetScale = isVisible ? (isHovered && !isLocked ? 1.1 : 1) : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    
    if (imageMaterialRef.current && !isHovered && !isLocked) {
        imageMaterialRef.current.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 5 + item.position[0]) * 0.1;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    if (isLocked) {
        setShowDeniedMsg(true);
        setTimeout(() => setShowDeniedMsg(false), 2000);
    } else {
        onClick(e);
    }
  };

  const baseOpacity = isLocked ? 0.3 : 0.7;
  const imageOpacity = isLocked ? 0.2 : (isHovered ? 1 : 0.8);

  return (
    <group
      ref={groupRef}
      position={item.position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={0}
    >
      <RoundedBox args={[6, 8.5, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#051020" roughness={0.2} metalness={0.5} transparent opacity={baseOpacity} />
      </RoundedBox>

      {item.imageUrl && (
        <Image
          url={item.imageUrl}
          scale={[5.5, 7]}
          position={[0, 0.5, 0.15]}
          grayscale={isLocked ? 1 : 0}
        >
          <meshStandardMaterial 
            ref={imageMaterialRef}
            transparent 
            opacity={imageOpacity} 
            emissive={"#ffffff"} 
            emissiveIntensity={isHovered && !isLocked ? 0.2 : 0} 
            toneMapped={false} 
          />
        </Image>
      )}
      {isLocked && <LockIcon />}
      {showDeniedMsg && <AccessDeniedMessage />}

      <Text
        position={[0, -3.8, 0.15]}
        fontSize={0.3}
        color={isLocked ? "#555" : "white"}
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
      >
        {item.title}
      </Text>
    </group>
  );
};