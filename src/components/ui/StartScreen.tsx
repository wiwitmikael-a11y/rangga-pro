import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';
import { useAudio } from '../../hooks/useAudio';

interface StartScreenProps {
  appState: 'loading' | 'start' | 'entering';
  progress: number;
  onStart: () => void;
  onIntroEnd: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  gateContainer: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  door: {
    width: '100vw',
    height: '50vh',
    background: 'linear-gradient(180deg, #141c32, #0a101f)',
    position: 'absolute',
    left: 0,
    transition: 'transform 1.5s cubic-bezier(0.8, 0, 0.2, 1)',
    boxShadow: '0 0 50px rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topDoor: {
    top: 0,
    flexDirection: 'column',
  },
  bottomDoor: {
    bottom: 0,
    background: 'linear-gradient(0deg, #141c32, #0a101f)',
  },
  consoleUI: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'var(--font-family)',
    color: 'var(--primary-color)',
    padding: '20px',
    transition: 'opacity 0.5s ease-out',
    pointerEvents: 'auto',
    width: '90%',
    maxWidth: '800px',
    background: 'rgba(0, 5, 10, 0.4)',
    border: '1px solid rgba(0, 170, 255, 0.2)',
    borderRadius: '10px',
    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 170, 255, 0.1)',
    backdropFilter: 'blur(3px)',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 400,
    margin: '0 0 30px 0',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    textShadow: '0 0 10px var(--primary-color), 0 0 20px var(--primary-color)',
    animation: 'pulse 3s infinite',
  },
  startButton: {
    background: 'transparent',
    border: '2px solid var(--primary-color)',
    color: 'var(--primary-color)',
    padding: '15px 30px',
    fontSize: '1.2rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px var(--primary-color)',
  },
  dangerStripes: {
    position: 'absolute',
    left: 0,
    width: '100vw',
    height: '20px',
    background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)',
    boxShadow: '0 0 15px #ff9900',
  },
};

export const StartScreen: React.FC<StartScreenProps> = React.memo(({ appState, progress, onStart, onIntroEnd }) => {
  const [uiVisible, setUiVisible] = useState(true);
  const [doorsOpening, setDoorsOpening] = useState(false);
  const audio = useAudio();

  useEffect(() => {
    if (appState === 'entering') {
      // 1. Fade out the console UI
      setUiVisible(false);

      // Play the gate sound effect
      audio.play('gate_open', { volume: 0.7 });

      // 2. After UI fades, start opening the gate doors
      const doorsTimer = setTimeout(() => {
        setDoorsOpening(true);
      }, 500); // This should match the UI fade-out duration

      // 3. After the doors have finished opening, notify the parent component
      const endTimer = setTimeout(() => {
        onIntroEnd();
      }, 2000); // 500ms fade + 1500ms door animation

      return () => {
        clearTimeout(doorsTimer);
        clearTimeout(endTimer);
      };
    }
  }, [appState, onIntroEnd, audio]);

  const topDoorStyle = { ...styles.door, ...styles.topDoor, transform: doorsOpening ? 'translateY(-100%)' : 'translateY(0)' };
  const bottomDoorStyle = { ...styles.door, ...styles.bottomDoor, transform: doorsOpening ? 'translateY(100%)' : 'translateY(0)' };
  const consoleStyle: React.CSSProperties = { ...styles.consoleUI, opacity: uiVisible ? 1 : 0, pointerEvents: appState === 'entering' ? 'none' : 'auto' };

  const isLoaded = appState !== 'loading';

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color); }
          50% { text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color); }
          100% { text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color); }
        }
      `}</style>
      <div style={styles.gateContainer}>
        <div style={topDoorStyle}>
          <div style={consoleStyle}>
            {isLoaded ? (
              <>
                <h1 style={styles.title}>Rangga Digital Portfolio</h1>
                <button
                  style={styles.startButton}
                  onClick={onStart}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.2)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Enter 3D World
                </button>
              </>
            ) : (
              <Loader progress={progress} />
            )}
          </div>
          <div style={{...styles.dangerStripes, bottom: 0}}></div>
        </div>
        <div style={bottomDoorStyle}>
          <div style={{...styles.dangerStripes, top: 0}}></div>
        </div>
      </div>
    </>
  );
});
