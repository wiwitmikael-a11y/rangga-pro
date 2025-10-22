import React, { useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.scanlineEffect}></div>
      <div style={styles.content}>
        <h1 style={styles.title}>METROPOLIS_OS</h1>
        <p style={styles.subtitle}>A DIGITAL PORTFOLIO EXPERIENCE</p>
        <button
          style={{ ...styles.button, ...(isHovered ? styles.buttonHover : {}) }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onStart}
        >
          &gt; ENTER THE GRID &lt;
        </button>
      </div>
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
    zIndex: 2000,
    color: '#00ffff',
    fontFamily: 'monospace',
    textAlign: 'center',
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
    zIndex: 1,
  },
  title: {
    fontSize: 'clamp(2rem, 10vw, 5rem)',
    margin: 0,
    textShadow: '0 0 15px #00ffff',
    letterSpacing: '0.2em',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
    margin: '10px 0 40px 0',
    color: '#a7d1d0',
    letterSpacing: '0.1em',
  },
  button: {
    background: 'transparent',
    border: '2px solid #00ffff',
    color: '#00ffff',
    padding: '15px 30px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px #00ffff',
    letterSpacing: '0.1em',
  },
  buttonHover: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    boxShadow: '0 0 20px #00ffff',
  },
};
