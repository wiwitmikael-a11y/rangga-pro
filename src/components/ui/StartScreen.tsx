import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = React.memo(({ onStart, isExiting }) => {
  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isExiting ? 0 : 1,
    pointerEvents: isExiting ? 'none' : 'auto',
    transition: 'opacity 1s ease-out',
  };

  return (
    <div style={containerStyle}>
      <div style={styles.scanlineEffect} />
      <div style={styles.content}>
        <h1 style={styles.title}>METROPOLIS.CORE</h1>
        <p style={styles.subtitle}>Rangga Digital Portfolio</p>
        <button
            style={styles.startButton}
            onClick={onStart}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.2)')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Enter 3D World
        </button>
        <p style={styles.disclaimer}>Best experienced on a desktop browser with a dedicated GPU.</p>
      </div>
       <style>{`
          @keyframes fadeInStart { from { opacity: 0; } to { opacity: 1; } }
          @keyframes pulse {
            0% { text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color); }
            50% { text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color); }
            100% { text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color); }
          }
      `}</style>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: 1000,
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-family)',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    animation: 'fadeInStart 1s ease-in',
  },
  scanlineEffect: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
    backgroundSize: '100% 4px',
    opacity: 0.1,
    zIndex: 1,
  },
  content: {
    zIndex: 2,
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
  disclaimer: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '0.8rem',
      opacity: 0.5,
      width: '100%',
  }
};