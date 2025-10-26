import React, { useState, useCallback, useEffect } from 'react';

// Dikembalikan ke impor langsung sesuai permintaan pengguna untuk memulihkan perilaku stabil sebelumnya.
import Experience3D from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { ControlHints } from './components/ui/ControlHints';
import { LoaderUI } from './components/ui/Loader'; 

const App: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'start' | 'entering' | 'experience'>('loading');
  const [hasShownHints, setHasShownHints] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Efek Pemuatan Simulasi ---
  // Ini memberikan layar pemuatan yang andal sementara aset diambil di latar belakang.
  // Menjamin pengguna melihat umpan balik segera.
  useEffect(() => {
    if (appState === 'loading') {
      const totalDuration = 3500; // Waktu pemuatan simulasi 3.5 detik
      let startTime = 0;
      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const currentProgress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
        setProgress(currentProgress);

        if (elapsed < totalDuration) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => setAppState('start'), 100);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [appState]);

  const handleStart = useCallback(() => {
    setAppState('entering');
    // Timeout ini cocok dengan durasi animasi gerbang hidrolik 1.5 detik.
    setTimeout(() => {
      setAppState('experience');
      if (!sessionStorage.getItem('hasShownHints')) {
        setHasShownHints(true);
        sessionStorage.setItem('hasShownHints', 'true');
      }
    }, 1500);
  }, []);

  const showStartScreen = appState === 'start' || appState === 'entering';
  const shouldMountExperience = appState === 'entering' || appState === 'experience';

  return (
    <>
      {appState === 'loading' && <LoaderUI progress={progress} />}

      {showStartScreen && (
        <StartScreen
          onStart={handleStart}
          isExiting={appState === 'entering'}
        />
      )}
      
      {/* 
        Merender komponen Experience3D secara langsung. Ini memastikan semua asetnya
        dimuat saat komponen dipasang, sesuai dengan perilaku stabil sebelumnya.
      */}
      {shouldMountExperience && (
          <main style={{
              width: '100vw',
              height: '100vh',
              backgroundColor: 'var(--background-color)',
              opacity: appState === 'experience' ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}>
            <Experience3D />
          </main>
      )}
      
      {hasShownHints && <ControlHints />}
    </>
  );
};

export default App;
