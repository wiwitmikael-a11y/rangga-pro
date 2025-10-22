import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
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

  useEffect(() => {
    ambientSoundRef.current = document.getElementById('ambient-sound') as HTMLAudioElement;
    clickSoundRef.current = document.getElementById('click-sound') as HTMLAudioElement;
    
    const timer = setTimeout(() => setLoading(false), 1500);
    
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    if (ambientSoundRef.current) {
        ambientSoundRef.current.volume = 0.3;
        ambientSoundRef.current.play();
    }
    playClickSound();
  };

  const handleSelectDistrict = (district: CityDistrict | null) => {
    setSelectedDistrict(district);
    setSelectedSubItem(null);
    playClickSound();
  };

  const handleSelectSubItem = (item: PortfolioSubItem) => {
    setSelectedSubItem(item);
    playClickSound();
  };
  
  const handleGoHome = () => {
    setSelectedDistrict(null);
    setSelectedSubItem(null);
    playClickSound();
  };

  const handleClosePanel = () => {
    setSelectedSubItem(null);
    playClickSound();
  }

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