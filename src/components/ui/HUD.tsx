import React, { useMemo } from 'react';
import type { CityDistrict } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
  onToggleNavMenu: () => void;
}

export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, onToggleNavMenu }) => {

  const breadcrumb = useMemo(() => {
    if (selectedDistrict) return `METROPOLIS.CORE > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`;
    return 'METROPOLIS.CORE';
  }, [selectedDistrict]);
  
  const showHomeButton = !!selectedDistrict;
  const homeButtonIcon = '⌂'; // Home icon
  const navMenuIcon = '☰'; // A more common menu icon (hamburger)

  return (
    <>
      <div style={styles.breadcrumbContainer}>
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
      </div>
       
      <div style={styles.bottomContainer}>
         <button 
            onClick={onGoHome} 
            style={{...styles.hudButton, ...(showHomeButton ? styles.visible : styles.hiddenBottom)}}
            aria-label="Back to City Overview"
          >
            {homeButtonIcon}
          </button>
      </div>

      <div style={styles.bottomRightContainer}>
        <button
          onClick={onToggleNavMenu}
          style={{...styles.hudButton, ...styles.hexButton}}
          className="hex-btn"
          aria-label="Open Quick Navigation"
        >
          {navMenuIcon}
        </button>
      </div>
    </>
  );
});

const glassmorphism: React.CSSProperties = {
  background: 'rgba(0, 20, 40, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
  boxShadow: '0 0 15px rgba(0, 170, 255, 0.1)',
};

const styles: { [key: string]: React.CSSProperties } = {
  breadcrumbContainer: {
    ...glassmorphism,
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#00aaff',
    padding: '5px 15px',
    borderRadius: '5px',
    zIndex: 10,
    textShadow: '0 0 5px #00aaff',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.5s ease',
  },
  breadcrumbText: {
    margin: 0,
    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
    letterSpacing: '0.1em',
  },
  bottomContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    textAlign: 'center',
  },
  bottomRightContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10,
  },
  hudButton: {
    ...glassmorphism,
    color: '#00aaff',
    width: '45px',
    height: '45px',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    borderRadius: '50%',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    lineHeight: 1,
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    pointerEvents: 'all',
  },
  hexButton: {
    width: '50px',
    height: '55px',
    borderRadius: '0', // remove border radius for clip-path
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'all',
  },
  hiddenBottom: {
    opacity: 0,
    transform: 'translateY(20px)',
    pointerEvents: 'none',
  },
};