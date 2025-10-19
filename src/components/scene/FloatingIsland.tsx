import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

// --- INTERACTABLES ---
const InfoCrystal: React.FC<{
  subItem: PortfolioSubItem;
  onSelect: () => void;
}> = ({ subItem, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh
      ref={meshRef}
      position={subItem.position}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color={hovered ? '#ffffff' : '#00aaff'}
        emissive={hovered ? '#ffffff' : '#00aaff'}
        emissiveIntensity={hovered ? 1.5 : 0.8}
        toneMapped={false}
      />
    </mesh>
  );
};

export const FloatingIsland: React.FC<{
  district: CityDistrict;
  onSelect: () => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
  isFaded: boolean;
}> = ({ district, onSelect, onSelectSubItem, isSelected, isFaded }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));

  // FIX: Replace `useDrag` with native pointer events for drag handling.
  const dragState = useRef({
    isDragging: false,
    initialPointerX: 0,
    initialRotationY: 0,
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    dragState.current = {
      isDragging: true,
      initialPointerX: e.clientX,
      initialRotationY: groupRef.current.rotation.y,
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: any) => {
    if (dragState.current.isDragging) {
      e.stopPropagation();
      const deltaX = e.clientX - dragState.current.initialPointerX;
      const newY = dragState.current.initialRotationY + deltaX / 100;
      setRotation(new THREE.Euler(0, newY, 0));
    }
  };
  
  const handlePointerUp = (e: any) => {
    if (dragState.current.isDragging) {
      e.stopPropagation();
      dragState.current.isDragging = false;
      e.target.releasePointerCapture(e.pointerId);
    }
  };
  
  useFrame((_, delta) => {
    // Auto-rotate when not selected or being dragged
    if (!isSelected) {
      groupRef.current.rotation.y += delta * 0.05;
    } else {
      // Smoothly interpolate to dragged rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation.y, 0.1);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect();
    }
  };

  return (
    <group position={district.position3D} visible={!isFaded}>
      <group 
        ref={groupRef} 
        {...(isSelected ? {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerOut: handlePointerUp,
            onPointerCancel: handlePointerUp,
        } : {})} 
        onClick={handleClick}
      >
        {/* Main Island Pillar */}
        <mesh>
          <cylinderGeometry args={[1, 1.5, 4, 8]} />
          <meshStandardMaterial color="#111122" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[1.01, 1.51, 4.01, 8]} />
          <meshStandardMaterial wireframe color={district.color} emissive={district.color} emissiveIntensity={0.5} />
        </mesh>
        
        {/* Info Crystals */}
        {isSelected && district.subItems.map(item => (
            <InfoCrystal key={item.id} subItem={item} onSelect={() => onSelectSubItem(item)} />
        ))}
      </group>

      <Billboard>
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.5}
          color={isSelected ? 'white' : '#aaa'}
          onClick={handleClick}
        >
          {district.title}
        </Text>
      </Billboard>
    </group>
  );
};