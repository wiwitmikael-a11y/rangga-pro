import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

interface FloatingIslandProps {
  district: CityDistrict;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
}

const SubItemNode: React.FC<{ item: PortfolioSubItem; onClick: (e: any) => void }> = ({ item, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.position.y = item.position[1] + Math.sin(clock.getElapsedTime() * 2 + item.position[0]) * 0.1;
        }
    });

    return (
        <group position={[item.position[0], 0, item.position[2]]}>
             <Sphere
                ref={ref}
                args={[0.2, 16, 16]}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
             >
                <meshStandardMaterial color={hovered ? '#fff' : '#aaa'} emissive={hovered ? '#fff' : '#aaa'} emissiveIntensity={0.5} toneMapped={false}/>
            </Sphere>
            <Text
                position={[0, item.position[1] + 0.5, 0]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
                visible={hovered}
            >
                {item.title}
            </Text>
        </group>
    )
}

export const FloatingIsland: React.FC<FloatingIslandProps> = ({ district, onSelectDistrict, onSelectSubItem, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = district.position3D[1] + Math.sin(clock.getElapsedTime() + district.position3D[0]) * 0.2;
    }
  });

  const handleIslandClick = () => {
    onSelectDistrict(district);
  };
  
  const handleSubItemClick = (e: any, item: PortfolioSubItem) => {
      e.stopPropagation(); // Prevent island click from firing
      onSelectSubItem(item);
  }

  return (
    <group ref={groupRef} position={district.position3D}>
      {/* Base of the island */}
      <mesh
        onClick={handleIslandClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[2.5, 3, 1, 12]} />
        <meshStandardMaterial color={hovered && !isSelected ? '#444' : '#222'} roughness={0.8} />
      </mesh>
      
      {/* Top surface */}
      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
         <circleGeometry args={[2.5, 32]} />
         <meshStandardMaterial color={district.color} toneMapped={false} emissive={district.color} emissiveIntensity={isSelected ? 0.3 : 0.1} />
      </mesh>
      
      {/* District Title */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineColor="black"
        outlineWidth={0.02}
      >
        {district.title}
      </Text>

      {/* Sub Items - only show when island is selected */}
      {isSelected && district.subItems.map(item => (
        <SubItemNode key={item.id} item={item} onClick={(e) => handleSubItemClick(e, item)} />
      ))}
    </group>
  );
};
