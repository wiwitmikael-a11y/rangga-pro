import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>rangga.pro</h1>
        <h2 style={styles.subtitle}>A Digital Museum</h2>
        <button id="start-button" onClick={onStart} style={styles.startButton}>
          START
        </button>
      </div>
      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 0 5px #00aaff, 0 0 10px #00aaff, 0 0 15px #00aaff; }
          50% { box-shadow: 0 0 10px #00aaff, 0 0 20px #00aaff, 0 0 30px #00aaff; }
          100% { box-shadow: 0 0 5px #00aaff, 0 0 10px #00aaff, 0 0 15px #00aaff; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #start-button:hover {
            box-shadow: 0 0 10px #00aaff, 0 0 20px #00aaff, 0 0 30px #00aaff, 0 0 40px #00aaff !important;
            background-color: rgba(0, 170, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  content: {
    animation: 'fadeIn 1.5s ease-out',
  },
  title: {
    fontSize: 'clamp(2rem, 10vw, 4rem)',
    margin: 0,
    letterSpacing: '0.1em',
    textShadow: '0 0 10px #00aaff, 0 0 20px #00aaff',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 5vw, 1.5rem)',
    margin: '10px 0 40px',
    color: '#ccc',
    letterSpacing: '0.05em',
  },
  startButton: {
    background: 'transparent',
    border: '2px solid #00aaff',
    color: '#00aaff',
    padding: '15px 30px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    boxShadow: '0 0 5px #00aaff, 0 0 10px #00aaff, 0 0 15px #00aaff',
    animation: 'glow 3s infinite ease-in-out',
  },
};
