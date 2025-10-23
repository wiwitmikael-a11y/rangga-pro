/// <reference types="@react-three/fiber" />

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Image, Text } from '@react-three/drei';
import { PortfolioSubItem } from '../../types';

interface ProjectDisplayProps {
  item: PortfolioSubItem;
  isLocked: boolean;
  onClick: () => void;
}

const LockIcon: React.FC = () => (
    <Text
        position={[0, 0.5, 0.2]}
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
        position={[0, 1.5, 0.2]}
        fontSize={0.25}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
        lineHeight={1.2}
    >
        ACCESS DENIED.
        ROUTE DATASTREAM VIA NEXUS PROTOCOL TO DECRYPT.
    </Text>
);

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ item, isLocked, onClick }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDeniedMsg, setShowDeniedMsg] = useState(false);

  useEffect(() => {
    // Tunda kemunculan untuk efek staggered
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 400 + 100);
    return () => clearTimeout(timer);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetScale = isVisible ? (isHovered && !isLocked ? 1.1 : 1) : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isLocked) {
        setShowDeniedMsg(true);
        setTimeout(() => setShowDeniedMsg(false), 2000);
    } else {
        onClick();
    }
  };
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    if (!isLocked) document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const baseOpacity = isLocked ? 0.3 : 0.7;
  const imageOpacity = isLocked ? 0.2 : (isHovered ? 1 : 0.9);

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
          scale={[5.5, 4]}
          position={[0, 2, 0.15]}
          grayscale={isLocked ? 1 : 0}
        >
          <meshStandardMaterial 
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
        position={[0, -1.5, 0.15]}
        fontSize={0.35}
        color={isLocked ? "#555" : "white"}
        anchorX="center"
        anchorY="top"
        maxWidth={5}
        textAlign="center"
      >
        {item.title}
      </Text>
      <Text
        position={[0, -2.2, 0.15]}
        fontSize={0.25}
        color={isLocked ? "#444" : "#aaa"}
        anchorX="center"
        anchorY="top"
        maxWidth={5}
        textAlign="center"
        lineHeight={1.3}
      >
        {item.description}
      </Text>
    </group>
  );
};