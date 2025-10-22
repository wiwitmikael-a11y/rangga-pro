import React, { Suspense, useState } from 'react';
// FIX: This side-effect import extends the JSX namespace to include react-three-fiber elements, resolving TypeScript errors.
import '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import CameraRig from './scene/CameraRig';
import FloatingParticles from './scene/FloatingParticles';
import CityModel from './scene/CityModel';
import FlyingVehicles from './scene/FlyingVehicles'; // Import the new component

interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
}

const HolographicPanel: React.FC<{item: PortfolioSubItem, onClick: (e: any) => void}> = ({ item, onClick }) => {
    return (
        <group 
            position={item.position}
            onClick={onClick}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
        >
             <Box args={[4, 2.2, 0.1]}>
                <meshStandardMaterial 
                    color="#00aaff" 
                    emissive="#00aaff" 
                    emissiveIntensity={0.5} 
                    transparent 
                    opacity={0.2} 
                    side={2}
                />
            </Box>
            <Text
                position={[0, 0.6, 0.1]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.8}
            >
                {item.title}
            </Text>
             <Text
                position={[0, 0, 0.1]}
                fontSize={0.15}
                color="#ccc"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.8}
                lineHeight={1.4}
            >
                {item.description}
            </Text>
        </group>
    )
}

// New component to handle district interaction and highlighting
const DistrictSelector: React.FC<{
  district: CityDistrict;
  isHovered: boolean;
  onPointerOver: (id: string) => void;
  onPointerOut: () => void;
  onClick: (district: CityDistrict) => void;
}> = ({ district, isHovered, onPointerOver, onPointerOut, onClick }) => {
    const highlightColor = "#00ffff";

    return (
        <group position={district.position}>
            <Box
                args={[15, 40, 15]}
                position={[0, 20, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(district);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onPointerOver(district.id);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onPointerOut();
                    document.body.style.cursor = 'auto';
                }}
            >
                <meshStandardMaterial 
                    color={highlightColor}
                    emissive={highlightColor}
                    emissiveIntensity={isHovered ? 0.6 : 0}
                    transparent
                    opacity={isHovered ? 0.15 : 0}
                />
            </Box>
        </group>
    );
};

const Experience3D: React.FC<Experience3DProps> = ({ 
  selectedDistrict, 
  onSelectDistrict,
  onSelectSubItem 
}) => {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  
  return (
    <Canvas
      shadows
      camera={{ position: [100, 50, 100], fov: 50 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[50, 80, 50]} 
        intensity={2.0} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-40, 20, -30]} color="#ff00ff" intensity={3} distance={200} />
      <pointLight position={[50, 30, 40]} color="#00aaff" intensity={4} distance={250} />
      <fog attach="fog" args={['#050810', 120, 350]} />

      {/* Scene Components */}
      <CameraRig selectedDistrict={selectedDistrict} />
      <FloatingParticles count={500} />
      <FlyingVehicles count={15} />

      {/* Cityscape */}
      <Suspense fallback={null}>
        <CityModel />
      </Suspense>

      {/* Interactive layer */}
      <group>
        {portfolioData.map((district) => {
            if (district.type !== 'major') return null;
            return (
              <group key={district.id}>
                 <DistrictSelector
                    district={district}
                    isHovered={hoveredDistrictId === district.id && selectedDistrict?.id !== district.id}
                    onPointerOver={setHoveredDistrictId}
                    onPointerOut={() => setHoveredDistrictId(null)}
                    onClick={() => onSelectDistrict(district)}
                 />

                {selectedDistrict?.id === district.id && district.subItems?.map(subItem => (
                    <HolographicPanel
                        key={subItem.id}
                        item={subItem}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectSubItem(subItem);
                        }}
                    />
                ))}
              </group>
            );
        })}
      </group>
    </Canvas>
  );
};

export default Experience3D;
