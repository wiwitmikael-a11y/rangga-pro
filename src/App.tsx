import React, { useState, Suspense, useCallback } from 'react';
import { Experience3D } from './components/Experience3D';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';
import { VideoIntro } from './components/ui/VideoIntro';

const AppContent: React.FC = () => {
  // Simplified State: video (intro) -> entering (fly-in) -> experience (interactive)
  const [appState, setAppState] = useState<'video' | 'entering' | 'experience'>('video');
  const audio = useAudio();

  const handleIntroComplete = useCallback(() => {
    // Triggers the transition from Intro directly to 3D Entry
    audio.play('confirm');
    audio.play('gate_open', { volume: 0.8 });
    
    // Start main ambience loop immediately
    audio.playLoop('ambience', { volume: 0.2 });
    audio.playLoop('flyby', { volume: 0.15 });

    setAppState('entering');
  }, [audio]);

  const handleEntryAnimationFinish = useCallback(() => {
    setAppState('experience');
  }, []);

  const showVideo = appState === 'video';
  
  // RENDER STRATEGY:
  // Render Experience3D immediately behind the video.
  // The 'isWaitingToStart' flag keeps the camera locked at the gate position
  // until the video finishes and the user clicks enter.
  const isWaitingToStart = appState === 'video';
  const isEntering = appState === 'entering';
  const isHudVisible = appState === 'experience';

  return (
    <>
      {showVideo && <VideoIntro onComplete={handleIntroComplete} />}

      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#050810' }}>
        <Suspense fallback={null}>
            <Experience3D 
              isHudVisible={isHudVisible} 
              isEntering={isEntering}
              isWaitingToStart={isWaitingToStart} // Camera is locked while video plays
              onEntryFinish={handleEntryAnimationFinish} // Connect the callback here
            />
        </Suspense>
      </main>
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