import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Image, Text } from '@react-three/drei';
import { PortfolioSubItem } from '../../types';

interface ProjectDisplayProps {
  item: PortfolioSubItem;
  onClick: (e: any) => void;
}

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ item, onClick }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 500 + 100);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetScale = isVisible ? (isHovered ? 1.1 : 1) : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
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

  return (
    <group
      ref={groupRef}
      position={item.position}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={0}
    >
      <RoundedBox args={[6, 8.5, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#051020" roughness={0.2} metalness={0.5} transparent opacity={0.7} />
      </RoundedBox>

      {item.imageUrl && (
        <Image
          url={item.imageUrl}
          scale={[5.5, 7]}
          position={[0, 0.5, 0.15]}
        >
          <meshStandardMaterial 
            transparent 
            opacity={isHovered ? 1 : 0.8} 
            emissive={"#ffffff"} 
            emissiveIntensity={isHovered ? 0.2 : 0} 
            toneMapped={false} 
          />
        </Image>
      )}

      <Text
        position={[0, -3.8, 0.15]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
      >
        {item.title}
      </Text>
    </group>
  );
};
