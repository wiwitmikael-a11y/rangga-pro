import React, { useState } from 'react';
import { Edges } from '@react-three/drei';
import { CityDistrict } from '../../types';
import * as THREE from 'three';

interface DistrictBuildingProps {
  district: CityDistrict;
  onSelect: () => void;
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

const DistrictBuilding: React.FC<DistrictBuildingProps> = ({ district, onSelect, isSelected }) => {
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
  
  const getShapeComponent = () => {
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
  }

  return (
    <group
      position={district.position3D}
      onClick={onSelect}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group scale={hovered || isSelected ? 1.1 : 1} position-y={hovered || isSelected ? 1 : 0} >
        {getShapeComponent()}
      </group>
    </group>
  );
};

export default DistrictBuilding;
