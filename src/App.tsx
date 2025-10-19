import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { InfoPanel } from './components/ui/InfoPanel';
import { HUD } from './components/ui/HUD';
import { CityDistrict, PortfolioSubItem } from './types';

const Experience3D = lazy(() => import('./components/Experience3D'));

function App() {
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<PortfolioSubItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSelectDistrict = (district: CityDistrict | null) => {
    setSelectedDistrict(district);
    setSelectedSubItem(null); // Deselect sub-item when changing districts
  };

  const handleSelectSubItem = (item: PortfolioSubItem) => {
    setSelectedSubItem(item);
  };
  
  const handleGoHome = () => {
    setSelectedDistrict(null);
    setSelectedSubItem(null);
  };

  const handleClosePanel = () => {
    setSelectedSubItem(null);
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
