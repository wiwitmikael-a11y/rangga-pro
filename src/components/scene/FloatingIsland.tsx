
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface FloatingIslandProps {
  district: CityDistrict;
  onSelect: () => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
  isFaded: boolean;
}

const InfoCrystal: React.FC<{ item: PortfolioSubItem; onSelect: () => void; districtColor: string; isVisible: boolean }> = ({ item, onSelect, districtColor, isVisible }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={item.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        visible={isVisible}
      >
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={hovered ? 'white' : districtColor} emissive={districtColor} emissiveIntensity={hovered ? 2 : 0.8} toneMapped={false} />
      </mesh>
      <Html 
        position={[0, 0.4, 0]} 
        center 
        style={{
          color: 'white',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          fontFamily: 'monospace',
          transition: 'opacity 0.3s',
          opacity: hovered && isVisible ? 1 : 0,
          pointerEvents: 'none',
          textShadow: `0 0 5px ${districtColor}`,
        }}
      >
        {item.title}
      </Html>
    </group>
  );
};


const Building: React.FC<{position: [number, number, number], size: [number, number, number], color: string}> = ({position, size, color}) => {
    return (
        <mesh position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial 
                color="#1a1a2a" 
                metalness={0.9} 
                roughness={0.3} 
            />
            <mesh position={[0, size[1] / 2 + 0.01, 0]}>
                <planeGeometry args={[size[0], size[2]]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
            </mesh>
        </mesh>
    )
}

export const FloatingIsland: React.FC<FloatingIslandProps> = ({ district, onSelect, onSelectSubItem, isSelected, isFaded }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  
  const targetY = useMemo(() => {
    let base = district.position3D[1];
    if (hovered && !isSelected) base += 0.2;
    return base;
  }, [hovered, isSelected, district.position3D]);

  useFrame((state, delta) => {
    if (groupRef.current) {
        const t = state.clock.getElapsedTime();
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + Math.sin(t * 0.5 + district.position3D[0]) * 0.1, delta * 5);
        groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const materialOpacity = isFaded ? 0.1 : 1.0;

  return (
    <group 
        ref={groupRef} 
        position={district.position3D}
        onClick={onSelect}
        onPointerOver={() => !isSelected && setHovered(true)}
        onPointerOut={() => setHovered(false)}
    >
      {/* Base Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.2, 16]} />
        <meshStandardMaterial 
            color="#222" 
            metalness={0.8}
            roughness={0.4}
            transparent
            opacity={materialOpacity}
        />
      </mesh>

      {/* Building Cluster */}
      <group visible={!isFaded}>
        <Building position={[0, 0.75, 0]} size={[1, 1.5, 1]} color={district.color} />
        <Building position={[-0.8, 0.5, 0.5]} size={[0.5, 1, 0.5]} color={district.color} />
        <Building position={[0.7, 0.4, -0.6]} size={[0.6, 0.8, 0.6]} color={district.color} />
      </group>
      
      <Billboard>
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          visible={!isFaded && !isSelected}
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {district.title}
        </Text>
      </Billboard>
      
      {district.subItems.map(item => (
        <InfoCrystal 
          key={item.id} 
          item={item} 
          onSelect={() => onSelectSubItem(item)} 
          districtColor={district.color}
          isVisible={isSelected}
        />
      ))}
    </group>
  );
};
