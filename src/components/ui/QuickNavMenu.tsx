import React from 'react';
import type { CityDistrict } from '../../types';

interface QuickNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict: (district: CityDistrict) => void;
  districts: CityDistrict[];
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.8)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
    transition: 'opacity 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    width: '80%',
    maxWidth: '800px',
    padding: '20px',
    borderRadius: '15px',
    zIndex: 101,
    boxShadow: '0 0 30px rgba(0, 170, 255, 0.2)',
    overflow: 'hidden',
  },
  dangerStripes: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '10px',
    background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)',
    animation: 'stripe-scroll 1s linear infinite',
    borderBottom: '2px solid #ff9900',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: '1px solid rgba(255, 153, 0, 0.7)',
    color: '#ff9900',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '10px',
    marginTop: '15px',
  },
  navButton: {
    ...glassmorphism,
    color: '#00aaff',
    padding: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderLeft: '3px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
    width: '100%', // Ensure button takes full grid cell width
  },
  buttonTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '5px',
  },
  buttonDesc: {
    fontSize: '0.8rem',
    color: '#aaa',
    lineHeight: '1.3',
  },
};

export const QuickNavMenu: React.FC<QuickNavMenuProps> = React.memo(({ isOpen, onClose, onSelectDistrict, districts }) => {
  if (!isOpen) return null;

  const handleSelect = (district: CityDistrict) => {
    onSelectDistrict(district);
  };

  return (
    <>
      <style>{`
        @keyframes stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 56.5px 0; }
        }
        .nav-button:hover {
          transform: translateY(-3px);
          border-left-color: var(--primary-color) !important;
          box-shadow: 0 5px 15px rgba(0, 225, 255, 0.2);
          background: rgba(0, 100, 150, 0.4);
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.container} className={`quick-nav-container ${isOpen ? 'panel-enter' : ''}`}>
        <div style={styles.dangerStripes} />
        <button onClick={onClose} style={styles.closeButton} aria-label="Close Navigation">&times;</button>
        <div style={styles.grid} className="quick-nav-grid">
          {districts.map(district => (
            <button
              key={district.id}
              style={styles.navButton}
              className="nav-button"
              onClick={() => handleSelect(district)}
            >
              <span style={styles.buttonTitle}>{district.title}</span>
              <span style={styles.buttonDesc}>{district.description}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
});
