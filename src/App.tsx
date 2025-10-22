import React, { useState, useEffect, Suspense, lazy, useRef, useCallback } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { HUD } from './components/ui/HUD';
import { CityDistrict } from './types';
import { portfolioData } from './constants';

// Lazy load the 3D experience
const Experience3D = lazy(() => import('./components/Experience3D'));

function App() {
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [unlockedProjects, setUnlockedProjects] = useState<Set<string>>(new Set());

  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const scanSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    ambientSoundRef.current = document.getElementById('ambient-sound') as HTMLAudioElement;
    clickSoundRef.current = document.getElementById('click-sound') as HTMLAudioElement;
    hoverSoundRef.current = document.getElementById('hover-sound') as HTMLAudioElement;
    scanSoundRef.current = document.getElementById('scan-sound') as HTMLAudioElement;
    
    const timer = setTimeout(() => setLoading(false), 3500);
    
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  const playClickSound = useCallback(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  }, []);

  const playHoverSound = useCallback(() => {
    if (hoverSoundRef.current) {
        hoverSoundRef.current.currentTime = 0;
        hoverSoundRef.current.volume = 0.4;
        hoverSoundRef.current.play();
    }
  }, []);

  const playScanSound = useCallback(() => {
    if (scanSoundRef.current) {
        scanSoundRef.current.currentTime = 0;
        scanSoundRef.current.volume = 0.5;
        scanSoundRef.current.play();
    }
  }, []);

  const handleStart = useCallback(() => {
    // This will trigger the boot sequence in StartScreen
    // isStarted will be set to true by StartScreen after the sequence
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsStarted(true);
    if (ambientSoundRef.current) {
        ambientSoundRef.current.volume = 0.3;
        ambientSoundRef.current.play();
    }
    playClickSound();
  }, [playClickSound]);

  const handleSelectDistrict = useCallback((district: CityDistrict | null) => {
    setSelectedDistrict(district);
    playClickSound();
  }, [playClickSound]);
  
  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    playClickSound();
  }, [playClickSound]);

  const handleUnlockProjects = useCallback(() => {
    const allProjectIds = portfolioData
        .find(d => d.id === 'portfolio')?.subItems?.map(item => item.id) || [];
    setUnlockedProjects(new Set(allProjectIds));
    // Optional: play an "unlock" sound effect here
    playClickSound();
  }, [playClickSound]);


  if (loading) {
    return <Loader />;
  }
  
  return (
    <>
      <StartScreen 
        onStart={handleStart} 
        onBootComplete={handleBootComplete} 
        isStarted={isStarted}
        playScanSound={playScanSound}
      />
      {isStarted && (
        <Suspense fallback={<Loader />}>
          <Experience3D 
            onSelectDistrict={handleSelectDistrict}
            selectedDistrict={selectedDistrict}
            onDistrictHover={playHoverSound}
            unlockedProjects={unlockedProjects}
            onUnlockProjects={handleUnlockProjects}
          />
           <HUD 
            selectedDistrict={selectedDistrict}
            onGoHome={handleGoHome}
          />
        </Suspense>
      )}
    </>
  );
}

export default App;