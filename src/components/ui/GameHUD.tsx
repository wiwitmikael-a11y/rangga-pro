import React from 'react';
import ReactDOM from 'react-dom';

interface GameHUDProps {
  onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onExit }) => {
  const hudContent = (
    <div style={styles.container}>
      <div style={styles.leftInfo}>
        <p style={styles.label}>OBJECTIVE</p>
        <p style={styles.value}>NEUTRALIZE HOSTILE CORES</p>
      </div>
      <button onClick={onExit} style={styles.exitButton}>
        EXIT PROTOCOL
      </button>
      <div style={styles.rightInfo}>
        <p style={styles.label}>SYSTEM STATUS</p>
        <p style={{...styles.value, color: '#4CAF50'}}>NOMINAL</p>
      </div>
    </div>
  );

  // The HUD is an HTML overlay, so we render it into the main document body using a portal
  // to ensure it stacks correctly above the 3D canvas.
  return ReactDOM.createPortal(hudContent, document.body);
};


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '800px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    borderRadius: '10px',
    padding: '10px 20px',
    color: 'white',
    fontFamily: 'var(--font-family)',
    zIndex: 100,
    pointerEvents: 'auto',
  },
  leftInfo: {
    textAlign: 'left',
  },
  rightInfo: {
    textAlign: 'right',
  },
  label: {
    margin: 0,
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  value: {
    margin: '2px 0 0 0',
    fontSize: '1rem',
    color: 'var(--primary-color)',
    letterSpacing: '0.05em',
  },
  exitButton: {
    background: 'rgba(255, 67, 67, 0.2)',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '10px 20px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
  }
};