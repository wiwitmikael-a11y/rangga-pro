import React, { useState, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { CityDistrict, PortfolioSubItem } from '../../types';
import * as THREE from 'three';

interface SkyscraperProps {
  district: CityDistrict;
  onSelect: () => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
}

const baseMaterial = new THREE.MeshStandardMaterial({ color: '#111319', metalness: 0.8, roughness: 0.4 });

const NeonSign: React.FC<{ text: string; position: [number, number, number] }> = ({ text, position }) => {
  return (
    <group position={position}>
      <Text
        fontSize={text.length > 5 ? 1.5 : 2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        rotation-y={Math.PI / 2}
      >
        {text}
      </Text>
    </group>
  );
};

const InfoNode: React.FC<{ item: PortfolioSubItem; onClick: () => void }> = ({ item, onClick }) => {
  const ref = React.useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = item.position[1] + Math.sin(t * 2 + item.position[0]) * 0.2;
  });

  return (
    <mesh
      ref={ref}
      position={item.position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[hovered ? 0.7 : 0.5, 16, 16]} />
      <meshStandardMaterial color={hovered ? '#ff00ff' : '#00ffff'} emissive={hovered ? '#ff00ff' : '#00ffff'} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
};

const Skyscraper: React.FC<SkyscraperProps> = ({ district, onSelect, onSelectSubItem, isSelected }) => {
  const { position, height = 20, type } = district;
  const [hovered, setHovered] = useState(false);

  // FIX: The useMemo hook should return the arguments for the geometry, not a JSX element.
  // This preserves the random dimensions across re-renders.
  const buildingGeoArgs = useMemo<[number, number, number]>(() => {
    const width = type === 'major' ? 5 : 2 + Math.random() * 2;
    const depth = type === 'major' ? 5 : 2 + Math.random() * 2;
    return [width, height, depth];
  }, [height, type]);
  
  return (
    <group
      position={[position[0], height / 2, position[2]]}
      onClick={type === 'major' ? onSelect : undefined}
      onPointerOver={e => { e.stopPropagation(); if (type === 'major') { setHovered(true); document.body.style.cursor = 'pointer'; } }}
      onPointerOut={() => { if (type === 'major') { setHovered(false); document.body.style.cursor = 'auto'; } }}
    >
      {/* FIX: The geometry component (<boxGeometry>) should be a child of <mesh>, 
          and not passed as a JSX element to the `geometry` prop. */}
      <mesh material={baseMaterial}>
        <boxGeometry args={buildingGeoArgs} />
      </mesh>
      {type === 'major' && <NeonSign text={district.title} position={[2.6, height/4, 0]} />}
      {isSelected && district.subItems?.map(item => (
        <InfoNode key={item.id} item={item} onClick={() => onSelectSubItem(item)} />
      ))}
       <mesh scale={hovered && type ==='major' ? 1.1 : 1} position={[0, -height/2, 0]}>
         <boxGeometry args={[6, 0.2, 6]} />
         <meshStandardMaterial emissive={isSelected ? '#00ffff' : (hovered ? '#ff00ff' : '#111319')} emissiveIntensity={isSelected ? 1 : 2} toneMapped={false} />
       </mesh>
    </group>
  );
};

export default Skyscraper;