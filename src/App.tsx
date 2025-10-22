import React, { useState, useEffect, useCallback, Suspense, useMemo, useRef } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { HUD } from './components/ui/HUD';
import Experience3D from './components/Experience3D';
import { CityDistrict, PerformanceTier, PortfolioSubItem } from './types';
import { usePerformance } from './hooks/usePerformance';
import { NexusProtocolGame } from './components/game/NexusProtocolGame';
import HolographicProjector from './components/scene/HolographicProjector';
import { portfolioData } from './constants';

function App() {
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());
  const [showGame, setShowGame] = useState<CityDistrict | null>(null);
  const [showProjector, setShowProjector] = useState<PortfolioSubItem | null>(null);

  const { initialTier, performanceTier, setPerformanceTier } = usePerformance();
  const audioContext = useMemo(() => new (window.AudioContext || (window as any).webkitAudioContext)(), []);
  const scanSoundBuffer = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Pre-load sound effect
    fetch('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sounds/scanner_ui.wav')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        scanSoundBuffer.current = audioBuffer;
      });

    const timer = setTimeout(() => setLoading(false), 5500); // Sync with Loader animation
    return () => clearTimeout(timer);
  }, [audioContext]);
  
  const playScanSound = useCallback(() => {
    if (scanSoundBuffer.current && audioContext.state === 'running') {
      const source = audioContext.createBufferSource();
      source.buffer = scanSoundBuffer.current;
      source.connect(audioContext.destination);
      source.start(0);
    }
  }, [audioContext]);
  
  const handleStart = useCallback(() => {
      // Resume audio context on user interaction
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      setIsStarted(true);
  }, [audioContext]);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
  }, []);

  const handleDistrictSelect = useCallback((district: CityDistrict | null) => {
    if (district?.id === 'contact-terminal') {
      // Special handling for contact terminal if needed
      setSelectedDistrict(district);
      return;
    }

    const isUnlocked = unlockedItems.has(district?.id || '');
    if (district && !isUnlocked && district.id !== 'intro-architect') { // intro-architect is always unlocked
      setShowGame(district);
    } else {
      setSelectedDistrict(district);
    }
  }, [unlockedItems]);

  const handleGameWin = useCallback((district: CityDistrict) => {
    setUnlockedItems(prev => new Set(prev).add(district.id));
    setShowGame(null);
    setSelectedDistrict(district);
  }, []);
  
  const handleProjectClick = useCallback((item: PortfolioSubItem) => {
    setShowProjector(item);
    setSelectedDistrict(null); // Hide district info while projector is open
  }, []);
  
  const handleProjectorClose = useCallback(() => {
    if (showProjector) {
      const parentDistrict = portfolioData.find(d => d.subItems?.some(s => s.id === showProjector.id));
      if (parentDistrict) {
        setSelectedDistrict(parentDistrict);
      }
    }
    setShowProjector(null);
  }, [showProjector]);

  if (loading) {
    return <Loader />;
  }

  if (!bootComplete) {
    return (
      <StartScreen
        onStart={handleStart}
        isStarted={isStarted}
        onBootComplete={handleBootComplete}
        playScanSound={playScanSound}
      />
    );
  }
  
  // Render null until performance tier is detected to avoid flicker
  if (!initialTier) return null;

  return (
    <>
      <Suspense fallback={null}>
        <Experience3D
          onDistrictSelect={handleDistrictSelect}
          onDistrictHover={setHoveredDistrictId}
          selectedDistrict={selectedDistrict}
          hoveredDistrictId={hoveredDistrictId}
          performanceTier={performanceTier}
          unlockedItems={unlockedItems}
          onProjectClick={handleProjectClick}
        />
      </Suspense>
      <HUD
        selectedDistrict={selectedDistrict}
        onGoHome={() => handleDistrictSelect(null)}
        performanceTier={performanceTier}
        onSetPerformanceTier={setPerformanceTier}
      />
      {showGame && (
        <NexusProtocolGame
          district={showGame}
          onWin={() => handleGameWin(showGame)}
          onExit={() => setShowGame(null)}
        />
      )}
       {showProjector && (
         <HolographicProjector 
            item={showProjector}
            onClose={handleProjectorClose}
         />
       )}
    </>
  );
}

export default App;
