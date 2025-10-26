import React, { useState, useCallback, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { CityModel } from './scene/CityModel';
import { FlyingShips } from './scene/FlyingShips';
import { DistrictRenderer } from './scene/DistrictRenderer';
import { portfolioData, OVERVIEW_CAMERA_POSITION } from '../constants';
import type { CityDistrict, PortfolioSubItem } from '../types';
import { CameraRig } from './CameraRig';
import { HUD } from './ui/HUD';
import { ProceduralTerrain } from './scene/ProceduralTerrain';
import { QuickNavMenu } from './ui/QuickNavMenu';
import { ProjectSelectionPanel } from './ui/ProjectSelectionPanel';
import { PatrollingCore } from './scene/PatrollingCore';


// Define the sun's position for a sunset glow near the horizon
const sunPosition: [number, number, number] = [100, 2, -100]; // Lower sun for a more dramatic sunset
const sunColor = '#ffd0b3'; // Warmer light

export const Experience3D: React.FC = () => {
  const [districts] = useState<CityDistrict[]>(portfolioData);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContentPanel, setShowContentPanel] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [shipRefs, setShipRefs] = useState<React.RefObject<THREE.Group>[]>([]);
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const navDistricts = useMemo(() => {
    const majorDistricts = districts.filter(d => d.type === 'major');
    const nexusCore = majorDistricts.find(d => d.id === 'nexus-core');
    return nexusCore
      ? [nexusCore, ...majorDistricts.filter(d => d.id !== 'nexus-core')]
      : majorDistricts;
  }, [districts]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    setShowContentPanel(false);
    setIsAutoRotating(false);
    
    setSelectedDistrict(districts.find(d => d.id === district.id) || null);
    setIsAnimating(true);
  }, [selectedDistrict, isAnimating, districts]);
  
  const isDetailViewActive = showContentPanel || !!selectedDistrict;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !isDetailViewActive) {
            setIsAutoRotating(true);
        }
    }, 5000);
  }, [pov, isDetailViewActive]);

  const handleInteractionStart = useCallback(() => {
      setIsAutoRotating(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
      resetIdleTimer();
  }, [resetIdleTimer]);

  const handleControlsChange = useCallback(() => {
    if (controlsRef.current) {
      const target = controlsRef.current.target;
      const boundary = 150;
      target.x = THREE.MathUtils.clamp(target.x, -boundary, boundary);
      target.z = THREE.MathUtils.clamp(target.z, -boundary, boundary);
      target.y = THREE.MathUtils.clamp(target.y, 0, 50); // Prevent looking underground or too high
    }
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleGoHome = useCallback(() => {
    setPov('main');
    setSelectedDistrict(null);
    setIsAnimating(true);
    setShowContentPanel(false);
    setTargetShipRef(null);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const onAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    if (selectedDistrict) {
      setShowContentPanel(true);
    } else if (pov === 'main') {
      resetIdleTimer();
    }
  }, [selectedDistrict, resetIdleTimer, pov]);


  const handleProjectClick = (item: PortfolioSubItem) => {
    console.log('Project clicked:', item.title);
  };

  const handleQuickNavSelect = (district: CityDistrict) => {
    handleDistrictSelect(district);
    setIsNavMenuOpen(false);
  };
  
  const handleSetPov = (newPov: 'main' | 'ship') => {
    if (newPov === 'ship') {
      let newTargetRef = targetShipRef;
      // Cycle through ships if already in ship POV
      if (pov === 'ship' && shipRefs.length > 1) {
          let currentTargetIndex = shipRefs.findIndex(ref => ref === targetShipRef);
          let nextIndex = (currentTargetIndex + 1) % shipRefs.length;
          newTargetRef = shipRefs[nextIndex];
      } else if (shipRefs.length > 0) { // Or select a random one if switching from main
          const randomIndex = Math.floor(Math.random() * shipRefs.length);
          newTargetRef = shipRefs[randomIndex];
      }
      
      if (newTargetRef) {
          setIsAutoRotating(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          if (selectedDistrict) setSelectedDistrict(null);
          setShowContentPanel(false);
          setTargetShipRef(newTargetRef);
          setPov('ship');
          setIsAnimating(true);
      }

    } else { // newPov is 'main'
      // If already in main view, cycle through district POVs
      if (pov === 'main' && !selectedDistrict) {
        const majorDistricts = districts.filter(d => d.type === 'major' && d.id !== selectedDistrict?.id);
        if (majorDistricts.length > 0) {
          const randomIndex = Math.floor(Math.random() * majorDistricts.length);
          handleDistrictSelect(majorDistricts[randomIndex]);
        }
      } else {
        handleGoHome();
      }
    }
  };

  return (
    <>
      <Canvas
        shadows
        camera={{ position: OVERVIEW_CAMERA_POSITION.toArray(), fov: 50, near: 0.1, far: 1000 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
            <>
              <Sky sunPosition={sunPosition} turbidity={20} rayleigh={1} mieCoefficient={0.005} mieDirectionalG={0.8} />
              <ambientLight intensity={1.2} />
              <directionalLight
                position={sunPosition}
                intensity={6.0}
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
              <FlyingShips setShipRefs={setShipRefs} isPaused={false} />
              <PatrollingCore isPaused={false} />
              <ProceduralTerrain onDeselect={handleGoHome} />
              
              <group position={[0, 5, 0]}>
                <DistrictRenderer
                  districts={districts}
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                />
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
            </>
        </Suspense>

        <OrbitControls
            ref={controlsRef}
            enabled={pov === 'main' && !isAnimating && !isNavMenuOpen && !showContentPanel}
            minDistance={20}
            maxDistance={300}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
            autoRotate={isAutoRotating}
            autoRotateSpeed={0.5}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
            onChange={handleControlsChange}
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

      {isNavMenuOpen && (
          <QuickNavMenu 
              isOpen={isNavMenuOpen}
              onClose={() => setIsNavMenuOpen(false)}
              onSelectDistrict={handleQuickNavSelect}
              districts={navDistricts}
          />
      )}
       {showContentPanel && (
          <ProjectSelectionPanel
              isOpen={showContentPanel}
              district={selectedDistrict}
              onClose={handleGoHome}
              onProjectSelect={handleProjectClick}
          />
      )}
    </>
  );
};
