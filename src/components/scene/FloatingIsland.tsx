import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface FloatingIslandProps {
  district: CityDistrict;
  onSelectDistrict: (district: CityDistrict) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
}

const SubItem: React.FC<{ item: PortfolioSubItem; onClick: () => void; color: string }> = ({ item, onClick, color }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={item.position}>
      <Box
        ref={meshRef}
        args={[0.5, 0.5, 0.5]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
      >
        <meshStandardMaterial color={hovered ? 'white' : color} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.2} />
      </Box>
      <Html position={[0, 0.5, 0]} center>
         <div style={{ 
              color: 'white', 
              background: 'rgba(0,0,0,0.5)', 
              padding: '2px 5px', 
              borderRadius: '3px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              transform: 'translate(-50%, 0)',
              visibility: hovered ? 'visible' : 'hidden',
              pointerEvents: 'none',
            }}>
            {item.title}
          </div>
      </Html>
    </group>
  );
};

export const FloatingIsland: React.FC<FloatingIslandProps> = ({ district, onSelectDistrict, onSelectSubItem, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const handleIslandClick = () => {
    if (!isSelected) {
      onSelectDistrict(district);
    }
  };
  
  return (
    <group ref={groupRef} position={district.position3D}>
      {/* Island Base */}
      <mesh
        onClick={handleIslandClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[3, 3.5, 1, 32]} />
        <meshStandardMaterial color={hovered ? '#555' : '#333'} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* District Title */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineColor={district.color}
        outlineWidth={0.02}
        pointerEvents="none"
      >
        {district.title}
      </Text>

      {/* Sub-items shown when district is selected */}
      {isSelected && district.subItems.map(subItem => (
        <SubItem 
          key={subItem.id} 
          item={subItem} 
          onClick={() => onSelectSubItem(subItem)}
          color={district.color}
        />
      ))}
    </group>
  );
};
