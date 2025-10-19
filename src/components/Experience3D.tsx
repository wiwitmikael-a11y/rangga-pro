import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import CameraRig from './scene/CameraRig';
import GroundGrid from './scene/GroundGrid';
import FloatingParticles from './scene/FloatingParticles';
import Skyscraper from './scene/Skyscraper';

interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
}

// A simple component for displaying sub-item info in the 3D scene
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

const Experience3D: React.FC<Experience3DProps> = ({ 
  selectedDistrict, 
  onSelectDistrict,
  onSelectSubItem 
}) => {
  return (
    <Canvas
      shadows
      camera={{ position: [60, 60, 60], fov: 50 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 30, 20]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} color="#00aaff" intensity={2} distance={100} />
      <fog attach="fog" args={['#050810', 50, 200]} />

      {/* Scene Components */}
      <CameraRig selectedDistrict={selectedDistrict} />
      <GroundGrid />
      <FloatingParticles count={500} />
      
      {/* Cityscape */}
      <group>
        {portfolioData.map((district) => {
          if (district.type === 'major') {
            return (
              <group key={district.id} position={district.position}>
                <Skyscraper 
                    position={[0, 0, 0]} // Position is relative to the group
                    height={district.height || 20}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectDistrict(district);
                    }}
                    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
                />
                {selectedDistrict?.id === district.id && district.subItems?.map(subItem => (
                    <HolographicPanel
                        key={subItem.id}
                        item={subItem} // subItem.position is relative to the group
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectSubItem(subItem);
                        }}
                    />
                ))}
              </group>
            );
          } else {
            return (
              <Skyscraper 
                key={district.id}
                position={district.position}
                height={district.height || 15}
              />
            );
          }
        })}
      </group>
    </Canvas>
  );
};

export default Experience3D;
