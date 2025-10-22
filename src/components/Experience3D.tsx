import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
// FIX: This side-effect import extends the JSX namespace to include react-three-fiber elements, resolving TypeScript errors.
import '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Box, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Selection, Select, Outline, Glitch, DepthOfField } from '@react-three/postprocessing';
import { CityDistrict, PortfolioSubItem } from '../types';
import { portfolioData } from '../constants';
import CameraRig from './scene/CameraRig';
import FloatingParticles from './scene/FloatingParticles';
import CityModel from './scene/CityModel';
import FlyingVehicles from './scene/FlyingVehicles';
import { GroundPlane } from './scene/GroundPlane';
import { ProjectDisplay } from './scene/ProjectDisplay';


interface Experience3DProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  onDistrictHover: () => void;
}

// District interaction volume
const DistrictSelector: React.FC<{
  district: CityDistrict;
  isHovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: (district: CityDistrict) => void;
}> = ({ district, isHovered, onPointerOver, onPointerOut, onClick }) => {
    return (
        <Select enabled={isHovered}>
            <Box
                args={[15, 40, 15]}
                position={[0, 20, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(district);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onPointerOver();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onPointerOut();
                    document.body.style.cursor = 'auto';
                }}
            >
                <meshStandardMaterial 
                    transparent
                    opacity={0}
                />
            </Box>
        </Select>
    );
};

const Experience3D: React.FC<Experience3DProps> = ({ 
  selectedDistrict, 
  onSelectDistrict,
  onSelectSubItem,
  onDistrictHover
}) => {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (selectedDistrict) {
      setGlitchActive(true);
      const timer = setTimeout(() => setGlitchActive(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedDistrict]);
  
  return (
    <Canvas
      shadows
      camera={{ position: [80, 40, 120], fov: 45 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
    >
      {/* Lighting & Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[50, 80, 50]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-40, 20, -30]} color="#ff00ff" intensity={3} distance={200} />
      <pointLight position={[50, 30, 40]} color="#00aaff" intensity={4} distance={250} />
      <fog attach="fog" args={['#050810', 120, 350]} />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      {/* Scene Components */}
      <CameraRig selectedDistrict={selectedDistrict} />
      <FloatingParticles count={500} />
      <FlyingVehicles count={15} />
      <GroundPlane />
      <Suspense fallback={null}>
          <CityModel />
      </Suspense>

      {/* Post-processing effects */}
      <EffectComposer autoClear={false}>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
          <Outline blur visibleEdgeColor="#00ffff" edgeStrength={100} width={1000} />
          <Glitch
            delay={new THREE.Vector2(1.5, 3.5)}
            duration={new THREE.Vector2(0.2, 0.4)}
            strength={new THREE.Vector2(0.01, 0.03)}
            active={glitchActive}
          />
          <DepthOfField
              focusDistance={0.1}
              focalLength={0.2}
              bokehScale={selectedDistrict ? 4 : 0}
              height={480}
          />
      </EffectComposer>

      {/* Interactive layer */}
      <Selection>
        <group>
          {portfolioData.map((district) => {
              if (district.type !== 'major') return null;
              return (
                <group key={district.id} position={district.position}>
                   <DistrictSelector
                      district={district}
                      isHovered={hoveredDistrictId === district.id && selectedDistrict?.id !== district.id}
                      onPointerOver={() => {
                          if (hoveredDistrictId !== district.id) {
                              onDistrictHover();
                          }
                          setHoveredDistrictId(district.id)
                      }}
                      onPointerOut={() => setHoveredDistrictId(null)}
                      onClick={() => onSelectDistrict(district)}
                   />

                  {selectedDistrict?.id === district.id && district.subItems?.map(subItem => (
                      <ProjectDisplay
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
      </Selection>
    </Canvas>
  );
};

export default Experience3D;