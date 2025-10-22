import React, { useState, useEffect, Suspense, lazy, useRef, useCallback } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { InfoPanel } from './components/ui/InfoPanel';
import { HUD } from './components/ui/HUD';
import { CityDistrict, PortfolioSubItem } from './types';

// Lazy load the 3D experience
const Experience3D = lazy(() => import('./components/Experience3D'));

function App() {
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<PortfolioSubItem | null>(null);

  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    ambientSoundRef.current = document.getElementById('ambient-sound') as HTMLAudioElement;
    clickSoundRef.current = document.getElementById('click-sound') as HTMLAudioElement;
    hoverSoundRef.current = document.getElementById('hover-sound') as HTMLAudioElement;
    
    const timer = setTimeout(() => setLoading(false), 3500); // Increased loading time for new boot sequence
    
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

  const handleStart = useCallback(() => {
    setIsStarted(true);
    if (ambientSoundRef.current) {
        ambientSoundRef.current.volume = 0.3;
        ambientSoundRef.current.play();
    }
    playClickSound();
  }, [playClickSound]);

  const handleSelectDistrict = useCallback((district: CityDistrict | null) => {
    setSelectedDistrict(district);
    setSelectedSubItem(null);
    playClickSound();
  }, [playClickSound]);

  const handleSelectSubItem = useCallback((item: PortfolioSubItem) => {
    setSelectedSubItem(item);
    playClickSound();
  }, [playClickSound]);
  
  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setSelectedSubItem(null);
    playClickSound();
  }, [playClickSound]);

  const handleClosePanel = useCallback(() => {
    setSelectedSubItem(null);
    playClickSound();
  }, [playClickSound]);

  if (loading) {
    return <Loader />;
  }
  
  if (!isStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Experience3D 
          onSelectDistrict={handleSelectDistrict}
          onSelectSubItem={handleSelectSubItem}
          selectedDistrict={selectedDistrict}
          onDistrictHover={playHoverSound}
        />
         <HUD 
          selectedDistrict={selectedDistrict}
          onGoHome={handleGoHome}
        />
      </Suspense>
     
      {selectedSubItem && (
        <InfoPanel 
          item={selectedSubItem}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
}

export default App;