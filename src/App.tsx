import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience3D } from './components/Experience3D';
import { StartScreen } from './components/ui/StartScreen';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';
import { VideoIntro } from './components/ui/VideoIntro';

const AppContent: React.FC = () => {
  const { progress } = useProgress();
  const [appState, setAppState] = useState<'video' | 'loading' | 'start' | 'entering' | 'experience'>('video');
  const audio = useAudio();

  const isLoaded = progress >= 100;

  const handleVideoEnd = useCallback(() => {
    setAppState('loading');
  }, []);

  useEffect(() => {
    if (appState === 'loading' && isLoaded) {
      const timer = setTimeout(() => setAppState('start'), 500);
      return () => clearTimeout(timer);
    }
  }, [appState, isLoaded]);

  const handleStart = useCallback(() => {
    if (appState === 'start') {
      audio.play('confirm');
      // Start main ambience loop once user engages
      audio.playLoop('ambience', { volume: 0.2 });
      audio.playLoop('flyby', { volume: 0.15 });
      setAppState('entering');
    }
  }, [appState, audio]);

  const handleIntroEnd = useCallback(() => {
    setAppState('experience');
  }, []);

  const showVideo = appState === 'video';
  const showIntro = appState === 'loading' || appState === 'start' || appState === 'entering';
  const showExperienceCanvas = appState !== 'loading' && appState !== 'video';
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
      
      {showIntro && (
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