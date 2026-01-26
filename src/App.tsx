import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';
import { VideoIntro } from './components/ui/VideoIntro';

const AppContent: React.FC = () => {
  const { progress } = useProgress();
  // State: video -> loading -> start (waiting for user) -> entering (animation) -> experience
  const [appState, setAppState] = useState<'video' | 'loading' | 'start' | 'entering' | 'experience'>('video');
  const audio = useAudio();

  // Threshold to switch from loading to start button
  const isLoaded = progress >= 100;

  const handleVideoEnd = useCallback(() => {
    setAppState('loading');
  }, []);

  useEffect(() => {
    if (appState === 'loading' && isLoaded) {
      // Small delay to ensure smooth transition from loader to button
      const timer = setTimeout(() => setAppState('start'), 800);
      return () => clearTimeout(timer);
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    if (appState === 'start') {
      audio.play('confirm');
      audio.play('gate_open', { volume: 0.8 });
      
      // Start main ambience loop immediately
      audio.playLoop('ambience', { volume: 0.2 });
      audio.playLoop('flyby', { volume: 0.15 });
      
      setAppState('entering');
    }
  }, [appState, audio]);

  const handleIntroEnd = useCallback(() => {
    setAppState('experience');
  }, []);

  const showVideo = appState === 'video';
  
  // FIX: Render Experience3D as soon as video ends. 
  // It will be hidden behind the StartScreen, allowing it to "warm up" (compile shaders).
  // This prevents the black flash/blank screen when opening the doors.
  const showExperienceCanvas = appState !== 'video';
  
  // Keep StartScreen mounted during loading, start, and entering phases.
  const showStartScreen = appState === 'loading' || appState === 'start' || appState === 'entering';
  
  const isHudVisible = appState === 'experience';

  return (
    <>
      {showVideo && <VideoIntro onVideoEnd={handleVideoEnd} />}

      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#050810' }}>
        <Suspense fallback={null}>
          {showExperienceCanvas && (
            <Experience3D 
              isHudVisible={isHudVisible} 
              isEntering={appState === 'entering'} 
            />
          )}
        </Suspense>
      </main>
      
      {showStartScreen && (
        <StartScreen
          appState={appState}
          progress={progress}
          onStart={handleStart}
          onIntroEnd={handleIntroEnd}
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
};


export default App;