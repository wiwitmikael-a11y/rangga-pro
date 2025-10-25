import React from 'react';

interface GameLobbyPanelProps {
  isOpen: boolean;
  onLaunch: () => void;
  onClose: () => void;
}

export const GameLobbyPanel: React.FC<GameLobbyPanelProps> = ({ isOpen, onLaunch, onClose }) => {
  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div 
        style={styles.container} 
        className={`game-lobby-modal responsive-modal ${isOpen ? 'panel-enter' : ''}`}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
            <h2 style={styles.title}>Aegis Command</h2>
            <button onClick={onClose} style={styles.closeButton} aria-label="Close Lobby">&times;</button>
        </div>
        <div style={styles.content}>
            <p style={styles.description}>
                Unauthorized hostile data cores detected within city limits. Launch pilot protocol to neutralize all threats.
            </p>
            <div style={styles.controlsInfo}>
                <h3 style={styles.controlsTitle}>Pilot Controls</h3>
                <ul>
                    <li><strong>[W][S]</strong>: Forward / Backward</li>
                    <li><strong>[A][D]</strong>: Strafe Left / Right</li>
                    <li><strong>[SPACE]</strong>: Ascend</li>
                    <li><strong>[SHIFT]</strong>: Descend</li>
                </ul>
            </div>
            <button onClick={onLaunch} style={styles.launchButton}>
                Launch Protocol
            </button>
        </div>
      </div>
    </>
  );
};

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 100,
    transition: 'opacity 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    zIndex: 101,
    borderRadius: '15px',
    padding: '25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 170, 255, 0.3)',
    paddingBottom: '15px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: 'var(--primary-color)',
    fontSize: '1.5rem',
    textShadow: '0 0 8px var(--primary-color)',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid rgba(0, 170, 255, 0.7)',
    color: '#00aaff',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
  content: {
    padding: '20px 0 0 0',
    color: '#ccc',
  },
  description: {
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 1.6,
    margin: '0 0 25px 0',
  },
  controlsInfo: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '25px',
  },
  controlsTitle: {
    margin: '0 0 10px 0',
    textAlign: 'center',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  launchButton: {
    width: '100%',
    background: 'rgba(0, 170, 255, 0.2)',
    border: '1px solid var(--primary-color)',
    color: 'var(--primary-color)',
    padding: '15px',
    fontSize: '1.2rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px var(--primary-color)',
    borderRadius: '5px',
  },
};