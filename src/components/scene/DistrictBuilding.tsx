import React, { useState, useMemo } from 'react';
import { Edges } from '@react-three/drei';
import { CityDistrict, PortfolioSubItem } from '../../types';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DistrictBuildingProps {
  district: CityDistrict;
  onSelect: () => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
}

const BuildingMaterial = new THREE.MeshStandardMaterial({
  color: '#1a203c',
  metalness: 0.9,
  roughness: 0.3,
});

const NeonEdges = ({ color }: { color: string }) => (
  <Edges scale={1} threshold={15}>
    <meshBasicMaterial color={color} toneMapped={false} />
  </Edges>
);

const Tower = ({ height = 8 }: { height?: number }) => (
  <mesh material={BuildingMaterial}>
    <boxGeometry args={[3, height, 3]} />
    <NeonEdges color="#00ffff" />
  </mesh>
);

const Platform = () => (
    <mesh material={BuildingMaterial}>
        <cylinderGeometry args={[5, 5, 1, 64]} />
        <NeonEdges color="#ff00ff" />
    </mesh>
);

const Ring = () => (
    <mesh material={BuildingMaterial}>
        <torusGeometry args={[5, 0.8, 16, 64]} />
         <NeonEdges color="#ff00ff" />
    </mesh>
)

const InfoNode: React.FC<{ item: PortfolioSubItem; onClick: () => void }> = ({ item, onClick }) => {
  const ref = React.useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = item.position[1] + Math.sin(t * 2) * 0.2;
  });

  return (
    <mesh
      ref={ref}
      position={item.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <octahedronGeometry args={[hovered ? 0.7 : 0.5]} />
      <meshStandardMaterial color={hovered ? '#ff00ff' : '#00ffff'} emissive={hovered ? '#ff00ff' : '#00ffff'} emissiveIntensity={1} toneMapped={false} />
    </mesh>
  );
};


const DistrictBuilding: React.FC<DistrictBuildingProps> = ({ district, onSelect, onSelectSubItem, isSelected }) => {
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const shapeComponent = useMemo(() => {
    switch (district.shape) {
      case 'platform': return <Platform />;
      case 'ring': return <group rotation={[Math.PI / 2, 0, 0]}><Ring /></group>;
      case 'tower': 
      default:
        const isHome = district.id === 'home';
        return (
             <group>
                <Tower height={isHome ? 12 : 8} />
                {!isHome && <mesh position={[0, -2.5, 2]}><Tower height={3} /></mesh>}
            </group>
        )
    }
  }, [district.shape, district.id]);

  return (
    <group
      position={district.position3D}
      onClick={onSelect}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group scale={hovered && !isSelected ? 1.05 : 1} >
        {shapeComponent}
      </group>

      {isSelected && district.subItems.map(item => (
        <InfoNode key={item.id} item={item} onClick={() => onSelectSubItem(item)} />
      ))}
    </group>
  );
};

export default DistrictBuilding;