import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

import { CityModel } from './scene/CityModel';
import Rain from './scene/Rain';
import { FlyingShips } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData } from '../constants';
import type { CityDistrict, PortfolioSubItem } from '../types';
import { CameraRig } from './CameraRig';
import { HUD } from './ui/HUD';
import { DigitalEnergyField } from './scene/DigitalEnergyField';
import { ProjectDisplay } from './scene/ProjectDisplay';
import HolographicInfoPanel from './scene/HolographicInfoPanel';

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === selectedDistrict?.id) return;
    
    // For districts with sub-items, zoom in. For others, show info panel directly.
    if (district.subItems && district.subItems.length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null); // Go to overview if clicking a non-interactive major district
      setInfoPanelItem(district);
    }
    setIsAnimating(true);
    setShowProjects(false); // Hide old projects immediately
    if (district.type === 'major' && (!district.subItems || district.subItems.length === 0)) {
        setInfoPanelItem(district);
    }
  }, [selectedDistrict]);

  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowProjects(false);
    setInfoPanelItem(null);
  }, []);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict) {
      setShowProjects(true); // Show new projects after animation
    }
  }, [selectedDistrict]);

  const handleProjectClick = (item: PortfolioSubItem) => {
    // In a real app, you'd show project details.
    // Here we can just log it or show a generic panel.
    console.log('Project clicked:', item.title);
    if(selectedDistrict){
       setInfoPanelItem(selectedDistrict)
    }
  };
  
  const handlePanelClose = () => {
      setInfoPanelItem(null);
  };

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 60, 120], fov: 50, near: 0.1, far: 1000 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#050810']} />
        <fog attach="fog" args={['#050810', 50, 250]} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 40, 0]} intensity={1.5} color="#00aaff" distance={150} decay={2} />
          <directionalLight
            position={[-20, 50, -50]}
            intensity={2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={200}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />

          <CityModel />
          <Rain count={5000} />
          <FlyingShips />
          <DigitalEnergyField onDeselect={handleGoHome} />

          <group position={[0, 5, 0]}>
            <DistrictRenderer
              districts={portfolioData}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
            />
            {showProjects && selectedDistrict?.subItems && (
              selectedDistrict.subItems.map((item) => (
                <ProjectDisplay 
                  key={item.id} 
                  item={item} 
                  isLocked={false} 
                  onClick={() => handleProjectClick(item)} 
                />
              ))
            )}
            {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={handlePanelClose} />}
          </group>
          
          <CameraRig selectedDistrict={selectedDistrict} onAnimationFinish={onAnimationFinish} isAnimating={isAnimating} />

          <Environment preset="night" />

        </Suspense>

        <OrbitControls
            enabled={!isAnimating}
            minDistance={20}
            maxDistance={200}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
        />
      </Canvas>
      <HUD selectedDistrict={selectedDistrict} onGoHome={handleGoHome} />
    </>
  );
};
