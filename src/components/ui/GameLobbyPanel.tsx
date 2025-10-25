import React from 'react';

interface GameLobbyPanelProps {
  isOpen: boolean;
  onLaunch: () => void;
  onClose: () => void;
}

export const GameLobbyPanel: React.FC<GameLobbyPanelProps> = ({ isOpen, onLaunch, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div 
        style={styles.container} 
        className={`game-lobby-panel responsive-modal ${isOpen ? 'panel-enter' : ''}`}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
            <h2 style={styles.title}>SIMULATOR PENERBANGAN</h2>
            <button onClick={onClose} style={styles.closeButton} aria-label="Abort Mission">&times;</button>
        </div>
        <div style={styles.content}>
            <h3 style={styles.sectionTitle}>PENERBANGAN BEBAS</h3>
            <p style={styles.briefingText}>
                Mulai sesi uji terbang bebas. Semua sistem senjata nonaktif.
                Fokus pada manuver dan kontrol di wilayah udara yang ditentukan.
            </p>
            <button onClick={onLaunch} style={styles.launchButton}>
                MULAI SIMULASI
            </button>
        </div>
      </div>
    </>
  );
};

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 80, 100, 0.6)',
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
    boxShadow: '0 0 40px rgba(255, 80, 100, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 80, 100, 0.4)',
    paddingBottom: '15px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: '#ff8c8c',
    fontSize: '1.5rem',
    textShadow: '0 0 8px #ff4d4d',
    textTransform: 'uppercase',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid rgba(255, 80, 100, 0.7)',
    color: '#ff8c8c',
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
    color: '#f0f0f0',
  },
  sectionTitle: {
    color: '#ffb3b3',
    textAlign: 'center',
    margin: '0 0 15px 0',
    letterSpacing: '0.1em',
  },
  briefingText: {
    color: '#ccc',
    lineHeight: 1.6,
    textAlign: 'center',
    marginBottom: '20px',
  },
  launchButton: {
    width: '100%',
    background: 'rgba(255, 80, 100, 0.3)',
    border: '1px solid #ff4d4d',
    color: '#ff8c8c',
    padding: '15px',
    fontSize: '1.2rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px #ff4d4d',
    marginTop: '10px',
  },
};