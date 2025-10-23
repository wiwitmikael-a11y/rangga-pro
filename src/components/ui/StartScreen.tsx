import React, { useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.gridBackground} />
      <div style={styles.vignette} />
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span>METROPOLIS</span>
          <span style={styles.titleCore}>.CORE</span>
        </h1>
        <p style={styles.subtitle}>A DIGITAL PORTFOLIO BY RANGGA</p>
        <p style={styles.description}>
          This is a WebGL-based portfolio. Performance may vary. For the best experience, use a modern browser on a desktop device.
        </p>
        <button
          onClick={onStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ ...styles.button, ...(isHovered ? styles.buttonHover : {}) }}
          className={isHovered ? 'glitch' : ''}
        >
          <span data-text="ENTER THE METROPOLIS">ENTER THE METROPOLIS</span>
        </button>
      </div>
       <div style={styles.scanlineEffect} />
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grid-pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .glitch span {
          position: relative;
          display: inline-block;
          animation: glitch-anim 0.2s infinite;
        }
        .glitch span::before, .glitch span::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            width: 100%;
            height: 100%;
            background: #050810;
            overflow: hidden;
            top: 0;
        }
        .glitch span::before {
            left: 2px;
            text-shadow: -1px 0 red;
            clip: rect(24px, 550px, 90px, 0);
            animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        .glitch span::after {
            left: -2px;
            text-shadow: -1px 0 blue;
            clip: rect(85px, 550px, 140px, 0);
            animation: glitch-anim 3s infinite linear alternate-reverse;
        }
       `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--background-color)',
    zIndex: 1000,
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-family)',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    animation: 'fadeIn 1s ease-out',
    overflow: 'hidden',
  },
  gridBackground: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'grid-pan 60s linear infinite',
    opacity: 0.5,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    boxShadow: 'inset 0 0 150px 50px rgba(0, 0, 0, 0.8)',
  },
  scanlineEffect: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
    backgroundSize: '100% 4px',
    opacity: 0.1,
  },
  content: {
    maxWidth: '600px',
    zIndex: 1,
  },
  title: {
    fontSize: 'clamp(2rem, 10vw, 4rem)',
    margin: 0,
    textShadow: '0 0 10px var(--primary-color), 0 0 20px var(--primary-color)',
    letterSpacing: '0.2em',
    fontWeight: 700,
  },
  titleCore: {
    color: '#fff',
    textShadow: '0 0 10px #fff',
  },
  subtitle: {
    fontSize: 'clamp(0.8rem, 3vw, 1rem)',
    margin: '10px 0 30px 0',
    color: '#aaa',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
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
    fontFamily: 'var(--font-family)',
    color: 'var(--primary-color)',
    backgroundColor: 'transparent',
    border: '2px solid var(--primary-color)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textShadow: '0 0 5px var(--primary-color)',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonHover: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    boxShadow: '0 0 15px var(--primary-color)',
  },
};
