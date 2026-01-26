import React, { useState, Suspense, useCallback } from 'react';
import { Experience3D } from './components/Experience3D';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';
import { VideoIntro } from './components/ui/VideoIntro';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch 3D crashes without killing the whole app UI
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CRITICAL 3D ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#050810', color: '#ff4444', fontFamily: 'monospace', textAlign: 'center', padding: '20px'
        }}>
            <h2 style={{fontSize: '2rem', marginBottom: '10px'}}>SYSTEM FAILURE</h2>
            <p style={{color: '#888', maxWidth: '600px', marginBottom: '20px'}}>
                The 3D Reality Engine encountered a critical error.<br/>
                {this.state.error?.message || "Unknown WebGL Error"}
            </p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    background: 'transparent', border: '1px solid #ff4444', color: '#ff4444',
                    padding: '10px 30px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem'
                }}
            >
                REBOOT SYSTEM
            </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'video' | 'entering' | 'experience'>('video');
  const audio = useAudio();

  const handleIntroComplete = useCallback(() => {
    audio.play('confirm');
    audio.play('gate_open', { volume: 0.8 });
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
  // The 'isWaitingToStart' flag keeps the camera locked at the gate position.
  const isWaitingToStart = appState === 'video';
  const isEntering = appState === 'entering';
  const isHudVisible = appState === 'experience';

  return (
    <>
      {showVideo && <VideoIntro onComplete={handleIntroComplete} />}

      <main style={{ width: '100vw', height: '100vh', backgroundColor: '#050810' }}>
        <ErrorBoundary>
            <Suspense fallback={null}>
                <Experience3D 
                  isHudVisible={isHudVisible} 
                  isEntering={isEntering}
                  isWaitingToStart={isWaitingToStart} 
                  onEntryFinish={handleEntryAnimationFinish} 
                />
            </Suspense>
        </ErrorBoundary>
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