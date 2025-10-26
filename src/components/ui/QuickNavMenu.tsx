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
    opacity: 0,
    animation: 'list-item-enter 0.4s ease forwards',
  },
  homeButton: {
    borderColor: 'var(--primary-color)',
    background: 'rgba(0, 170, 255, 0.1)',
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

export const QuickNavMenu: React.FC<QuickNavMenuProps> = ({ isOpen, onClose, onSelectDistrict, districts }) => {
  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
    transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1, 0.2, 1)',
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };
  
  const handleClose = () => {
    onClose();
  };

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
      `}</style>
      <div style={overlayStyle} onClick={handleClose} />
      <div style={containerStyle} className={`quick-nav-container ${isOpen ? 'panel-enter' : ''}`}>
        <div style={styles.dangerStripes} />
        <button onClick={handleClose} style={styles.closeButton} aria-label="Close Navigation">&times;</button>
        <div style={styles.grid} className="quick-nav-grid">
          {districts.map((district, index) => {
            const isHomeButton = district.id === 'nexus-core';
            return (
              <button
                key={district.id}
                style={{
                  ...styles.navButton,
                  ...(isHomeButton ? styles.homeButton : {}),
                  animationDelay: isOpen ? `${index * 50}ms` : '0ms',
                }}
                className="nav-button"
                onClick={() => handleSelect(district)}
              >
                <span style={styles.buttonTitle}>{district.title}</span>
                <span style={styles.buttonDesc}>{district.description}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
};