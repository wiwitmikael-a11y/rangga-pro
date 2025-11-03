import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onIntroEnd: () => void;
  isEntering: boolean;
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
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    margin: 0,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    textShadow: '0 0 10px var(--primary-color), 0 0 20px var(--primary-color)',
    animation: 'pulse 3s infinite',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    margin: '10px 0 40px 0',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    opacity: 0.8,
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
    animation: 'stripe-scroll 1s linear infinite',
    boxShadow: '0 0 15px #ff9900',
  },
};

export const StartScreen: React.FC<StartScreenProps> = React.memo(({ onIntroEnd, isEntering }) => {
  const [uiVisible, setUiVisible] = useState(true);
  const [doorsOpening, setDoorsOpening] = useState(false);

  useEffect(() => {
    if (isEntering) {
      // 1. Fade out the console UI
      setUiVisible(false);

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
  }, [isEntering, onIntroEnd]);

  const topDoorStyle = { ...styles.door, ...styles.topDoor, transform: doorsOpening ? 'translateY(-100%)' : 'translateY(0)' };
  const bottomDoorStyle = { ...styles.door, ...styles.bottomDoor, transform: doorsOpening ? 'translateY(100%)' : 'translateY(0)' };
  const consoleStyle = { ...styles.consoleUI, opacity: uiVisible ? 1 : 0, pointerEvents: isEntering ? 'none' : 'auto' };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color); }
          50% { text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color); }
          100% { text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color); }
        }
        @keyframes stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 56.5px 0; }
        }
      `}</style>
      <div style={styles.gateContainer}>
        <div style={topDoorStyle}>
          <div style={consoleStyle}>
            <h1 style={styles.title}>RAGETOPIA</h1>
            <p style={styles.subtitle}>Rangga Digital Portfolio</p>
            <button
              style={styles.startButton}
              onClick={onIntroEnd} // The button is now on the top door
              onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.2)')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Enter 3D World
            </button>
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
