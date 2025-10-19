import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../../types';

// Preload the model
useGLTF.preload('/sci_fi_drone.glb');

interface DistrictNodeProps {
  district: CityDistrict;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  isSelected: boolean;
  isActive: boolean; // Is any district selected?
}

const InfoCrystal: React.FC<{ item: PortfolioSubItem; onSelect: () => void, color: string }> = ({ item, onSelect, color }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useFrame(() => {
    const targetScale = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, hovered ? 5 : 2, 0.1);
  });

  return (
    <group position={item.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 1} transparent opacity={0.8} />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={2} distance={2} />
    </group>
  );
};


export const DistrictNode: React.FC<DistrictNodeProps> = ({ district, onSelectDistrict, onSelectSubItem, isSelected, isActive }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { nodes, materials } = useGLTF('/sci_fi_drone.glb');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
     if (!isSelected && !isActive) {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
     }
  }, [hovered, isSelected, isActive]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Idle animation
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.position.y = district.position3D[1] + Math.sin(t + district.position3D[0]) * 0.1;
    
    // Theatrical transition
    const targetPos = new THREE.Vector3();
    if (isActive) {
        if (isSelected) {
            targetPos.set(0, 1, 5); // Center stage
        } else {
            // Move to background
            const direction = new THREE.Vector3(...district.position3D).normalize();
            targetPos.set(...district.position3D).add(direction.multiplyScalar(8));
        }
    } else {
        targetPos.set(...district.position3D);
    }
    groupRef.current.position.lerp(targetPos, 0.05);

    // Hover animation
    const targetScale = isSelected ? 1.2 : (hovered && !isActive ? 1.1 : 1);
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });
  
  const handleNodeClick = () => {
    if (!isSelected) {
        onSelectDistrict(district);
    }
  };

  const clonedScene = React.useMemo(() => {
    const scene = (nodes.Scene as THREE.Group).clone();
    scene.traverse((child) => {
        // Fix: Use `instanceof THREE.Mesh` as a type guard. This allows TypeScript
        // to correctly infer that `child` is a Mesh and has a `material` property,
        // resolving the errors.
        if(child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if((child.material as THREE.MeshStandardMaterial).name === 'glow') {
                (child.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(district.color);
                (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
                (child.material as THREE.MeshStandardMaterial).toneMapped = false;
            }
        }
    });
    return scene;
  }, [nodes, district.color]);

  return (
    <group
      ref={groupRef}
      position={district.position3D}
      onClick={handleNodeClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={clonedScene} scale={0.5} />
       <Text
        position={[0, 1.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={!isActive || isSelected}
      >
        {district.title}
      </Text>
      
      {isSelected && district.subItems.map(item => (
        <InfoCrystal 
            key={item.id} 
            item={item} 
            color={district.color}
            onSelect={() => onSelectSubItem(item)} 
        />
      ))}
    </group>
  );
};
