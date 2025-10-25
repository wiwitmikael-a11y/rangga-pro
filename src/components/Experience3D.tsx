import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import Rain from './scene/Rain';
import { FlyingShips } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData } from '../constants';
import type { CityDistrict, PortfolioSubItem } from '../types';
import { CameraRig } from './CameraRig';
import { HUD } from './ui/HUD';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import HolographicInfoPanel from './scene/HolographicInfoPanel';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { PatrollingCore } from './scene/PatrollingCore';

// Define the sun's position to be used by the light, sky, and mesh
const sunPosition: [number, number, number] = [100, 2, -200]; // Lower sun for sunset effect
const sunColor = '#FFFFF0'; // A warm, sun-like white
const backgroundColor = '#2c1912'; // Dark, desaturated orange to match the sky's bottom gradient
const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 100, 250];

export const Experience3D: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [infoPanelItem, setInfoPanelItem] = useState<CityDistrict | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  // New state for POV and auto-rotation
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navDistricts = useMemo(() => {
    const majorDistricts = portfolioData.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [...majorDistricts.filter(d => d.id !== 'nexus-core'), nexusCore]
      : majorDistricts;
  }, []);
  
  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === 'nexus-core') {
      window.open('https://www.instagram.com/rangga.p.h/', '_blank');
      // Even for external links, briefly show selection animation
      setSelectedDistrict(district); 
      setShowProjects(false);
      setInfoPanelItem(null);
      // After a short delay, clear selection to allow re-clicking
      setTimeout(() => setSelectedDistrict(null), 1000);
      return;
    }

    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    if (district.subItems && district.subItems.length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null); 
      setInfoPanelItem(district);
    }
    setIsAnimating(true);
    setShowProjects(false);
    setIsAutoRotating(false); // Stop autorotate when focusing
  }, [selectedDistrict, isAnimating]);

  const isDetailViewActive = showProjects || !!infoPanelItem || !!selectedDistrict;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !selectedDistrict && !isDetailViewActive) {
            setIsAutoRotating(true);
        }
    }, 5000); // 5 seconds of inactivity
  }, [pov, selectedDistrict, isDetailViewActive]);

  const handleInteractionStart = useCallback(() => {
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
      resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleGoHome = useCallback(() => {
    if (pov === 'ship') {
      setPov('main');
    }
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowProjects(false);
    setInfoPanelItem(null);
    resetIdleTimer();
  }, [pov, resetIdleTimer]);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict && selectedDistrict.id !== 'nexus-core') {
      setShowProjects(true);
    } else if (!selectedDistrict) {
      resetIdleTimer();
    }
  }, [selectedDistrict, resetIdleTimer]);

  const handleProjectClick = (item: PortfolioSubItem) => {
    console.log('Project clicked:', item.title);
  };
  
  const handlePanelClose = () => {
      setInfoPanelItem(null);
      resetIdleTimer();
  };

  const handleQuickNavSelect = (district: CityDistrict) => {
    handleDistrictSelect(district);
    setIsNavMenuOpen(false);
  };
  
  const handleSetPov = (newPov: 'main' | 'ship') => {
    if (newPov === 'ship') {
        if (shipRefs.length > 0) {
            let newTargetRef = targetShipRef;
            if (shipRefs.length > 1) {
                // Ensure a new ship is selected if possible
                while (newTargetRef === targetShipRef) {
                    const randomIndex = Math.floor(Math.random() * shipRefs.length);
                    newTargetRef = shipRefs[randomIndex];
                }
            } else {
                newTargetRef = shipRefs[0];
            }
            setTargetShipRef(newTargetRef);
        }
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    } else {
      resetIdleTimer();
    }
    setPov(newPov);
  };

  return (
    <>
      <Canvas
        shadows
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 50, near: 0.1, far: 1000 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[backgroundColor]} />
          
          <Sky sunPosition={sunPosition} turbidity={10} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={sunPosition}
            intensity={3}
            color={sunColor}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={500}
            shadow-camera-left={-200}
            shadow-camera-right={200}
            shadow-camera-top={200}
            shadow-camera-bottom={-200}
          />

          <CityModel />
          <Rain count={2500} />
          <FlyingShips setShipRefs={setShipRefs} />
          <PatrollingCore />
          <ProceduralTerrain onDeselect={handleGoHome} />

          <group position={[0, 5, 0]}>
            <DistrictRenderer
              districts={portfolioData}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={handleDistrictSelect}
            />
            {infoPanelItem && <HolographicInfoPanel district={infoPanelItem} onClose={handlePanelClose} />}
          </group>
          
          <CameraRig 
            selectedDistrict={selectedDistrict} 
            onAnimationFinish={onAnimationFinish} 
            isAnimating={isAnimating}
            pov={pov}
            targetShipRef={targetShipRef}
          />

          <EffectComposer>
            <Noise 
              premultiply 
              blendFunction={BlendFunction.ADD}
              opacity={0.07} 
            />
            <ChromaticAberration 
              offset={new THREE.Vector2(0.001, 0.001)}
              radialModulation={false}
              modulationOffset={0.15}
            />
          </EffectComposer>

        </Suspense>

        <OrbitControls
            enabled={pov === 'main' && !isAnimating && !isNavMenuOpen && !showProjects && !infoPanelItem}
            minDistance={20}
            maxDistance={400} // Increased max distance to accommodate new overview
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
            autoRotate={isAutoRotating}
            autoRotateSpeed={0.5}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
        />
      </Canvas>
      <HUD 
        selectedDistrict={selectedDistrict} 
        onGoHome={handleGoHome}
        onToggleNavMenu={() => setIsNavMenuOpen(!isNavMenuOpen)}
        isDetailViewActive={isDetailViewActive}
        pov={pov}
        onSetPov={handleSetPov}
      />
      <QuickNavMenu 
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onSelectDistrict={handleQuickNavSelect}
        districts={navDistricts}
      />
      <ProjectSelectionPanel 
        isOpen={showProjects && !!selectedDistrict}
        district={selectedDistrict}
        onClose={handleGoHome}
        onProjectSelect={handleProjectClick}
      />
    </>
  );
};
