import React, { useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>METROPOLIS.CORE</h1>
        <p style={styles.subtitle}>A DIGITAL PORTFOLIO BY RANGGA</p>
        <p style={styles.description}>
          This is a WebGL-based portfolio. Performance may vary. For the best experience, use a modern browser on a desktop device.
        </p>
        <button
          onClick={onStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ ...styles.button, ...(isHovered ? styles.buttonHover : {}) }}
        >
          ENTER THE METROPOLIS
        </button>
      </div>
       <div style={styles.scanlineEffect}></div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: 1000,
    color: '#00ffff',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
   scanlineEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
        backgroundSize: '100% 4px',
        opacity: 0.2,
    },
  content: {
    maxWidth: '600px',
    zIndex: 1,
  },
  title: {
    fontSize: 'clamp(2rem, 10vw, 4rem)',
    margin: 0,
    textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
    letterSpacing: '0.2em',
  },
  subtitle: {
    fontSize: 'clamp(0.8rem, 3vw, 1rem)',
    margin: '10px 0 30px 0',
    color: '#aaa',
    letterSpacing: '0.1em',
  },
  description: {
    fontSize: 'clamp(0.8rem, 3vw, 1rem)',
    color: '#ddd',
    lineHeight: 1.6,
  },
  button: {
    marginTop: '30px',
    padding: '15px 30px',
    fontSize: '1rem',
    fontFamily: 'monospace',
    color: '#00ffff',
    backgroundColor: 'transparent',
    border: '2px solid #00ffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textShadow: '0 0 5px #00ffff',
  },
  buttonHover: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    boxShadow: '0 0 15px #00ffff',
  },
};
