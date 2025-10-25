import React from 'react';

// SVG Icon Component with a gradient to mimic Instagram's colors
const InstagramIcon: React.FC = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', marginBottom: '10px' }}>
      <defs>
        <radialGradient id="ig-gradient" cx="0.3" cy="1" r="1">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-gradient)"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-gradient)"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-gradient)" strokeWidth="2"></line>
    </svg>
  );

interface InstagramVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramVisitModal: React.FC<InstagramVisitModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleVisit = () => {
        window.open('https://www.instagram.com/rangga.p.h/', '_blank');
        onClose();
    };

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div 
                style={styles.container} 
                className={`instagram-visit-modal responsive-modal ${isOpen ? 'panel-enter' : ''}`}
                onContextMenu={(e) => e.stopPropagation()}
            >
                <div style={styles.content}>
                    <InstagramIcon />
                    <h2 style={styles.username}>@rangga.p.h</h2>
                    <p style={styles.promptText}>Visit External Profile?</p>
                    <button onClick={handleVisit} style={styles.visitButton}>
                        Proceed
                    </button>
                    <button onClick={onClose} style={styles.closeButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
};

const glassmorphism = {
  background: 'rgba(10, 20, 35, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 225, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 200,
    transition: 'opacity 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    zIndex: 201,
    borderRadius: '15px',
    padding: '30px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 40px rgba(0, 225, 255, 0.3)',
  },
  content: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
  },
  username: {
    margin: '0 0 10px 0',
    color: 'var(--primary-color)',
    fontSize: '1.5rem',
    textShadow: '0 0 8px var(--primary-color)',
  },
  promptText: {
    margin: '0 0 25px 0',
    color: '#ccc',
    fontSize: '1rem',
  },
  visitButton: {
    width: '100%',
    background: 'rgba(0, 170, 255, 0.2)',
    border: '1px solid var(--primary-color)',
    color: 'var(--primary-color)',
    padding: '12px 25px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px var(--primary-color)',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  closeButton: {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#aaa',
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    borderRadius: '5px',
  },
};